import React, {useContext} from "react";
import {Stack} from "@mui/material";
import CompanyGeneralDataSection from "./CompanyGeneralDataSection";
import {useFormContext} from "react-hook-form";
import {CompanyFileContext, CompanyFileEditFormFields, Sections} from "../../../hooks/contexts/CompanyFileContext";
import CompanyEconomicFinancialDataSection from "./CompanyEconomicFinancialDataSection";
import {CompanyFileCompletenessView} from "../../../types/company/companyData";
import CompanyFileDataCardLoading from "../CompanyFileDataCardLoading";

export type CompanyFileSectionsContextType = { 
    editing: boolean, 
    setEditing: (arg: boolean) => void,
}

export const CompanyFileSectionsContext = React.createContext<CompanyFileSectionsContextType | null>(null);

interface CompanyPersonalInformationDetailProps {
    allowEdit?: boolean;
    context: React.Context<CompanyFileSectionsContextType>,
    completenessPercentage?: CompanyFileCompletenessView
}

function CompanyPersonalInformationDetailSections({allowEdit, context, completenessPercentage}: CompanyPersonalInformationDetailProps) {

    const { watch } = useFormContext();
    const company = watch(CompanyFileEditFormFields.Company)
    const activity = watch(CompanyFileEditFormFields.Activity)
    const { loading, showSection } = useContext(CompanyFileContext);

    return (
        loading ?
            <Stack spacing={3}>
                <CompanyFileDataCardLoading />
                <CompanyFileDataCardLoading />
            </Stack>
            :
        <Stack sx={{width: '100%', mb: 4}} spacing={3}>
                {
                    (company && activity) &&
                        <CompanyGeneralDataSection company={company}
                                                   activity={activity}
                                                   canEdit={allowEdit}
                                                   context={context}
                                                   completenessPercentage={completenessPercentage}
                        />
                }
                {
                    ((company) && (showSection[Sections.Financial])) &&
                        <CompanyEconomicFinancialDataSection company={company}
                                                             canEdit={allowEdit}
                                                             context={context}
                                                             completenessPercentage={completenessPercentage}
                        />
                }
        </Stack>
    );
}

export default CompanyPersonalInformationDetailSections;