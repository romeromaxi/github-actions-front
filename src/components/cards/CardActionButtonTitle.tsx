import React from 'react';
import { SxProps, Tooltip, Typography } from '@mui/material';
import { stringFormatter } from 'util/formatters/stringFormatter';

interface CardActionButtonTitleProps {
  title: string;
  disabled?: boolean;
  fontProps?: SxProps;
  cutTitleIf?: number;
}

function CardActionButtonTitle(props: CardActionButtonTitleProps) {
  const componentTitle = (
    <Typography
      fontSize={'1.5rem'}
      textAlign={'center'}
      color={'grey.900'}
      pt={1}
      fontWeight={props.disabled ? 400 : 600}
      sx={props.fontProps}
    >
      {props.cutTitleIf
        ? stringFormatter.cutIfHaveMoreThan(props.title, props.cutTitleIf)
        : props.title}
    </Typography>
  );

  return props.cutTitleIf && props.title.length > props.cutTitleIf ? (
    <Tooltip title={props.title}>{componentTitle}</Tooltip>
  ) : (
    componentTitle
  );
}

export default CardActionButtonTitle;
