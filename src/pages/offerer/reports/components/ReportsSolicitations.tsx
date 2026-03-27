import React, { useContext } from 'react';
import { OffererContext } from '../../components/OffererContextProvider';
import { Grid } from '@mui/material';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import SolicitationAnalysisAndStateChartWithFilter from './charts/solicitation-charts/SolicitationAnalysisAndStateChartWithFilter';

function ReportsSolicitations() {
  const offerer = useContext(OffererContext);
  return (
    <Grid container spacing={1} sx={{ mb: 5 }}>
      <Grid item container xs={12}>
        <SolicitationAnalysisAndStateChartWithFilter
          offererId={offerer[EntityWithIdFields.Id]}
        />
      </Grid>
    </Grid>
  );
}

export default ReportsSolicitations;
