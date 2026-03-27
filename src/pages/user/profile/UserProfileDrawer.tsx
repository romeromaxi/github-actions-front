import React, {useEffect, useState} from "react";
import {Button, IconButton, Stack, Switch, TextField} from "@mui/material";
import useAxios from "hooks/useAxios";
import {useUser} from "hooks/contexts/UserContext";
import {AppRoutesDefinitions, useAppNavigation} from "hooks/navigation";
import {stringFormatter} from "util/formatters/stringFormatter";
import { LogOutIcon, HeadsetIcon, PencilIcon } from "lucide-react";
import {Module} from "types/form/login/login-enum";
import {HttpUser} from "http/user/index";
import {BaseResponseFields} from "types/baseEntities";
import {useSnackbarActions} from "hooks/useSnackbarActions";
import CompanyLabelWithValueComponent from "pages/companyFile/company/components/CompanyLabelWithValueComponent";
import DrawerBase from "components/misc/DrawerBase";
import LabelFormBase from "components/forms/LabelFormBase";
import {UserModelView, UserModelViewFields} from "types/user";
import ChangePasswordDrawer from "../changePassword/ChangePasswordDrawer";
import ChangePersonalDataDrawer from "../PersonalData/ChangePersonalDataDrawer";
import {PinConfirmationMode} from "../../../types/user/userAuth-enum";

interface UserProfileDrawerProps {
    open: boolean;
    onClose: () => void;
}

function UserProfileDrawer(props: UserProfileDrawerProps) {
    const { user, displayName, logout } = useUser();
    const { navigate } = useAppNavigation();
    const { addSnackbarSuccess } = useSnackbarActions();
    const { fetchData } = useAxios();

    const isUserOfferer = user?.userType === Module.Offerer;
    const [userView, setUser] = useState<UserModelView>();
    const [reload, setReload] = useState<boolean>(true);
    const [allowNotifications, setAllowNotifications] = useState<boolean>(false);
    const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);
    const [pinConfirmation, setPinConfirmation] = useState<PinConfirmationMode>();
    
    const goToContactLuc = () => navigate(AppRoutesDefinitions.LucContactPage);

    const onEditPassword = () => setOpenChangePassword(true);

    const onCloseEditPassword = () => setOpenChangePassword(false);


    const onEditPhoneNumber = () => setPinConfirmation(PinConfirmationMode.Phone);
    
    const onCloseEditPersonalData = () => setPinConfirmation(undefined);

    const onSubmitEditPersonalData = () => {
        searchDataUser()
        setPinConfirmation(undefined);
    };

    const actionsDrawer = (
        <Stack direction={'row'} justifyContent={'space-between'}>
            <Button color={'error'}
                    startIcon={<LogOutIcon />}
                    onClick={logout}
            >
                Cerrar sesión
            </Button>
            <Button color={'secondary'}
                    variant={'outlined'}
                    startIcon={<HeadsetIcon />}
                    onClick={goToContactLuc}
            >
                Necesito Ayuda
            </Button>
        </Stack>
    )

    const searchDataUser = () => {
        setUser(undefined);
            
        HttpUser.getUserDataLogged().then((responseUser) => {
            setUser(responseUser);
            setReload(false);
            setAllowNotifications(responseUser[UserModelViewFields.AllowMailNotifications])
        });
    };

    useEffect(() => {
        if (reload) searchDataUser();
    }, [reload]);
    
    const onSubmitAllowNotifications = (e: React.ChangeEvent<HTMLInputElement>) => {
        fetchData(
            () => HttpUser.insertNotifications(!allowNotifications),
            true
        ).then((r) => {
            if (!r[BaseResponseFields.HasError]){
                if (!allowNotifications) {
                    addSnackbarSuccess('A partir de ahora vas a recibir notificaciones vía mail')
                } else {
                    addSnackbarSuccess('A partir de ahora vas a dejar de recibir notificaciones vía mail')
                }
            }
        })
        setAllowNotifications(!allowNotifications)
    }
    
    return (
        <DrawerBase show={props.open}
                    onCloseDrawer={props.onClose}
                    action={actionsDrawer}
                    title={stringFormatter.toTitleCase(displayName) || ''}
                    subtitle={stringFormatter.formatCuit(user?.cuit)}
        >
            <Stack spacing={4}>
                <Stack spacing={1.25}>
                    <LabelFormBase label={"Mail"} />
                    
                    <TextField variant={'filled'}
                               size={'small'}
                               value={userView?.[UserModelViewFields.Mail] || '-'}
                               disabled
                    />
                </Stack>

                <Stack spacing={1.25}>
                    <LabelFormBase label={"Teléfono"} />
                    
                    <TextField variant={'filled'}
                               size={'small'}
                               value={
                                   stringFormatter.phoneNumberWithAreaCode(
                                       userView?.[UserModelViewFields.AreaCode] ? userView[UserModelViewFields.AreaCode].toString() : undefined,
                                       userView?.[UserModelViewFields.PhoneNumber] ? userView[UserModelViewFields.PhoneNumber].toString() : undefined
                                   )
                               }
                               InputProps={{
                                   endAdornment:
                                       <IconButton size={'small'}
                                                   onClick={onEditPhoneNumber}
                                                   color={'primary'}
                                                   sx={{cursor: 'pointer !important'}}
                                       >
                                           <PencilIcon />
                                       </IconButton>
                               }}
                               disabled
                    />
                </Stack>

                <Stack spacing={1.25}>
                    <LabelFormBase label={"Contraseña"} />
                    
                    <TextField variant={'filled'}
                               size={'small'}
                               value={'*********'}
                               InputProps={{
                                   endAdornment: 
                                       <Button color={'primary'}
                                               variant={'text'}
                                               size={'small'}
                                               sx={{cursor: 'pointer !important'}}
                                               onClick={onEditPassword}
                                               fullWidth
                                       >
                                           Cambiar contraseña 
                                       </Button>
                               }}
                               disabled
                    />
                </Stack>
            </Stack>
            
            {
                !isUserOfferer &&
                <CompanyLabelWithValueComponent label={'Recibir notificaciones por mail'} value={
                    <Switch checked={allowNotifications}
                            onChange={onSubmitAllowNotifications}
                            size={'small'}
                    />
                } />
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
        </DrawerBase>
    )
}

export default UserProfileDrawer;