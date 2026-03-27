import React, { useContext } from 'react';
import { OffererContext } from '../components/OffererContextProvider';
import { Grid } from '@mui/material';
import { EntityWithIdFields } from '../../../types/baseEntities';
import OffererDocumentation from '../documentation/OffererDocumentation';

function HomeOffererDocumentation() {
  const offerer = useContext(OffererContext);

  return (
    <Grid container>
      <Grid item xs={12}>
        <OffererDocumentation offererId={offerer[EntityWithIdFields.Id]} />
      </Grid>
    </Grid>
  );
}

export default HomeOffererDocumentation;
