
import {Grid} from "@mui/material";
import CompanySolicitationResultEvaluation from "../resultEvaluation/CompanySolicitationResultEvaluation";
import React, {useMemo} from "react";
import SolicitationFollowUpSteps from "../../../solicitations/components/SolicitationFollowUpSteps";
import {useParams} from "react-router-dom";
import CompanySolicitationAlertCards from "./CompanySolicitationAlertCards";
import {SolicitationAlertType} from "../../../../types/solicitations/solicitationEnums";



const CompanySolicitationDashboard = () => {
    const {solicitationId} = useParams()
    const parsedSolicitationId = useMemo(() => solicitationId ? parseInt(solicitationId) : undefined, [solicitationId])
    
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <SolicitationFollowUpSteps horizontal fromCompany solicitationId={parsedSolicitationId}/>
            </Grid>
            <Grid item xs={12}>
                <CompanySolicitationAlertCards />
            </Grid>
            <Grid item xs={12}>
                <CompanySolicitationResultEvaluation hideAlert />
            </Grid>
        </Grid>
    )
}


export default CompanySolicitationDashboard