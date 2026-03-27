import React, {useContext, useEffect, useMemo, useState} from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {OffererSolicitationTabProgressContext} from "./OffererSolicitationTabProgress";
import {BaseRequestFields, EntityWithIdFields} from "types/baseEntities";
import {
    SolicitationAnalysisInsert,
    SolicitationAnalysisInsertFields,
} from "types/solicitations/solicitationAnalysisData";
import {Button, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {WrapperIcons} from "components/icons/Icons";
import {TypographyBase} from "components/misc/TypographyBase";
import LabelFormBase from "components/forms/LabelFormBase";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {useQuery} from "hooks/useQuery";
import {FormProvider, useForm} from "react-hook-form";
import useAxios from "hooks/useAxios";
import {ActionExecute, ActionExecuteFields} from "types/workflow/actionData";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {Systems} from "types/workflow/workflowEnums";
import {HttpAction, HttpFileDocument, HttpFilesSolicitationManagement} from "http/index";
import {useSnackbarActions} from "hooks/useSnackbarActions";
import {
    SolicitationApprovalResultType,
    SolicitationProposedApprovalFlowTypes
} from "types/solicitations/solicitationEnums";
import {ActionsTypes} from "types/workflow/actionEnums";
import OffererSolicitationAssignmentActionWrapper, {
    OffererSolicitationAssignmentActionVariant
} from "../../offerer/solicitation/components/assignment/OffererSolicitationAssignmentActionWrapper";
import OffererSolicitationApprovalComponent from "./components/OffererSolicitationApprovalComponent";
import {
    analysisNoteRelatedDataTypeMap, analysisStatesButtonProps,
    analysisStatesIconMap,
    SolicitationAnalysisStates,
    titleAnalysisStatesMap
} from "./OffererSolicitationTabProgressCommonConfiguration";
import SolicitationNoteAddButton from "../notes/SolicitationNoteAddButton";
import {
    SolicitationNoteFields,
    SolicitationNoteRelatedData
} from "types/solicitations/solicitationsNotesData";
import {HttpSolicitationsNotes} from "http/solicitations/httpSolicitationsNotes";
import {DialogAlert} from "components/dialog";
import HelperInputText from "components/text/HelperInputText";
import {RequiredStringSchema} from "util/validation/validationSchemas";
import {CryptoJSHelper} from "util/helpers";
import SolicitationActivityList, {MixedItem} from "components/solicitations/SolicitationActivityList";
import SolicitationManagementFilesAddButton from "../managementFiles/SolicitationManagementFilesAddButton";
import {useNavigate} from "react-router-dom";
import OffererSolicitationAnalysisMessage from "./components/OffererSolicitationAnalysisMessage";

const actionWorkflowMap : Record<Systems, Record<SolicitationProposedApprovalFlowTypes, ActionsTypes>> = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: ActionsTypes.SendDataAnalysisToApproval,
        [SolicitationProposedApprovalFlowTypes.SendingResults]: ActionsTypes.SendPrequalificationAnalysisToApproval
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: 0,
        [SolicitationProposedApprovalFlowTypes.SendingResults]: 0
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: ActionsTypes.SolicitationsReferralsReceive,
        [SolicitationProposedApprovalFlowTypes.SendingResults]: ActionsTypes.SendAssistanceAnalysisToApproval
    },
}

enum OffererSolicitationProgressAnalysisTypeFields {
    Aptitude = 'aptitude',
    Message = 'message'
}

interface OffererSolicitationProgressAnalysisTypeForm {
    aptitude: string,
    message: string
}

