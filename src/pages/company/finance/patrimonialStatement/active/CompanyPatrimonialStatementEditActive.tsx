import React from 'react';

import { Box, Divider, Grid, Typography } from '@mui/material';

import CompanyPatrimonialStatementEditActiveCurrent from './CompanyPatrimonialStatementEditActiveCurrent';
import CompanyPatrimonialStatementEditActiveNotCurrent from './CompanyPatrimonialStatementEditActiveNotCurrent';
import CompanyPatrimonialStatementEditActiveTotals from './CompanyPatrimonialStatementEditActiveTotals';
import CompanyFinancialSectionTitle from '../../components/CompanyFinancialSectionTitle';

interface CompanyPatrimonialStatementEditActiveProps {
  nameBase: string;
}

function CompanyPatrimonialStatementEditActive({
  nameBase,
}: CompanyPatrimonialStatementEditActiveProps) {
  return (
    <Grid container spacing={2}>
      <CompanyFinancialSectionTitle title={'Activo'} />

      <Grid container item xs={12} spacing={3}>
        <Grid item xs={12}>
          <Typography fontSize={18} fontWeight={500}>
            Corriente
          </Typography>
          <CompanyPatrimonialStatementEditActiveCurrent nameBase={nameBase} />
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ borderStyle: 'dashed', mt: 1 }} />
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={18} fontWeight={500}>
            No corriente
          </Typography>
          <CompanyPatrimonialStatementEditActiveNotCurrent
            nameBase={nameBase}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <CompanyPatrimonialStatementEditActiveTotals nameBase={nameBase} />
      </Grid>
    </Grid>
  );
}

export default CompanyPatrimonialStatementEditActive;
