import React, {useEffect, useState} from 'react';
import { useForm, useWatch } from 'react-hook-form';
import {Alert, Button, Checkbox, Link, Stack, Typography, useMediaQuery} from '@mui/material';
import { ControlledTextFieldFilled } from 'components/forms';
import {
  BackButton, SendButton
} from 'components/buttons/Buttons';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ControlledReCaptcha } from 'components/forms/ControlledReCaptcha';
import { RequiredMailSchema } from 'util/validation/validationSchemas';
import { LogInProcessParts } from 'types/form/login/login-enum';
import useAxios from 'hooks/useAxios';
import {ForgotPasswordRequest, ForgotPasswordRequestFields} from "../../../types/user";
import {LogInDrawerContext} from "../LogInDrawer";
import { useSnackbarActions } from 'hooks/useSnackbarActions';
import {AppRoutesDefinitions, useAppNavigation} from "../../../hooks/navigation";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {useTheme} from "@mui/material/styles";

enum PasswordRecoveryFields {
  Email = 'email',
  Captcha = 'captcha',
}

type PasswordRecoveryFormData = {
  [PasswordRecoveryFields.Email]: string;
  [PasswordRecoveryFields.Captcha]: string;
};

interface PasswordRecoveryFormProps {
  onClickReturn: (...args: any[]) => void;
}

function PasswordRecoveryForm({
  onClickReturn,
}: PasswordRecoveryFormProps) {
  const { fetchData } = useAxios(); 
  const { navigate } = useAppNavigation();
  const { addSnackbarSuccess } = useSnackbarActions();
  const { setActions } = React.useContext(LogInDrawerContext);
  const [formSent, setFormSent] = useState<boolean>();
  const [reset, resetCaptcha] = useState<boolean>(false);
  const [resend, setResend] = useState<boolean>(false);
  
  const passwordFormSchema = yup.object().shape({
    [PasswordRecoveryFields.Email]: RequiredMailSchema,
    [PasswordRecoveryFields.Captcha]: yup
      .string()
      .required('Campo obligatorio'),
  });

  const { control, handleSubmit, setValue } = useForm<PasswordRecoveryFormData>({
    resolver: yupResolver(passwordFormSchema),
  });

  const watchMail = useWatch({
    control: control,
    name: PasswordRecoveryFields.Email,
  });

  const MESSAGE_SUCCESS = `Enviamos un mail a ${watchMail} con los pasos para cambiar tu contraseña. Por favor, revisá tu bandeja de entrada y seguí las instrucciones. 
  Si no lo recibís a la brevedad revisá la carpeta de SPAM, solicitá el reenvío o `;

  const onSubmit = async (data: PasswordRecoveryFormData) => {
    const { HttpAuth } = await import('../../../http/index');
    const dataSubmit: ForgotPasswordRequest = {
      ...data,
      [ForgotPasswordRequestFields.Mail]: data[PasswordRecoveryFields.Email]
    };
    
    try {
      const response = await fetchData(
        () => HttpAuth.passwordRecovery(dataSubmit),
        true,
      );
      
      setFormSent(true);
      if (!response?.tieneError && formSent) {
        addSnackbarSuccess('El mail se reenvió correctamente')
      }
    } catch (error) {
      setValue(PasswordRecoveryFields.Captcha, '');
      resetCaptcha(true);
    } finally {
      resetCaptcha(true);
    }
  };

  const goToContactLuc = () => navigate(AppRoutesDefinitions.LucContactPage);

  useEffect(() => {
    setActions(
        formSent ?
          <SendButton form={`${LogInProcessParts.PassRecovery}-form`} 
                      type="submit"
                      variant={'outlined'}
                      disabled={!resend}
                      fullWidth
          >
            Reenviar mail
          </SendButton>
          :
          <SendButton type="submit" form={`${LogInProcessParts.PassRecovery}-form`} fullWidth>
            Enviar
          </SendButton>
    )
  }, [formSent, resend]);
  
  return (
    <form
      id={`${LogInProcessParts.PassRecovery}-form`}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack spacing={3} alignItems={'center'}>
        {
          formSent &&
            <Stack spacing={2}>
              <Alert severity={'success'}>
                <Typography>
                  {MESSAGE_SUCCESS}
                  <Link underline={'none'} onClick={goToContactLuc}>contactanos</Link>
                </Typography>
              </Alert>
              <Stack spacing={1} direction='row' alignItems='center'>
                <Checkbox value={resend}
                          onChange={(e) => setResend(!resend)}
                />
                <Typography>
                  Reenviar mail
                </Typography>
              </Stack>
            </Stack>
        }
        
        {!formSent && (
          <Alert severity="info">
            Ingresa el mail con el que te registraste en LUC
          </Alert>
        )}
        
        {
          !formSent && (
            <ControlledTextFieldFilled
              fullWidth
              control={control}
              label="Email"
              name={PasswordRecoveryFields.Email}
            />
        )}
        {
            (resend || !formSent) &&
          <ControlledReCaptcha
              control={control}
              name={PasswordRecoveryFields.Captcha}
              reset={reset}
              setReset={resetCaptcha}
          />
        }
        
          <Stack direction={'row'} spacing={6} alignItems={'center'}>
            <BackButton onClick={onClickReturn}>Volver</BackButton>
          </Stack>
      </Stack>
    </form>
  );
}

