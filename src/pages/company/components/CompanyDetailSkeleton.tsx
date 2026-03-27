import React from 'react';
import { Skeleton, Stack } from '@mui/material';
import SectionHeader from '../../../components/cards/SectionHeader';

function CompanyDetailSkeleton() {
  const skeletonWidth: string = '100%';

  return (
    <Stack direction={'column'}>
      <SectionHeader>Empresa</SectionHeader>
      <Skeleton variant={'rectangular'} width={skeletonWidth} height={150} />
      <SectionHeader sx={{ mt: 3 }}>Contacto</SectionHeader>
      <Skeleton variant={'rectangular'} width={skeletonWidth} height={150} />

      <SectionHeader sx={{ mt: 3 }} variant={'h6'}>
        Documentación Respaldatoria
      </SectionHeader>
      <Skeleton variant={'rectangular'} width={skeletonWidth} height={150} />
    </Stack>
  );
}

export default CompanyDetailSkeleton;
