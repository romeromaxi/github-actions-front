import React from 'react';
import { Card, CardContent, Skeleton } from '@mui/material';

import CardHeaderWithBorder from './CardHeaderWithBorder';
import { EnumColors } from 'types/general/generalEnums';

import CardBaseStyles from './CardBase.styles';

interface CardBaseLoadingProps {
  baseColor: EnumColors;
  avatar?: React.ReactNode;
}

function CardBaseLoading(props: CardBaseLoadingProps) {
  const classes = CardBaseStyles();

  return (
    <Card className={classes.card}>
      <CardHeaderWithBorder
        baseColor={props.baseColor}
        title={<Skeleton width="100%" />}
        avatar={props.avatar}
      />

      <CardContent>
        <Skeleton width="100%" />
      </CardContent>
    </Card>
  );
}

export default CardBaseLoading;
