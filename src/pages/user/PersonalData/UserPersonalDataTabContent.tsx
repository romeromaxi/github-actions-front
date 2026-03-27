import {Button, Card, CardContent, CardHeader, Skeleton, Stack, Switch, Typography} from "@mui/material";
import {BaseIconWrapper, WrapperIcons} from "../../../components/icons/Icons";
import {SealCheck, User} from "@phosphor-icons/react";
import {DefaultStylesButton} from "../../../components/buttons/Buttons";
import React, {useEffect, useState} from "react";
import {UserModelView, UserModelViewFields} from "../../../types/user";
import {HttpUser} from "../../../http";
import {userStorage} from "../../../util/localStorage/userStorage";
import {Module} from "../../../types/form/login/login-enum";
import {ValidationStatesType} from "../../../types/person/personEnums";
import ValidateUserIdentityDialog from "../components/ValidateUserIdentityDialog";
import CompanyLabelWithValueComponent from "../../companyFile/company/components/CompanyLabelWithValueComponent";
import {stringFormatter} from "../../../util/formatters/stringFormatter";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {PinConfirmationMode} from "../../../types/user/userAuth-enum";
import ChangePasswordDrawer from "../changePassword/ChangePasswordDrawer";
import ChangePersonalDataDrawer from "./ChangePersonalDataDrawer";
import useAxios from "../../../hooks/useAxios";
import {BaseResponseFields} from "../../../types/baseEntities";
import {useAction} from "../../../hooks/useAction";


interface UserPersonalDataTabContentProps {
    showMailToggle?: boolean;
}

const UserPersonalDataTabContent = ({showMailToggle} : UserPersonalDataTabContentProps) => {
    const [user, setUser] = useState<UserModelView>();
    const [showValidateDialog, setShowValidateDialog] = useState<boolean>(false);
    const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);
    const [pinConfirmation, setPinConfirmation] = useState<PinConfirmationMode>();
    const [allowNotifications, setAllowNotifications] = useState<boolean>(false)
    const {fetchData} = useAxios()
    const {snackbarSuccess} = useAction()

    const onEditPassword = () => setOpenChangePassword(true);

    const onCloseEditPassword = () => setOpenChangePassword(false);

    const onCloseEditPersonalData = () => setPinConfirmation(undefined);

    const onSubmitEditPersonalData = () => {
        searchDataUser()
        setPinConfirmation(undefined);
    };

    const onEditPhoneNumber = () => setPinConfirmation(PinConfirmationMode.Phone);


    const openValidateDialog = () => setShowValidateDialog(true);

    const closeValidateDialog = () => setShowValidateDialog(false);

    const searchDataUser = () => {
        setUser(undefined);

        HttpUser.getUserDataLogged().then((responseUser) => {
            setUser(responseUser);
            showMailToggle && setAllowNotifications(responseUser[UserModelViewFields.AllowMailNotifications])
        });
    };

    useEffect(() => {
        searchDataUser();
    }, []);
    
    const onSubmitAllowNotifications = (e: React.ChangeEvent<HTMLInputElement>) => {
        fetchData(
            () => HttpUser.insertNotifications(!allowNotifications),
            true
        ).then((r) => {
            if (!r[BaseResponseFields.HasError]){
                if (!allowNotifications) {
                    snackbarSuccess('A partir de ahora vas a recibir notificaciones vía mail')
                } else {
                    snackbarSuccess('A partir de ahora vas a dejar de recibir notificaciones vía mail')
                }
            }
        })
        showMailToggle && setAllowNotifications(!allowNotifications)
    }
    
    return (
        <React.Fragment>
            {
                user ?
                    <Stack spacing={2}>
                        <Card>
                            <CardHeader title={
                                <Stack direction='row' alignItems='center' spacing={2}>
                                    <BaseIconWrapper Icon={User} size={'md'} bg={'#F7FAFC'} />
                                    <Typography variant={'h4'} fontWeight={500}>Mi Perfil</Typography>
                                    {user[UserModelViewFields.ValidationIdentityStatusCode] === ValidationStatesType.Validated &&
                                        <WrapperIcons Icon={SealCheck} size={'sm'} />
                                    }
                                </Stack>
                            }
                                        action={[
                                            ValidationStatesType.LoadProcess,
                                            ValidationStatesType.Returned,
                                        ].includes(user[UserModelViewFields.ValidationIdentityStatusCode]) && (
                                            <DefaultStylesButton onClick={openValidateDialog} size={'small'}>
                                                Valida ahora
                                            </DefaultStylesButton>
                                        )}
                            />
                        </Card>
                        <Card>
                            <CardHeader title={'Información de usuario'} />
                            <CardContent>
                                <Stack spacing={1}>
                                    <CompanyLabelWithValueComponent label={'Mail'} value={user[UserModelViewFields.Mail]} />
                                    <CompanyLabelWithValueComponent label={'Teléfono'} value={
                                        <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                            <TypographyBase variant={'label'} fontWeight={500}>
                                                {stringFormatter.phoneNumberWithAreaCode(
                                                    user[UserModelViewFields.AreaCode] ? user[UserModelViewFields.AreaCode].toString() : undefined,
                                                    user[UserModelViewFields.PhoneNumber] ? user[UserModelViewFields.PhoneNumber].toString() : undefined
                                                )}
                                            </TypographyBase>
                                            <Button size={'small'} variant={'outlined'} color={'secondary'} onClick={onEditPhoneNumber}>Editar</Button>
                                        </Stack>
                                    }
                                    />
                                    <CompanyLabelWithValueComponent label={'Contraseña'} value={
                                        <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                            <TypographyBase variant={'label'} fontWeight={500}>
                                                ***********
                                            </TypographyBase>
                                            <Button size={'small'} variant={'outlined'} color={'secondary'} onClick={onEditPassword}>Editar</Button>
                                        </Stack>
                                    } />
                                    {
                                        showMailToggle &&
                                        <CompanyLabelWithValueComponent label={'Recibir notificaciones por mail'} value={
                                            <Switch checked={allowNotifications} 
                                                    onChange={onSubmitAllowNotifications} 
                                                    size={'small'}
                                            />
                                        }
                                        />
                                    }
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                    :
                    <Stack spacing={2}>
                        <Card>
                            <CardContent>
                                <Stack direction="row" alignItems={'center'} spacing={4}>
                                    <Skeleton variant="circular" width={100} height={100} />
                                    <Stack spacing={2} sx={{ width: '90% !important' }}>
                                        <Skeleton sx={{ width: '20% !important' }} />
                                        <Skeleton width={'100% !important'} />
                                        <Skeleton width={'100% !important'} />
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                        {userStorage.getUserType() === Module.Company && (
                        <Card>
                            <CardContent>
                                <Skeleton sx={{ width: '100%' }} height="30px" />
                            </CardContent>
                        </Card>
                        )}
                    </Stack>
            }
            <ChangePasswordDrawer
                show={openChangePassword}
                onCloseDrawer={onCloseEditPassword}
                onFinishProcess={onCloseEditPassword}
            />

            <ChangePersonalDataDrawer
                show={!!pinConfirmation}
                onCloseDrawer={onCloseEditPersonalData}
                onFinishProcess={onSubmitEditPersonalData}
                pinMode={pinConfirmation ?? PinConfirmationMode.Phone}
            />
            <ValidateUserIdentityDialog
                open={showValidateDialog}
                onClose={closeValidateDialog}
                onReload={searchDataUser}
            />
        </React.Fragment>
    )
}


export default UserPersonalDataTabContent