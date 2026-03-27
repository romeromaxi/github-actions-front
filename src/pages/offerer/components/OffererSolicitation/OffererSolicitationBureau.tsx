import React from 'react';
import { useQuery } from 'hooks/useQuery';
import { Stack } from '@mui/material';
import CompanyBureauInfo from '../../../bureau/CompanyBureauInfo';

interface OffererSolicitationBureauProps {
  companyId: number;
}

const OffererSolicitationBureau = ({
  companyId,
}: OffererSolicitationBureauProps) => {
  const queryParams = useQuery();
  const id = parseInt(queryParams.get('id') || '');

  return (
    <Stack spacing={2}>
      <CompanyBureauInfo
        dataId={companyId}
        defaultTab={'bcra'}
        defaultQueryId={id}
        hideActions
      />
    </Stack>
  );
};

export default OffererSolicitationBureau;
