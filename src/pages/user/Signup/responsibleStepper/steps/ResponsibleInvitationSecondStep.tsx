import {useForm} from "react-hook-form";
import {SignupInvitationForm, SignupInvitationFormFields} from "../../SignupInvitationPage";
import React, {useContext} from "react";
import {SignupResponsibleStepperFormContext} from "../SignupResponsibleStepperForm";
import * as yup from "yup";
import {RequiredPasswordSchema} from "../../../../../util/validation/validationSchemas";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {HttpInvitations} from "../../../../../http/invitations";
import {HttpPerson, HttpUser} from "../../../../../http";
import {AuthorizationResponseFields, UserResponseInvitationFields} from "../../../../../types/user";
import {userStorage} from "../../../../../util/localStorage/userStorage";
import {HttpAxiosRequest} from "../../../../../http/httpAxiosBase";
import {HttpAxiosRequestPublicBases} from "../../../../../http/httpAxiosPublicBasesBase";
import {NosisResponseFields} from "../../../../../types/person/personData";
import {useAction} from "../../../../../hooks/useAction";
import {Box, Grid, Stack, Tooltip, Typography, useMediaQuery, useTheme} from "@mui/material";
import PinForm from "../../PinForm";
import {PinConfirmationMode} from "../../../../../types/user/userAuth-enum";
import {ControlledTextPasswordFieldFilled} from "../../../../../components/forms";
import {BackButton, DefaultStylesButton} from "../../../../../components/buttons/Buttons";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PasswordRulesList from "components/forms/PasswordRulesList";
import {ModuleCodes} from "../../../../../types/general/generalEnums";


