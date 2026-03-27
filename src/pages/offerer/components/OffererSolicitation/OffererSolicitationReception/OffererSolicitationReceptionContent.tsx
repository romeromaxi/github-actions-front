import React from "react";
import {SolicitationViewDTO} from "types/solicitations/solicitationData";
import {Card, CardContent} from "@mui/material";
import {
    SolicitationOffererTabs, SolicitationProposedApprovalFlowTypes
} from "types/solicitations/solicitationEnums";
import SolicitationProposedApprovalFlow from "pages/solicitations/flowApproval/SolicitationProposedApprovalFlow";


interface OffererSolicitationReceptionContentProps {
    solicitation: SolicitationViewDTO
}

const OffererSolicitationReceptionContent = ({solicitation} : OffererSolicitationReceptionContentProps) => {
    return (
        <Card sx={{ paddingTop: '0px !important', paddingRight: '32px' }}>
            <CardContent>
                <SolicitationProposedApprovalFlow solicitation={solicitation}
                                                  type={SolicitationProposedApprovalFlowTypes.AdmissionReception}
                                                  tabs={{
                                                      proposal: SolicitationOffererTabs.ReceptionProposal,
                                                      approval: SolicitationOffererTabs.ReceptionApproval,
                                                      outcome: SolicitationOffererTabs.ReceptionOutcome
                                                  }}
                />
            </CardContent>
        </Card>
    )
}


export default OffererSolicitationReceptionContent