function OffererSolicitationProgressAnalysis() {
    const { solicitation } = useSolicitation();
    const queryParams = useQuery();
    const navigate = useNavigate();
    const aptitudeParam = queryParams.get('aptitud');
    const {fetchData} = useAxios();
    const {addSnackbarSuccess} = useSnackbarActions();
    const {type, HttpAnalysis, currentAnalysis, currentApproval} = useContext(OffererSolicitationTabProgressContext);
    
    const [showAlertWithoutNotes, setShowAlertWithoutNotes] = useState<boolean>(false);
    const [itemsCount, setItemsCount] = useState<number>(0);
    const [reloadTrigger, setReloadTrigger] = useState<number>(0);
    const [showConfirmDelete, setShowConfirmDelete] = useState<boolean>(false);
    const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
    const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
    const relatedDataNotes = useMemo(() => {
        if (!currentAnalysis) return undefined;
        
        return {
            [SolicitationNoteFields.RelatedDataCode]: analysisNoteRelatedDataTypeMap[type],
            [SolicitationNoteFields.RelatedDataId]: currentAnalysis[EntityWithIdFields.Id]
        } as SolicitationNoteRelatedData;
    }, [type, currentAnalysis]);

    const analysisFormSchema = yup.object().shape({
        [OffererSolicitationProgressAnalysisTypeFields.Aptitude]: RequiredStringSchema
    });
    const methods = useForm<OffererSolicitationProgressAnalysisTypeForm>({
        resolver: yupResolver(analysisFormSchema)
    });
    
    const aptitude = methods.watch(OffererSolicitationProgressAnalysisTypeFields.Aptitude);
    const { error: aptitudeErrorMessage } = methods.getFieldState(
        OffererSolicitationProgressAnalysisTypeFields.Aptitude, 
        methods.formState,
    );

    const buttonProps = useMemo(() => {
        if (!aptitude || !solicitation)
            return analysisStatesButtonProps[Systems.Solicitations][type]['default']['false']
        
        const hasPermissions = solicitation[SolicitationViewDTOFields.HasPermissionsNextStage] ?
            'true' : 'false';
        
        return analysisStatesButtonProps[Systems.Solicitations][type][aptitude][hasPermissions]
    }, [type, aptitude, solicitation]);
    
    const handleChange = (event: React.MouseEvent<HTMLElement>, newAptitude: string) => {
        if (!!newAptitude) {
            methods.clearErrors(OffererSolicitationProgressAnalysisTypeFields.Aptitude);
            methods.setValue(OffererSolicitationProgressAnalysisTypeFields.Aptitude, newAptitude);
            methods.setValue(OffererSolicitationProgressAnalysisTypeFields.Message, '');
        }
    }

    const executeActionWorkflow = () => {
        if (!solicitation) return;
        
        const dataExecute: ActionExecute = {
            [ActionExecuteFields.MessageId]:
                solicitation[SolicitationViewDTOFields.MessageId],
            [ActionExecuteFields.WorkflowVariables]: [],
            [ActionExecuteFields.Observations]: '',
        } as ActionExecute;

        const actionId = actionWorkflowMap[solicitation[SolicitationViewDTOFields.SystemCode] as Systems][type];

        fetchData(
            () => HttpAction.executeAction(actionId, dataExecute),
            true,
        ).then(() => {
            addSnackbarSuccess('El formulario se envió correctamente');
            window.location.reload();
        });
    };
    
    const onSubmit = (data: OffererSolicitationProgressAnalysisTypeForm) => {
        setShowAlertWithoutNotes(false);
        
        if (!solicitation) return;
        
        const messages: string[] = [];
        if (!!data[OffererSolicitationProgressAnalysisTypeFields.Message])
            messages.push(data[OffererSolicitationProgressAnalysisTypeFields.Message])

        const isSuitable: boolean = data[OffererSolicitationProgressAnalysisTypeFields.Aptitude] === 'apto';

        const dataToInsert: SolicitationAnalysisInsert = {
            [SolicitationAnalysisInsertFields.Considerations]: "",
            [SolicitationAnalysisInsertFields.IsSuitable]: isSuitable,
            [SolicitationAnalysisInsertFields.AditionalAptitudeMessageList]: messages,
            [BaseRequestFields.OriginCode]: 1,
            [BaseRequestFields.ModuleCode]: 1,
        };

        fetchData(
            () => HttpAnalysis.sendToApproval(solicitation[EntityWithIdFields.Id], dataToInsert),
            true,
        ).then(executeActionWorkflow);
    }

    const handleSubmit = (data: OffererSolicitationProgressAnalysisTypeForm) => {
        if (!itemsCount)
            setShowAlertWithoutNotes(true);
        else 
            onSubmit(data);
    }
    
    const hideAlertWithoutNotes = () => setShowAlertWithoutNotes(false);
    
    const handleReload = () => setReloadTrigger(prev => prev + 1);

    const onItemsLoaded = (items: MixedItem[]) => setItemsCount(items.length);
    
    const fetchNotes = () => {
        if (solicitation && relatedDataNotes) {
            return HttpSolicitationsNotes.search(solicitation[EntityWithIdFields.Id], relatedDataNotes[SolicitationNoteFields.RelatedDataCode], relatedDataNotes[SolicitationNoteFields.RelatedDataId])
        }
        return Promise.resolve([]);
    }

    const fetchDocuments = () => {
        if (solicitation && relatedDataNotes) {
            return HttpFilesSolicitationManagement.getList(solicitation[EntityWithIdFields.Id], relatedDataNotes[SolicitationNoteFields.RelatedDataCode], relatedDataNotes[SolicitationNoteFields.RelatedDataId])
        }
        return Promise.resolve([]);
    }
    
    const handleDeleteDocument = () => {
        setIsLoadingDelete(true);
        if (documentToDelete && solicitation && currentAnalysis) {
            return fetchData(
                () => HttpFileDocument.delete(documentToDelete),
                true
            ).then(() => {
                setShowConfirmDelete(false);
                setDocumentToDelete(null);
                handleReload();
            }).finally(() => {
                setIsLoadingDelete(false);
            });
        }
        setIsLoadingDelete(false);
        return Promise.resolve();
    }
    
    const handleDeleteFromActivityList = (documentId: number): Promise<void> => {
        setDocumentToDelete(documentId);
        setShowConfirmDelete(true);
        return Promise.resolve();
    }
        
    const onCancelDelete = () => {
        setShowConfirmDelete(false);
        setDocumentToDelete(null);
        setIsLoadingDelete(false);
    };

    useEffect(() => {
        if (!!aptitudeParam) {
            const newAptitude = CryptoJSHelper.decryptRoute(aptitudeParam || '');
            methods.setValue(OffererSolicitationProgressAnalysisTypeFields.Aptitude, newAptitude);

            const params = new URLSearchParams(window.location.search);
            params.delete('aptitud');

            const newSearch = params.toString() ? `?${params.toString()}` : '';

            navigate({
                pathname: window.location.pathname,
                search: newSearch
            }, { replace: true });
        }
    }, [aptitudeParam]);

    
    return (
        <OffererSolicitationAssignmentActionWrapper variant={OffererSolicitationAssignmentActionVariant.Stage}>
            <Stack spacing={3}>
                <Stack spacing={2.5}>
                    {
                        currentApproval &&
                            <OffererSolicitationApprovalComponent approval={currentApproval}
                                                                  type={type}
                                                                  solicitationId={solicitation?.[EntityWithIdFields.Id]}
                                                                  solicitationSystemCode={solicitation?.[SolicitationViewDTOFields.SystemCode]}
                            />
                    }
                    
                    <LabelFormBase label={'Cambio de estado'} />
    
                    <Stack spacing={1.25}>
                        <ToggleButtonGroup color={'primary'}
                                           value={aptitude}
                                           onChange={handleChange}
                                           exclusive
                                           aria-label={'Aprobacion'}
                                           size={'large'}
                                           fullWidth
                                           variant={'approval'}
                        >
                            <ToggleButton value={'noapto'}
                                          color={'error'}
                                          variant={'approval'}
                            >
                                <WrapperIcons Icon={analysisStatesIconMap[Systems.Solicitations][type][SolicitationAnalysisStates.NotSuitable]}/>
                                <TypographyBase>
                                    {titleAnalysisStatesMap[Systems.Solicitations][type][SolicitationAnalysisStates.NotSuitable]}
                                </TypographyBase>
                            </ToggleButton>

                            <ToggleButton value={'apto'}
                                          color={'success'}
                                          variant={'approval'}
                            >
                                <WrapperIcons Icon={analysisStatesIconMap[Systems.Solicitations][type][SolicitationAnalysisStates.Suitable]}/>
                                <TypographyBase>
                                    {titleAnalysisStatesMap[Systems.Solicitations][type][SolicitationAnalysisStates.Suitable]}
                                </TypographyBase>
                            </ToggleButton>
                        </ToggleButtonGroup>

                        {
                            !!aptitudeErrorMessage && !!aptitudeErrorMessage.message &&
                                <HelperInputText text={aptitudeErrorMessage.message} error />
                        }
                    </Stack>
                </Stack>

                {
                    !!aptitude &&
                        <FormProvider { ...methods }>
                            <OffererSolicitationAnalysisMessage type={type} 
                                                                name={OffererSolicitationProgressAnalysisTypeFields.Message}
                                                                isSuitable={aptitude === SolicitationAnalysisStates.Suitable}
                            />
                        </FormProvider>
                }
                
                <Stack spacing={2.5}>
                    <LabelFormBase label={'Seguimiento interno'} />

                    <SolicitationActivityList fetchNotes={fetchNotes} 
                                              fetchDocuments={fetchDocuments} 
                                              reloadTrigger={reloadTrigger} 
                                              onDeleteDocument={handleDeleteFromActivityList} 
                                              onItemsLoaded={onItemsLoaded}
                    />
                    
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                        {
                            solicitation && relatedDataNotes &&
                                <SolicitationNoteAddButton solicitationId={solicitation[EntityWithIdFields.Id]} 
                                                           onReloadNotes={handleReload}
                                                           relatedData={relatedDataNotes}
                                />
                        }

                        {
                            solicitation && relatedDataNotes &&
                                <SolicitationManagementFilesAddButton solicitationId={solicitation[EntityWithIdFields.Id]}
                                                                      onReloadFiles={handleReload} 
                                                                      relatedData={relatedDataNotes}
                                />
                        }
                    </Stack>
                </Stack>
                
                <Stack direction={'row'} 
                       justifyContent={'end'}
                       width={1}
                >
                    {
                        !!buttonProps &&
                            <Button variant={'contained'}
                                    color={buttonProps.color}
                                    onClick={methods.handleSubmit(handleSubmit)}
                                    startIcon={buttonProps.Icon ? <buttonProps.Icon /> : undefined}
                            >
                                {buttonProps.label}
                            </Button>
                    }
                </Stack>

                <DialogAlert open={showAlertWithoutNotes}
                             textContent={'Tu análisis no tiene notas ni documentos de seguimento interno'}
                             textClose={'Volver'}
                             onClose={hideAlertWithoutNotes}
                             textConfirm={'Continuar de todos modos'}
                             onConfirm={methods.handleSubmit(onSubmit)}
                             maxWidth={'sm'}
                             fullWidth
                             hideTitle
                >
                    Esta información puede ser útil para la hora de aprobar el análisis correspondiente
                </DialogAlert>

                <DialogAlert
                    open={showConfirmDelete}
                    onClose={onCancelDelete}
                    onConfirm={handleDeleteDocument}
                    textContent="¿Estás seguro de que quieres eliminar este documento?"
                    textClose="Cancelar"
                    textConfirm="Eliminar"
                    loading={isLoadingDelete}
                />
            </Stack>
        </OffererSolicitationAssignmentActionWrapper>
    )
}

export default OffererSolicitationProgressAnalysis;

