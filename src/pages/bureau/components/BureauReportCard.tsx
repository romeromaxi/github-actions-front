import React from 'react';
import {Card, CardContent, Stack, Typography} from '@mui/material';
import { TableCardHeader } from '../../../components/table';

interface BureauReportCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

function BureauReportCard({ children, title, subtitle }: BureauReportCardProps) {
  return (
    <Card
      sx={{
        boxShadow: 0,
        padding: '0 !important',
        borderRadius: '0px !important',
      }}
    >
      <TableCardHeader title={
          <Stack>
              <Typography variant={'h5'} fontWeight={500}>{title}</Typography>
              <Typography variant={'caption'} color={'text.lighter'}>{subtitle}</Typography>
          </Stack>
      } />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default BureauReportCard;
