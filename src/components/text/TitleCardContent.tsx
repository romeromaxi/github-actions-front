import React from 'react';
import { Typography } from '@mui/material';

import TitleCardContentStyles from './TitleCardContent.styles';

interface TitleCardContentProps {
  text: string;
}

function TitleCardContent(props: TitleCardContentProps) {
  const classes = TitleCardContentStyles();

  return <Typography className={classes.root}>{props.text}</Typography>;
}

export default TitleCardContent;
