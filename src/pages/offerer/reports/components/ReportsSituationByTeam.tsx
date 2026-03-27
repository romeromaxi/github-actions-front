import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import TeamSolicitationsByStage from './charts/team-peformance-charts/TeamSolicitationsByStage';
import { OffererContext } from '../../components/OffererContextProvider';
import { EntityWithIdFields } from '../../../../types/baseEntities';

function ReportsSituationByTeam() {
  const offerer = useContext(OffererContext);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TeamSolicitationsByStage offererId={offerer[EntityWithIdFields.Id]} />
      </Grid>
    </Grid>
  );
}

export default ReportsSituationByTeam;
