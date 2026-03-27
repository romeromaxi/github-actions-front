import React from 'react';
import { Divider, Stack, Typography } from '@mui/material';
import SectionDividerStyles from './SectionDivider.styles';

interface SectionDividerProps {
  title: string;
  action?: React.ReactNode;
}

function SectionDivider(props: SectionDividerProps) {
  const classes = SectionDividerStyles();

  return (
    <Stack direction="column">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems={'center'}
      >
        <Typography component="span" fontSize={14} className={classes.title}>
          {props.title}
        </Typography>
        {props.action && props.action}
      </Stack>
      <Divider className={classes.divider} />
    </Stack>
  );
}

export default SectionDivider;
