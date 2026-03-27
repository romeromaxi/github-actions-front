import {useAction} from "../../../hooks/useAction";
import {useNavigate} from "react-router-dom";
import React, {ReactNode, useState} from "react";
import {userStorage} from "../../../util/localStorage/userStorage";
import {Box, Button, IconButton, ListItemIcon, Menu, MenuItem, Stack, Typography} from "@mui/material";
import {LogInProcessParts, Module} from "../../../types/form/login/login-enum";
import UserAvatar from "./UserAvatar";
import LogInDrawer from "../../../pages/user/LogInDrawer";
import {WrapperIcons} from "../../../components/icons/Icons";
import {AppbarMenuDataItem, AppbarMenuDataItemFields} from "../../../types/menu/menuData";
import { SafetyComponent } from "../../../components/security";
import { GeneralConfigurationSecObjects, SecurityComponents, SideBarMenuItemsSecObjects } from "../../../types/security";
import {useUser} from "../../../hooks/contexts/UserContext";
import {AppRoutesDefinitions, useAppNavigation} from "../../../hooks/navigation";
import UserProfileDrawer from "../../../pages/user/profile/UserProfileDrawer";
import {BellRingIcon, LogOutIcon, MailIcon, SettingsIcon} from "lucide-react";

interface UserOptionMenu {
    id: string,
    label: string,
    Icon: React.ElementType,
    onclick: () => void,
    color?: string
}

interface UserAvatarWithMenuNewProps {
    additionalMenuItems?: ReactNode,
    menuItemsAsData?: AppbarMenuDataItem[],
    onlyOptionsMenu?: boolean
}

