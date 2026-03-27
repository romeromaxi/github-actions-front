import { Chip, ChipProps } from '@mui/material';
import React from 'react';
import { ValidationStateColorMap } from '../../../util/typification/validationStateColor';
import { ValidationStatesType } from '../../../types/person/personEnums';

interface PersonValidateStateChipProps extends ChipProps {
  code: ValidationStatesType;
  selected?: boolean;
}

function PersonValidateStateChip(props: PersonValidateStateChipProps) {
  const color =
    ValidationStateColorMap?.[props.code] || ValidationStateColorMap[1];

  return (
    <Chip
      label={props.label}
      sx={{
        color: color.dark,
        backgroundColor: color.light,
        border: props.onClick && props.selected ? '2px solid grey' : '',
      }}
      size={props.size || 'small'}
      onClick={props.onClick || undefined}
    />
  );
}

export default PersonValidateStateChip;
