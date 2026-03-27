import React from 'react';
import {Box, Skeleton, Stack} from '@mui/material';

function ProductLineCardLoading() {
  return (
      <Box
          sx={{
              border: '1px solid #EDF2F7',
              backgroundColor: 'white',
              borderRadius: '16px',
              p: 2,
          }}
      >
          <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton variant="rectangular" width={80} height={20} sx={{ borderRadius: '4px' }} />
              </Stack>

              <Skeleton variant="text" height={28} width="90%" />

              <Skeleton variant="text" height={20} width="100%" />
              <Skeleton variant="text" height={20} width="80%" />

              <Box sx={{ height: 16 }} />

              <Skeleton
                  variant="rectangular"
                  height={40}
                  sx={{ borderRadius: '24px' }}
              />
          </Stack>
      </Box>
  );
}

export default ProductLineCardLoading;
