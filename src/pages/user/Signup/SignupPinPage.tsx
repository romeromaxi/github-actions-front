import React, {useCallback, useEffect, useState} from 'react';
import {Box, Card, CardContent, Link, Stack, Typography, useMediaQuery, useTheme} from '@mui/material';
import {ConfirmButton, SendButton, UpdateButton} from 'components/buttons/Buttons';
import {useLocation, useNavigate, useSearchParams} from 'react-router-dom';
import {userStorage} from 'util/localStorage/userStorage';
import {HttpPerson, HttpUser} from 'http/index';
import {
    LinkPersonToUserRequest,
    LinkPersonToUserRequestFields,
    UserConfirmations,
    UserConfirmationsFields
} from 'types/user';
import {Skeleton} from '@mui/lab';
import {useModuleNavigate} from 'hooks/useModuleNavigate';
import {Module} from 'types/form/login/login-enum';
import {useAction} from 'hooks/useAction';
import {EntityWithIdFields} from 'types/baseEntities';
import useAxios from 'hooks/useAxios';
import {NosisMainDataResponseFields} from "../../../types/person/personData";
import CuitChangeForm from "../PersonalData/CuitChangeForm";
import DrawerBase from "../../../components/misc/DrawerBase";
import {PersonTypes} from "../../../types/person/personEnums";
import {useUser} from "../../../hooks/contexts/UserContext";
import {WrapperIcons} from "../../../components/icons/Icons";
import {PencilSimple} from "phosphor-react";
import PinFormNew from "./PinFormNew";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {ModuleCodes} from "../../../types/general/generalEnums";

