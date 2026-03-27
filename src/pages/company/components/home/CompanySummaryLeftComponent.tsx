import {Stack} from "@mui/material";
import {CompanyViewDTO} from "../../../../types/company/companyData";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import CompanyFileGeneralInfo from "../CompanyFileGeneralInfo";
import React from "react";
import CompanySummarySolicitations from "./CompanySummarySolicitations";


interface CompanySummaryLeftComponentProps {
    company: CompanyViewDTO;
}


const CompanySummaryLeftComponent = (props: CompanySummaryLeftComponentProps) => {
    return (
        <Stack spacing={3}>
            <CompanyFileGeneralInfo companyId={props.company[EntityWithIdFields.Id]} />
            <CompanySummarySolicitations companyId={props.company[EntityWithIdFields.Id]} />
        </Stack>
    )
}


export default CompanySummaryLeftComponent