import {Stack} from '@mui/material';
import React, {useEffect} from 'react';
import { useFormContext } from 'react-hook-form';
import {
  CompanyBasePatrimonialStatementFields,
  CompanyFinancialTotals,
  CompanyFinancialTotalsFields,
  CompanyIncomeLastYearStatementFields,
  CompanyPatrimonialStatementFields,
} from '../../../../types/company/companyFinanceInformationData';
import {
  FinancialPatrimonialYearlyEditTotals
} from "../../../companyFile/finance/components/CompanyFinancialPatrimonialYearlyTotals";
import {
  FinancialResultYearlyEditTotals
} from "../../../companyFile/finance/components/CompanyFinancialResultYearlyTotals";
import {EconomicFinancialTableWrapper} from "../../../companyFile/company/CompanyEconomicFinancialDataSection";
import {PatrimonialStatementFields} from "../../../../types/general/generalFinanceData";

interface FinancialYearEditComponentProps {
  year: number;
  incomeStatement: any,
  patrimonialStatement: any,
  patrimonialNameBase: string;
  incomeNameBase: string;
  disabled?: boolean
}
function FinancialYearEditComponent({
  year, incomeStatement, patrimonialStatement,
  patrimonialNameBase,
  incomeNameBase,
  disabled
}: FinancialYearEditComponentProps) {
  const { setValue, watch } = useFormContext();
  
  const watchActiveCurrentTotal = watch(
    `${patrimonialNameBase}.${PatrimonialStatementFields.ActiveCurrentTotal}`,
    0,
  );
  const watchActiveNotCurrentTotal = watch(
    `${patrimonialNameBase}.${PatrimonialStatementFields.ActiveNotCurrentTotal}`,
    0,
  );
  const watchActiveTotal = watch(
    `${patrimonialNameBase}.${PatrimonialStatementFields.ActiveTotal}`,
    0,
  );
  const watchPassiveCurrentTotal = watch(
    `${patrimonialNameBase}.${PatrimonialStatementFields.PassiveCurrentTotal}`,
    0,
  );
  const watchPassiveNotCurrentTotal = watch(
    `${patrimonialNameBase}.${PatrimonialStatementFields.PassiveNotCurrentTotal}`,
    0,
  );
  const watchPassiveTotal = watch(
    `${patrimonialNameBase}.${PatrimonialStatementFields.PassiveTotal}`,
    0,
  );
  const watchLastActiveCurrentTotal = watch(
    `${patrimonialNameBase}.${CompanyPatrimonialStatementFields.LastPatrimonialStatement}.${PatrimonialStatementFields.ActiveCurrentTotal}`,
    0,
  );
  const watchLastActiveNotCurrentTotal = watch(
    `${patrimonialNameBase}.${CompanyPatrimonialStatementFields.LastPatrimonialStatement}.${PatrimonialStatementFields.ActiveNotCurrentTotal}`,
    0,
  );
  const watchLastActiveTotal = watch(
    `${patrimonialNameBase}.${CompanyPatrimonialStatementFields.LastPatrimonialStatement}.${PatrimonialStatementFields.ActiveTotal}`,
    0,
  );
  const watchLastPassiveCurrentTotal = watch(
    `${patrimonialNameBase}.${CompanyPatrimonialStatementFields.LastPatrimonialStatement}.${PatrimonialStatementFields.PassiveCurrentTotal}`,
    0,
  );
  const watchLastPassiveNotCurrentTotal = watch(
    `${patrimonialNameBase}.${CompanyPatrimonialStatementFields.LastPatrimonialStatement}.${PatrimonialStatementFields.PassiveNotCurrentTotal}`,
    0,
  );
  const watchLastPassiveTotal = watch(
    `${patrimonialNameBase}.${CompanyPatrimonialStatementFields.LastPatrimonialStatement}.${PatrimonialStatementFields.PassiveTotal}`,
    0,
  );

  useEffect(() => {
    setValue(
      `${patrimonialNameBase}.${PatrimonialStatementFields.ActiveTotal}`,
      parseFloat(watchActiveCurrentTotal || '0') +
        parseFloat(watchActiveNotCurrentTotal || '0'),
    );
  }, [watchActiveCurrentTotal, watchActiveNotCurrentTotal]);

  useEffect(() => {
    setValue(
      `${patrimonialNameBase}.${PatrimonialStatementFields.PassiveTotal}`,
      parseFloat(watchPassiveCurrentTotal || '0') +
        parseFloat(watchPassiveNotCurrentTotal || '0'),
    );
  }, [watchPassiveCurrentTotal, watchPassiveNotCurrentTotal]);

  useEffect(() => {
    setValue(
      `${patrimonialNameBase}.${PatrimonialStatementFields.NetPatrimonyTotal}`,
      parseFloat(watchActiveTotal || '0') -
        parseFloat(watchPassiveTotal || '0'),
    );
  }, [watchActiveTotal, watchPassiveTotal]);

  useEffect(() => {
    setValue(
      `${patrimonialNameBase}.${CompanyPatrimonialStatementFields.LastPatrimonialStatement}.${PatrimonialStatementFields.ActiveTotal}`,
      parseFloat(watchLastActiveCurrentTotal || '0') +
        parseFloat(watchLastActiveNotCurrentTotal || '0'),
    );
  }, [watchLastActiveCurrentTotal, watchLastActiveNotCurrentTotal]);

  useEffect(() => {
    setValue(
      `${patrimonialNameBase}.${CompanyPatrimonialStatementFields.LastPatrimonialStatement}.${PatrimonialStatementFields.PassiveTotal}`,
      parseFloat(watchLastPassiveCurrentTotal || '0') +
        parseFloat(watchLastPassiveNotCurrentTotal || '0'),
    );
  }, [watchLastPassiveCurrentTotal, watchLastPassiveNotCurrentTotal]);

  useEffect(() => {
    setValue(
      `${patrimonialNameBase}.${CompanyPatrimonialStatementFields.LastPatrimonialStatement}.${PatrimonialStatementFields.NetPatrimonyTotal}`,
      parseFloat(watchLastActiveTotal || '0') -
        parseFloat(watchLastPassiveTotal || '0'),
    );
  }, [watchLastActiveTotal, watchLastPassiveTotal]);

  // @ts-ignore
  const lastFinancialTotals: CompanyFinancialTotals[] | undefined = (patrimonialStatement && incomeStatement) ?
      [
        {
          ...patrimonialStatement, ...incomeStatement,
          [CompanyFinancialTotalsFields.Date]: new Date(patrimonialStatement[CompanyBasePatrimonialStatementFields.Year], 1, 1)
        },
        {
          ...patrimonialStatement[CompanyPatrimonialStatementFields.LastPatrimonialStatement],
          ...incomeStatement[CompanyIncomeLastYearStatementFields.LastYearIncomeStatement],
          [CompanyFinancialTotalsFields.Date]: new Date(patrimonialStatement[CompanyPatrimonialStatementFields.LastPatrimonialStatement][CompanyBasePatrimonialStatementFields.Year], 1, 1)
        }
      ] : undefined;
  
  return (
      <EconomicFinancialTableWrapper title={''} expanded={true} expandable={false}>
        <Stack spacing={2} sx={{ padding: '0px !important' }}>
          <FinancialPatrimonialYearlyEditTotals totals={lastFinancialTotals} patrimonialNameBase={patrimonialNameBase} disabled={disabled} />
          <FinancialResultYearlyEditTotals totals={lastFinancialTotals} incomeNameBase={incomeNameBase} disabled={disabled} />
        </Stack>
      </EconomicFinancialTableWrapper>
  );
}

export default FinancialYearEditComponent;
