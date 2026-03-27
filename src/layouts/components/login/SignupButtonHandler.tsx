import React, { useMemo, useState } from 'react';
import { DefaultStylesButton } from 'components/buttons/Buttons';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import LogInDrawer from 'pages/user/LogInDrawer';
import { LogInOrSignUpProcessParts, Module } from 'types/form/login/login-enum';
import { userStorage } from 'util/localStorage/userStorage';
import { useModuleNavigate } from 'hooks/useModuleNavigate';

function SignupButtonHandler() {
  const isLoggedIn = userStorage.isLogged(); //useMemo(() => userStorage.isLogged(), []);
  const navigate = useModuleNavigate();

  const [signUpActive, setSignUpActive] = useState<boolean>(false);

  const onSignUp = () => navigate(Module.None);

  return (
    <>
      {!isLoggedIn ? (
        <>
          <DefaultStylesButton
            color={'secondary'}
            onClick={() => setSignUpActive(true)}
            startIcon={<PersonAddOutlinedIcon />}
          >
            Registro
          </DefaultStylesButton>

          {signUpActive && (
            <LogInDrawer
              onLoginOrRegister={onSignUp}
              formPart={LogInOrSignUpProcessParts.Signup}
              title={'Registrarse'}
              open={signUpActive}
              onClose={() => setSignUpActive(false)}
            />
          )}
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default SignupButtonHandler;
