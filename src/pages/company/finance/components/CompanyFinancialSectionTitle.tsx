import { Divider, Grid, Typography } from '@mui/material';
import React from 'react';

interface CompanyFinancialSectionTitleProps {
  title: string;
}

function CompanyFinancialSectionTitle({
  title,
}: CompanyFinancialSectionTitleProps) {
  return (
    <>
      <Grid item xs={12} mt={-1.5}>
        <Typography fontSize={17} fontWeight={600} color={'cornflowerblue'}>
          {title}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>
    </>
  );
}

export default CompanyFinancialSectionTitle;
