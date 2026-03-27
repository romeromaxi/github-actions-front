import React from 'react';
import { Box, Grid, Skeleton, Stack, Typography } from '@mui/material';
import SectionHeader from '../../../components/cards/SectionHeader';
import { grey } from '@mui/material/colors';

function CompanyFlowSkeleton() {
  const skeletonWidth: string = '100%';

  return (
    <Stack direction={'column'} spacing={1} sx={{ width: 1 }}>
      <Grid item container xs={12}>
        <Grid item xs={6}>
          <Box width={'100%'} />
        </Grid>
        <Grid item xs={3}>
          <Typography
            style={{ textAlign: 'center' }}
            color={grey[600]}
            variant={'h6'}
          >
            Ingreso
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography
            style={{ textAlign: 'center' }}
            color={grey[600]}
            variant={'h6'}
          >
            Egreso
          </Typography>
        </Grid>
      </Grid>
      {Array.from({ length: 18 }).map(() => (
        <Stack direction={'row'} spacing={3}>
          <Skeleton variant={'rectangular'} width={'50%'} height={30} />
          <Skeleton variant={'rectangular'} width={'25%'} height={30} />
          <Skeleton variant={'rectangular'} width={'25%'} height={30} />
        </Stack>
      ))}

      <SectionHeader>Documentación Respaldatoria</SectionHeader>
      <Skeleton variant={'rectangular'} width={skeletonWidth} height={50} />
    </Stack>
  );
}

export default CompanyFlowSkeleton;