export default PasswordRecoveryForm;


export function PasswordRecoveryFormNew({
                                       onClickReturn,
                                     }: PasswordRecoveryFormProps) {
  const { fetchData } = useAxios();
  const { navigate } = useAppNavigation();
  const { addSnackbarSuccess } = useSnackbarActions();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formSent, setFormSent] = useState<boolean>();
  const [reset, resetCaptcha] = useState<boolean>(false);
  const [resend, setResend] = useState<boolean>(false);

  const passwordFormSchema = yup.object().shape({
    [PasswordRecoveryFields.Email]: RequiredMailSchema,
    [PasswordRecoveryFields.Captcha]: yup
        .string()
        .required('Campo obligatorio'),
  });

  const { control, handleSubmit, setValue } = useForm<PasswordRecoveryFormData>({
    resolver: yupResolver(passwordFormSchema),
  });

  const watchMail = useWatch({
    control: control,
    name: PasswordRecoveryFields.Email,
  });

  const MESSAGE_SUCCESS = `Enviamos un mail a ${watchMail} con los pasos para cambiar tu contraseña. Por favor, revisá tu bandeja de entrada y seguí las instrucciones. 
  Si no lo recibís a la brevedad revisá la carpeta de SPAM, solicitá el reenvío o `;

  const onSubmit = async (data: PasswordRecoveryFormData) => {
    const { HttpAuth } = await import('../../../http/index');
    const dataSubmit: ForgotPasswordRequest = {
      ...data,
      [ForgotPasswordRequestFields.Mail]: data[PasswordRecoveryFields.Email]
    };

    try {
      const response = await fetchData(
          () => HttpAuth.passwordRecovery(dataSubmit),
          true,
      );

      setFormSent(true);
      if (!response?.tieneError && formSent) {
        addSnackbarSuccess('El mail se reenvió correctamente')
      }
    } catch (error) {
      setValue(PasswordRecoveryFields.Captcha, '');
      resetCaptcha(true);
    } finally {
      resetCaptcha(true);
    }
  };

  const goToContactLuc = () => navigate(AppRoutesDefinitions.LucContactPage);

  return (
      <Stack spacing={4}>
        <Stack spacing={0.75}>
          <TypographyBase variant="eyebrow2" color="primary">RECUPERÁ TU CONTRASEÑA</TypographyBase>
          <Typography variant="h4">Recuperación de contraseña</Typography>
          <Typography variant="body2" color="text.lighter">Ingresá tu mail con el que te registraste en LUC</Typography>
        </Stack>
        <Stack justifyContent="space-between" spacing={4} sx={{width: '100%', height: '100%'}}>
          <Stack spacing={3} alignItems={'center'}>
            {
                formSent &&
                <Stack spacing={2}>
                  <Alert severity={'success'}>
                    <Typography>
                      {MESSAGE_SUCCESS}
                      <Link underline={'none'} onClick={goToContactLuc}>contactanos</Link>
                    </Typography>
                  </Alert>
                  <Stack spacing={1} direction='row' alignItems='center'>
                    <Checkbox value={resend}
                              onChange={(e) => setResend(!resend)}
                    />
                    <Typography>
                      Reenviar mail
                    </Typography>
                  </Stack>
                </Stack>
            }
  
            {
                !formSent && (
                    <ControlledTextFieldFilled
                        fullWidth
                        control={control}
                        label="Email"
                        name={PasswordRecoveryFields.Email}
                    />
                )}
            {
                (resend || !formSent) &&
                <ControlledReCaptcha
                    control={control}
                    name={PasswordRecoveryFields.Captcha}
                    reset={reset}
                    setReset={resetCaptcha}
                />
            }
          </Stack>
          <Stack spacing={2} 
                 alignItems={'center'}
                 justifyContent={'space-between'} 
                 direction={isSmallScreen ? "column-reverse" : "row"}
          >
            <Button onClick={onClickReturn} variant="outlined" fullWidth={isSmallScreen}>Volver</Button>
            {
              formSent ?
                  <Button onClick={handleSubmit(onSubmit)}
                          variant={'contained'}
                          disabled={!resend}
                          fullWidth={isSmallScreen}
                  >
                    Reenviar mail
                  </Button>
                  :
                  <Button onClick={handleSubmit(onSubmit)}
                          variant={'contained'}
                          fullWidth={isSmallScreen}
                  >
                    Enviar
                  </Button>
            }
          </Stack>
        </Stack>
      </Stack>
  );
}