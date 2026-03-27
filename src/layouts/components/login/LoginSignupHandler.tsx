import React, { useState } from 'react';
import { DefaultStylesButton } from '../../../components/buttons/Buttons';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import LogInDrawer from '../../../pages/user/LogInDrawer';
import {
  LogInOrSignUpProcessParts,
  Module,
} from '../../../types/form/login/login-enum';
import { Stack } from '@mui/material';
import { userStorage } from '../../../util/localStorage/userStorage';
import { useModuleNavigate } from '../../../hooks/useModuleNavigate';

function LoginSignupHandler() {
  const isLoggedIn = !!userStorage.get();
  const userType = userStorage.getUserType();
  const navigate = useModuleNavigate();
  const [module, setModule] = useState<Module>(userType || Module.None);
  const [logInActive, setLogInActive] = useState<boolean>(false);
  const [signUpActive, setSignUpActive] = useState<boolean>(false);

  function onLogIn() {
    navigate(module);
  }

  function onSignUp() {
    navigate(Module.None);
  }

  return (
    <div>
      {!isLoggedIn || (module && userType !== module) ? (
        <Stack direction={'row'} gap={1}>
          <DefaultStylesButton
            color={'secondary'}
            onClick={() => {
              setModule(Module.Company);
              setLogInActive(true);
            }}
            startIcon={<HowToRegIcon />}
          >
            Pymes
          </DefaultStylesButton>
          <DefaultStylesButton
            color={'secondary'}
            onClick={() => {
              setModule(Module.Offerer);
              setLogInActive(true);
            }}
            startIcon={<HowToRegIcon />}
          >
            Oferentes
          </DefaultStylesButton>
          <DefaultStylesButton
            color={'secondary'}
            onClick={() => {
              setModule(Module.Internal);
              setLogInActive(true);
            }}
            startIcon={<HowToRegIcon />}
          >
            QUA
          </DefaultStylesButton>

          {
            <DefaultStylesButton
              color={'primary'}
              onClick={() => setSignUpActive(true)}
              startIcon={<PersonAddOutlinedIcon />}
            >
              Registro
            </DefaultStylesButton>
          }

          {logInActive && (
            <LogInDrawer
              onLoginOrRegister={onLogIn}
              formPart={LogInOrSignUpProcessParts.Login}
              title={'Acceder'}
              open={logInActive}
              onClose={() => setLogInActive(false)}
            />
          )}
          {signUpActive && (
            <LogInDrawer
              onLoginOrRegister={onSignUp}
              formPart={LogInOrSignUpProcessParts.Signup}
              title={'Registro de usuario'}
              
              open={signUpActive}
              onClose={() => setSignUpActive(false)}
            />
          )}
        </Stack>
      ) : (
        <></>
      )}
    </div>
  );
}

export default LoginSignupHandler;
