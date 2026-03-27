import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { greyColor900 } from 'util/themes/ThemeItapTec';

interface SubTitleAppBarProps extends TypographyProps {
  textDisabled?: boolean;
}

function SubTitleAppBar({
  children,
  textDisabled,
  ...props
}: SubTitleAppBarProps) {
  const color = textDisabled ? 'text.disabled' : props.color || greyColor900;

  return (
    <Typography
      fontSize="1rem !important"
      color={color}
      fontWeight={500}
      {...props}
    >
      {children}
    </Typography>
  );
}

export { SubTitleAppBar };
