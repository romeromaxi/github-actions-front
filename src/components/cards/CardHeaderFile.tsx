import React from 'react';
import { CardHeader, CardHeaderProps, Divider } from '@mui/material';

import CardHeaderFileStyles from './CardHeaderFile.styles';

interface CardHeaderFileProps extends CardHeaderProps {
  avatar?: React.ReactElement;
}

function CardHeaderFile(props: CardHeaderFileProps) {
  const classes = CardHeaderFileStyles();

  const finalAvatar = props.avatar
    ? React.cloneElement(props.avatar, { className: classes.avatar })
    : undefined;

  return (
    <>
      <CardHeader {...props} avatar={finalAvatar} />

      <Divider className={classes.divider} variant="middle" />
    </>
  );
}

export default CardHeaderFile;
