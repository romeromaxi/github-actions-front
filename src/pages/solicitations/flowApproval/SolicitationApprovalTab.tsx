import {SolicitationViewDTO, SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {
    SolicitationApprovalResultType,
    SolicitationOffererTabs,
    SolicitationProposedApprovalFlowTypes
} from "types/solicitations/solicitationEnums";
import React, {useContext} from "react";
import {
    SolicitationApprovalUpdateDTO,
    SolicitationApprovalUpdateDTOFields
} from "types/solicitations/solicitationApprovalData";
import {useAction} from "hooks/useAction";
import useAxios from "hooks/useAxios";
import {SolicitationHelper} from "util/helpers/solicitationHelper";
import {Alert, Box, Grid} from "@mui/material";
import {BaseRequestFields, EntityWithIdFields} from "types/baseEntities";
import {HttpAction} from "http/index";
import {
    OffererSolicitationApprovalSecObjects,
    OffererSolicitationDocumentationValidationSecObjects,
    SecurityComponents
} from "types/security";
import {ActionsTypes} from "types/workflow/actionEnums";
import {ActionExecute, ActionExecuteFields} from "types/workflow/actionData";
import {Systems} from "types/workflow/workflowEnums";
import SolicitationApprovalForm from "./components/approval/SolicitationApprovalForm";
import {SolicitationProposedApprovalFlowContext} from "./SolicitationProposedApprovalFlow";

interface SolicitationApprovalTabProps {
    solicitation: SolicitationViewDTO,
    type: SolicitationProposedApprovalFlowTypes,
    tab: SolicitationOffererTabs;
}

const actionWorkflowApproveMap : Record<Systems, Record<SolicitationProposedApprovalFlowTypes, ActionsTypes>> = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: ActionsTypes.ApproveDataAnalysis,
        [SolicitationProposedApprovalFlowTypes.SendingResults]: ActionsTypes.ApprovePrequalificationAnalysis
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: 0,
        [SolicitationProposedApprovalFlowTypes.SendingResults]: 0
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: ActionsTypes.SolicitationApproveReception,
        [SolicitationProposedApprovalFlowTypes.SendingResults]: ActionsTypes.ApproveAssistanceAnalysis
    },
}

const actionWorkflowRejectMap : Record<Systems, Record<SolicitationProposedApprovalFlowTypes, ActionsTypes>> = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: ActionsTypes.ReturnToDataAnalysis,
        [SolicitationProposedApprovalFlowTypes.SendingResults]: ActionsTypes.ReturnToPrequalificationAnalysis
    },
    [Systems.ProductLinesApproval]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: 0,
        [SolicitationProposedApprovalFlowTypes.SendingResults]: 0
    },
    [Systems.SolicitationsReferrals]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: ActionsTypes.SolicitationRejectReception,
        [SolicitationProposedApprovalFlowTypes.SendingResults]: ActionsTypes.ReturnToAssistanceAnalysis
    },
}

const safetyComponentsData : Record<Systems, 
    Record<SolicitationProposedApprovalFlowTypes, 
        { safetyComponentName: string, safetyObjectName: string  }
    >
> = {
    [Systems.Solicitations]: {
        [SolicitationProposedApprovalFlowTypes.AdmissionReception]: {
            safetyComponentName: SecurityComponents.OffererSolicitationApproval, 
            safetyObjectName: OffererSolicitationApprovalSecObjects.ApproveDataAnalysisSolicitationButton
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            safetyComponentName: SecurityComponents.OffererSolicitationDocumentationValidation,
            safetyObjectName: OffererSolicitationDocumentationValidationSecObjects.ApproveDocumentationAnalysisSolicitationButton
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
            safetyComponentName: SecurityComponents.OffererSolicitationApproval,
            safetyObjectName: OffererSolicitationApprovalSecObjects.ApproveDataAnalysisSolicitationButton
        },
        [SolicitationProposedApprovalFlowTypes.SendingResults]: {
            safetyComponentName: SecurityComponents.OffererSolicitationDocumentationValidation,
            safetyObjectName: OffererSolicitationDocumentationValidationSecObjects.ApproveDocumentationAnalysisSolicitationButton
        }
    },
}

function SolicitationApprovalTab({ solicitation, type, tab }: SolicitationApprovalTabProps) {
    const { fetchData } = useAxios();
    const { snackbarSuccess } = useAction();
    const { HttpApproval } = useContext(SolicitationProposedApprovalFlowContext);
    const { safetyObjectName, safetyComponentName } = 
        safetyComponentsData[solicitation[SolicitationViewDTOFields.SystemCode] as Systems][type];

    const tabActive = SolicitationHelper.isTabActive(solicitation, tab);
    const alreadyPassedTab = SolicitationHelper.alreadyPassedTab(solicitation, tab);

    const executeActionWorkflow = (action: ActionsTypes) => {
        const dataExecute: ActionExecute = {
            [ActionExecuteFields.MessageId]: solicitation[SolicitationViewDTOFields.MessageId],
            [ActionExecuteFields.WorkflowVariables]: [],
            [ActionExecuteFields.Observations]: '',
        } as ActionExecute;

        fetchData(
            () => HttpAction.executeAction(action, dataExecute),
            true
        ).then(
            () => {
                snackbarSuccess('La aprobación se envió correctamente');
                window.location.reload();
            },
        );
    };

    const handleContinue = (justification: string, approvalState: string) => {
        const approvalId: number = parseInt(approvalState);

        const approvalUpdate: SolicitationApprovalUpdateDTO = {
            [SolicitationApprovalUpdateDTOFields.Justification]: justification,
            [SolicitationApprovalUpdateDTOFields.SolicitationApprovalResultCode]: approvalId,
            [BaseRequestFields.OriginCode]: 1,
            [BaseRequestFields.ModuleCode]: 1,
        };
        
        fetchData(
            () => HttpApproval.setApprovalResponse(solicitation[EntityWithIdFields.Id], approvalUpdate),
            true,
        ).then(() => {
            const actionWorkflowMap = approvalId === SolicitationApprovalResultType.Approved ? 
                actionWorkflowApproveMap : actionWorkflowRejectMap;
            const actionTypes = actionWorkflowMap[solicitation[SolicitationViewDTOFields.SystemCode] as Systems][type];
            
            executeActionWorkflow(actionTypes);
        });
    };
    
    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                {
                    (tabActive || alreadyPassedTab) ?
                        <SolicitationApprovalForm handleContinue={handleContinue}
                                                  safetyComponentName={safetyObjectName}
                                                  safetyObjectName={safetyComponentName}
                        />
                        :
                        <Box sx={{ width: '100%' }}>
                            <Alert severity="info">
                                La solicitud aún no se encuentra en este estado
                            </Alert>
                        </Box>
                }
            </Grid>
        </Grid>
    )
}

export default SolicitationApprovalTab;