const ResponsibleInvitationSecondStep = () => {
    const {identifier, userData, invitation, setInvitation, onBack, onContinue} = useContext(SignupResponsibleStepperFormContext)

    const {showLoader, hideLoader, snackbarError, snackbarWarning, setProfile, reloadUserSummary} = useAction()

    const signupInvitationPageSchema = yup.object().shape({
        [SignupInvitationFormFields.Password]: RequiredPasswordSchema,
        [SignupInvitationFormFields.RepeatPassword]: RequiredPasswordSchema.oneOf(
            [yup.ref(SignupInvitationFormFields.Password), null],
            'Las contraseñas no coinciden',
        ),
    });
    
    const { control,
        handleSubmit,
        watch,
        setValue } = useForm<SignupInvitationForm>(
        {
            defaultValues: {
                [SignupInvitationFormFields.CUIT]: userData?.[UserResponseInvitationFields.CUIT] ?? '',
                [SignupInvitationFormFields.BusinessName]: userData?.[UserResponseInvitationFields.BusinessName],
                [SignupInvitationFormFields.Mail]: userData?.[UserResponseInvitationFields.Mail] ?? '',
                [SignupInvitationFormFields.MailConfirmed]: true,
                [SignupInvitationFormFields.PhoneCode]: userData?.[UserResponseInvitationFields.PhoneCode] ?? '',
                [SignupInvitationFormFields.AreaCode]: userData?.[UserResponseInvitationFields.AreaCode] ?? '',
                [SignupInvitationFormFields.PhoneConfirmed]: userData?.[UserResponseInvitationFields.ConfirmedPhoneNumber] ?? false,
                [SignupInvitationFormFields.PhoneNumber]: userData?.[UserResponseInvitationFields.PhoneNumber]
            },
            resolver: yupResolver(signupInvitationPageSchema),
        }
    )
    const watchMail = watch(SignupInvitationFormFields.Mail);
    const watchPhoneCode = watch(SignupInvitationFormFields.PhoneCode);
    const watchAreaCode = watch(SignupInvitationFormFields.AreaCode);
    const watchPhoneNumber = watch(SignupInvitationFormFields.PhoneNumber);
    const watchPhoneConfirmed = watch(SignupInvitationFormFields.PhoneConfirmed);
    const watchPassword = watch(SignupInvitationFormFields.Password);

    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('lg'))
    const onUpdatePhoneNumber = (phoneNumber: string) => {
        setValue(SignupInvitationFormFields.PhoneNumber, phoneNumber);
        setValue(SignupInvitationFormFields.PhoneConfirmed, false);
    }

    const reloadInvitation = () => {
        showLoader()
        HttpInvitations.getInvitationByGuid(identifier).then((r) => {
            setInvitation(r)
            hideLoader()
        })
    }

    const createUserInvitation = (
        personId: number,
        password: string,
        mail: string,
    ) => {
        HttpUser.userInvitationActivation(identifier, personId, password)
            .then((response) => {
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
                    reloadInvitation();
                    onContinue()
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
        if (invitation && userData) {
            const submitData: SignupInvitationForm = {
                ...data,
                [SignupInvitationFormFields.BusinessName]: userData[UserResponseInvitationFields.BusinessName],
                [SignupInvitationFormFields.Mail]: userData[UserResponseInvitationFields.Mail],
                [SignupInvitationFormFields.CUIT]: userData[UserResponseInvitationFields.CUIT]
            }
            
            showLoader();
    
            HttpPerson.synchronizeWithNosisAndGetPersonId(
                submitData[SignupInvitationFormFields.CUIT], ModuleCodes.UserRegistration
            )
                .then((responseNosis) => {
                    if (
                        responseNosis[NosisResponseFields.Valid] &&
                        responseNosis[NosisResponseFields.PersonId]
                    )
                        createUserInvitation(
                            responseNosis[NosisResponseFields.PersonId],
                            submitData[SignupInvitationFormFields.Password],
                            submitData[SignupInvitationFormFields.Mail],
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
        }
    }
    
    return (
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Typography variant={'body2'} mt={0.5}>
                        Por favor ingresá tu número de celular. Te enviaremos un PIN por SMS, ingresalo y verificá tu cuenta
                    </Typography>
                </Grid>
                <Grid item xs={12}>
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
                        isMobile={isMediumScreen}
                    />
                </Grid>

                <Grid item xs={12} container spacing={1} alignItems={'center'}>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                            <Typography variant={'body2'} mt={2}>
                                Ingresá la constraseña:
                            </Typography>
                            <ControlledTextPasswordFieldFilled
                                fullWidth
                                control={control}
                                name={SignupInvitationFormFields.Password}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Stack spacing={1}>
                            <Typography variant={'body2'} mt={2}>
                                Repetí la contraseña:
                            </Typography>
                            <ControlledTextPasswordFieldFilled
                                fullWidth
                                control={control}
                                name={SignupInvitationFormFields.RepeatPassword}
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <PasswordRulesList password={watchPassword} />
                    </Grid>
                    <Grid item xs={12} mt={4}>
                        <Stack 
                            direction={{ xs: 'column-reverse', sm: 'row' }} 
                            spacing={2} 
                            alignItems="center" 
                            justifyContent={'space-between'}
                        >
                            <BackButton 
                                onClick={onBack} 
                                size='small'
                                sx={{ 
                                    width: { xs: '100%', sm: 'auto' },
                                    mt: { xs: 2, sm: 0 }
                                }}
                            >
                                Volver
                            </BackButton>
                            
                            {!watchPhoneConfirmed ? (
                                <Tooltip title={'Validá el número de celular para completar datos'}>
                                    <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                                        <DefaultStylesButton 
                                            size={'small'} 
                                            disabled 
                                            endIcon={<ArrowForwardIcon />}
                                            sx={{ width: { xs: '100%', sm: 'auto' } }}
                                        >
                                            Continuar
                                        </DefaultStylesButton>
                                    </Box>
                                </Tooltip>
                            ) : (
                                <DefaultStylesButton 
                                    size={'small'} 
                                    onClick={handleSubmit(onSubmit)} 
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                                >
                                    Continuar
                                </DefaultStylesButton>
                            )}
                        </Stack>
                    </Grid>
                </Grid>
            </Grid>
    )
}


export default ResponsibleInvitationSecondStep