import React from "react";
import {SolicitationViewDTO} from "types/solicitations/solicitationData";
import {Card, CardContent} from "@mui/material";
import SolicitationProposedApprovalFlow from "pages/solicitations/flowApproval/SolicitationProposedApprovalFlow";
import {
  SolicitationOffererTabs,
  SolicitationProposedApprovalFlowTypes
} from "types/solicitations/solicitationEnums";

export enum AssessmentSections {
  Admission,
  Prequalification
}

interface OffererSolicitationAnalysisAssessmentSectionNavsProps {
  solicitation: SolicitationViewDTO,
  section: AssessmentSections
}

function OffererSolicitationAnalysisAssessmentSectionNavs({solicitation, section}: OffererSolicitationAnalysisAssessmentSectionNavsProps) {
    const isAdmission = section === AssessmentSections.Admission;
    const flowType = isAdmission ?
        SolicitationProposedApprovalFlowTypes.AdmissionReception : SolicitationProposedApprovalFlowTypes.SendingResults;
    
    return (
      <Card sx={{ paddingTop: '0px !important', paddingRight: '32px' }}>
        <CardContent>
          <SolicitationProposedApprovalFlow solicitation={solicitation}
                                            type={flowType}
                                            tabs={{
                                              proposal: isAdmission ? SolicitationOffererTabs.AdmissionProposal : SolicitationOffererTabs.PrequalificationProposal,
                                              approval: isAdmission ? SolicitationOffererTabs.AdmissionApproval : SolicitationOffererTabs.PrequalificationApproval,
                                              outcome: isAdmission ? SolicitationOffererTabs.AdmissionOutcome : SolicitationOffererTabs.PrequalificationOutcome,
                                            }}
          />
        </CardContent>
      </Card>
    )
}

export default OffererSolicitationAnalysisAssessmentSectionNavs;