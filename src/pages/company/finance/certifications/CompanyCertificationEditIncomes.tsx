import { useFormContext } from 'react-hook-form';
import { CompanyCertificationsFields } from '../../../../types/company/companyFinanceInformationData';
import React, { useEffect } from 'react';
import { Divider, Grid, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ControlledTextFieldFilled } from '../../../../components/forms';

interface CompanyCertificationEditIncomesProps {
  nameBase: string;
}

const CompanyCertificationEditIncomes = ({
  nameBase,
}: CompanyCertificationEditIncomesProps) => {
  const { control, setValue, watch } = useFormContext();

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

  const handleFocus = (e: any) => e.target.select();

  useEffect(() => {
    updateIncomesTotal();
  }, [watchIncome]);

  return (
    <Grid container spacing={1} mt={2}>
      <Grid item xs={12} container alignItems={'center'} mb={1}>
        <Grid item xs={6}>
          <Typography color={grey[600]} fontSize={18}>
            Concepto
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography color={grey[600]} fontSize={18} textAlign={'center'}>
            Monto
          </Typography>
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={6}>
          <Typography color={grey[600]} fontSize={14}>
            Ingresos Anuales
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyCertificationsFields.IncomeAnnual_Total}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid container spacing={2} alignItems={'center'}>
        <Grid item xs={12}>
          <Divider sx={{ borderStyle: 'dashed', mt: 2 }} />
        </Grid>
        <Grid item xs={6}>
          <Typography color={grey[600]} fontSize={20} fontWeight={600}>
            Total
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyCertificationsFields.IncomeAnnual_Total}`}
            currency
            disabled={true}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
    </Grid>
  );
};

export default CompanyCertificationEditIncomes;
