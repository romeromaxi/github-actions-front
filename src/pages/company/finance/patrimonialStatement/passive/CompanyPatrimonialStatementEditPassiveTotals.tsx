import React from 'react';
import { useFormContext } from 'react-hook-form';

import { Divider, Grid, Typography } from '@mui/material';

import { CompanyBasePatrimonialStatementFields } from 'types/company/companyFinanceInformationData';
import { grey } from '@mui/material/colors';
import { ControlledTextFieldFilled } from '../../../../../components/forms';
import CompanyYearFieldVariation from '../../components/CompanyYearFieldVariation';

interface CompanyPatrimonialStatementEditPassiveTotalsProps {
  nameBase: string;
}

function CompanyPatrimonialStatementEditPassiveTotals({
  nameBase,
}: CompanyPatrimonialStatementEditPassiveTotalsProps) {
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
          name={`${nameBase}.${CompanyBasePatrimonialStatementFields.PassiveTotal}`}
          currency
          disabled={true}
          textAlign={'right'}
        />
      </Grid>
      <Grid item xs={3}>
        <ControlledTextFieldFilled
          label=""
          control={control}
          name={`${nameBase}.estadoPatrimonialAnterior.${CompanyBasePatrimonialStatementFields.PassiveTotal}`}
          currency
          disabled={true}
          textAlign={'right'}
        />
      </Grid>
      <Grid item xs={2}>
        <CompanyYearFieldVariation
          nameBase={nameBase}
          field={CompanyBasePatrimonialStatementFields.PassiveTotal}
        />
      </Grid>
    </Grid>
  );
}

export default CompanyPatrimonialStatementEditPassiveTotals;
