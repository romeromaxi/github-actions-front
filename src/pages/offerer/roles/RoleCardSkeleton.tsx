import React from 'react';
import { Grid, Skeleton, Stack, Typography } from '@mui/material';

import RoleCardStyles from './RoleCard.styles';

function RoleCardSkeleton() {
  const classes = RoleCardStyles();

  return (
    <Grid
      container
      spacing={1}
      className={`${classes.cardRole} ${classes.backgroudRoleLoading}`}
    >
      <Grid item xs={12} container>
        <Grid item xs={2}>
          <Skeleton variant="circular" width={60} height={60} />
        </Grid>
        <Grid item xs={10}>
          <Stack direction="column" spacing={1}>
            <Skeleton width="80%">
              <Typography>.</Typography>
            </Skeleton>
            <Skeleton width="50%">
              <Typography>.</Typography>
            </Skeleton>
          </Stack>
        </Grid>
      </Grid>

      <Grid item xs={12} container>
        <Grid item xs={12}>
          <Stack direction="column" spacing={1}>
            <Skeleton width="90%">
              <Typography>.</Typography>
            </Skeleton>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default RoleCardSkeleton;
