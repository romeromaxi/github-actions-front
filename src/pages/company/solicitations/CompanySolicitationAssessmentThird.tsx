import {SolicitationViewDTO} from "../../../types/solicitations/solicitationData";
import {Grid} from "@mui/material";
import SolicitationLeftPanelComponent from "../../../components/solicitations/leftPanel/SolicitationLeftPanelComponent";
import {ProfilePersonTypes} from "../../../types/person/personData";
import SolicitationRightPanelComponent
    from "../../../components/solicitations/rightPanel/SolicitationRightPanelComponent";
import React from "react";
import CompanySolicitationAssessmentCenterPanelThird from "./CompanySolicitationAssessmentCenterPanelThird";


interface CompanySolicitationAssessmentThirdProps {
    solicitation: SolicitationViewDTO
}


const CompanySolicitationAssessmentThird = ({solicitation} : CompanySolicitationAssessmentThirdProps) => {
    
    return (
        <Grid container spacing={2} mb={2}>
            <Grid item xs={3}>
                <SolicitationLeftPanelComponent variant={ProfilePersonTypes.Company} solicitation={solicitation} />
            </Grid>
            <Grid item xs={6}>
                <CompanySolicitationAssessmentCenterPanelThird solicitation={solicitation} />
            </Grid>
            <Grid item xs={3}>
                <SolicitationRightPanelComponent variant={ProfilePersonTypes.Company} solicitation={solicitation} />
            </Grid>
        </Grid>
    )
}


export default CompanySolicitationAssessmentThird