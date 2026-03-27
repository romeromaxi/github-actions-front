import React, {useContext} from 'react';
import {Stack} from '@mui/material';

import {PrequalificationStepperContext} from "../PrequalificationStepper";
import PrequalificationStepCompanyFile from "./PrequalificationStepCompanyFile";
import {PrequalificiationStepLineDetail} from "./PrequalificiationStepLineDetail";
import PrequalificationSuccessMessage from './PrequalificationSuccessMessage';

function PrequalificationStepFinal() {
    const {stepperDone, solicitations} = useContext(PrequalificationStepperContext)
    
  return (
      stepperDone ? 
          <PrequalificationSuccessMessage solicitationLength={solicitations?.length ?? 0}/>
          :
          <Stack spacing={3}>
              <PrequalificationStepCompanyFile disableEdit/>
              <PrequalificiationStepLineDetail />
          </Stack>
  )
}

export default PrequalificationStepFinal;
