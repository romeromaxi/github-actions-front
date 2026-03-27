import React from 'react';

import { Divider, Grid, Typography } from '@mui/material';

import CompanyPatrimonialStatementEditPassiveCurrent from './CompanyPatrimonialStatementEditPassiveCurrent';
import CompanyPatrimonialStatementEditPassiveNotCurrent from './CompanyPatrimonialStatementEditPassiveNotCurrent';
import CompanyPatrimonialStatementEditPassiveTotals from './CompanyPatrimonialStatementEditPassiveTotals';
import CompanyFinancialSectionTitle from '../../components/CompanyFinancialSectionTitle';

interface CompanyPatrimonialStatementEditPassiveProps {
  nameBase: string;
}

function CompanyPatrimonialStatementEditPassive({
  nameBase,
}: CompanyPatrimonialStatementEditPassiveProps) {
  return (
    <Grid container spacing={2}>
      <CompanyFinancialSectionTitle title={'Pasivo'} />

      <Grid container item xs={12} spacing={3}>
        <Grid item xs={12}>
          <Typography fontSize={18} fontWeight={500}>
            Corriente
          </Typography>
          <CompanyPatrimonialStatementEditPassiveCurrent nameBase={nameBase} />
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ borderStyle: 'dashed', mt: 1 }} />
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={18} fontWeight={500}>
            No corriente
          </Typography>
          <CompanyPatrimonialStatementEditPassiveNotCurrent
            nameBase={nameBase}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <CompanyPatrimonialStatementEditPassiveTotals nameBase={nameBase} />
      </Grid>
    </Grid>
  );
}

export default CompanyPatrimonialStatementEditPassive;
