import React from 'react';
import { Grid } from '@mui/material';
import CompanyAffidavitEditTable from './CompanyAffidavitEditTable';

interface CompanyAffidavitEditDetailProps {
  nameBase: string;
}

const CompanyAffidavitEditDetail = ({
  nameBase,
}: CompanyAffidavitEditDetailProps) => {
  return (
    <Grid container spacing={3} mt={1}>
      <Grid item xs={12}>
        <CompanyAffidavitEditTable nameBase={nameBase} />
      </Grid>
    </Grid>
  );
};

export default CompanyAffidavitEditDetail;
