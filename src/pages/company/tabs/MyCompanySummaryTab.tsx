import {CompanyViewDTO} from "../../../types/company/companyData";
import {Grid} from "@mui/material";
import React from "react";
import CompanySummaryLeftComponent from "../components/home/CompanySummaryLeftComponent";
import CompanySummaryRightComponent from "../components/home/CompanySummaryRightComponent";


interface MyCompanySummaryTabProps {
  company: CompanyViewDTO;
  onReload?: () => void;
}


const MyCompanySummaryTab = ({ company, onReload }: MyCompanySummaryTabProps) => {
    return (
        <Grid container>
            <Grid item md={4.5} xs={12}>
                <CompanySummaryLeftComponent company={company}/>
            </Grid>
            <Grid item md={7.5} xs={12} sx={{paddingLeft: {md: 2, xs: 0}, paddingTop: {xs: 2, md: 0}}}>
                <CompanySummaryRightComponent company={company}/>
            </Grid>
        </Grid>
    )
}


export default MyCompanySummaryTab;