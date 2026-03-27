import React from "react";
import {
    SolicitationAnalysisViewDTO,
    SolicitationAnalysisViewDTOFields
} from "types/solicitations/solicitationAnalysisData";
import {
    SolicitationNoteRelatedDataTypes,
    SolicitationProposedApprovalFlowTypes
} from "types/solicitations/solicitationEnums";
import {Systems} from "types/workflow/workflowEnums";
import {EntityWithIdFields} from "types/baseEntities";
import {OffererSolicitationProgressHistoryItem} from "../OffererSolicitationProgressHistory";
import {SolicitationHistoryView, SolicitationHistoryViewFields} from "../../../../types/solicitations/solicitationData";

interface OffererSolicitationAnalysisComponentProps {
    analysis: SolicitationAnalysisViewDTO,
    type: SolicitationProposedApprovalFlowTypes,
    solicitationId?: number,
    solicitationSystemCode?: Systems,
}

function OffererSolicitationAnalysisComponent({ analysis, type, solicitationId, solicitationSystemCode }: OffererSolicitationAnalysisComponentProps) {    
    if (!analysis[SolicitationAnalysisViewDTOFields.HasDefinedAptitude] || !solicitationId)
        return null;
        
    const analysisAsHistory = {
        [EntityWithIdFields.Id]: analysis[EntityWithIdFields.Id],
        [SolicitationHistoryViewFields.RelatedDataCode]:
            type === SolicitationProposedApprovalFlowTypes.AdmissionReception ? 
                SolicitationNoteRelatedDataTypes.AdmissionProposal :
                SolicitationNoteRelatedDataTypes.PrequalificationProposal,
        [SolicitationHistoryViewFields.Date]: analysis[SolicitationAnalysisViewDTOFields.AptitudeDate],
        [SolicitationHistoryViewFields.UserId]: analysis[SolicitationAnalysisViewDTOFields.AptitudeUserId],
        [SolicitationHistoryViewFields.UserName]: analysis[SolicitationAnalysisViewDTOFields.AptitudeUserName],
        [SolicitationHistoryViewFields.IsPositiveResult]: analysis[SolicitationAnalysisViewDTOFields.IsSuitable],
        [SolicitationHistoryViewFields.ResultCode]: analysis[SolicitationAnalysisViewDTOFields.IsSuitable] ? 1 : 0,
        [SolicitationHistoryViewFields.ResultDesc]: '',
        [SolicitationHistoryViewFields.RelatedId]: undefined,
        [SolicitationHistoryViewFields.MessageCompany]: analysis[SolicitationAnalysisViewDTOFields.AptitudeMessage]
    } as SolicitationHistoryView;
    
    return (
        <OffererSolicitationProgressHistoryItem solicitationId={solicitationId}
                                                solicitationSystemCode={solicitationSystemCode || Systems.Solicitations}
                                                history={analysisAsHistory}
                                                hideConnector
        />
    )
}

export default OffererSolicitationAnalysisComponent;