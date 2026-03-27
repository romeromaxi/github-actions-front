import React, { useContext, useEffect, useState } from 'react';
import { PrequalificationStepperContext } from '../PrequalificationStepper';
import TitleCardContent from '../../../../components/text/TitleCardContent';
import CompanyFinancialLegalPersonHomeView from '../../../companyFile/finance/home/CompanyFinancialLegalPersonHomeView';
import { CompanyViewDTO } from '../../../../types/company/companyData';
import { HttpCompany } from '../../../../http';

function PrequalificationStepFinancialData() {
  const { companyId } = useContext(PrequalificationStepperContext);
  const [company, setCompany] = useState<CompanyViewDTO>();

  useEffect(() => {
    HttpCompany.getCompanyById(companyId).then((r) => setCompany(r));
  }, [companyId]);

  return (
    <>
      <TitleCardContent text="Confirma tu información financiera" />
      <div style={{ marginTop: '2px' }}>
        <CompanyFinancialLegalPersonHomeView company={company} />
      </div>
    </>
  );
}

export default PrequalificationStepFinancialData;
