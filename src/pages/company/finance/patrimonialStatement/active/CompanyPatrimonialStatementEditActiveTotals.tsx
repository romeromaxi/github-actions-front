import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Divider, Grid, Typography } from '@mui/material';

import { ControlledTextFieldFilled } from 'components/forms';

import { CompanyBasePatrimonialStatementFields } from 'types/company/companyFinanceInformationData';
import { grey } from '@mui/material/colors';
import CompanyYearFieldVariation from '../../components/CompanyYearFieldVariation';

interface CompanyPatrimonialStatementEditActiveTotalsProps {
  nameBase: string;
}

function CompanyPatrimonialStatementEditActiveTotals({
  nameBase,
}: CompanyPatrimonialStatementEditActiveTotalsProps) {
  const { control } = useFormContext();

  return (
    <Grid container spacing={2} alignItems={'center'}>
      <Grid item xs={12}>
        <Divider sx={{ borderStyle: 'dashed', mt: 1 }} />
      </Grid>
      <Grid item xs={4}>
        <Typography color={grey[600]} fontSize={20} fontWeight={600}>
          Total
        </Typography>
      </Grid>
      <Grid item xs={3}>
        <ControlledTextFieldFilled
          label=""
          control={control}
          name={`${nameBase}.${CompanyBasePatrimonialStatementFields.ActiveTotal}`}
          currency
          disabled={true}
          textAlign={'right'}
        />
      </Grid>
      <Grid item xs={3}>
        <ControlledTextFieldFilled
          label=""
          control={control}
          name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.ActiveTotal}`}
          currency
          disabled={true}
          textAlign={'right'}
        />
      </Grid>
      <Grid item xs={2}>
        <CompanyYearFieldVariation
          nameBase={nameBase}
          field={CompanyBasePatrimonialStatementFields.ActiveTotal}
        />
      </Grid>
    </Grid>
  );
}

export default CompanyPatrimonialStatementEditActiveTotals;
