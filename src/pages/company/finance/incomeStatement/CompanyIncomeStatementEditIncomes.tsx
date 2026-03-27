import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Grid, Typography } from '@mui/material';

import { ControlledTextFieldFilled } from 'components/forms';
import { CompanyIncomeStatementFields } from 'types/company/companyFinanceInformationData';
import { grey } from '@mui/material/colors';
import CompanyIncomeFieldVariation from './CompanyIncomeFieldVariation';

interface CompanyIncomeStatementEditIncomesProps {
  nameBase: string;
}

function CompanyIncomeStatementEditIncomes({
  nameBase,
}: CompanyIncomeStatementEditIncomesProps) {
  const { control, setValue, watch } = useFormContext();

  const watchIncomeSales = watch(
    `${nameBase}.${CompanyIncomeStatementFields.IncomeSales}`,
  );
  const handleFocus = (e: any) => e.target.select();

  useEffect(() => {
    setValue(
      `${nameBase}.${CompanyIncomeStatementFields.IncomeTotal}`,
      parseFloat(watchIncomeSales || '0'),
      { shouldDirty: true }
    );
  }, [watchIncomeSales]);

  return (
    <Grid container spacing={1} mt={2} alignItems={'center'}>
      <Grid item xs={12} container alignItems={'center'} mb={1}>
        <Grid item xs={4}></Grid>
        <Grid item xs={3}>
          <Typography color={grey[600]} fontSize={18} textAlign={'center'}>
            Año actual
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography color={grey[600]} fontSize={18} textAlign={'center'}>
            Año pasado
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Typography color={grey[600]} fontSize={18} textAlign={'center'}>
            Variación
          </Typography>
        </Grid>
      </Grid>
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <Grid item xs={4}>
          <Typography color={grey[600]} fontSize={18}>
            Ventas
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyIncomeStatementFields.IncomeSales}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.IncomeSales}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}>
          <CompanyIncomeFieldVariation
            nameBase={nameBase}
            field={CompanyIncomeStatementFields.IncomeSales}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CompanyIncomeStatementEditIncomes;
