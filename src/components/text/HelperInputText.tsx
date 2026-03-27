import React from 'react';
import { Typography } from '@mui/material';
import HelperInputTextStyles from './HelperInputText.styles';

interface HelperInputTextProps {
  text: any;
  error?: boolean;
}

function HelperInputText(props: HelperInputTextProps) {
  const classes = HelperInputTextStyles();

  return (
    <Typography
        ml={1}
        variant="subtitle2"
        className={`${classes.root} ${props.error ? classes.error : classes.normalText}`}
        fontSize={'0.75rem'}
    >
      {props.text}
    </Typography>
  );
}

export default HelperInputText;
