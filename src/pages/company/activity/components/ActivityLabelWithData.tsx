import React from 'react';
import { Stack, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { dataSx, iconSx, labelSx } from './ActivityLabelWithData.styles';

export interface ActivityLabelWithDataProps {
  label: React.ReactNode;
  data?: React.ReactNode;
  type?: 'string' | 'icon';
}

function ActivityLabelWithData({
  label,
  data,
  type = 'string',
}: ActivityLabelWithDataProps) {
  const dataToRender =
    type === 'string' ? (
      data ? (
        data
      ) : (
        '-'
      )
    ) : data ? (
      <CheckIcon sx={iconSx} />
    ) : (
      <CloseIcon sx={iconSx} />
    );
  return (
    <Stack
      direction={'row'}
      sx={{ ml: 1 }}
      justifyContent={'space-between'}
      gap={8}
    >
      <Typography sx={labelSx}>{label}</Typography>
      <Typography sx={dataSx}>{dataToRender}</Typography>
    </Stack>
  );
}

export default ActivityLabelWithData;
