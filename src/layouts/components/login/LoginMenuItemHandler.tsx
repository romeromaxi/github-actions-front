import React, { useState } from 'react';
import { MenuItem } from '@mui/material';
import LogInDrawer from 'pages/user/LogInDrawer';

import { userStorage } from 'util/localStorage/userStorage';
import { useModuleNavigate } from 'hooks/useModuleNavigate';
import { LogInProcessParts, Module } from 'types/form/login/login-enum';
import { useAction } from 'hooks/useAction';
import { createSearchParams, useNavigate } from 'react-router-dom';
import {HttpAuth} from "../../../http";

function LoginMenuItemHandler() {
  const { snackbarWarning, setProfile } = useAction();

  const isLoggedIn = !!userStorage.get();
  const userType = userStorage.getUserType();
  const navigate = useNavigate();
  const moduleNavigate = useModuleNavigate();
  const [module, setModule] = useState<Module>(userType || Module.None);
  const [logInActive, setLogInActive] = useState<boolean>(false);

  const onLogIn = () => {
    const user = userStorage.get();
    const userTypeLogin = user?.userType;

    setLogInActive(false);

    if (user && userTypeLogin === module) {
      if (user.lackConfirmation) {
        const params = { mail: user.mail };

        navigate({
          pathname: '/signup/confirmation',
          search: `?${createSearchParams(params)}`,
        });
      } else moduleNavigate(module);
    } else {
      userStorage.removeFromStorage();
      setProfile(undefined);
      snackbarWarning(
        'El usuario ingresado no corresponde a la sección solicitada',
      );
    }
  };

  const onRegister = () => setLogInActive(false);

  const openLoginDialog = (loginModule: Module) => {
    setModule(loginModule);
    setLogInActive(true);
  };

  const openOffererDialog = () => openLoginDialog(Module.Offerer);

  return (
    <>
      {!isLoggedIn || (module && userType !== module) ? (
        <MenuItem
          onClick={openOffererDialog}
          sx={{ color: 'black', fontSize: '1.5rem' }}
        >
          OFERENTES
        </MenuItem>
      ) : (
        <></>
      )}

      {logInActive && (
        <LogInDrawer
          onLogin={onLogIn}
          onRegister={onRegister}
          formPart={LogInProcessParts.Login}
          title={'Acceder'}
          open={logInActive}
          onClose={() => setLogInActive(false)}
          allowsRegistration={module === Module.Company}
          fnAuthenticateUser={HttpAuth.authenticateUser}
        />
      )}
    </>
  );
}

export default LoginMenuItemHandler;
