import React from 'react';
import { Box, BoxProps, SxProps, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { Theme } from '@mui/material/styles';

interface DataBoxProps extends BoxProps {
  label: string;
  value: React.ReactNode;
  borderStyle?: string;
  labelSx?: SxProps<Theme>;
  size?: 'small' | 'medium' | 'large';
}

function DataBox({
  label,
  value,
  borderStyle,
  labelSx,
  size = 'medium',
  sx,
  ...rest
}: DataBoxProps) {
  return (
    <Box
      {...rest}
      sx={{
        border: borderStyle || `2px dashed ${grey[600]}`,
        textAlign: 'center',
        maxWidth:
          size === 'medium' ? '125px' : size === 'large' ? '185px' : '110px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 1,
        pt: 0,
        ...sx,
      }}
    >
      <Typography variant={'caption'} sx={{ ...labelSx }}>
        {label}
      </Typography>
      <Typography variant={'h6'}>{value}</Typography>
    </Box>
  );
}

export default DataBox;
