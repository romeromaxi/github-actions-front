import React from 'react';
import { Grid } from '@mui/material';
import OffererAdminDetailCards from '../components/OffererAdminDetailCards';

function HomeOffererAdmin() {
  return (
    <Grid container spacing={2}>
      {/*<Grid item xs={12}>
                    <OffererDetailHeader icon={<AdminPanelSettingsRoundedIcon fontSize={'large'} color={'info'} />}
                                         role={'Vista administrador'}
                    />
                </Grid>*/}
      <Grid item xs={12} container alignItems={'center'} spacing={2}>
        <OffererAdminDetailCards />
      </Grid>
    </Grid>
  );
}

export default HomeOffererAdmin;
