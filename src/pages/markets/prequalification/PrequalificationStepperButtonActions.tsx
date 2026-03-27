import React from 'react';
import { Box, Button, Divider } from '@mui/material';
import { PrequalificationStepProps } from './PrequalificationStepper';
import {
  BackButton,
  DefaultDarkGreyButton,
  DefaultStylesButton,
} from '../../../components/buttons/Buttons';
import KeyboardBackspaceOutlinedIcon from '@mui/icons-material/KeyboardBackspaceOutlined';

function PrequalificationStepperButtonActions(
  props: PrequalificationStepProps,
) {
  return (
    <>
      <Divider sx={{ marginTop: 1 }} />
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 1 }}>
        <BackButton
          disabled={!props.onBack}
          onClick={props.onBack}
          sx={{ mr: 1 }}
        >
          Atrás
        </BackButton>

        <Box sx={{ flex: '1 1 auto' }} />

        <DefaultStylesButton
          onClick={props.onNext}
          startIcon={
            <KeyboardBackspaceOutlinedIcon sx={{ rotate: '180deg' }} />
          }
        >
          Siguiente
        </DefaultStylesButton>
      </Box>
    </>
  );
}

export default PrequalificationStepperButtonActions;
