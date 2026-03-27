import {Stack} from "@mui/material";
import React from "react";
import {CompanyFilePublic, CompanyFilePublicFields} from "../../../types/companyFile/companyFileData";
import CompanyFileGeneralDataAccordion from "../../companyFile/company/components/CompanyFileGeneralDataAccordion";
import CompanyFileEconomicFinancialDataAccordion
    from "../../companyFile/company/components/CompanyFileEconomicFinancialDataAccordion";
import {CompanyViewDTOFields} from "../../../types/company/companyData";
import {PersonTypes} from "../../../types/person/personEnums";


interface SharedSolicitationCompanyInfoProps {
    companyFile: CompanyFilePublic
}

const SharedSolicitationCompanyInfo = ({companyFile} : SharedSolicitationCompanyInfoProps) => {
    
    return (
        <Stack spacing={2}>
            <CompanyFileGeneralDataAccordion companyFile={companyFile} />

            {/*{
                companyFile[CompanyFilePublicFields.Company][CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Legal &&
                    <CompanyFileEconomicFinancialDataAccordion companyFile={companyFile} />
            }*/}
        </Stack>
    )
}


export default SharedSolicitationCompanyInfo