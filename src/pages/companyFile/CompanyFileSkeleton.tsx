import React from 'react';
import { Skeleton, Stack } from '@mui/material';

function CompanyFileSkeleton() {
  return (
    <Stack>
      <Skeleton height={100} />
      <Stack direction={'row'} gap={1} sx={{ mt: -5 }}>
        <Skeleton height={400} width={'30%'} />
        <Skeleton height={400} width={'70%'} />
      </Stack>
    </Stack>
  );
}

export default CompanyFileSkeleton;
