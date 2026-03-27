import {Alert, Box, Grid, Skeleton, Stack} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import {SolicitationOffererTabs, SolicitationProposedApprovalFlowTypes} from "types/solicitations/solicitationEnums";
import {SolicitationHelper} from "../../../util/helpers/solicitationHelper";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "../../../types/solicitations/solicitationData";
import {
    SolicitationAnalysisInsert, SolicitationAnalysisInsertFields,
    SolicitationAnalysisViewDTO,
    SolicitationAnalysisViewDTOFields
} from "../../../types/solicitations/solicitationAnalysisData";
import {useAction} from "../../../hooks/useAction";
import useAxios from "../../../hooks/useAxios";
import {BaseRequestFields, EntityWithIdFields} from "../../../types/baseEntities";
import {HttpAction} from "http/index";
import {ActionExecute, ActionExecuteFields} from "../../../types/workflow/actionData";
import {Systems} from "../../../types/workflow/workflowEnums";
import {ActionsTypes} from "../../../types/workflow/actionEnums";
import {
    OffererSolicitationAnalysisFormDataRequest,
    OffererSolicitationAnalysisFormDataRequestFields
} from "../../../types/offerer/offererSolicitationData";
import {SolicitationProposedApprovalFlowContext} from "./SolicitationProposedApprovalFlow";
import SolicitationProposedForm from "./components/SolicitationProposedForm";
import {
    OffererSolicitationDocumentationAnalysisSecObjects,
    SecurityComponents
} from "../../../types/security";

interface SolicitationProposedTabProps {
    type: SolicitationProposedApprovalFlowTypes,
    tab: SolicitationOffererTabs;
}

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

const safetyComponentsData : Record<Systems,
    Record<SolicitationProposedApprovalFlowTypes,
        { safetyComponentName: string, safetyObjectName: string  }
    >
> = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            safetyComponentName: "",
            safetyObjectName: ""
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            safetyComponentName: SecurityComponents.OffererSolicitationDocumentationAnalysis,
            safetyObjectName: OffererSolicitationDocumentationAnalysisSecObjects.ProposalDocumentationAnalysisSolicitationButton
        }
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            safetyComponentName: "",
            safetyObjectName: ""
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            safetyComponentName: "",
            safetyObjectName: ""
        }
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            safetyComponentName: "",
            safetyObjectName: ""
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            safetyComponentName: SecurityComponents.OffererSolicitationDocumentationAnalysis,
            safetyObjectName: OffererSolicitationDocumentationAnalysisSecObjects.ProposalDocumentationAnalysisSolicitationButton
        }
    },
}

function SolicitationProposedTab({ type, tab }: SolicitationProposedTabProps) {
    const { fetchData } = useAxios();
    const { snackbarSuccess } = useAction();
    const { solicitation, HttpAnalysis } = useContext(SolicitationProposedApprovalFlowContext);
    const { safetyObjectName, safetyComponentName } =
        safetyComponentsData[solicitation[SolicitationViewDTOFields.SystemCode] as Systems][type];
    
    const tabActive = SolicitationHelper.isTabActive(solicitation, tab);
    const alreadyPassedTab = SolicitationHelper.alreadyPassedTab(solicitation, tab);

    const [solicitationAnalysis, setSolicitationAnalysis] = useState<SolicitationAnalysisViewDTO>();
    
    const executeActionWorkflow = () => {
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
            snackbarSuccess('El formulario se envió correctamente');
            window.location.reload();
        });
    };

    const handleSave = (
        considerations: string, aptitude: string, aditionalMessages?: OffererSolicitationAnalysisFormDataRequest[],
    ) => {
        const messages: string[] = [];
        aditionalMessages?.map((msg) =>
            messages.push(
                msg[OffererSolicitationAnalysisFormDataRequestFields.Message],
            ),
        );
        const isSuitable: boolean = aptitude === 'apto';

        const dataToInsert: SolicitationAnalysisInsert = {
            [SolicitationAnalysisInsertFields.Considerations]: considerations,
            [SolicitationAnalysisInsertFields.IsSuitable]: isSuitable,
            [SolicitationAnalysisInsertFields.AditionalAptitudeMessageList]: messages,
            [BaseRequestFields.OriginCode]: 1,
            [BaseRequestFields.ModuleCode]: 1,
        };

        fetchData(
            () => HttpAnalysis.sendToApproval(solicitation[EntityWithIdFields.Id], dataToInsert), 
            true,
        ).then(executeActionWorkflow);
    };
        
    useEffect(() => {
        HttpAnalysis.getActualBySolicitationId(solicitation[EntityWithIdFields.Id])
            .then(setSolicitationAnalysis);
    }, [solicitation]);
    
    return (
        <Grid container spacing={3} width={1} px={0} ml={'-10px'}>
            <Grid item xs={12}>
                {
                    (tabActive || alreadyPassedTab) ?
                        <SolicitationProposedForm dataAnalysis={solicitationAnalysis}
                                                  handleSave={handleSave}
                                                  safetyObjectName={safetyObjectName}
                                                  safetyComponentName={safetyComponentName}
                        />
                        :
                        <Box sx={{ width: '100%' }}>
                            <Alert severity="info">
                                {
                                    type === SolicitationProposedApprovalFlowTypes.AdmissionReception ?
                                        "La solicitud aún no ha sido asignada para ser analizada. Hacé click en el botón ‘Asignarme solicitud’, en la equina superior izquierda, para comenzar"
                                        :
                                        "La solicitud aún no se encuentra en este estado"
                                }
                            </Alert>
                        </Box>
                }
            </Grid>
        </Grid>
    )
}

export default SolicitationProposedTab;