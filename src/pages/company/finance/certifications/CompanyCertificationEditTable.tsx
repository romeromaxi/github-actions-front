import { useFormContext } from 'react-hook-form';
import { CompanyCertificationsFields } from '../../../../types/company/companyFinanceInformationData';
import { useEffect } from 'react';
import { Stack } from '@mui/material';
import CompanyCertificationEditTableDebts from './CompanyCertificationEditTableDebts';
import CompanyCertificationEditTableIncomes from './CompanyCertificationEditTableIncomes';

interface CompanyCertificationEditTableProps {
  nameBase: string;
}

const CompanyCertificationEditTable = ({
  nameBase,
}: CompanyCertificationEditTableProps) => {
  const { setValue, watch } = useFormContext();

  const watchCommercial = watch(
    `${nameBase}.${CompanyCertificationsFields.Debts_Commercial}`,
  );
  const watchPersonal = watch(
    `${nameBase}.${CompanyCertificationsFields.Debts_Personal}`,
  );
  const watchTax = watch(
    `${nameBase}.${CompanyCertificationsFields.Debts_Tax}`,
  );
  const watchIncome = watch(
    `${nameBase}.${CompanyCertificationsFields.IncomeAnnual_Total}`,
  );

  const updateIncomesTotal = () => {
    const newTotal: number = parseFloat(watchIncome || '0');

    setValue(
      `${nameBase}.${CompanyCertificationsFields.IncomeAnnual_Total}`,
      newTotal,
    );
  };

  const updateDebtsTotal = () => {
    const newTotal: number =
      parseFloat(watchCommercial || '0') +
      parseFloat(watchPersonal || '0') +
      parseFloat(watchTax || '0');

    setValue(
      `${nameBase}.${CompanyCertificationsFields.Debts_Total}`,
      newTotal,
    );
  };

  useEffect(() => {
    updateIncomesTotal();
  }, [watchIncome]);

  useEffect(() => {
    updateDebtsTotal();
  }, [watchCommercial, watchPersonal, watchTax]);

  return (
    <Stack spacing={4}>
      <CompanyCertificationEditTableDebts nameBase={nameBase} />
      <CompanyCertificationEditTableIncomes nameBase={nameBase} />
    </Stack>
  );
};

export default CompanyCertificationEditTable;
