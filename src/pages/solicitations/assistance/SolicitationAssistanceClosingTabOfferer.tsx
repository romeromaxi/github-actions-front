import React from "react";
import {Card, CardContent} from "@mui/material";
import {SolicitationViewDTO} from "types/solicitations/solicitationData";
import SolicitationProposedApprovalFlow from "../flowApproval/SolicitationProposedApprovalFlow";
import {
    SolicitationOffererTabs,
    SolicitationProposedApprovalFlowTypes
} from "../../../types/solicitations/solicitationEnums";

interface SolicitationAssistanceClosingTabOffererProps {
    solicitation: SolicitationViewDTO
}

function SolicitationAssistanceClosingTabOfferer({solicitation}: SolicitationAssistanceClosingTabOffererProps) {
    return (
        <Card sx={{ paddingTop: '0px !important', paddingRight: '32px' }}>
            <CardContent>
                <SolicitationProposedApprovalFlow solicitation={solicitation} 
                                                  type={SolicitationProposedApprovalFlowTypes.SendingResults}
                                                  tabs={{ 
                                                      proposal: SolicitationOffererTabs.AssistanceClosingProposal, 
                                                      approval: SolicitationOffererTabs.AssistanceClosingApproval, 
                                                      outcome: SolicitationOffererTabs.AssistanceClosingOutcome 
                                                  }}
                />
            </CardContent>
        </Card>
    )
}

export default SolicitationAssistanceClosingTabOfferer;
