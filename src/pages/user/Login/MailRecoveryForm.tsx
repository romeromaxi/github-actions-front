import React, { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {Alert, Button, Stack, Typography, useMediaQuery} from '@mui/material';
import { ControlledTextFieldFilled } from '../../../components/forms';
import {
  SendButton,
} from '../../../components/buttons/Buttons';
import { ControlledReCaptcha } from '../../../components/forms/ControlledReCaptcha';
import {RequiredCaptchaSchema, RequiredCuitSchema} from '../../../util/validation/validationSchemas';
import { LogInProcessParts } from '../../../types/form/login/login-enum';
import { ForgotMailResponseFields } from '../../../types/user';
import {LogInDrawerContext} from "../LogInDrawer";
import { useLoaderActions } from '../../../hooks/useLoaderActions';
import { useSnackbarActions } from '../../../hooks/useSnackbarActions';
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {useTheme} from "@mui/material/styles";

enum MailRecoveryFields {
  CUIT = 'cuit',
  Captcha = 'captcha',
}

type MailRecoveryFormData = {
  [MailRecoveryFields.CUIT]: string;
  [MailRecoveryFields.Captcha]: string;
};

interface MailRecoveryFormProps {
  onClickReturn: (...args: any[]) => void;
  onClickNewUser?: (...args: any[]) => void;
}

function MailRecoveryForm({
  onClickReturn,
  onClickNewUser,
}: MailRecoveryFormProps) {
  const { showLoader, hideLoader } = useLoaderActions();
  const { addSnackbarError } = useSnackbarActions();
  const { setActions } = React.useContext(LogInDrawerContext);
  
  const [recoveryResult, setRecoveryResult] = useState<boolean>();
  const [recoveryMail, setRecoveryMail] = useState<string>();
  const [recoveryMessage, setRecoveryMessage] = useState<string>('');
  const [reset, resetCaptcha] = useState<boolean>(false);

  const mailFormSchema = yup.object().shape({
    [MailRecoveryFields.CUIT]: RequiredCuitSchema,
    [MailRecoveryFields.Captcha]: RequiredCaptchaSchema,
  });

  const { control, handleSubmit, setValue } = useForm<MailRecoveryFormData>({
    resolver: yupResolver(mailFormSchema),
  });
  const watchCUIT = useWatch({
    control: control,
    name: MailRecoveryFields.CUIT,
  });

  const MESSAGE_SUCCESS = `El CUIT ${watchCUIT} tiene asociada la siguiente cuenta de correo: ${recoveryMail}`;
  const MESSAGE_FAILURE = `El CUIT ${watchCUIT} no corresponde con un usuario de LUC`;

  const onSubmit = useCallback(async (data: MailRecoveryFormData) => {
    try {
      showLoader();
      const { HttpAuth } = await import('../../../http');
      const response = await HttpAuth.mailRecovery(data[MailRecoveryFields.CUIT]);
      
      setRecoveryMail(response[ForgotMailResponseFields.Mail]);
      setRecoveryResult(response[ForgotMailResponseFields.ExistingUser]);
      
      if (!response[ForgotMailResponseFields.ExistingUser]) {
        addSnackbarError(MESSAGE_FAILURE);
        setValue(MailRecoveryFields.Captcha, '');
        resetCaptcha(true);
      }
    } catch (error) {
      setValue(MailRecoveryFields.Captcha, '');
      resetCaptcha(true);
      addSnackbarError('Error al recuperar el email');
    } finally {
      hideLoader();
    }
  }, [showLoader, hideLoader]);

  useEffect(() => {
    setRecoveryMessage(recoveryResult ? MESSAGE_SUCCESS : MESSAGE_FAILURE);
  }, [recoveryResult]);

  useEffect(() => {
    setActions(
        recoveryResult ?
          undefined :
          <SendButton type="submit" form={`${LogInProcessParts.MailRecovery}-form`} fullWidth>
            Recuperar Email
          </SendButton>
    )
  }, [recoveryResult]);

  return (
    <form
      id={`${LogInProcessParts.MailRecovery}-form`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={3} alignItems={'center'}>
        {!recoveryResult && (
          <Alert severity="info">Ingresa tu CUIT para recuperar tu email</Alert>
        )}
        {recoveryResult !== undefined && (
          <Alert severity={recoveryResult ? 'success' : 'error'}>
            {recoveryMessage}
          </Alert>
        )}
        <ControlledTextFieldFilled
          fullWidth
          control={control}
          name={MailRecoveryFields.CUIT}
          label="CUIT"
        />
        <ControlledReCaptcha control={control} 
                             name={MailRecoveryFields.Captcha}
                             reset={reset}
                             setReset={resetCaptcha}
        />
      </Stack>
    </form>
  );
}

export default MailRecoveryForm;


export const MailRecoveryFormNew = ({onClickReturn} : MailRecoveryFormProps) => {
  const { showLoader, hideLoader } = useLoaderActions();
  const { addSnackbarError } = useSnackbarActions();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [recoveryResult, setRecoveryResult] = useState<boolean>();
  const [recoveryMail, setRecoveryMail] = useState<string>();
  const [recoveryMessage, setRecoveryMessage] = useState<string>('');
  const [reset, resetCaptcha] = useState<boolean>(false);

  const mailFormSchema = yup.object().shape({
    [MailRecoveryFields.CUIT]: RequiredCuitSchema,
    [MailRecoveryFields.Captcha]: RequiredCaptchaSchema,
  });

  const { control, handleSubmit, setValue } = useForm<MailRecoveryFormData>({
    resolver: yupResolver(mailFormSchema),
  });
  const watchCUIT = useWatch({
    control: control,
    name: MailRecoveryFields.CUIT,
  });

  const MESSAGE_SUCCESS = `El CUIT ${watchCUIT} tiene asociada la siguiente cuenta de correo: ${recoveryMail}`;
  const MESSAGE_FAILURE = `El CUIT ${watchCUIT} no corresponde con un usuario de LUC`;

  const onSubmit = useCallback(async (data: MailRecoveryFormData) => {
    try {
      showLoader();
      const { HttpAuth } = await import('../../../http');
      const response = await HttpAuth.mailRecovery(data[MailRecoveryFields.CUIT]);

      setRecoveryMail(response[ForgotMailResponseFields.Mail]);
      setRecoveryResult(response[ForgotMailResponseFields.ExistingUser]);

      if (!response[ForgotMailResponseFields.ExistingUser]) {
        addSnackbarError(MESSAGE_FAILURE);
        setValue(MailRecoveryFields.Captcha, '');
        resetCaptcha(true);
      }
    } catch (error) {
      setValue(MailRecoveryFields.Captcha, '');
      resetCaptcha(true);
      addSnackbarError('Error al recuperar el email');
    } finally {
      hideLoader();
    }
  }, [showLoader, hideLoader]);

  useEffect(() => {
    setRecoveryMessage(recoveryResult ? MESSAGE_SUCCESS : MESSAGE_FAILURE);
  }, [recoveryResult]);

  return (
      <Stack spacing={4}>
        <Stack spacing={0.75}>
          <TypographyBase variant="eyebrow2" color="primary">RECUPERÁ TU USUARIO</TypographyBase>
          <Typography variant="h4">Recuperación de Email</Typography>
          <Typography variant="body2" color="text.lighter">Ingresá tu CUIT para recuperar tu email</Typography>
        </Stack>
        <Stack justifyContent="space-between" spacing={4} sx={{width: '100%', height: '100%'}}>
          <Stack spacing={3} alignItems={'center'}>
            {recoveryResult !== undefined && (
                <Alert severity={recoveryResult ? 'success' : 'error'}>
                  {recoveryMessage}
                </Alert>
            )}
            <ControlledTextFieldFilled
                fullWidth
                control={control}
                name={MailRecoveryFields.CUIT}
                label="CUIT"
            />
            <ControlledReCaptcha control={control}
                                 name={MailRecoveryFields.Captcha}
                                 reset={reset}
                                 setReset={resetCaptcha}
            />
          </Stack>
          <Stack spacing={2}
                 alignItems={'center'}
                 justifyContent={'space-between'} 
                 direction={isSmallScreen ? "column-reverse" : "row"}
          >
            <Button onClick={onClickReturn}
                    variant="outlined"
                    fullWidth={isSmallScreen}
            >
              Volver
            </Button>
            <Button onClick={handleSubmit(onSubmit)} 
                    variant="contained"
                    fullWidth={isSmallScreen}
            >
              Recuperar Email
            </Button>
          </Stack>
        </Stack>
      </Stack>
  );
}