function SignupPinPage() {
    const {reloadProfile, reloadUserSummary, showLoader, hideLoader, snackbarError} = useAction();
    const {fetchData} = useAxios();
    const {refreshUser} = useUser();

    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down(800));
    const moduleNavigate = useModuleNavigate(Module.Company);
    const user = userStorage.get();
    const location = useLocation();
    const state = location.state as { prevPathname?: string };
    let [searchParams] = useSearchParams();
    const userMail = searchParams.get('mail') || '';
    const redirect = searchParams.get('goto') || '';
    const navigate = useNavigate();
    const [userData, setUserConfirmation] = useState<UserConfirmations>();
    const [refreshPin, setRefreshPin] = useState<boolean>(false);
    const [openMailDrawer, setOpenMailDrawer] = useState<boolean>(false);
    const receiveNotifications = true;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isProcessingConfirmation, setIsProcessingConfirmation] = useState(false);

    useEffect(() => {
        if (isProcessingConfirmation) return;
        if (!userMail || (user && user.confirmedMail)) {
            navigate('/');
        }
    }, [userMail, user, navigate, isProcessingConfirmation]);

    const getUserConfirmation = useCallback(() => {
        if (!userMail || isLoading) {
            return;
        }

        setIsLoading(true);
        setUserConfirmation(undefined);
        HttpUser.getUserConfirmation(userMail).then((confirmationResponse) => {
            if (
                confirmationResponse[UserConfirmationsFields.ConfirmedMail] &&
                confirmationResponse[UserConfirmationsFields.ConfirmedPhoneNumber] &&
                confirmationResponse[UserConfirmationsFields.ConfirmedPerson]
            ) {
                userStorage.setDataConfirmed(
                    confirmationResponse[UserConfirmationsFields.ConfirmedMail],
                    confirmationResponse[UserConfirmationsFields.ConfirmedPhoneNumber],
                    confirmationResponse[UserConfirmationsFields.ConfirmedPerson],
                );
                moduleNavigate();
            } else {
                setUserConfirmation(confirmationResponse);
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }, [userMail, isLoading, moduleNavigate]);

    useEffect(() => {
        getUserConfirmation();
    }, []);

    if (!userMail || (user && user.confirmedMail)) {
        return null;
    }

    const onUpdateMail = (newMail: string) => {
        const newUrl = `/signup/confirmation?mail=${newMail}`;
        window.history.replaceState(null, '', newUrl);
    };

    const onClickContinueButton = () => {
        setIsProcessingConfirmation(true);

        fetchData(
            () => HttpUser.completeRegistration(userData[EntityWithIdFields.Id], receiveNotifications),
            true
        ).then(async () => {
            userStorage.setDataConfirmed(true, true, true);
            reloadProfile();
            reloadUserSummary();
            userStorage.setFullName(
                userData?.[UserConfirmationsFields.Lastname]
            );
            await refreshUser();
            if (state && state.prevPathname) {
                const prevPathname = state.prevPathname;
                if (prevPathname.includes('market')) navigate('/market/landing');

                if (prevPathname.includes('casfog') && redirect && redirect !== '')
                    navigate(redirect);
            } else moduleNavigate(Module.Company);
        }).catch(() => {
            setIsProcessingConfirmation(false);
        });
    };

    const openDrawer = () => setDrawerOpen(true);

    const closeDrawer = () => setDrawerOpen(false);

    const onChangeCuit = (newCuit: string) => {
        showLoader();
        HttpPerson.getNosisData(newCuit ?? '', ModuleCodes.UserRegistration)
            .then((nosisResponse) => {
                if (nosisResponse[NosisMainDataResponseFields.PersonTypeCode] === PersonTypes.Physical) {
                    const linkPerson: LinkPersonToUserRequest = {
                        [LinkPersonToUserRequestFields.ModuleCode]: 1,
                        [LinkPersonToUserRequestFields.OriginCode]: 1,
                        [LinkPersonToUserRequestFields.BusinessName]:
                            nosisResponse[NosisMainDataResponseFields.BusinessName],
                        [LinkPersonToUserRequestFields.CUIT]: newCuit,
                        [LinkPersonToUserRequestFields.LastName]:
                            nosisResponse[NosisMainDataResponseFields.LastName],
                        [LinkPersonToUserRequestFields.FirstName]:
                            nosisResponse[NosisMainDataResponseFields.FirstName],
                        [LinkPersonToUserRequestFields.PersonTypeCode]:
                            nosisResponse[NosisMainDataResponseFields.PersonTypeCode],
                        [LinkPersonToUserRequestFields.Gender]:
                            nosisResponse[NosisMainDataResponseFields.Gender],
                        [LinkPersonToUserRequestFields.PhoneNumber]: '',
                    };
                    fetchData(
                        () => HttpUser.updatePerson(linkPerson),
                        false
                    )
                        .then(() => {
                            // @ts-ignore
                            const newUser: UserConfirmations | undefined = {
                                ...userData,
                                [UserConfirmationsFields.Lastname]: `${nosisResponse[NosisMainDataResponseFields.LastName]}, ${nosisResponse[NosisMainDataResponseFields.FirstName]}`,
                                [UserConfirmationsFields.CUIT]: newCuit
                            }
                            setUserConfirmation(newUser)
                        })
                        .finally(() => hideLoader())
                } else {
                    hideLoader()
                    snackbarError('El CUIT debe corresponder a una persona física')
                }
            })
            .catch(() => {
                snackbarError('Error al sincronizar o al relacionar persona con usuario');
                hideLoader();
            });
    };

    return (
        <Box sx={{width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center'}}>
            <Card variant={'onboarding'}>
                <CardContent sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <Stack spacing={3}>
                        <Stack spacing={1}>
                            <TypographyBase variant="eyebrow2" color="primary">CONFIRMACIÓN DE MAIL</TypographyBase>
                            <Typography variant="h4" fontWeight={600}>Ingresá el código que te enviamos por
                                correo</Typography>
                            <Stack spacing={1} direction="row" alignItems="center">
                                <Typography variant="body2" color={'text.lighter'}>Ingresá el código de 4 dígitos que
                                    enviamos a <Link underline={'none'}
                                                     onClick={() => setOpenMailDrawer(true)}>{userMail}</Link></Typography>
                                <Box onClick={() => setOpenMailDrawer(true)} sx={{cursor: 'pointer'}}>
                                    <WrapperIcons Icon={PencilSimple} color={'primary'}/>
                                </Box>
                            </Stack>
                        </Stack>
                        <Typography component={'div'} paddingLeft={isMobileScreenSize ? 0 : 4}>
                            {!!userData ? (
                                <PinFormNew onPinConfirmed={() => {
                                }}
                                            onReferentialDataChange={onUpdateMail}
                                            referentialData={userData[UserConfirmationsFields.Mail]}
                                            initConfirmed={userData[UserConfirmationsFields.ConfirmedMail]}
                                            isMobile={isMobileScreenSize}
                                            refreshPin={refreshPin}
                                            openMailDrawer={openMailDrawer}
                                            setOpenMailDrawer={setOpenMailDrawer}
                                            onFinishComplete={onClickContinueButton}
                                />
                            ) : (
                                <Skeleton/>
                            )}
                        </Typography>
                        <Stack direction={isMobileScreenSize ? "column-reverse" : "row"} justifyContent="space-between"
                               alignItems={'center'} spacing={2}>
                            <UpdateButton color="secondary" variant="outlined" onClick={() => setRefreshPin(true)}
                                          fullWidth={isMobileScreenSize}>
                                Volver a enviar código
                            </UpdateButton>
                            <ConfirmButton type="submit"
                                           form="pin-new-mail-form"
                                           fullWidth={isMobileScreenSize}
                            >
                                Verificar código
                            </ConfirmButton>
                        </Stack>
                        <DrawerBase
                            show={drawerOpen}
                            onCloseDrawer={closeDrawer}
                            title={'Cambio de CUIT'}
                            action={<SendButton type={'submit'} form={'form-change-current-cuit'}>Enviar</SendButton>}
                        >
                            <CuitChangeForm
                                onCuitChanged={(data) => {
                                    onChangeCuit(data.cuit);
                                    closeDrawer();
                                }}
                            />
                        </DrawerBase>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}

export default SignupPinPage;

