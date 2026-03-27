import React, { useMemo } from 'react';
import { lightBlue } from '@mui/material/colors';
import { Box, BoxProps, Stack, TypographyProps } from '@mui/material';
import MarketTypography from '../../components/MarketTypography';
import { getBaseColor } from '../../../../util/typification/generalColors';
import { EnumColors } from '../../../../types/general/generalEnums';

interface MarketBorderBoxProps extends BoxProps {
  text?: string;
  icon?: React.ReactNode;
  textColor?: string;
  textProps?: TypographyProps;
}

function MarketBorderBox({
  text,
  icon,
  textColor,
  textProps,
  ...props
}: MarketBorderBoxProps) {
  const boxSx = useMemo(
    () => ({
      borderRadius: '8px 8px 8px 8px',
      border: `2px solid ${getBaseColor(EnumColors.MARKET_BLUE)}`,
      p: 1,
      minHeight: '110px',
      height: '100%',
      backgroundColor: '#f6f6f6',
    }),
    [],
  );

  return (
    <Box {...props} sx={{ ...boxSx, ...props.sx }}>
      <Stack direction={'column'} alignItems={'center'}>
        <Box color={getBaseColor(EnumColors.MARKET_BLUE)}>{icon}</Box>

        <MarketTypography
          {...textProps}
          sx={{
            color: textColor || getBaseColor(EnumColors.MARKET_BLUE),
            fontWeight: 600,
            fontSize: '1.125rem',
            ...textProps?.sx,
          }}
        >
          {text}
        </MarketTypography>
      </Stack>
    </Box>
  );
}

export default MarketBorderBox;
