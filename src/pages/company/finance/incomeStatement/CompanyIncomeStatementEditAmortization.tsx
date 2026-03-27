import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Grid, Stack, Typography } from '@mui/material';

import {
  CompanyBasePatrimonialStatementFields,
  CompanyIncomeStatementFields,
} from 'types/company/companyFinanceInformationData';
import { ControlledTextFieldFilled } from '../../../../components/forms';
import { grey } from '@mui/material/colors';
import CompanyIncomeFieldVariation from './CompanyIncomeFieldVariation';

interface CompanyIncomeStatementEditAmortizationProps {
  nameBase: string;
}

function CompanyIncomeStatementEditAmortization({
  nameBase,
}: CompanyIncomeStatementEditAmortizationProps) {
  const { control } = useFormContext();
  const handleFocus = (e: any) => e.target.select();

  return (
    <Grid container spacing={2} mt={2} alignItems={'center'}>
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
            Neto
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.${CompanyIncomeStatementFields.AmortizationTotal}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={3}>
          <ControlledTextFieldFilled
            label=""
            control={control}
            name={`${nameBase}.estadoResultadoAnterior.${CompanyIncomeStatementFields.AmortizationTotal}`}
            currency
            onFocus={handleFocus}
            textAlign={'right'}
          />
        </Grid>
        <Grid item xs={2}>
          <CompanyIncomeFieldVariation
            nameBase={nameBase}
            field={CompanyIncomeStatementFields.AmortizationTotal}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CompanyIncomeStatementEditAmortization;
