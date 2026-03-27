import React, { useContext } from 'react';
import { OffererContext } from '../../components/OffererContextProvider';
import { Grid } from '@mui/material';
import LinesByProductChart from './charts/control-panel-charts/LinesByProductChart';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import SolicitationsByProductChart from './charts/control-panel-charts/SolicitationsByProductChart';

function ReportsControlPanel() {
  const offerer = useContext(OffererContext);

  return (
    <Grid container spacing={1} sx={{ mb: 5 }}>
      <Grid item xs={6}>
        <LinesByProductChart offererId={offerer[EntityWithIdFields.Id]} />
      </Grid>
      <Grid item xs={6}>
        <SolicitationsByProductChart
          offererId={offerer[EntityWithIdFields.Id]}
        />
      </Grid>
    </Grid>
  );
}

export default ReportsControlPanel;
