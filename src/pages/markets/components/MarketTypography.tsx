import React from 'react';
import { Typography, TypographyProps } from '@mui/material';

function MarketTypography({ sx, children, ...props }: TypographyProps) {
  return (
    <Typography
      {...props}
      sx={{
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

export default MarketTypography;
