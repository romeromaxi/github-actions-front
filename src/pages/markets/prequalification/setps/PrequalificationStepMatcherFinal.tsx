import React, {useContext} from 'react';

import {Card, Stack} from '@mui/material';

import {PrequalificationStepperContext} from "../PrequalificationStepper";
import PrequalificationStepCompanyFile from "./PrequalificationStepCompanyFile";
import SolicitationSurveyDetailView from "../../../solicitations/survey/SolicitationSurveyDetailView";
import {
    SolicitationSurveyContext,
    SolicitationSurveyFormTypeFields
} from "hooks/contexts/SolicitationSurveyContext";
import PrequalificationSuccessMessage from "./PrequalificationSuccessMessage";

function PrequalificationStepMatcherFinal() {
  const {stepperDone, solicitations} = useContext(PrequalificationStepperContext);
  const {answers, methods} = useContext(SolicitationSurveyContext);
  const message = methods.getValues(SolicitationSurveyFormTypeFields.Message)
  
  return (
      stepperDone ?
          <PrequalificationSuccessMessage solicitationLength={solicitations?.length ?? 0}/>
          :
          <Stack spacing={3}>
              <PrequalificationStepCompanyFile disableEdit/>

              <Card>
                <SolicitationSurveyDetailView answers={answers}
                                              message={message}
                                              showRowMessage
                />
              </Card>
          </Stack>
  )
}

export default PrequalificationStepMatcherFinal;
