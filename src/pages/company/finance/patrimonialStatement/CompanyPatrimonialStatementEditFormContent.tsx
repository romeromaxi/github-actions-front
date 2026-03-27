import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {Stack} from '@mui/material';
import CompanyPatrimonialYearTable from './CompanyPatrimonialYearTable';
import CompanyIncomeYearTable from '../incomeStatement/CompanyIncomeYearTable';
import {PatrimonialStatementFields} from "../../../../types/general/generalFinanceData";
import {FinancialYearEditFormFields} from "../components/FinancialYearDetail";

interface CompanyPatrimonialStatementEditFormContentProps {
  nameBase: string;
  year: number;
}
function CompanyPatrimonialStatementEditFormContent({
  nameBase,
  year,
}: CompanyPatrimonialStatementEditFormContentProps) {
  const { setValue, watch } = useFormContext();

  const watchActiveCurrentTotal = watch(
    `${nameBase}.${PatrimonialStatementFields.ActiveCurrentTotal}`,
    0,
  );
  const watchActiveNotCurrentTotal = watch(
    `${nameBase}.${PatrimonialStatementFields.ActiveNotCurrentTotal}`,
    0,
  );
  const watchPassiveCurrentTotal = watch(
    `${nameBase}.${PatrimonialStatementFields.PassiveCurrentTotal}`,
    0,
  );
  const watchPassiveNotCurrentTotal = watch(
    `${nameBase}.${PatrimonialStatementFields.PassiveNotCurrentTotal}`,
    0,
  );
  const watchLastActiveCurrentTotal = watch(
    `${nameBase}.estadoPatrimonialAnterior.${PatrimonialStatementFields.ActiveCurrentTotal}`,
    0,
  );
  const watchLastActiveNotCurrentTotal = watch(
    `${nameBase}.estadoPatrimonialAnterior.${PatrimonialStatementFields.ActiveNotCurrentTotal}`,
    0,
  );
  const watchLastPassiveCurrentTotal = watch(
    `${nameBase}.estadoPatrimonialAnterior.${PatrimonialStatementFields.PassiveCurrentTotal}`,
    0,
  );
  const watchLastPassiveNotCurrentTotal = watch(
    `${nameBase}.estadoPatrimonialAnterior.${PatrimonialStatementFields.PassiveNotCurrentTotal}`,
    0,
  );

  useEffect(() => {
    setValue(
      `${nameBase}.${PatrimonialStatementFields.ActiveTotal}`,
      parseFloat(watchActiveCurrentTotal || '0') +
        parseFloat(watchActiveNotCurrentTotal || '0'),
    );
  }, [watchActiveCurrentTotal, watchActiveNotCurrentTotal]);

  useEffect(() => {
    setValue(
      `${nameBase}.${PatrimonialStatementFields.PassiveTotal}`,
      parseFloat(watchPassiveCurrentTotal || '0') +
        parseFloat(watchPassiveNotCurrentTotal || '0'),
    );
  }, [watchPassiveCurrentTotal, watchPassiveNotCurrentTotal]);

  useEffect(() => {
    setValue(
      `${nameBase}.estadoPatrimonialAnterior.${PatrimonialStatementFields.ActiveTotal}`,
      parseFloat(watchLastActiveCurrentTotal || '0') +
        parseFloat(watchLastActiveNotCurrentTotal || '0'),
    );
  }, [watchLastActiveCurrentTotal, watchLastActiveNotCurrentTotal]);

  useEffect(() => {
    setValue(
      `${nameBase}.estadoPatrimonialAnterior.${PatrimonialStatementFields.PassiveTotal}`,
      parseFloat(watchLastPassiveCurrentTotal || '0') +
        parseFloat(watchLastPassiveNotCurrentTotal || '0'),
    );
  }, [watchLastPassiveCurrentTotal, watchLastPassiveNotCurrentTotal]);

  return (
    <Stack spacing={2} mt={1}>
      <CompanyPatrimonialYearTable
        year={year}
        nameBase={FinancialYearEditFormFields.PatrimonialStatement}
      />
      <CompanyIncomeYearTable
        year={year}
        nameBase={FinancialYearEditFormFields.IncomeStatement}
      />
    </Stack>
  );
}

export default CompanyPatrimonialStatementEditFormContent;
