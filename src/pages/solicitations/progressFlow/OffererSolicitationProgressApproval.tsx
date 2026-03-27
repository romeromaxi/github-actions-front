import React, {useContext, useEffect, useMemo, useState} from "react";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import OffererSolicitationAssignmentActionWrapper, {
    OffererSolicitationAssignmentActionVariant
} from "../../offerer/solicitation/components/assignment/OffererSolicitationAssignmentActionWrapper";
import {Button, Stack, ToggleButton, ToggleButtonGroup} from "@mui/material";
import LabelFormBase from "components/forms/LabelFormBase";
import {TypographyBase} from "components/misc/TypographyBase";
import {
    SolicitationApprovalResultViewDTO,
    SolicitationApprovalResultViewDTOFields,
    SolicitationApprovalUpdateDTO,
    SolicitationApprovalUpdateDTOFields,
} from "types/solicitations/solicitationApprovalData";
import {WrapperIcons} from "components/icons/Icons";
import {CheckIcon, Undo2Icon} from "lucide-react";
import {OffererSolicitationTabProgressContext} from "./OffererSolicitationTabProgress";
import OffererSolicitationAnalysisComponent from "./components/OffererSolicitationAnalysisComponent";
import {HttpAction, HttpCacheSolicitation, HttpFilesSolicitationManagement} from "http/index";
import {BaseRequestFields, EntityWithIdAndDescriptionFields, EntityWithIdFields} from "types/baseEntities";
import {useForm} from "react-hook-form";
import {
    SolicitationApprovalResultType,
    SolicitationStatusType,
} from "types/solicitations/solicitationEnums";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {Systems} from "types/workflow/workflowEnums";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import useAxios from "hooks/useAxios";
import {
    actionWorkflowApproveMap,
    actionWorkflowRejectMap,
    approvalNoteRelatedDataTypeMap,
    approvalStatesButtonProps,
    SolicitationAnalysisStates
} from "./OffererSolicitationTabProgressCommonConfiguration";
import {ActionsTypes} from "types/workflow/actionEnums";
import {ActionExecute, ActionExecuteFields} from "types/workflow/actionData";
import {useSnackbarActions} from "hooks/useSnackbarActions";
import {SolicitationNoteFields, SolicitationNoteRelatedData} from "types/solicitations/solicitationsNotesData";
import {HttpSolicitationsNotes} from "http/solicitations/httpSolicitationsNotes";
import SolicitationNoteAddButton from "../notes/SolicitationNoteAddButton";
import HelperInputText from "components/text/HelperInputText";
import {RequiredNumberSchema} from "util/validation/validationSchemas";
import SolicitationManagementFilesAddButton from "../managementFiles/SolicitationManagementFilesAddButton";
import SolicitationActivityList from "../../../components/solicitations/SolicitationActivityList";
import {SolicitationAnalysisViewDTOFields} from "../../../types/solicitations/solicitationAnalysisData";
import {DialogAlert} from "components/dialog";


enum OffererSolicitationProgressApprovalTypeFields {
    ResultCode = 'aptitude'
}

interface OffererSolicitationProgressApprovalTypeForm {
    [OffererSolicitationProgressApprovalTypeFields.ResultCode]: number,

}

