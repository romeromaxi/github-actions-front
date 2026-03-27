import React, { useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import {
  IconButton,
  InputAdornment,
  Stack,
  StandardTextFieldProps,
  TextField,
} from '@mui/material';
import LabelFormBase from "./LabelFormBase";
import HelperInputText from "../text/HelperInputText";
import {Eye, EyeSlash} from "@phosphor-icons/react";

export interface ControlledTextPasswordFieldProps
  extends StandardTextFieldProps {
  control: Control<any>;
  hideControl?: boolean;
}

export function ControlledTextPasswordFieldFilled({
  label, hideControl,
  ...props
}: ControlledTextPasswordFieldProps) {
    
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isFocused, setFocused] = useState<boolean>(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleFocus = () => setFocused(true);
  
  const handleBlur = () => setFocused(false);
  
  return (
    <Controller
      control={props.control}
      name={props.name || ''}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <Stack sx={{ width: '100%' }}>
          <Stack spacing={1.25}>
            {
              !!label &&
                <LabelFormBase label={label} />
            }
            
            <TextField
              {...props}
              variant="filled"
              size="small"
              type={showPassword ? 'text' : 'password'}
              value={value}
              error={!!error}
              onChange={onChange}
              defaultValue={props.defaultValue}
              onFocus={handleFocus}
              onBlur={handleBlur}
              InputProps={hideControl ? { disableUnderline: true, ...props.InputProps } : {
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? (
                        <Eye />
                      ) : (
                        <EyeSlash />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
                ...props.InputProps,
              }}
              InputLabelProps={{
                shrink: isFocused || !!value,
                ...props.InputLabelProps,
              }}
            ></TextField>
          </Stack>

          {error && <HelperInputText text={error.message} error />}

          {props.helperText && !error && <HelperInputText text={props.helperText} />}
        </Stack>
      )}
    />
  );
}
