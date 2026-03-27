import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid } from '@mui/material';
import { LoaderBlockUI } from 'components/loader';
import { ControlledReCaptcha } from 'components/forms/ControlledReCaptcha';
import {
    RequiredCaptchaSchema,
    RequiredMailSchema,
    RequiredStringSchema
} from 'util/validation/validationSchemas';
import { useProfileActions } from 'hooks/useProfileActions'; 
import { ControlledTextFieldFilled, ControlledTextPasswordFieldFilled } from 'components/forms';
import { AuthorizationRequest, AuthorizationResponse, AuthorizationResponseFields } from '../../../types/user';
import { LogInProcessParts } from "../../../types/form/login/login-enum";
import { LogInDrawerContext } from "../LogInDrawer";
import { SendButton } from 'components/buttons/Buttons';
import { useUser } from "../../../hooks/contexts/UserContext";
import { useSnackbarActions } from 'hooks/useSnackbarActions';

enum LogInFormFields {
  Email = 'mail',
  Password = 'password',
  Captcha = 'captcha',
}

type LoginFormData = {
  [LogInFormFields.Email]: string;
  [LogInFormFields.Password]: string;
  [LogInFormFields.Captcha]: string;
};

interface LogInFormProps {
  onClickPasswordRecovery?: (...args: any[]) => void;
  onClickMailRecovery?: (...args: any[]) => void;
  onClickNewUser?: (...args: any[]) => void;
  onLogin?: (...args: any[]) => void;
  allowsRegistration?: boolean;
  fnAuthenticateUser: (requestParams: AuthorizationRequest) => Promise<AuthorizationResponse>
}

function LogInForm({
  onClickPasswordRecovery,
  onClickMailRecovery,
  onClickNewUser,
  onLogin,
  allowsRegistration,
  fnAuthenticateUser
}: LogInFormProps) {
  const { refreshUser } = useUser();
  const { setProfile } = useProfileActions();
  const { addSnackbarWarning, addSnackbarError } = useSnackbarActions();
  const { setActions } = React.useContext(LogInDrawerContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [reset, resetCaptcha] = useState<boolean>(false);

  const logInFormSchema = yup.object().shape({
    [LogInFormFields.Email]: RequiredMailSchema,
    [LogInFormFields.Password]: RequiredStringSchema,
    [LogInFormFields.Captcha]: RequiredCaptchaSchema,
  });

  const { control, handleSubmit, setValue } = useForm<LoginFormData>({
    resolver: yupResolver(logInFormSchema),
  });
  
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const response = await fnAuthenticateUser({
        mail: data.mail,
        password: data.password,
        ipClient: '', 
        captcha: data.captcha
      });

      const { userStorage } = await import('../../../util/localStorage/userStorage');

      if (response[AuthorizationResponseFields.LoginExtraField] !== null) {
        userStorage.setOffererSlug(response[AuthorizationResponseFields.LoginExtraField]);
      }

      if (!response[AuthorizationResponseFields.HasError]) {
        const accessToken = response[AuthorizationResponseFields.AccessToken];
        const refreshToken = response[AuthorizationResponseFields.RefreshToken];

        await userStorage.save(
          response[AuthorizationResponseFields.UserId],
          response[AuthorizationResponseFields.Lastname],
          response[AuthorizationResponseFields.CUIT],
          data.mail,
          response[AuthorizationResponseFields.DefaultLanguage],
          response[AuthorizationResponseFields.UserType],
          response[AuthorizationResponseFields.ProfileId],
          response[AuthorizationResponseFields.ProfileIds],
          response[AuthorizationResponseFields.ConfirmedMail],
          response[AuthorizationResponseFields.ConfirmedPhoneNumber],
          response[AuthorizationResponseFields.ConfirmedPerson],
          response[AuthorizationResponseFields.ValidatedIdentity],
          response[AuthorizationResponseFields.HasTaxActivity],
          response[AuthorizationResponseFields.ValidationIdentityStatusCode],
          response[AuthorizationResponseFields.ValidationIdentityObservations],
          response[AuthorizationResponseFields.MustChangePassword], 
          response[AuthorizationResponseFields.IsFirstLogin], 
          accessToken,
          refreshToken
        );

        const { HttpAxiosRequest } = await import('../../../http/httpAxiosBase');
        const { HttpAxiosRequestPublicBases } = await import('../../../http/httpAxiosPublicBasesBase');
        await Promise.all([
          HttpAxiosRequest.refreshToken(accessToken, refreshToken),
          HttpAxiosRequestPublicBases.refreshToken(accessToken, refreshToken)
        ]);

        setProfile(response[AuthorizationResponseFields.ProfileId]);
        await refreshUser();
        onLogin?.();
      } else {
        setValue(LogInFormFields.Captcha, '');
        resetCaptcha(true);
        addSnackbarWarning(response[AuthorizationResponseFields.ErrorDescription]);
      }
    } catch (error) {
      setValue(LogInFormFields.Captcha, '');
      resetCaptcha(true);
      addSnackbarError(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActions(
      <SendButton type="submit" form={`${LogInProcessParts.Login}-form`} fullWidth>
        Acceder
      </SendButton>
    );
  }, [setActions]);
  
  return (
    <div>
      <form id={`${LogInProcessParts.Login}-form`} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ControlledTextFieldFilled
              fullWidth
              control={control}
              label="Email"
              name={LogInFormFields.Email}
            />
          </Grid>
          <Grid item xs={4} mt={-2}>
            <Button
              sx={{ width: 1, textTransform: 'none' }}
              onClick={onClickMailRecovery}
            >
              No lo sé
            </Button>
          </Grid>
          <Grid item xs={12}>
            <ControlledTextPasswordFieldFilled
              fullWidth
              control={control}
              label="Contraseña"
              name={LogInFormFields.Password}
            />
          </Grid>
          <Grid item xs={4} mt={-2}>
            <Button
              sx={{ width: 1, textTransform: 'none' }}
              onClick={onClickPasswordRecovery}
            >
              La olvidé
            </Button>
          </Grid>
          <Grid item container xs={12} justifyContent="center">
            <Grid item xs={8}>
              <ControlledReCaptcha
                control={control}
                reset={reset}
                setReset={resetCaptcha}
                name={LogInFormFields.Captcha}
              />
            </Grid>
          </Grid>
        </Grid>
        {loading && <LoaderBlockUI />}
      </form>
    </div>
  );
}

export default React.memo(LogInForm);