import React from 'react';
import { Grid } from '@mui/material';
import OffererSolicitationByStatusChart from './OffererSolicitationByStatusChart';
import OffererSolicitationPieChart from './OffererSolicitationPieChart';
import OffererSolicitationLinesStats from './OffererSolicitationLinesStats';

interface OffererSolicitationChartsTabProps {
  offererId: number;
}

function OffererSolicitationChartsTab({
  offererId,
}: OffererSolicitationChartsTabProps) {
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <OffererSolicitationByStatusChart offererId={offererId} />
        </Grid>
        <Grid item xs={4}>
          <OffererSolicitationPieChart offererId={offererId} />
        </Grid>
        <Grid item xs={4}>
          <OffererSolicitationLinesStats offererId={offererId} />
        </Grid>
      </Grid>
    </div>
  );
}

export default OffererSolicitationChartsTab;
