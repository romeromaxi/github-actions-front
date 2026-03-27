import React from 'react';
import { Grid, Typography } from '@mui/material';

import SectionCardContentStyles from './SectionCardContent.styles';

interface SectionCardContentProps {
  text: string;
  children?: React.ReactNode;
}

function SectionCardContent(props: SectionCardContentProps) {
  const classes = SectionCardContentStyles();

  return (
    <>
      <Typography className={classes.text}>{props.text}</Typography>
      <Grid container className={classes.content}>
        <Grid item xs={12}>
          {props.children}
        </Grid>
      </Grid>
    </>
  );
}

export default SectionCardContent;
