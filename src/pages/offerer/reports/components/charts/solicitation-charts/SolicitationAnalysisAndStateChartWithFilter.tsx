import React from 'react';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import SolicitationStateChart from './SolicitationStateChart';
import SolicitationsInAnalysisChart from './SolicitationsInAnalysisChart';
import { useSolicitationChartFilter } from '../../../hooks/useSolicitationFilter';

interface SolicitationAnalysisAndStateChartWithFilterProps {
  offererId: number;
}

function SolicitationAnalysisAndStateChartWithFilter({
  offererId,
}: SolicitationAnalysisAndStateChartWithFilterProps) {
  const { Filters, formValues } = useSolicitationChartFilter(offererId);

  return (
    <Grid item xs={12} container spacing={1}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={'Filtros'} />
          <CardContent>
            <Filters />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <SolicitationStateChart offererId={offererId} filter={formValues} />
      </Grid>
      <Grid item xs={6}>
        <SolicitationsInAnalysisChart
          offererId={offererId}
          filter={formValues}
        />
      </Grid>
    </Grid>
  );
}

export default SolicitationAnalysisAndStateChartWithFilter;
