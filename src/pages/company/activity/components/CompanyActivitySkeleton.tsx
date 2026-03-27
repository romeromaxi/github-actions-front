import React from 'react';
import { Box, Skeleton, Stack } from '@mui/material';
import { boxSx } from './ActivityBox.styles';

function CompanyActivitySkeleton() {
  return (
    <Box sx={boxSx}>
      <Stack direction={'row'} gap={1}>
        <Skeleton variant={'text'} sx={{ width: 1 / 3 }} />
        <Skeleton variant={'text'} sx={{ width: 1 / 6 }} />
        <Skeleton variant={'text'} sx={{ width: 1 / 6 }} />
        <Skeleton variant={'text'} sx={{ width: 1 / 3 }} />
      </Stack>
    </Box>
  );
}

export default CompanyActivitySkeleton;
