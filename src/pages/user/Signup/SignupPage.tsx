import React, { useState } from 'react';
import { Box, Card, CardContent } from '@mui/material';
import SignupStep1Form from './SignupStep1Form';
import SignupStep2Confirm from './SignupStep2Confirm';
import SignupStep3Password from './SignupStep3Password';

enum SignupFormSteps {
  STEP_MAIL_CUIT,
  STEP_CONFIRM,
  STEP_PASSWORD,
}

type Step1FormData = {
  mail: string;
  cuit: string;
  captcha: string;
};

export default function SignupPage() {
  const [step, setStep] = useState<SignupFormSteps>(SignupFormSteps.STEP_MAIL_CUIT);
  const [userData, setUserData] = useState<any>(null);
  const [formStep1, setFormStep1] = useState<Step1FormData>({ mail: '', cuit: '', captcha: '' });

  const handleStep1Success = (data: Step1FormData, response: any) => {
    setUserData(response);
    setFormStep1(data);
    setStep(SignupFormSteps.STEP_CONFIRM);
  };

  const handleStep2Confirm = () => {
    setStep(SignupFormSteps.STEP_PASSWORD);
  };

  const handleStep2Back = () => {
    setStep(SignupFormSteps.STEP_MAIL_CUIT);
  };

  return (
    <Box sx={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
      <Card variant={'onboarding'}>
        <CardContent sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {step === SignupFormSteps.STEP_MAIL_CUIT && (
            <SignupStep1Form onSuccess={handleStep1Success} />
          )}
          {step === SignupFormSteps.STEP_CONFIRM && userData && (
            <SignupStep2Confirm
              userData={userData}
              cuit={formStep1.cuit}
              onConfirm={handleStep2Confirm}
              onBack={handleStep2Back}
            />
          )}
          {step === SignupFormSteps.STEP_PASSWORD && (
            <SignupStep3Password
              mail={formStep1.mail}
              cuit={formStep1.cuit}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
