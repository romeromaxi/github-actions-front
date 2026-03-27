import React from 'react';
import { Grid, Skeleton, Stack, Typography } from '@mui/material';
import OffererCardStyles from './OffererCard.styles';

function OffererCardSkeleton() {
  const classes = OffererCardStyles();

  return (
    <Grid container className={classes.cardCompany}>
      <Grid item xs={12} container>
        <Grid item xs={2}>
          <Skeleton variant="circular" width={80} height={80} />
        </Grid>
        <Grid item xs={10}>
          <Stack direction="column" spacing={1}>
            <Skeleton width="30%">
              <Typography>.</Typography>
            </Skeleton>
            <Skeleton width="60%">
              <Typography>.</Typography>
            </Skeleton>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Skeleton width="10%">
              <Typography>.</Typography>
            </Skeleton>
            <Skeleton width="30%">
              <Typography>.</Typography>
            </Skeleton>
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default OffererCardSkeleton;
