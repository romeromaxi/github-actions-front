import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { greyColor900 } from 'util/themes/ThemeItapTec';

function TitleAppBar({ children, ...props }: TypographyProps) {
  return (
    <Typography
      variant="h1"
      fontWeight={600}
      fontSize="1.5rem !important"
      color={greyColor900}
      lineHeight={1.2}
      {...props}
    >
      {children}
    </Typography>
  );
}

export { TitleAppBar };
