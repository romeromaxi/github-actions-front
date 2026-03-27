import React from "react";
import {
    SolicitationApprovalViewDTO,
    SolicitationApprovalViewDTOFields
} from "types/solicitations/solicitationApprovalData";
import {Systems} from "types/workflow/workflowEnums";
import {
    SolicitationNoteRelatedDataTypes,
    SolicitationProposedApprovalFlowTypes
} from "types/solicitations/solicitationEnums";
import {EntityWithIdFields} from "types/baseEntities";
import {OffererSolicitationProgressHistoryItem} from "../OffererSolicitationProgressHistory";
import {SolicitationHistoryView, SolicitationHistoryViewFields} from "types/solicitations/solicitationData";

interface OffererSolicitationApprovalComponentProps {
    approval: SolicitationApprovalViewDTO,
    type: SolicitationProposedApprovalFlowTypes,
    solicitationId?: number,
    solicitationSystemCode?: Systems,
}

function OffererSolicitationApprovalComponent({ approval, type, solicitationId, solicitationSystemCode }: OffererSolicitationApprovalComponentProps) {
    if (!approval[SolicitationApprovalViewDTOFields.HasDefiniteResult] || !solicitationId)
        return null;
    
    const approvalAsHistory = {
        [EntityWithIdFields.Id]: approval[EntityWithIdFields.Id],
        [SolicitationHistoryViewFields.RelatedDataCode]:
            type === SolicitationProposedApprovalFlowTypes.AdmissionReception ?
                SolicitationNoteRelatedDataTypes.AdmissionApproval :
                SolicitationNoteRelatedDataTypes.PrequalificationApproval,
        [SolicitationHistoryViewFields.Date]: approval[SolicitationApprovalViewDTOFields.ApprovalResultDate],
        [SolicitationHistoryViewFields.UserId]: approval[SolicitationApprovalViewDTOFields.ApprovalResultUserId],
        [SolicitationHistoryViewFields.UserName]: approval[SolicitationApprovalViewDTOFields.ApprovalResultUserName],
        [SolicitationHistoryViewFields.IsPositiveResult]: !!approval[SolicitationApprovalViewDTOFields.IsPositiveResult],
        [SolicitationHistoryViewFields.ResultCode]: approval[SolicitationApprovalViewDTOFields.SolicitationApprovalResultCode],
        [SolicitationHistoryViewFields.ResultDesc]: approval[SolicitationApprovalViewDTOFields.SolicitationApprovalResultDesc],
        [SolicitationHistoryViewFields.RelatedId]: undefined
    } as SolicitationHistoryView;
    
    return (
        <OffererSolicitationProgressHistoryItem solicitationId={solicitationId}
                                                solicitationSystemCode={solicitationSystemCode || Systems.Solicitations}
                                                history={approvalAsHistory}
                                                hideConnector
        />
    )
}

export default OffererSolicitationApprovalComponent;