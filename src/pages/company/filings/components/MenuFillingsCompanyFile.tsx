import React from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import CompanyFileFillingsButtons from './CompanyFileFillingsButtons';

interface MenuFillingsCompanyFileProps {
  companyId: number;
}

const MenuFillingsCompanyFile = ({
  companyId,
}: MenuFillingsCompanyFileProps) => {
  return (
    <Stack spacing={0.2}>
      <Typography variant="h3" fontWeight={600}>
        Tus Legajos
      </Typography>
      <Grid container spacing={2}>
        <CompanyFileFillingsButtons companyId={companyId} />
      </Grid>
    </Stack>
  );
};

export default MenuFillingsCompanyFile;
