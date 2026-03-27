import React from 'react';
import { Control, Controller } from 'react-hook-form';
import PinInput from 'react-pin-input';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import {themeColorDefinition} from "../../util/themes/definitions";

interface ControlledPinProps {
  control: Control<any>;
  name: string;
}

function ControlledPin({ control, name }: ControlledPinProps) {
    
  const inputStyles = {
      fontFamily: 'Geist', 
      fontSize: '1rem', 
      padding: '10px 16px', 
      borderRadius: '14px', 
      border: `1px solid ${themeColorDefinition.UIElements.borders.primary}`, 
      width: '46px', 
      height: '54px'
  }  
    
  return (
    <Controller
      control={control}
      name={name || ''}
      render={({ field: { onChange }, fieldState: { error } }) => (
        <Box width={1} textAlign={'right'}>
          <PinInput
            length={4}
            initialValue=""
            type="custom"
            inputMode="number"
            style={{ padding: '10px' }}
            inputStyle={inputStyles}
            inputFocusStyle={{ border: '2px solid #4784E1' }}
            onChange={onChange}
            autoSelect={true}
            regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
            onComplete={onChange}
          />
          {error && (
            <Typography
              variant="caption"
              sx={{ color: 'error.main', marginLeft: '15px' }}
            >
              {error.message}
            </Typography>
          )}
        </Box>
      )}
    />
  );
}

export default ControlledPin;
