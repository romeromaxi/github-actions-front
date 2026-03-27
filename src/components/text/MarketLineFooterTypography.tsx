import { Tooltip, Typography, TypographyProps } from '@mui/material';
import React from 'react';
import {TypographyBase} from "../misc/TypographyBase";

interface MarketLineFooterTypographyProps extends TypographyProps {
  tooltip?: string;
}

const MarketLineFooterTypography = ({
  children,
  tooltip,
  ...props
}: MarketLineFooterTypographyProps) => {
  const component = (
    <TypographyBase
        maxLines={2}
        minLines={2}
        tooltip
      variant={'caption'}
      fontWeight={400}
      fontSize={'14px'}
      {...props}
    >
      {children}
    </TypographyBase>
  );

  return tooltip ? <Tooltip title={tooltip}>{component}</Tooltip> : component;
};

export default MarketLineFooterTypography;
