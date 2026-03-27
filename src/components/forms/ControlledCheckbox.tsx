import React from "react";
import { Control, Controller } from 'react-hook-form';
import {Checkbox, FormControlLabel, Stack, SxProps, Typography} from '@mui/material';

export interface ControlledCheckBoxProps {
  label: string;
  name: string;
  control: Control<any>;
  disabled?: boolean;
  sx?: SxProps;
}

export const ControlledCheckBox = (props: ControlledCheckBoxProps) => (
  <Controller
    control={props.control}
    name={props.name || ''}
    render={({ field: { onChange, value } }) => (
      <FormControlLabel
        control={
          <Checkbox
            sx={{ ...props.sx }}
            checked={!!value && !props.disabled}
            onChange={onChange}
            color="primary"
            disabled={props.disabled}
          />
        }
        label={props.label}
      />
    )}
  />
);

export const ControlledCheckBoxFilter = (props: ControlledCheckBoxProps) => (
    <Controller
        control={props.control}
        name={props.name || ''}
        render={({ field: { onChange, value } }) => (
            <Stack
                direction='row'
                alignItems='center'
                spacing={0.5}
                onClick={() => onChange(!value)}
                sx={{
                    padding: '10px 12px',
                    borderRadius: '100px',
                    backgroundColor: '#F7FAFC',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                        backgroundColor: '#e4eafc',
                    },
                    maxWidth: '215px !important'
                }}
            >
                <Checkbox
                    sx={{ ...props.sx }}
                    checked={!!value && !props.disabled}
                    onChange={onChange}
                    color="primary"
                    disabled={props.disabled}
                />

                <Typography variant={'caption'} color={'black'}>
                    {props.label}
                </Typography>
            </Stack>
        )}
    />
);

/*
<Box sx={{borderRadius: '100px !important', padding: '4px 16px', backgroundColor: 'rgb(247, 250, 252)'}}>
    <ControlledCheckBox label={'Con Alerta'}
                        name={GeneralSolicitationFilterFields.OnlyWithAlert}
                        control={methods.control}
    />
</Box>*/
