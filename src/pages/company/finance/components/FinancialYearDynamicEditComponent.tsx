import {Stack} from '@mui/material';
import React from 'react';
import {EconomicFinancialTableWrapper} from "../../../companyFile/company/CompanyEconomicFinancialDataSection";
import {FinancialPatrimonialDynamicYearlyTotals} from "./FinancialPatrimonialDynamicYearlyTotals";
import {FinancialResultDynamicYearlyTotals} from "./FinancialResultDynamicYearlyTotals";

interface FinancialYearDynamicEditComponentProps {
  year: number;
  patrimonialNameBase: string;
  incomeNameBase: string;
  disabled?: boolean
}

function FinancialYearDynamicEditComponent({
  year, patrimonialNameBase, incomeNameBase, disabled
}: FinancialYearDynamicEditComponentProps) {
  
  return (
      <EconomicFinancialTableWrapper title={`Ejercicio ${!isNaN(year) ? year : ''}`} expanded={true} expandable={false}>
          <Stack spacing={2}>
            <FinancialPatrimonialDynamicYearlyTotals year={year} patrimonialNameBase={patrimonialNameBase} disabled={disabled} />
            <FinancialResultDynamicYearlyTotals year={year} incomeNameBase={incomeNameBase} disabled={disabled} />
          </Stack>
      </EconomicFinancialTableWrapper>
  );
}

export default FinancialYearDynamicEditComponent;