const UserAvatarWithMenuNew = ({menuItemsAsData, onlyOptionsMenu} : UserAvatarWithMenuNewProps) => {
    const { setProfile } = useAction();
    const { logout } = useUser()
    const isLoggedIn = userStorage.isLogged();
    const routerDomNavigate = useNavigate();
    const { navigate } = useAppNavigation();
    
    const [openDrawer, setOpenDrawer] = useState<boolean>(false);
    const userType = userStorage.getUserType();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [openProfile, setOpenProfile] = useState<boolean>(false);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) =>
        setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const showUserProfileDrawer = () => setOpenProfile(true);
    
    const closeUserProfileDrawer = () => setOpenProfile(false);
    
    const onViewProfile = () => {
        if (userType === Module.Offerer) {
            navigate(AppRoutesDefinitions.OffererProfile);
        } else if (userType === Module.Internal) {
            navigate(AppRoutesDefinitions.InternalProfile);
        } else {
            showUserProfileDrawer();
        }
        
        handleClose()
    };
    
    const onSignOut = () => {
        const wasInternal = userType == Module.Internal
        logout().then(() => {
            setProfile(undefined);
            const offererSlug = userStorage.getOffererSlug()
            if (!!offererSlug) routerDomNavigate(`/offerer/login/${offererSlug}`)
            else if (wasInternal) routerDomNavigate('/internal/login');
            else routerDomNavigate('/');
            handleClose()
        })
    };
    
    const goToContactLuc = () => {
        navigate(AppRoutesDefinitions.LucContactPage);
        handleClose();
    }
    
    const handleClickMenuData = (item: AppbarMenuDataItem) => {
        item[AppbarMenuDataItemFields.OnClick]()
        handleClose()
    }

    type SecurityComponentType = {
        componentName: SecurityComponents;
        objectName: GeneralConfigurationSecObjects | SideBarMenuItemsSecObjects;
    };
    
    const optionsMenu: UserOptionMenu[] = [
        {
            id: "btn-contactanos",
            label: "Contactanos",
            Icon: MailIcon,
            onclick: goToContactLuc
        },
        {
            id: "btn-profile",
            label: "Configuración y Perfil",
            Icon: SettingsIcon,
            onclick: onViewProfile
        },
        {
            id: "btn-cerrar-sesion",
            label: "Cerrar sesión",
            Icon: LogOutIcon,
            onclick: onSignOut,
            color: 'error'
        },
    ]
    
    return (
        <React.Fragment>
            {
                !onlyOptionsMenu ?
                    <IconButton onClick={handleClick}>
                        <UserAvatar hasMenu />
                    </IconButton>
                    :
                    <React.Fragment>
                        {
                            optionsMenu.map((option) => (
                                <Button variant={'appbar'}
                                        id={option.id}
                                        key={`key-options-${option.id}`}
                                        startIcon={<option.Icon />}
                                        onClick={option.onclick}
                                        size={'small'}
                                >
                                    {option.label}
                                </Button>
                            ))
                        }
                    </React.Fragment>
            }

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={undefined}
                transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                sx={{
                    marginTop: 9
                }}
            >
                <div></div>
                {isLoggedIn ? (
                    <Stack>
                        
                        {menuItemsAsData && menuItemsAsData.length > 0 &&
                            menuItemsAsData.map((item) => {
                                const safetyComponent = item[AppbarMenuDataItemFields.Component] as SecurityComponentType  | undefined;

                                return safetyComponent ? (
                                    <SafetyComponent
                                        key={item[AppbarMenuDataItemFields.Title]}
                                        componentName={safetyComponent.componentName}
                                        objectName={safetyComponent.objectName}
                                    >
                                        <MenuItemOptionBase 
                                            id={item[AppbarMenuDataItemFields.Id]} 
                                            onClick={() => handleClickMenuData(item)}
                                        >
                                            <Stack direction='row' alignItems='center' spacing={1} sx={item[AppbarMenuDataItemFields.Styles]}>
                                                <WrapperIcons Icon={item[AppbarMenuDataItemFields.Logo]} />
                                                <Typography>{item[AppbarMenuDataItemFields.Title]}</Typography>
                                            </Stack>
                                        </MenuItemOptionBase>
                                    </SafetyComponent>
                                ) : (
                                    <MenuItemOptionBase
                                        id={item[AppbarMenuDataItemFields.Id]}
                                        key={item[AppbarMenuDataItemFields.Title]}
                                        onClick={() => handleClickMenuData(item)}
                                    >
                                        <Stack direction='row' alignItems='center' spacing={1} sx={item[AppbarMenuDataItemFields.Styles]}>
                                            <WrapperIcons Icon={item[AppbarMenuDataItemFields.Logo]} />
                                            <Typography>{item[AppbarMenuDataItemFields.Title]}</Typography>
                                        </Stack>
                                    </MenuItemOptionBase>
                                );
                        })}


                        {
                            optionsMenu.map((option) => (
                                <MenuItem variant={'bold'} 
                                          id={option.id} 
                                          key={`key-item-${option.id}`} 
                                          onClick={option.onclick}
                                          color={option.color}
                                >
                                    <ListItemIcon>
                                        <WrapperIcons Icon={option.Icon} />
                                    </ListItemIcon>
                                    
                                    {option.label}
                                </MenuItem>
                            ))
                        }
                    </Stack>
                ) : (
                    <MenuItemOptionBase
                        id={"btn-registrate"}
                        onClick={() => {
                            setOpenDrawer(true);
                        }}
                    >
                        Registrarse
                    </MenuItemOptionBase>
                )}
            </Menu>
            {openDrawer && (
                <LogInDrawer
                    formPart={LogInProcessParts.Signup}
                    title={'Registro'}
                    open={openDrawer}
                    onClose={() => setOpenDrawer(false)}
                />
            )}
            
            <UserProfileDrawer open={openProfile} 
                               onClose={closeUserProfileDrawer}
            />
        </React.Fragment>
    );
}


interface MenuItemOptionBaseProps {
    id?: string,
    children: React.ReactNode | string;
    onClick?: () => void;
}

export function MenuItemOptionBase(props: MenuItemOptionBaseProps) {
    return (
        <MenuItem id={props.id} disableRipple>
            <Box onClick={props.onClick}>{props.children}</Box>
        </MenuItem>
    );
}

export default UserAvatarWithMenuNew