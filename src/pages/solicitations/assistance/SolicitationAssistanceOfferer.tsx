import React from "react";
import {SolicitationViewDTO} from "types/solicitations/solicitationData";
import OffererSolicitationExternalAccessContent
    from "pages/offerer/components/OffererSolicitation/OffererSolicitationExternalAccess/OffererSolicitationExternalAccessContent";

interface SolicitationAssistanceOffererProps {
    solicitation: SolicitationViewDTO
}

function SolicitationAssistanceOfferer({ solicitation }: SolicitationAssistanceOffererProps) {
    return (
        <OffererSolicitationExternalAccessContent solicitation={solicitation} />
    )
}

export default SolicitationAssistanceOfferer;