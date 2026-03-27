import React from 'react';
import { CompanyViewDTO } from '../../../types/company/companyData';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { Grid } from '@mui/material';
import CompanySolicitationByStatusCard from './CompanySolicitationByStatusCard';
import CompanySolicitationOffererTotalsCard from './CompanySolicitationOffererTotalsCard';
import CompanySolicitationByProductService from './CompanySolicitationByProductService';

interface CompanySolicitationChartsProps {
  company: CompanyViewDTO;
}

function CompanySolicitationCharts({
  company,
}: CompanySolicitationChartsProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <CompanySolicitationByStatusCard
          companyId={company[EntityWithIdFields.Id]}
        />
      </Grid>
      <Grid item xs={4}>
        <CompanySolicitationByProductService
          companyId={company[EntityWithIdFields.Id]}
        />
      </Grid>
      <Grid item xs={4}>
        <CompanySolicitationOffererTotalsCard
          companyId={company[EntityWithIdFields.Id]}
        />
      </Grid>
    </Grid>
  );
}

export default CompanySolicitationCharts;
