import React from 'react';
import { SxProps, Typography, TypographyProps } from '@mui/material';
import { Theme } from '@mui/material/styles';
import SectionHeaderStyles from './SectionHeader.styles';
import { EnumColors } from '../../types/general/generalEnums';
import { getBaseColor } from '../../util/typification/generalColors';

interface SectionHeaderProps extends TypographyProps {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
  textColor?: EnumColors;
}

function SectionHeader({
  children,
  title,
  sx,
  textColor,
  ...rest
}: SectionHeaderProps) {
  const classes = SectionHeaderStyles();

  return (
    <Typography
      variant={'h6'}
      className={classes.root}
      color={textColor ? getBaseColor(textColor) : 'primary'}
      sx={sx}
      {...rest}
    >
      {children}
    </Typography>
  );
}

export default SectionHeader;
