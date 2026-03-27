import {SolicitationViewDTO} from "types/solicitations/solicitationData";
import {Card, CardContent} from "@mui/material";
import SolicitationTrackingOfferer from "./SolicitationTrackingOfferer";
import SolicitationTrackingInstrumentationOfferer from "./SolicitationTrackingInstrumentationOfferer";
import React from "react";

interface SolicitationTrackingGeneralTabProps {
    solicitation: SolicitationViewDTO
}

function SolicitationTrackingGeneralTab({solicitation}: SolicitationTrackingGeneralTabProps) {
    return (
        <Card>
            <CardContent>
                <SolicitationTrackingOfferer solicitation={solicitation} />
                <SolicitationTrackingInstrumentationOfferer solicitation={solicitation} />
            </CardContent>
        </Card>
    )
}

export default SolicitationTrackingGeneralTab;