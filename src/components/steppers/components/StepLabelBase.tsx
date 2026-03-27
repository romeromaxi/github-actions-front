import React from 'react';
import { StepLabel, StepLabelProps } from '@mui/material';
import { getBaseColor } from '../../../util/typification/generalColors';
import { EnumColors } from '../../../types/general/generalEnums';

interface StepLabelBaseProps extends StepLabelProps {
  label: string;
}

function StepLabelBase({ label, ...rest }: StepLabelBaseProps) {
  return (
    <StepLabel
      sx={{
        '& > span > .Mui-active': {
          color: 'primary',
        },
        '& > span > .Mui-completed': {
          color: 'primary',
        },
        '& > span > .MuiStepLabel-alternativeLabel': {
          marginTop: '8px',
          fontSize: '1.125rem',
          fontWeight: 600,
          color: 'rgb(140, 163, 186)',
        },
      }}
      {...rest}
    >
      {label}
    </StepLabel>
  );
}

export default StepLabelBase;
