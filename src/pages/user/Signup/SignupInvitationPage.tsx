import React, { useEffect, useState } from 'react';
import { Divider, Grid, Stack, Typography } from '@mui/material';
import { SendButton } from 'components/buttons/Buttons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PinForm from './PinForm';
import { PinConfirmationMode } from 'types/user/userAuth-enum';
import { TitlePage } from 'components/text/TitlePage';
import { SubTitle } from 'components/text/SubTitle';
import { grey } from '@mui/material/colors';
import { userStorage } from 'util/localStorage/userStorage';
import { HttpPerson, HttpUser } from 'http/index';
import { Skeleton } from '@mui/lab';
import { useModuleNavigate } from 'hooks/useModuleNavigate';
import { Module } from 'types/form/login/login-enum';
import { useAction } from 'hooks/useAction';
import { ControlledTextPasswordFieldFilled } from '../../../components/forms';
import { useForm } from 'react-hook-form';
import {
  AuthorizationResponseFields,
  UserResponseInvitationFields,
} from '../../../types/user';
import { HttpAxiosRequest } from '../../../http/httpAxiosBase';
import { HttpAxiosRequestPublicBases } from '../../../http/httpAxiosPublicBasesBase';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';
import { RequiredPasswordSchema } from '../../../util/validation/validationSchemas';
import { NosisResponseFields } from '../../../types/person/personData';
import CompanyInvitationDialog from '../../company/components/CompanyInvitationDialog';
import { CompanyUserInvitation } from '../../../types/user/userInvitation';
import PasswordRulesList from "components/forms/PasswordRulesList";
import {useUser} from "../../../hooks/contexts/UserContext";
import {ModuleCodes} from "../../../types/general/generalEnums";

export enum SignupInvitationFormFields {
  CUIT = 'cuit',
  BusinessName = 'razonSocial',
  Mail = 'mail',
  MailConfirmed = 'confirmoMail',
  PhoneCode = 'codigoTelefonico',
  AreaCode = 'codigoArea',
  PhoneNumber = 'telefono',
  PhoneConfirmed = 'confirmoTelefono',
  Password = 'password',
  RepeatPassword = 'repetirPassword',
}

export interface SignupInvitationForm {
  [SignupInvitationFormFields.CUIT]: string;
  [SignupInvitationFormFields.BusinessName]: string;
  [SignupInvitationFormFields.Mail]: string;
  [SignupInvitationFormFields.MailConfirmed]: boolean;
  [SignupInvitationFormFields.PhoneCode]: string;
  [SignupInvitationFormFields.AreaCode]: string;
  [SignupInvitationFormFields.PhoneNumber]: string;
  [SignupInvitationFormFields.PhoneConfirmed]: boolean;
  [SignupInvitationFormFields.Password]: string;
  [SignupInvitationFormFields.RepeatPassword]: string;
}

