import React from 'react';
import { Paper, Stack, Typography } from '@mui/material';

export interface LucInfoCardProps {
  primaryText: string;
  secondaryText: string;
  icon: React.ReactNode;
}

function LucInfoCard({ primaryText, secondaryText, icon }: LucInfoCardProps) {
  return (
    <Paper
      sx={{
        boxShadow: 1,
        ':--moz-transition': 'all 0.5s ease-in-out',
        ':--o-transition': 'all 0.5s ease-in-out',
        ':--webkit-transition': 'all 0.5s ease-in-out',
        ':--ms-transition': 'all 0.5s ease-in-out',
        transition: 'all 0.5s ease-in-out',
        '&:hover': {
          color: '#fff',
          ':--moz-transform': 'translateY(-10px)',
          ':--o-transform': 'translateY(-10px)',
          ':--webkit-transform': 'translateY(-10px)',
          ':--ms-transform': 'translateY(-10px)',
          transform: 'translateY(-10px)',
        },
      }}
    >
      <Stack direction={'column'} alignItems={'center'} sx={{ p: 5 }}>
        {icon}
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: '1.125rem',
            fontWeight: 500,
            lineHeight: 1.2,
            color: '#111',
          }}
        >
          {primaryText}
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            color: '#637381',
            fontSize: '0.875rem',
          }}
        >
          {secondaryText}
        </Typography>
      </Stack>
    </Paper>
  );
}

export default LucInfoCard;