function OffererSolicitationProgressApproval() {
    const { solicitation } = useSolicitation();
    const { fetchData } = useAxios();
    const { addSnackbarSuccess } = useSnackbarActions();
    const {type, HttpApproval, currentAnalysis, currentApproval} = useContext(OffererSolicitationTabProgressContext);
    const [approvalResults, setApprovalResults] = useState<SolicitationApprovalResultViewDTO[]>([]);

    const [itemsCount, setItemsCount] = useState<number>(0);
    const [reloadTrigger, setReloadTrigger] = useState<number>(0);
    const [showAlertWithoutNotes, setShowAlertWithoutNotes] = useState<boolean>(false);

    const relatedDataNotes: SolicitationNoteRelatedData | undefined = useMemo(() => {
        if (!currentApproval) return undefined;
        
        return {
            [SolicitationNoteFields.RelatedDataCode]: approvalNoteRelatedDataTypeMap[type],
            [SolicitationNoteFields.RelatedDataId]: currentApproval[EntityWithIdFields.Id]
        }
    }, [type, currentApproval]);
    
    const approvalFormSchema = yup.object().shape({
        [OffererSolicitationProgressApprovalTypeFields.ResultCode]: RequiredNumberSchema
    });
    const methods = useForm<OffererSolicitationProgressApprovalTypeForm>({
        resolver: yupResolver(approvalFormSchema)
    });
    
    const aptitude = methods.watch(OffererSolicitationProgressApprovalTypeFields.ResultCode);
    const { error: aptitudeErrorMessage } = methods.getFieldState(
        OffererSolicitationProgressApprovalTypeFields.ResultCode,
        methods.formState,
    );

    const buttonProps = useMemo(() => {
        if (!aptitude || !currentAnalysis)
            return approvalStatesButtonProps[Systems.Solicitations][type]['default'][SolicitationAnalysisStates.Suitable]

        return approvalStatesButtonProps[Systems.Solicitations][type][aptitude][currentAnalysis[SolicitationAnalysisViewDTOFields.IsSuitable] ? SolicitationAnalysisStates.Suitable : SolicitationAnalysisStates.NotSuitable]
    }, [type, currentAnalysis, aptitude]);
    
    const handleReload = () => setReloadTrigger(prev => prev + 1);

    const onItemsLoaded = (items: any[]) => setItemsCount(items.length);

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

    const handleChange = (event: React.MouseEvent<HTMLElement>, newAptitude: number) => {
        if (!!newAptitude) {
            methods.clearErrors(OffererSolicitationProgressApprovalTypeFields.ResultCode);
            methods.setValue(OffererSolicitationProgressApprovalTypeFields.ResultCode, newAptitude);
        }
    }
    
    const executeActionWorkflow = (action: ActionsTypes, messageId: number) => {
        const dataExecute: ActionExecute = {
            [ActionExecuteFields.MessageId]: messageId,
            [ActionExecuteFields.WorkflowVariables]: [],
            [ActionExecuteFields.Observations]: '',
        } as ActionExecute;

        fetchData(
            () => HttpAction.executeAction(action, dataExecute),
            true
        ).then(
            () => {
                addSnackbarSuccess('La aprobación se envió correctamente');
                window.location.reload();
            },
        );
    };
    
    const onSubmit = (data: OffererSolicitationProgressApprovalTypeForm) => {
        if (!solicitation) return;

        const approvalUpdate: SolicitationApprovalUpdateDTO = {
            [SolicitationApprovalUpdateDTOFields.Justification]: "",
            [SolicitationApprovalUpdateDTOFields.SolicitationApprovalResultCode]: data[OffererSolicitationProgressApprovalTypeFields.ResultCode],
            [BaseRequestFields.OriginCode]: 1,
            [BaseRequestFields.ModuleCode]: 1,
        };

        fetchData(
            () => HttpApproval.setApprovalResponse(solicitation[EntityWithIdFields.Id], approvalUpdate),
            true,
        ).then(() => {
            const actionWorkflowMap = data[OffererSolicitationProgressApprovalTypeFields.ResultCode] === SolicitationApprovalResultType.Approved ?
                actionWorkflowApproveMap : actionWorkflowRejectMap;
            const actionTypes = actionWorkflowMap[solicitation[SolicitationViewDTOFields.SystemCode] as Systems][type];

            executeActionWorkflow(actionTypes, solicitation[SolicitationViewDTOFields.MessageId]);
        });
    }
    
    const handleSubmit = (data: OffererSolicitationProgressApprovalTypeForm) => {
        const approvalStatusCodes = [
            SolicitationStatusType.GeneralOffererAdmissionApproval,
            SolicitationStatusType.GeneralOffererPrequalificationApproval,
            SolicitationStatusType.AssistedSearchOffererReceptionApproval
        ];
        
        const isApprovalStatus = solicitation && approvalStatusCodes.includes(solicitation[SolicitationViewDTOFields.OffererSolicitationStatusTypeCode]);
        
        if (data[OffererSolicitationProgressApprovalTypeFields.ResultCode] === SolicitationApprovalResultType.Rejected && !itemsCount && isApprovalStatus) {
            setShowAlertWithoutNotes(true);
        } else {
            onSubmit(data);
        }
    }
    
    const hideAlertWithoutNotes = () => setShowAlertWithoutNotes(false);
    
    useEffect(() => {
        HttpCacheSolicitation.getApprovalResults()
            .then(response => setApprovalResults(response.reverse()));
    }, []);
    
    return (
        <OffererSolicitationAssignmentActionWrapper variant={OffererSolicitationAssignmentActionVariant.Stage}>
            <Stack spacing={3}>
                <Stack spacing={2.5}>
                    {
                        currentAnalysis &&  
                            <OffererSolicitationAnalysisComponent analysis={currentAnalysis}
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
                            {
                                approvalResults.map((state, index) => (
                                    <ToggleButton key={`toggleButtonOffererSolicitationProgressApproval_${state[EntityWithIdAndDescriptionFields.Id]}_${index}`}
                                                  value={state[EntityWithIdAndDescriptionFields.Id]}
                                                  color={
                                                      state[SolicitationApprovalResultViewDTOFields.PositiveState]
                                                          ? 'success'
                                                          : 'error'
                                                  }
                                                  variant={'approval'}
                                    >
                                        <WrapperIcons Icon={state[SolicitationApprovalResultViewDTOFields.PositiveState]? CheckIcon : Undo2Icon}/>
                                        <TypographyBase>
                                            {state[EntityWithIdAndDescriptionFields.Description]}
                                        </TypographyBase>
                                    </ToggleButton>
                                ))
                            }
                        </ToggleButtonGroup>

                        {
                            !!aptitudeErrorMessage && !!aptitudeErrorMessage.message &&
                            <HelperInputText text={aptitudeErrorMessage.message} error />
                        }
                    </Stack>
                </Stack>

                <Stack spacing={2.5}>
                    <LabelFormBase label={'Seguimiento interno'} />

                    <SolicitationActivityList fetchNotes={fetchNotes}
                                              fetchDocuments={fetchDocuments}
                                              reloadTrigger={reloadTrigger}
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
                             textContent={'Tu aprobación no tiene notas ni documentos de seguimento interno'}
                             textClose={'Volver'}
                             onClose={hideAlertWithoutNotes}
                             textConfirm={'Continuar de todos modos'}
                             onConfirm={methods.handleSubmit(onSubmit)}
                             maxWidth={'sm'}
                             fullWidth
                             hideTitle
                >
                    Esta información puede ser útil para la hora de devolver el análisis al analista
                </DialogAlert>
            </Stack>
        </OffererSolicitationAssignmentActionWrapper>
    )
}

export default OffererSolicitationProgressApproval;