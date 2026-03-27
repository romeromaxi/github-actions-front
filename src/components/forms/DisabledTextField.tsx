import React from 'react';
import { TextFieldProps } from '@mui/material';
import { StyledTextField } from './StyledTextField';

function DisabledTextField(props: TextFieldProps) {
  return <StyledTextField {...props} disabled />;
}

export default DisabledTextField;
