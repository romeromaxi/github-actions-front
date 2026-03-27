import {useNavigate, useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {HttpInvitations} from "../../../http/invitations";
import {useAction} from "../../../hooks/useAction";
import {BaseResponseFields} from "../../../types/baseEntities";
import {DialogAlertLUC} from "../../../components/dialog/DialogAlertLUC";
import {grey} from "@mui/material/colors";
import {Box, Button, Stack, Typography} from "@mui/material";
import {CompanyUserInvitation, CompanyUserInvitationFields} from "../../../types/user/userInvitation";
import {DefaultStylesButton} from "../../../components/buttons/Buttons";
import {userStorage} from "../../../util/localStorage/userStorage";
import {AuthorizationResponseFields, UserResponseInvitation, UserResponseInvitationFields} from "../../../types/user";
import {HttpAxiosRequest} from "../../../http/httpAxiosBase";
import {HttpAxiosRequestPublicBases} from "../../../http/httpAxiosPublicBasesBase";
import SignupResponsibleStepperForm from "./responsibleStepper/SignupResponsibleStepperForm";
import {AppConfigFields, AppConfigLogosFields} from "types/appConfigEntities";
import {HttpAuth} from "../../../http";
import LogInDrawer from "../LogInDrawer";
import {LogInProcessParts, Module} from "../../../types/form/login/login-enum";


const SignupResponsibleInvitationPage = () => {
    const [searchParams] = useSearchParams();
    const identifierWeb = searchParams.get('identifier') || '';
    const {showLoader, hideLoader, setProfile, snackbarWarning} = useAction()
    const navigate = useNavigate()
    
    const [errorDesc, setErrorDesc] = useState<string>()
    const [startSteps, setStartSteps] = useState<boolean>(false)
    const [queryData, setQueryData] = useState<UserResponseInvitation>()
    const [invitation, setInvitation] = useState<CompanyUserInvitation>()
    const [openLogin, setOpenLogin] = useState<boolean>(false)
    
    useEffect(() => {
        if (identifierWeb && identifierWeb !== '') {
            showLoader()
            HttpInvitations.insertQueryInvitation(identifierWeb).then((response) => {
                if (response[BaseResponseFields.HasError]) {
                    setErrorDesc(response[BaseResponseFields.ErrorDescription])
                    hideLoader()
                } else {
                    const accessToken = response[AuthorizationResponseFields.AccessToken];
                    const refreshToken = response[AuthorizationResponseFields.RefreshToken];
                    
                    setQueryData(response)
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
                    HttpInvitations.getInvitationByGuid(identifierWeb).then((r) => {
                        setInvitation(r)
                    }).finally(() => {
                        hideLoader()
                    })
                }
            }).catch(() => {
                navigate('/')
                hideLoader()
            })
        } else navigate('/')
    }, []);
    
    const onCloseErrorDialog = () => {
        navigate('/')
        setErrorDesc(undefined)
    }
    
    const onLogIn = () => {
        setErrorDesc(undefined)
        setOpenLogin(true)
    }
    
    const onAccess = () => {
        const user = userStorage.get();
        const userTypeLogin = user?.userType;

        if (!user || userTypeLogin !== Module.Company) {
            userStorage.removeFromStorage();
            setProfile(undefined);
            snackbarWarning(
                'El usuario ingresado no corresponde a la sección solicitada',
            );
        } else {
            navigate('/');
        }
    }
    
    return (
        <Stack gap={1} mt={8}>
            {
                invitation && !startSteps && queryData &&
                <Stack spacing={5} mt={4}>
                    <Box
                        component={'img'}
                        sx={{
                            height: 65,
                            width: 130,
                            m: '0 auto !important',
                        }}
                        src={window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full]}
                    />
                    <Stack spacing={1}>
                        <Typography fontSize={21} fontWeight={600} textAlign={'center'}>
                            {`Bienvenido/a ${queryData[UserResponseInvitationFields.BusinessName]}`}
                        </Typography>
                        <Typography fontSize={17} textAlign={'center'}>
                            {`Para responder la invitación de ${invitation[CompanyUserInvitationFields.OwnUserInvitationBusinessName]}, vamos a necesitar que completes tres sencillos pasos.`}
                        </Typography>
                    </Stack>
                    <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
                        <DefaultStylesButton onClick={() => setStartSteps(true)} sx={{ textAlign: 'center', justifyContent: 'center', width: '10%' }}>
                            Empezar
                        </DefaultStylesButton>
                    </Box>
                </Stack>
            }
            {
                invitation && startSteps && identifierWeb && queryData &&
                <SignupResponsibleStepperForm invitation={invitation} identifier={identifierWeb} userData={queryData}/>
            }
            {
                errorDesc &&
                <DialogAlertLUC open={!!errorDesc}
                                onClose={onCloseErrorDialog}
                >
                    <Stack spacing={3} alignItems={'center'}>
                        <Typography fontSize={14} color={grey[600]} fontWeight={600}>
                            {errorDesc}
                        </Typography>
                        <Button variant={'contained'} onClick={onLogIn} size={'small'}>
                            Acceder
                        </Button>
                    </Stack>
                </DialogAlertLUC>
            }
            <LogInDrawer
                formPart={LogInProcessParts.Login}
                title={'Ingresar'}
                open={openLogin}
                onClose={() => {
                    setOpenLogin(false)
                    navigate('/')
                }}
                onLogin={onAccess}
                fnAuthenticateUser={HttpAuth.authenticateUser}
            />
        </Stack>
    )
}


export default SignupResponsibleInvitationPage