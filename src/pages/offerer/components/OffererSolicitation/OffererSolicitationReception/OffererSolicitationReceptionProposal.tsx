import {SolicitationViewDTO} from "../../../../../types/solicitations/solicitationData";
import React from "react";
import OffererSolicitationDataAnalysisDetail
    from "../OffererSolicitationAssessment/OffererSolicitationDataAnalyisisDetail";

interface OffererSolicitationReceptionProposalProps {
    solicitation: SolicitationViewDTO,
    actualState: number
}


const OfffererSolicitationReceptionProposal = ({solicitation, actualState} : OffererSolicitationReceptionProposalProps) => {
    return (
        <OffererSolicitationDataAnalysisDetail solicitation={solicitation}
                                               actualState={actualState}
        />
    )
}


export default OfffererSolicitationReceptionProposal