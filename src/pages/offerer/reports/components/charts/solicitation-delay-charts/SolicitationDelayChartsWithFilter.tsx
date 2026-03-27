import React from 'react';
import { useSolicitationChartFilter } from '../../../hooks/useSolicitationFilter';
import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import SolicitationStateChart from '../solicitation-charts/SolicitationStateChart';
import SolicitationsInAnalysisChart from '../solicitation-charts/SolicitationsInAnalysisChart';
import SolicitationTimeInStageChart from './SolicitationTimeInStageChart';
import SolicitationAverageTimeByStageChart from './SolicitationAverageTimeByStageChart';

interface SolicitationDelayChartsWithFilterProps {
  offererId: number;
}

function SolicitationDelayChartsWithFilter({
  offererId,
}: SolicitationDelayChartsWithFilterProps) {
  const { Filters, formValues } = useSolicitationChartFilter(offererId);

  return (
    <Grid item xs={12} container spacing={1}>
      <Grid item xs={12}></Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={'Filtros'} />
          <CardContent>
            <Filters />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <SolicitationTimeInStageChart
          offererId={offererId}
          filter={formValues}
        />
      </Grid>
      <Grid item xs={6}>
        <SolicitationAverageTimeByStageChart
          offererId={offererId}
          filter={formValues}
        />
      </Grid>
    </Grid>
  );
}

export default SolicitationDelayChartsWithFilter;
