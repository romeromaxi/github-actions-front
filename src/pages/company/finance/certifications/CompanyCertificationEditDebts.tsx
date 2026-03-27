import { useFormContext } from 'react-hook-form';
import { CompanyCertificationsFields } from '../../../../types/company/companyFinanceInformationData';
import React, { useEffect } from 'react';
import { Divider, Grid, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ControlledTextFieldFilled } from '../../../../components/forms';

interface CompanyCertificationEditDebtsProps {
  nameBase: string;
}

const CompanyCertificationEditDebts = ({
  nameBase,
}: CompanyCertificationEditDebtsProps) => {
  const { control, setValue, watch } = useFormContext();

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
  useEffect(() => {
    updateIncomesTotal();
  }, [watchIncome]);

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

  const handleFocus = (e: any) => e.target.select();

  useEffect(() => {
    updateDebtsTotal();
  }, [watchCommercial, watchPersonal, watchTax]);

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
            Deudas Comerciales
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyCertificationsFields.Debts_Commercial}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={6}>
          <Typography color={grey[600]} fontSize={14}>
            Deudas Personales
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyCertificationsFields.Debts_Personal}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}></Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={6}>
          <Typography color={grey[600]} fontSize={14}>
            Deudas Fiscales
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyCertificationsFields.Debts_Tax}`}
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
            name={`${nameBase}.${CompanyCertificationsFields.Debts_Total}`}
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

export default CompanyCertificationEditDebts;
