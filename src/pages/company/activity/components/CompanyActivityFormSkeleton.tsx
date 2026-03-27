import React from 'react';
import { Skeleton, Stack } from '@mui/material';
import { boxSx } from './ActivityBox.styles';

function CompanyActivityFormSkeleton() {
  return (
    <Stack direction={'column'} gap={2} sx={{ mt: 2 }}>
      <Stack direction={'column'} gap={1} sx={boxSx}>
        <Skeleton variant={'rectangular'} height={60} />
        <Skeleton variant={'rectangular'} height={60} />
        <Skeleton variant={'text'} width={120} />
        <Stack direction={'row'} justifyContent={'space-between'}>
          <Skeleton variant={'rectangular'} height={40} width={160} />
          <Skeleton variant={'rectangular'} height={40} width={160} />
        </Stack>
      </Stack>

      <Stack direction={'column'} gap={1} sx={boxSx}>
        <Skeleton variant={'rectangular'} height={40} />
        <Skeleton variant={'rectangular'} height={40} />
        <Skeleton variant={'rectangular'} height={40} />
        <Skeleton variant={'rectangular'} height={40} />
        <Skeleton variant={'rectangular'} height={40} />
        <Skeleton variant={'rectangular'} height={40} />
        <Skeleton variant={'rectangular'} height={40} />
        <Skeleton variant={'rectangular'} height={40} />
      </Stack>

      <Stack direction={'column'} gap={1} sx={boxSx}>
        <Skeleton variant={'rectangular'} height={40} width={160} />
      </Stack>
    </Stack>
  );
}

export default CompanyActivityFormSkeleton;
