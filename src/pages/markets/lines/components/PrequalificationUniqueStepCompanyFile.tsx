import React, {useContext} from "react";
import {PrequalificationStepperContext} from "../../prequalification/PrequalificationStepper";
import CompanyPersonalInformationDetailSections, {
  CompanyFileSectionsContext
} from "../../../companyFile/company/CompanyPersonalInformationDetailSections";
import {CompanyFileContextProvider} from "../../../../hooks/contexts/CompanyFileContext";
import {CompanyFileSourceType, CompanyFileType} from "../../../../types/company/companyEnums";


const PrequalificationUniqueStepCompanyFile = () => {
    const {companyId, editing, setEditing} = useContext(PrequalificationStepperContext);
    
    return (
      <CompanyFileSectionsContext.Provider value={{
        editing: editing,
        setEditing: setEditing
      }}>
        <CompanyFileContextProvider dataId={companyId}
                                    dataSource={CompanyFileSourceType.Company}
                                    companyFileType={CompanyFileType.Long}
        >
          <CompanyPersonalInformationDetailSections context={CompanyFileSectionsContext} allowEdit />
        </CompanyFileContextProvider>
      </CompanyFileSectionsContext.Provider>
    );
}

export default PrequalificationUniqueStepCompanyFile