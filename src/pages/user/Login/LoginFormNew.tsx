import React, {useState} from "react";
import * as yup from "yup";
import {
    RequiredCaptchaSchema,
    RequiredMailSchema,
    RequiredStringSchema
} from "../../../util/validation/validationSchemas";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {Button, Stack, Typography, useMediaQuery} from "@mui/material";
import {NavsTabHorizontal} from "../../../components/navs/NavsTab";
import {ControlledTextFieldFilled, ControlledTextPasswordFieldFilled} from "../../../components/forms";
import {ControlledReCaptcha} from "../../../components/forms/ControlledReCaptcha";
import {AuthorizationRequest, AuthorizationResponseFields} from "../../../types/user";
import {LoaderBlockUI} from "../../../components/loader";
import {useUser} from "../../../hooks/contexts/UserContext";
import {useProfileActions} from "../../../hooks/useProfileActions";
import {useSnackbarActions} from "../../../hooks/useSnackbarActions";
import {Module} from "../../../types/form/login/login-enum";
import {useNavigate} from "react-router-dom";
import useSearchParamsEncrypted from "../../../hooks/useSearchParamsEncrypted";
import {useModuleNavigate} from "../../../hooks/useModuleNavigate";
import {useTheme} from "@mui/material/styles";
import {TypographyBase} from "../../../components/misc/TypographyBase";


interface LogInFormNewProps {
    onClickPasswordRecovery?: (...args: any[]) => void;
    onClickMailRecovery?: (...args: any[]) => void;
}


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


const LogInFormNew = ({
                          onClickPasswordRecovery,
                          onClickMailRecovery
                      }: LogInFormNewProps) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const isOfferer = window.location.toString().includes('offerer');
    const isInternal = window.location.toString().includes('internal');
    const { refreshUser } = useUser();
    const { setProfile } = useProfileActions();
    const { addSnackbarWarning, addSnackbarError } = useSnackbarActions();
    const [tabValue, setTabValue] = useState<number>(isOfferer ? 1 : 0);
    const [reset, resetCaptcha] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    
    const logInFormSchema = yup.object().shape({
        [LogInFormFields.Email]: RequiredMailSchema,
        [LogInFormFields.Password]: RequiredStringSchema,
        [LogInFormFields.Captcha]: RequiredCaptchaSchema,
    });

    const {control, handleSubmit, setValue} = useForm<LoginFormData>({
        resolver: yupResolver(logInFormSchema),
    })

    const [searchParams] = useSearchParamsEncrypted();
    const redirect = searchParams.get('redirect') || '';
    
    const moduleNavigate = useModuleNavigate()
    
    const routeDomNavigate = useNavigate();
    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        try {
            const { HttpAuth } = await import('../../../http/index');
            
            const credentials: AuthorizationRequest = {
                mail: data.mail,
                password: data.password,
                ipClient: '',
                captcha: data.captcha
            }
            
            const response = tabValue === 0 ?
                isInternal ?
                    await HttpAuth.authenticateQuaUser(credentials)
                    :
                    await HttpAuth.authenticateUser(credentials)
                    :
                    await HttpAuth.authenticateOffererUser(credentials);

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
                const updatedUser = await refreshUser();
                if (redirect && redirect !== '') {
                    routeDomNavigate(redirect);
                } else if (updatedUser?.lackConfirmation && updatedUser.mail) {
                    const encodedMail = encodeURIComponent(updatedUser.mail);
                    routeDomNavigate(`/signup/confirmation?mail=${encodedMail}`);
                } else if (updatedUser?.userType === Module.Offerer) {
                    moduleNavigate(Module.Offerer);
                } else {
                    moduleNavigate(Module.Company)
                }
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
    
    return (
        <Stack spacing={4}>
            <Stack direction={{ xs: 'column-reverse', sm: 'row' }}
                   justifyContent={'space-between'}
                   width={1}
            >
                <Stack spacing={0.75}>
                    <TypographyBase variant={'eyebrow2'} color="primary">INGRESÁ A LUC</TypographyBase>
                    <Typography variant="h4" fontWeight={600}>Accedé a tu cuenta</Typography>
                </Stack>
                {
                    !isOfferer && !isInternal &&
                    <Stack alignItems={'end'}>
                        <Button variant="text" size="small"
                                onClick={() => navigate('/signup')}
                        >
                            Crear un usuario gratis
                        </Button>
                    </Stack>
                }
            </Stack>
            {
                !isOfferer && !isInternal &&
                <NavsTabHorizontal lstTabs={[
                    {tabList: [
                            {label: 'Soy PyME', default: true, content: <></>},
                            {label: 'Soy Oferente', content: <></>}
                        ]}
                ]}
                                   fullWidth
                                   onChange={(num) => {
                                       setTabValue(num)
                                   }}
                                   alignLeft
                />
            }
            <Stack spacing={3}>
                <Stack spacing={2}>
                    <ControlledTextFieldFilled
                        fullWidth
                        control={control}
                        label="Email"
                        name={LogInFormFields.Email}
                    />
                    <Button
                        variant="text"
                        size="small"
                        onClick={onClickMailRecovery}
                    >
                        Olvidé mi usuario
                    </Button>
                </Stack>
                <Stack spacing={2}>
                    <ControlledTextPasswordFieldFilled
                        fullWidth
                        control={control}
                        label="Contraseña"
                        name={LogInFormFields.Password}
                    />
                    <Button
                        variant="text"
                        size="small"
                        onClick={onClickPasswordRecovery}
                    >
                        Olvidé mi contraseña
                    </Button>
                </Stack>
            </Stack>
            <Stack direction={{ xs: 'column', sm: "row"}}
                   justifyContent="space-between"
                   alignItems="center"
                   spacing={2}
            >
                <ControlledReCaptcha
                    control={control}
                    reset={reset}
                    setReset={resetCaptcha}
                    name={LogInFormFields.Captcha}
                />
                <Button variant="contained"
                        onClick={handleSubmit(onSubmit)}
                        fullWidth={isSmallScreen}>
                    {'Ingresar'}
                </Button>
            </Stack>
            {loading && <LoaderBlockUI />}
        </Stack>
    )
}


export default LogInFormNew;
