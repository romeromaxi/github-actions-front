import { Typography } from '@mui/material';
import DisclaimerStyles from './Disclaimer.styles';
import React from 'react';

export interface DisclaimerProps {
  text: string;
  textBold?: string;
  opacity?: boolean;
  fontSize?: string;
}

export function Disclaimer(props: DisclaimerProps) {
  const classes = DisclaimerStyles();

  return (
    <Typography
      component="span"
      variant={'subtitle2'}
      fontWeight={500}
      color={'text.disabled'}
      fontSize={props.fontSize}
    >
      {props.text}
      <Typography component="span" className={classes.disclaimerBold}>
        {props.textBold}
      </Typography>
    </Typography>
  );
}
