import React, { useEffect, useState } from 'react';
import { createSearchParams, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useSearchParamsEncrypted from "hooks/useSearchParamsEncrypted";
import { Checkbox, Grid, Link, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ControlledTextFieldFilled, ControlledTextPasswordFieldFilled } from 'components/forms';
import { ControlledAreaCodePhoneFieldFilled } from 'components/forms/ControlledAreaCodePhoneField';
import { ControlledReCaptcha } from 'components/forms/ControlledReCaptcha';
import { DialogPreviewFileWrapper } from 'components/files/DialogPreviewFileWrapper';
import { Country, CountryFields } from 'types/general/generalAddressData';
import { NewUserRequest, NewUserResponseFields } from 'types/user';
import { AuthorizationResponseFields } from "../../../types/user";
import { stringFormatter } from 'util/formatters/stringFormatter';
import { LogInProcessParts } from 'types/form/login/login-enum';
import { AppConfigFields } from "../../../types/appConfigEntities";
import PasswordRulesList from "components/forms/PasswordRulesList";
import { LogInDrawerContext } from "../LogInDrawer";
import { SendButton } from "../../../components/buttons/Buttons";
import { useSnackbarActions } from 'hooks/useSnackbarActions';
import { EnumSnackbarType } from '../../../stores/reducer/snackbarReducer';
import { useLoaderActions } from "../../../hooks/useLoaderActions";
import {
    RequiredAreaCodeSchema,
    RequiredCaptchaSchema,
    RequiredCuitSchema,
    RequiredMailSchema,
    RequiredPasswordSchema,
    RequiredPhoneSchema,
    RequiredSchema
} from '../../../util/validation/validationSchemas';
import {ModuleCodes} from "../../../types/general/generalEnums";

enum SignUpFormFields {
  Email = 'mail',
  Password = 'password',
  RepeatPassword = 'repetirPassword',
  AreaCode = 'codigoArea',
  PhoneNumber = 'telefono',
  CUIT = 'cuit',
  Captcha = 'captcha',
  PhoneCode = 'codigoTelefonico',
}

export type SignUpFormData = {
  [SignUpFormFields.Email]: string;
  [SignUpFormFields.Password]: string;
  [SignUpFormFields.CUIT]: string;
  [SignUpFormFields.AreaCode]?: string;
  [SignUpFormFields.PhoneNumber]: string;
  [SignUpFormFields.Captcha]: string;
  [SignUpFormFields.PhoneCode]: Country;
};

function SignUpProcess() {
  const { addSnackbarError, addSnackbarWarning } = useSnackbarActions();
  const { showLoader, hideLoader } = useLoaderActions();
  const { setActions } = React.useContext(LogInDrawerContext);

  const navigate = useNavigate();
  const fromMarket: boolean = window.location.toString().includes('market');
  const [searchParams] = useSearchParamsEncrypted();
  const redirect = searchParams.get('redirect') || '';
  const [checkedTerms, setCheckedTerms] = useState<boolean>(false);
  const [checkedPolicies, setCheckedPolicies] = useState<boolean>(false);
  const [reset, resetCaptcha] = useState<boolean>(false);

  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));

  const signUpFormSchema = yup.object().shape({
    [SignUpFormFields.Email]: RequiredMailSchema,
    [SignUpFormFields.Password]: RequiredPasswordSchema,
    [SignUpFormFields.RepeatPassword]: RequiredPasswordSchema.oneOf(
      [yup.ref(SignUpFormFields.Password), null],
      'Las constraseñas no coinciden',
    ),
    [SignUpFormFields.AreaCode]: RequiredAreaCodeSchema,
    [SignUpFormFields.PhoneNumber]: RequiredPhoneSchema,
    [SignUpFormFields.CUIT]: RequiredCuitSchema,
    [SignUpFormFields.PhoneCode]: RequiredSchema,
    [SignUpFormFields.Captcha]: RequiredCaptchaSchema,
  });

  const { control, handleSubmit, watch, setValue } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpFormSchema),
  });
  const watchPassword = watch(SignUpFormFields.Password);

  const createNewUser = async (
    mail: string,
    phoneNumber: string,
    cuit: string,
    userRequest: NewUserRequest,
  ) => {
    try {
      const { userStorage } = await import('../../../util/localStorage/userStorage');
      const { HttpUser } = await import('../../../http/index');
      const { HttpAxiosRequest } = await import('../../../http/httpAxiosBase');
      const { HttpAxiosRequestPublicBases } = await import('../../../http/httpAxiosPublicBasesBase');

      const response = await HttpUser.newUser(userRequest);
      userStorage.removeFromStorage();

      if (!response[AuthorizationResponseFields.HasError]) {
        const accessToken = response[AuthorizationResponseFields.AccessToken];
        const refreshToken = response[AuthorizationResponseFields.RefreshToken];
        
        await userStorage.save(
          response[AuthorizationResponseFields.UserId],
          response[AuthorizationResponseFields.Lastname],
          response[AuthorizationResponseFields.CUIT],
          mail,
          response[AuthorizationResponseFields.DefaultLanguage],
          response[AuthorizationResponseFields.UserType],
          response[AuthorizationResponseFields.ProfileId],
          response[AuthorizationResponseFields.ProfileIds],
          false,
          false,
          false,
          false,
          response[AuthorizationResponseFields.HasTaxActivity],
          response[AuthorizationResponseFields.ValidationIdentityStatusCode],
          response[AuthorizationResponseFields.ValidationIdentityObservations],
          response[AuthorizationResponseFields.MustChangePassword],
          response[AuthorizationResponseFields.IsFirstLogin],
          accessToken,
          refreshToken
        );

        await Promise.all([
          HttpAxiosRequest.refreshToken(accessToken, refreshToken),
          HttpAxiosRequestPublicBases.refreshToken(accessToken, refreshToken)
        ]);

        fromMarket
        ? redirect && redirect !== ''
            ? navigate(
                {
                  pathname: '/signup/confirmation',
                  search: `?${createSearchParams({ mail, telefono: phoneNumber, cuit, goto: redirect })}`,
                },
                {
                  state: { prevPathname: 'casfog' },
                },
            )
            : navigate(
                {
                  pathname: '/signup/confirmation',
                  search: `?${createSearchParams({ mail, telefono: phoneNumber, cuit })}`,
                },
                {
                  state: { prevPathname: 'market' },
                },
            )
        : navigate({
          pathname: '/signup/confirmation',
          search: `?${createSearchParams({ mail, telefono: phoneNumber, cuit })}`,
        });
      } else {
        addSnackbarError(response[NewUserResponseFields.ErrorDescription]);
        setValue(SignUpFormFields.Captcha, '');
        resetCaptcha(true);
      }
    } catch (error) {
      addSnackbarError('Error al crear el usuario');
      setValue(SignUpFormFields.Captcha, '');
      resetCaptcha(true);
    } finally {
      hideLoader();
    }
  };

  const onSubmit = async (data: SignUpFormData) => {
    if (!checkedTerms || !checkedPolicies) {
      addSnackbarWarning('Para continuar debés aceptar los términos y condiciones y las políticas de privacidad');
      return;
    }

    const { mail, codigoArea, codigoTelefonico, telefono, cuit } = data;
    const submitData = {
      ...data,
      codigoTelefonico: codigoTelefonico[CountryFields.PhoneCode],
    };

    showLoader();

    try {
      const { HttpPerson } = await import('../../../http/index');
      await HttpPerson.synchronizeWithNosisAndGetPersonId(cuit, ModuleCodes.UserRegistration);
      
      const phoneNumber = stringFormatter.phoneNumberWithAreaCode(
        codigoArea,
        telefono,
      );
      await createNewUser(mail, phoneNumber, cuit, submitData as NewUserRequest);
    } catch (error) {
      addSnackbarError('Error al sincronizar');
      hideLoader();
      resetCaptcha(true);
    }
  };

  const TermsCheckbox = ({ checked, setChecked, prefix, label, fileUrl, titleDialog, isMobileScreenSize }) => (
    <Stack direction={'row'} alignItems={'center'} spacing={0.7}>
      <Checkbox checked={checked} onClick={() => setChecked(!checked)} />
      <Typography fontSize={14}>
        He leído y <strong>Acepto </strong>{prefix} 
        {isMobileScreenSize ? (
          <Link href={fileUrl} target="_blank" underline="hover" download>
            {label}
          </Link>
        ) : (
          <DialogPreviewFileWrapper fileUrl={fileUrl} titleDialog={titleDialog}>
            <Link underline={'none'}>{label}</Link>
          </DialogPreviewFileWrapper>
        )}
      </Typography>
    </Stack>
  );

  useEffect(() => {
    setActions(
      <SendButton type="submit" form={`${LogInProcessParts.Signup}-form`} fullWidth>
        Enviar
      </SendButton>
    );
  }, []);
    
  return (
    <form
          id={`${LogInProcessParts.Signup}-form`}
          onSubmit={handleSubmit(onSubmit)}
      >
        <Grid container spacing={2.5}>
          <Grid item xs={12} md={7.5}>
            <ControlledTextFieldFilled
                fullWidth
                control={control}
                name={SignUpFormFields.Email}
                label="Email"
            />
          </Grid>
          <Grid item xs={12} md={4.5}>
            <ControlledTextFieldFilled
                fullWidth
                control={control}
                name={SignUpFormFields.CUIT}
                label="CUIT"
                helperText={'Sin puntos ni guiones'}
            />
          </Grid>
          <Grid item xs={12}>
              <Typography fontWeight={500} variant={'h5'} fontSize={15}>
                  Teléfono Celular
              </Typography>
              <ControlledAreaCodePhoneFieldFilled
                  control={control}
                  nameAreaCode={SignUpFormFields.AreaCode}
                  namePhoneNumber={SignUpFormFields.PhoneNumber}
                  nameCountry={SignUpFormFields.PhoneCode}
                  showCountries
              />
          </Grid>
          <Grid item xs={12} md={6}>
            <ControlledTextPasswordFieldFilled
                fullWidth
                control={control}
                name={SignUpFormFields.Password}
                label="Contraseña"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <ControlledTextPasswordFieldFilled
                label="Repetir Contraseña"
                control={control}
                name={SignUpFormFields.RepeatPassword}
                fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <PasswordRulesList password={watchPassword} />
          </Grid>
          <Grid item xs={12} ml={2}>
            <ControlledReCaptcha
                control={control}
                name={SignUpFormFields.Captcha}
                reset={reset}
                setReset={resetCaptcha}
            />
          </Grid>
          <Grid item xs={12} ml={2}>
            <Stack direction={'row'} alignItems={'center'} spacing={0.7}>
                <Grid item xs={12}>
                  <TermsCheckbox 
                    checked={checkedTerms} 
                    setChecked={setCheckedTerms}
                    prefix={" los "} 
                    label="Términos y Condiciones" 
                    fileUrl={window.APP_CONFIG[AppConfigFields.TermsAndConditionsURL]} 
                    titleDialog="Términos y Condiciones de LUC" 
                    isMobileScreenSize={isMobileScreenSize} 
                  />
                  <TermsCheckbox 
                    checked={checkedPolicies} 
                    setChecked={setCheckedPolicies} 
                    prefix={" las "} 
                    label="Políticas de Privacidad y Seguridad de datos" 
                    fileUrl={window.APP_CONFIG[AppConfigFields.PrivacyPoliciesUserURL]} 
                    titleDialog="Políticas de Privacidad y Seguridad de datos" 
                    isMobileScreenSize={isMobileScreenSize} 
                  />
                </Grid>
            </Stack>
          </Grid>
        </Grid>
      </form>
  );
}

export default React.memo(SignUpProcess);
