import React from 'react';
import { Stack, StackProps, Typography, TypographyProps } from '@mui/material';

import DataWithIconStyles from './DataWithIcon.styles';

interface DataWithIconProps {
  data: React.ReactNode;
  icon: React.ReactElement;
  dataProps?: TypographyProps;
  rowProps?: StackProps;
}

function DataWithIcon({ icon, data, dataProps, rowProps }: DataWithIconProps) {
  const classes = DataWithIconStyles();

  return (
    <Stack
      direction="row"
      justifyContent="flex-start"
      alignItems="center"
      {...rowProps}
    >
      {React.cloneElement(icon, { className: classes.icon })}
      <Typography
        variant="h6"
        className={classes.data}
        sx={{ marginLeft: '12px' }}
        {...dataProps}
      >
        {data}
      </Typography>
    </Stack>
  );
}

export { DataWithIcon };
