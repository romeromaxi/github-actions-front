import React from 'react';
import { Typography } from '@mui/material';
import SubTitleStyles from './SubTitle.styles';

export interface SubTitleProps {
  text: string;
  light?: boolean;
  style?: React.CSSProperties;
}

export function SubTitle(props: SubTitleProps) {
  const classes = SubTitleStyles();

  return (
    <Typography
      variant="h4"
      fontWeight={600}
      color={props.light ? 'primary.light' : 'primary'}
      lineHeight={1.2}
      fontSize={
        props.style && props.style?.fontSize ? props.style.fontSize : '1.5rem'
      }
      style={props.style}
      /*className={classes.root}
       */
    >
      {props.text}
    </Typography>
  );
}