function SignupInvitationPage() {
  const {
    snackbarWarning,
    snackbarError,
    setProfile,
    showLoader,
    hideLoader,
    reloadUserSummary,
  } = useAction();
  const { refreshUser } = useUser();
  const navigate = useNavigate();
  const moduleNavigate = useModuleNavigate(Module.Company);

  let [searchParams] = useSearchParams();
  const identifierWeb = searchParams.get('identifier') || '';

  const [showInvitation, setShowInvitation] = useState<boolean>(false);
  const [invite, setInvite] = useState<CompanyUserInvitation>();

  useEffect(() => {
    if (!identifierWeb || !userStorage.isLackConfirmation()) {
      navigate('/');
    }
  }, [identifierWeb, navigate]);

  const signupInvitationPageSchema = yup.object().shape({
    [SignupInvitationFormFields.Password]: RequiredPasswordSchema,
    [SignupInvitationFormFields.RepeatPassword]: RequiredPasswordSchema.oneOf(
      [yup.ref(SignupInvitationFormFields.Password), null],
      'Las contraseñas no coinciden',
    ),
  });

  const { control, reset, setValue, watch, handleSubmit } =
    useForm<SignupInvitationForm>({
      defaultValues: {
        [SignupInvitationFormFields.MailConfirmed]: true,
        [SignupInvitationFormFields.PhoneConfirmed]: false,
      },
      resolver: yupResolver(signupInvitationPageSchema),
    });
  const watchCUIT = watch(SignupInvitationFormFields.CUIT);
  const watchBusinessName = watch(SignupInvitationFormFields.BusinessName);
  const watchMail = watch(SignupInvitationFormFields.Mail);
  const watchMailConfirmed = watch(SignupInvitationFormFields.MailConfirmed);
  const watchPhoneCode = watch(SignupInvitationFormFields.PhoneCode);
  const watchAreaCode = watch(SignupInvitationFormFields.AreaCode);
  const watchPhoneNumber = watch(SignupInvitationFormFields.PhoneNumber);
  const watchPhoneConfirmed = watch(SignupInvitationFormFields.PhoneConfirmed);
  const watchPassword = watch(SignupInvitationFormFields.Password);
  const watchRepeatPassword = watch(SignupInvitationFormFields.RepeatPassword);

  const onCloseInvitation = () => {
    setShowInvitation(false);
    moduleNavigate();
  };

  const onUpdateMail = (newMail: string) => {
    setValue(SignupInvitationFormFields.Mail, newMail);
    setValue(SignupInvitationFormFields.MailConfirmed, false);
  };

  const onUpdatePhoneNumber = (phoneNumber: string) => {
    setValue(SignupInvitationFormFields.PhoneNumber, phoneNumber);
    setValue(SignupInvitationFormFields.PhoneConfirmed, false);
  };

  const loadInvitation = () => {
    HttpUser.getInvitationByIdentifierWeb(identifierWeb)
      .then((invitation) => {
        setInvite(invitation);
        setShowInvitation(true);
      })
      .finally(() => hideLoader());
  };

  const createUserInvitation = (
    personId: number,
    password: string,
    mail: string,
  ) => {
    HttpUser.userInvitationActivation(identifierWeb, personId, password)
      .then(async (response) => {
        if (!response[AuthorizationResponseFields.HasError]) {
          const accessToken = response[AuthorizationResponseFields.AccessToken];
          const refreshToken = response[AuthorizationResponseFields.RefreshToken];
          
          userStorage.save(
            response[AuthorizationResponseFields.UserId],
            response[AuthorizationResponseFields.Lastname],
            response[AuthorizationResponseFields.CUIT],
            mail,
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
          HttpAxiosRequest.refreshToken(accessToken, refreshToken);
          HttpAxiosRequestPublicBases.refreshToken(accessToken, refreshToken);
          setProfile(response[AuthorizationResponseFields.ProfileId]);

          reloadUserSummary();
          await refreshUser();
          loadInvitation();
          // moduleNavigate();
        } else {
          snackbarWarning(
            response[AuthorizationResponseFields.ErrorDescription],
          );
          hideLoader();
        }
      })
      .catch((error) => {
        hideLoader();
        snackbarError(error.message);
      });
  };

  const onSubmit = (data: SignupInvitationForm) => {
    showLoader();

    HttpPerson.synchronizeWithNosisAndGetPersonId(
      data[SignupInvitationFormFields.CUIT], ModuleCodes.UserRegistration
    )
      .then((responseNosis) => {
        if (
          responseNosis[NosisResponseFields.Valid] &&
          responseNosis[NosisResponseFields.PersonId]
        )
          createUserInvitation(
            responseNosis[NosisResponseFields.PersonId],
            data[SignupInvitationFormFields.Password],
            data[SignupInvitationFormFields.Mail],
          );
        else {
          snackbarWarning('Error al crear el usuario');
          hideLoader();
        }
      })
      .catch(() => {
        snackbarWarning('Error al crear el usuario');
        hideLoader();
      });
  };

  useEffect(() => {
    if (!identifierWeb || !userStorage.isLackConfirmation()) {
      return;
    }

    showLoader();
    HttpUser.userInvitationByIdentifierWeb(identifierWeb).then(async (response) => {
      if (!response[UserResponseInvitationFields.HasError]) {
        const accessToken = response[AuthorizationResponseFields.AccessToken];
        const refreshToken = response[AuthorizationResponseFields.RefreshToken];
        
        userStorage.save(
          response[UserResponseInvitationFields.UserId],
          response[UserResponseInvitationFields.BusinessName],
          response[UserResponseInvitationFields.CUIT],
          response[UserResponseInvitationFields.Mail],
          response[UserResponseInvitationFields.DefaultLanguage],
          4, //response[SignupInvitationFormFields.UserType],
          0, //response[SignupInvitationFormFields.ProfileId],
          [], //response[SignupInvitationFormFields.ProfileIds],
          response[UserResponseInvitationFields.ConfirmedMail],
          response[UserResponseInvitationFields.ConfirmedPhoneNumber],
          response[UserResponseInvitationFields.ConfirmedPerson],
          response[UserResponseInvitationFields.ValidatedIdentity],
          response[UserResponseInvitationFields.HasTaxActivity],
          response[UserResponseInvitationFields.ValidationIdentityStatusCode],
          response[UserResponseInvitationFields.ValidationIdentityObservations],
          response[UserResponseInvitationFields.MustChangePassword],
          response[UserResponseInvitationFields.IsFirstLogin],
          accessToken,
          refreshToken
        );
        HttpAxiosRequest.refreshToken(accessToken, refreshToken);
        HttpAxiosRequestPublicBases.refreshToken(accessToken, refreshToken);

        reset({
          [SignupInvitationFormFields.CUIT]:
            response[UserResponseInvitationFields.CUIT],
          [SignupInvitationFormFields.BusinessName]:
            response[UserResponseInvitationFields.BusinessName],
          [SignupInvitationFormFields.Mail]:
            response[UserResponseInvitationFields.Mail],
          [SignupInvitationFormFields.MailConfirmed]:
            response[UserResponseInvitationFields.ConfirmedMail],
          [SignupInvitationFormFields.PhoneCode]:
            response[UserResponseInvitationFields.PhoneCode],
          [SignupInvitationFormFields.AreaCode]:
            response[UserResponseInvitationFields.AreaCode],
          [SignupInvitationFormFields.PhoneNumber]:
            response[UserResponseInvitationFields.PhoneNumber],
          [SignupInvitationFormFields.PhoneConfirmed]:
            response[UserResponseInvitationFields.ConfirmedPhoneNumber],
          [SignupInvitationFormFields.Password]: '',
        });
      } else {
        snackbarWarning(
          response[UserResponseInvitationFields.ErrorDescription],
        );
        userStorage.removeFromStorage();
        navigate('/');
      }

      hideLoader();
    });
  }, [identifierWeb, navigate, reset]);

  useEffect(() => { }, [
    watchMailConfirmed,
    watchPhoneConfirmed,
    watchPassword,
    watchRepeatPassword,
  ]);

  if (!identifierWeb || !userStorage.isLackConfirmation()) {
    return null;
  }

  return (
    <Stack direction={'column'} gap={1} mt={8}>
      <TitlePage text={`Bienvenido/a ${watchBusinessName ?? ''}`} />
      <SubTitle text={'Sólo un paso más para acceder a la plataforma LUC'} />

      <Grid container spacing={4}>
        <Grid item xs={12} sm={8} gap={1}>
          <Typography component={'div'} paddingLeft={4}>
            {!!watchCUIT ? (
              <PinForm
                mode={PinConfirmationMode.Mail}
                onPinConfirmed={() =>
                  setValue(SignupInvitationFormFields.MailConfirmed, true)
                }
                onReferentialDataChange={onUpdateMail}
                referentialData={watchMail}
                initConfirmed={true}
              />
            ) : (
              <Skeleton />
            )}
          </Typography>

          <Divider flexItem sx={{ backgroundColor: grey[400] }} />

          <Typography variant={'body2'} mt={2} mb={2}>
            Por favor ingrese un celular así podremos enviarle un PIN para
            validar su identidad:
          </Typography>

          <Typography component={'div'} paddingLeft={4}>
            {!!watchCUIT ? (
              <PinForm
                mode={PinConfirmationMode.Phone}
                onPinConfirmed={() => {
                  setValue(SignupInvitationFormFields.PhoneConfirmed, true);
                  if (watchMail === userStorage.getUserMail())
                    setValue(SignupInvitationFormFields.MailConfirmed, true);
                }}
                onReferentialDataChange={onUpdatePhoneNumber}
                referentialData={`${watchPhoneCode || ''} ${watchAreaCode ? '(' + watchAreaCode + ')' : ''} ${watchPhoneNumber || ''}`}
                initConfirmed={watchPhoneConfirmed}
              />
            ) : (
              <Skeleton />
            )}
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4} container spacing={1}>
          <Typography variant={'body2'} mt={2}>
            Ingrese la constraseña:
          </Typography>
          <Grid item xs={12}>
            <ControlledTextPasswordFieldFilled
              fullWidth
              control={control}
              name={SignupInvitationFormFields.Password}
            />
          </Grid>
          <Typography variant={'body2'} mt={2}>
            Repita la contraseña:
          </Typography>
          <Grid item xs={12}>
            <ControlledTextPasswordFieldFilled
              fullWidth
              control={control}
              name={SignupInvitationFormFields.RepeatPassword}
            />
          </Grid>

          <Grid item xs={12}>
            <PasswordRulesList password={watchPassword} />
          </Grid>
        </Grid>
      </Grid>

      <Typography component={'div'} paddingLeft={4}>
        <SendButton
          disabled={
            !watchMailConfirmed ||
            !watchPhoneConfirmed
          }
          sx={{ width: 1 / 8, marginTop: '12px' }}
          onClick={handleSubmit(onSubmit)}
        >
          Continuar
        </SendButton>
      </Typography>

      {invite && (
        <CompanyInvitationDialog
          open={showInvitation}
          onClose={onCloseInvitation}
          invitation={invite}
          onReloadAccept={onCloseInvitation}
          onReloadReject={onCloseInvitation}
        />
      )}
    </Stack>
  );
}

export default SignupInvitationPage;