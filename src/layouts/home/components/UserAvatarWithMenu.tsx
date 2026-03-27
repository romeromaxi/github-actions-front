import {Box, Divider, IconButton, Menu, MenuItem, Stack, Tooltip, Typography,} from '@mui/material';
import React, {useEffect, useMemo, useState} from 'react';
import UserAvatarWithMenuStyles from './UserAvatarWithMenu.styles';
import {useNavigate} from 'react-router-dom';
import {userStorage} from 'util/localStorage/userStorage';
import {useAction} from 'hooks/useAction';
import LogInDrawer from '../../../pages/user/LogInDrawer';
import {LogInProcessParts, Module,} from '../../../types/form/login/login-enum';
import UserAvatar from './UserAvatar';
import VerifiedIcon from '@mui/icons-material/Verified';
import {ValidationStatesType} from '../../../types/person/personEnums';
import SafetyCheckRoundedIcon from '@mui/icons-material/SafetyCheckRounded';
import {useLogoutActions} from "hooks/useLogoutActions";
import {useUser} from "../../../hooks/contexts/UserContext";
import {AppRoutesDefinitions, useAppNavigation} from "../../../hooks/navigation";

function UserAvatarWithMenu() {
  const { setProfile } = useAction();
  const { executeLogoutActions } = useLogoutActions();
  const { logout } = useUser()
  
  const classes = UserAvatarWithMenuStyles();
  const routerDomNavigate = useNavigate();
  const { navigate } = useAppNavigation();
  const isLoggedIn = useMemo(() => userStorage.isLogged(), []);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [user, setUser] = useState(userStorage.get());

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const onViewProfile = () => {
    if (window.location.toString().includes('offerer')) {
      navigate(AppRoutesDefinitions.OffererProfile);
    } else if (window.location.toString().includes('internal')) {
      navigate(AppRoutesDefinitions.InternalProfile);
    } else {
      navigate(AppRoutesDefinitions.PymeProfile);
    }
  };
  const onSignOut = () => {
    executeLogoutActions()
      .finally(() => {
        const userType = userStorage.getUserType() ?? Module.None;
        logout().finally(() => {
          setProfile(undefined);
          
          switch (userType) {
            case Module.Internal:
              routerDomNavigate(`/internal/login/`);
              break;
            
            case Module.Offerer:
              const offererSlug = userStorage.getOffererSlug();
              if (!!offererSlug) routerDomNavigate(`/offerer/login/${offererSlug}`);
              else routerDomNavigate('/');
              
              break;
              
            case Module.None:
            case Module.Company:
            default:
              routerDomNavigate('/');
          }
        })
      })
  };

  useEffect(() => {
    const handleStorageUpdate = () => {
      const validateIdentityCode = userStorage.getValidatedIdentityCode();
      if (!!validateIdentityCode)
        setUser(userStorage.get());
    };

    const unsubscribe = userStorage.subscribe(handleStorageUpdate);
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Stack
        className={classes.containerUser}
        direction={'row'}
        alignItems={'center'}
        onClick={handleClick}
      >
        <Box>
          <Stack alignItems={'flex-end'}>
            <Typography
              fontWeight={500}
              fontSize={'.85rem'}
              sx={{ opacity: '.75' }}
              color={'black'}
            >
              Hola!
            </Typography>
            <Stack alignItems="center" spacing={1} direction="row">
              {user?.validationIdentityStatusCode ===
                ValidationStatesType.Validated &&
                user?.userType === Module.Company && (
                  <Tooltip title="Usuario validado" sx={{ zIndex: 2 }}>
                    <VerifiedIcon fontSize="small" color="primary" />
                  </Tooltip>
                )}
              {user?.validationIdentityStatusCode ===
                ValidationStatesType.PendingValidation &&
                user?.userType === Module.Company && (
                  <Tooltip
                    title="Estamos verificando tu identidad"
                    sx={{ zIndex: 2 }}
                  >
                    <SafetyCheckRoundedIcon fontSize="small" color="warning" />
                  </Tooltip>
                )}
              <Typography
                fontWeight={600}
                fontSize={'.85rem'}
                color={'black'}
                sx={{ zIndex: 2 }}
              >
                {userStorage.getDisplayName()}
              </Typography>
            </Stack>
          </Stack>
        </Box>
        <IconButton onClick={handleClick}>
          <UserAvatar hasMenu />
        </IconButton>
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        PaperProps={{
          className: classes.menuPaper,
        }}
      >
        <MenuItemProfile />
        <Divider className={classes.menuDivider} />
        {isLoggedIn ? (
          <>
            <MenuItemOptionBase onClick={onViewProfile}>
              Mi Perfil
            </MenuItemOptionBase>
            <Divider className={classes.menuDivider} />
            <MenuItemOptionBase onClick={onSignOut}>Salir</MenuItemOptionBase>
          </>
        ) : (
          <MenuItemOptionBase
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
    </>
  );
}

interface MenuItemOptionBaseProps {
  children: React.ReactNode | string;
  onClick?: () => void;
}

function MenuItemOptionBase(props: MenuItemOptionBaseProps) {
  return (
    <MenuItem disableRipple>
      <Box onClick={props.onClick}>{props.children}</Box>
    </MenuItem>
  );
}

function MenuItemProfile() {
  const user = userStorage.get();
  const classes = UserAvatarWithMenuStyles();

  return (
    <MenuItem disableTouchRipple disableRipple sx={{ padding: 0 }}>
      <Box>
        {!!user && (
          <Stack direction="row" spacing={2} alignItems={'center'}>
            <UserAvatar />

            <Stack direction="column">
              <Typography
                component="span"
                fontWeight={600}
                fontSize={'1.15rem'}
                className={classes.namePersonalData}
              >
                {user.fullName}
              </Typography>
            </Stack>
          </Stack>
        )}
      </Box>
    </MenuItem>
  );
}

export default UserAvatarWithMenu;
