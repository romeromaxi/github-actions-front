import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import {
  blueColorBase,
  lightBlueColorLight,
} from '../../util/themes/ThemeItapTec';
import { AddBoxIconButton } from '../buttons/Buttons';

interface BoxNewEntityProps {
  title: string;
  subtitle?: string;
  onClickNew: () => void;
  horizontal?: boolean;
}

const BoxNewEntity = ({
  title,
  subtitle,
  onClickNew,
  horizontal = true,
}: BoxNewEntityProps) => {
  return (
    <Box
      sx={{
        borderRadius: '0.475rem',
        border: `1px dashed ${blueColorBase} !important`,
        backgroundColor: 'primary.light',
        padding: '0.425rem 1.5rem !important',
        width: '100% !important',
        height: '100% !important',
        alignItems: 'center !important',
      }}
    >
      <Stack
        direction={horizontal ? 'row' : 'column'}
        justifyContent={horizontal ? 'space-between' : 'flex-start'}
        alignItems={'center'}
      >
        <Stack>
          <Typography
            fontWeight={600}
            fontSize={'1.025rem'}
            color={'dark'}
            textAlign={horizontal ? 'start' : 'center'}
          >
            {title}
          </Typography>
          <Typography
            fontWeight={500}
            fontSize={'0.875rem'}
            color={'grey.700'}
            fontStyle={'italic'}
            textAlign={horizontal ? 'start' : 'center'}
          >
            {subtitle}
          </Typography>
        </Stack>
        <div
          style={{
            textAlign: horizontal ? 'start' : 'center',
            paddingTop: horizontal ? 0 : '1.5rem',
          }}
        >
          <AddBoxIconButton
            onClick={onClickNew}
            size={'large'}
            tooltipTitle={'Agregar'}
          />
        </div>
      </Stack>
    </Box>
  );
};

export default BoxNewEntity;
