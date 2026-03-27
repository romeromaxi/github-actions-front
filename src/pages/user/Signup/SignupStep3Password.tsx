import React from 'react';
import {Box, Button, Checkbox, Divider, Link, Stack, Typography, useMediaQuery, useTheme} from '@mui/material';
import {ControlledTextPasswordFieldFilled} from 'components/forms';
import {ControlledReCaptcha} from 'components/forms/ControlledReCaptcha';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {AppConfigFields} from '../../../types/appConfigEntities';
import {DialogPreviewFileWrapper} from 'components/files/DialogPreviewFileWrapper';
import {useSnackbarActions} from 'hooks/useSnackbarActions';
import {useLoaderActions} from 'hooks/useLoaderActions';
import PasswordRulesList from 'components/forms/PasswordRulesList';
import {TypographyBase} from '../../../components/misc/TypographyBase';
import {useNavigate} from 'react-router-dom';
import {AuthorizationResponseFields, NewUserRequestFields, NewUserResponseFields} from '../../../types/user';
import {
    RequiredCaptchaSchema,
    RequiredPasswordSchema,
} from "../../../util/validation/validationSchemas";
import {PersonConsultantResponseDTOFields} from "../../../types/person/personNosisData";
import {ModuleCodes} from "../../../types/general/generalEnums";
import {LoggerService, LogLevels} from "../../../http/logger/httpLogger";

const ButtonIdCreateUser: string = "btn-cmpletar-registracion";

enum Step3FormDataFields {
    Password = 'password',
    RepeatPassword = 'repeatPassword',
    Captcha = 'captcha'
}

const schemaStep3 = yup.object().shape({
    [Step3FormDataFields.Password]: RequiredPasswordSchema,
    [Step3FormDataFields.RepeatPassword]: RequiredPasswordSchema.oneOf(
        [yup.ref(Step3FormDataFields.Password), null],
        'Las constraseñas no coinciden',
    ),
    [Step3FormDataFields.Captcha]: RequiredCaptchaSchema
});

type Step3FormData = {
    [Step3FormDataFields.Password]: string;
    [Step3FormDataFields.RepeatPassword]: string;
    [Step3FormDataFields.Captcha]: string;
};

interface SignupStep3PasswordProps {
    mail: string;
    cuit: string;
}

