import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { FormControlLabel, Switch, SwitchProps } from '@mui/material';

export interface ControlledSwitchProps extends SwitchProps {
  control: Control<any>;
  name: string;
  label?: string | React.ReactElement;
}

export const ControlledSwitch = ({
  control,
  name,
  label,
  ...switchProps
}: ControlledSwitchProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControlLabel
          control={
            <Switch
              {...switchProps}
              focusVisibleClassName=".Mui-focusVisible"
              aria-label="switch"
              color={'primary'}
              onChange={(e) => onChange(e.target.checked)}
              checked={value}
            />
          }
          label={label ?? ''}
        />
      )}
    />
  );
};
