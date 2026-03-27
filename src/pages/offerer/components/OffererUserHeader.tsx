import React, { ReactElement } from 'react';
import { Card, CardContent, Stack } from '@mui/material';

interface OffererUserHeaderProps {
  children?: ReactElement | ReactElement[];
}

function OffererUserHeader({ children }: OffererUserHeaderProps) {
  
  return (
    <Card>
      <CardContent>
        <Stack
          direction={'row'}
          alignItems={'start'}
          justifyContent={'space-between'}
        >
            {children}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default OffererUserHeader;
