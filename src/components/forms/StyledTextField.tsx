import React from 'react';
import {
  FormLabel,
  Stack,
  StandardTextFieldProps,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import HelperInputText from '../text/HelperInputText';
import ControlledTextFieldStyles from './ControlledTextField.styles';
import { NumberFormatCustom } from './ControlledTextField';

export function StyledTextField(props: TextFieldProps) {
  return <TextField variant="outlined" size="small" {...props} />;
}

interface TextFieldFilledProps extends StandardTextFieldProps {
  currency?: boolean;
  currencyPrefix?: string;
  currencySuffix?: string;
  textAlign?: 'left' | 'right' | 'center';
}

export function TextFieldFilled({
  label,
  required,
  value,
  helperText,
  ...props
}: TextFieldFilledProps) {
  const classes = ControlledTextFieldStyles();

  return (
    <Stack sx={{ width: '100%' }}>
      <FormLabel className={classes.labelFilled}>
        <Stack direction="row" justifyContent="flex-start" spacing={1}>
          <>{label}</>
          <Typography>{required ? '*' : ''}</Typography>
        </Stack>
      </FormLabel>
      <TextField
        {...props}
        variant="outlined"
        value={value}
        type={props.type}
        className={classes.textFilled}
        size="small"
        InputProps={{
          inputComponent: props.currency
            ? (NumberFormatCustom as any)
            : 'input',
          ...props.InputProps,
        }}
        inputProps={{
          prefix:
            props?.currencyPrefix === undefined ? '$' : props.currencyPrefix,
          suffix: props?.currencySuffix,
          style: {
            textAlign: props?.textAlign,
          },
        }}
      />
      {helperText && <HelperInputText text={helperText} />}
    </Stack>
  );
}
