import React from "react";
import {Stack} from "@mui/material";
import OffererSolicitationInternalTracking from "../components/OffererSolicitationInternalTracking";
import OffererSolicitationHistoryTimeline from "../components/OffererSolicitationHistoryTimeline";


function OffererSolicitationTabInternalTracking() {
    return (
        <Stack direction={"column"} spacing={3}>
            <OffererSolicitationHistoryTimeline />
            
            <OffererSolicitationInternalTracking />
        </Stack>
    )
}

export default OffererSolicitationTabInternalTracking;