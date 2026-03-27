import React from 'react';
import { Stack } from '@mui/material';

import CompanyResponsiblesList from './CompanyResponsiblesList';

function CompanyAdministratorsRepresentativesList() {
  return (
    <Stack direction={'column'} gap={2}>
      <CompanyResponsiblesList />
    </Stack>
  );
}

export default CompanyAdministratorsRepresentativesList;
