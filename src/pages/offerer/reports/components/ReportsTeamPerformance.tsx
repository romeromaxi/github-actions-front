import React from 'react';
import { Grid } from '@mui/material';
import TeamReceivedSolicitationsChart from './charts/team-peformance-charts/TeamReceivedSolicitationsChart';
import TeamSolicitationsResolvedByTeamSize from './charts/team-peformance-charts/TeamSolicitationsResolvedByTeamSize';

function ReportsTeamPerformance() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <TeamSolicitationsResolvedByTeamSize />
      </Grid>
      <Grid item xs={6}>
        <TeamReceivedSolicitationsChart />
      </Grid>
    </Grid>
  );
}

export default ReportsTeamPerformance;