export default function SignupStep3Password({mail, cuit}: SignupStep3PasswordProps) {
    const theme = useTheme();
    const mobileView = useMediaQuery(theme.breakpoints.down('sm'));
    const {addSnackbarError, addSnackbarWarning} = useSnackbarActions();
    const {showLoader, hideLoader} = useLoaderActions();
    const navigate = useNavigate();

    const [checkedTerms, setCheckedTerms] = React.useState<boolean>(false);
    const [checkedPolicies, setCheckedPolicies] = React.useState<boolean>(false);
    const [resetCaptcha, setResetCaptcha] = React.useState<boolean>(false);

    const {
        control,
        handleSubmit,
        watch,
        setValue
    } = useForm<Step3FormData>({resolver: yupResolver(schemaStep3)});

    const watchPassword = watch(Step3FormDataFields.Password);
    const watchRepeatPassword = watch('repeatPassword');

    const onSubmit = async (data: Step3FormData) => {
        if (!checkedTerms || !checkedPolicies) {
            addSnackbarWarning('Debés aceptar los términos y condiciones y las políticas de privacidad');
            return;
        }
        showLoader();
        try {
            const {HttpUser, HttpPersonNosis} = await import('../../../http/index');
            const {userStorage} = await import('../../../util/localStorage/userStorage');
            const {HttpAxiosRequest} = await import('../../../http/httpAxiosBase');
            const {HttpAxiosRequestPublicBases} = await import('../../../http/httpAxiosPublicBasesBase');

            const responsePublicBases = 
                await HttpPersonNosis.synchronizeWithNosisAndGetPersonId(cuit, ModuleCodes.UserRegistration);

            if (!responsePublicBases[PersonConsultantResponseDTOFields.Valid]) {
                addSnackbarError(responsePublicBases[PersonConsultantResponseDTOFields.DescriptionState]);
                setValue(Step3FormDataFields.Captcha, '');
                setResetCaptcha(true);
                return;
            }

            const response = await HttpUser.newUser({
                [NewUserRequestFields.Mail]: mail,
                [NewUserRequestFields.CUIT]: cuit,
                [NewUserRequestFields.Password]: data.password,
                [NewUserRequestFields.PhoneNumber]: '',
                [NewUserRequestFields.PhoneCode]: '',
                [NewUserRequestFields.Captcha]: data.captcha
            });

            userStorage.removeFromStorage();

            if (!response[NewUserResponseFields.HasError]) {
                //@ts-ignore  
                window.dataLayer.push({
                    event: "signup-finished"
                });

                const accessToken = response.accessToken;
                const refreshToken = response.refreshToken;

                await userStorage.save(
                    response[NewUserResponseFields.UserId],
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

                HttpAxiosRequest.refreshToken(accessToken, refreshToken);
                HttpAxiosRequestPublicBases.refreshToken(accessToken, refreshToken);

                const encodedMail = encodeURIComponent(mail);

                navigate({
                    pathname: '/signup/confirmation',
                    search: `?mail=${encodedMail}`
                });
            }
        } catch (err) {
            addSnackbarError('Hubo un problema al registrar tu cuenta. Por favor, intentalo de nuevo y, si el error continúa, contactanos');
            setValue(Step3FormDataFields.Captcha, '');
            setResetCaptcha(true);
            
            LoggerService.log({
                level: LogLevels.Error,
                // @ts-ignore
                detail: 'Frontend error: ' + (err.stack || "Stack trace del error no disponible" + (err || "")),
            });
        } finally {
            hideLoader();
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
                <Stack spacing={0.75}>
                    <TypographyBase variant="eyebrow2" fontWeight={600} color="primary">
                        CONTRASEÑA
                    </TypographyBase>
                    <Typography variant="h4" fontWeight={600}>
                        Creá una contraseña segura
                    </Typography>
                </Stack>
                <Stack spacing={3}>
                    <ControlledTextPasswordFieldFilled
                        fullWidth
                        control={control}
                        name={Step3FormDataFields.Password}
                        label="Contraseña"
                        placeholder={"Ingresá al menos 8 caracteres"}
                    />
                    <ControlledTextPasswordFieldFilled
                        fullWidth
                        control={control}
                        name={Step3FormDataFields.RepeatPassword}
                        label="Repetir Contraseña"
                        placeholder={"Ingresá al menos 8 caracteres"}
                    />
                </Stack>
                <Stack>
                    <Typography fontFamily='Geist' fontWeight={600} fontSize={16}>
                        Tu contraseña debe contener
                    </Typography>
                    <PasswordRulesList password={watchPassword}/>
                </Stack>
                <Divider/>
                <Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Checkbox checked={checkedTerms} onClick={() => setCheckedTerms(!checkedTerms)}/>
                        <Typography fontSize={14}>
                            He leído y <strong>Acepto </strong> los{' '}
                            <DialogPreviewFileWrapper
                                fileUrl={window.APP_CONFIG[AppConfigFields.TermsAndConditionsURL]}
                                titleDialog="Términos y Condiciones de LUC"
                            >
                                <Link underline={'none'}>Términos y Condiciones</Link>
                            </DialogPreviewFileWrapper>
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Checkbox checked={checkedPolicies} onClick={() => setCheckedPolicies(!checkedPolicies)}/>
                        <Typography fontSize={14}>
                            He leído y <strong>Acepto </strong> las{' '}
                            <DialogPreviewFileWrapper
                                fileUrl={window.APP_CONFIG[AppConfigFields.PrivacyPoliciesUserURL]}
                                titleDialog="Políticas de Privacidad y Seguridad de datos"
                            >
                                <Link underline={'none'}>Políticas de Privacidad y Seguridad de datos</Link>
                            </DialogPreviewFileWrapper>
                        </Typography>
                    </Stack>
                </Stack>
                <ControlledReCaptcha
                    control={control}
                    reset={resetCaptcha}
                    setReset={setResetCaptcha}
                    name={Step3FormDataFields.Captcha}
                />
                <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                    <Button id={ButtonIdCreateUser}
                            type="submit"
                            variant="contained"
                            color="primary"
                            size="medium"
                            fullWidth={mobileView}
                            disabled={!watchPassword || !watchRepeatPassword}
                    >
                        Crear cuenta
                    </Button>
                </Box>
            </Stack>
        </form>
    );
}
