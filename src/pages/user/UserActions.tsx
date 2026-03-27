import React, { useState } from 'react';
import { LogInOrSignUpProcessParts } from '../../types/form/login/login-enum';
import { Grid, Stack } from '@mui/material';
import { DefaultStylesButton } from '../../components/buttons/Buttons';
import LogInDrawer from './LogInDrawer';
import { userStorage } from '../../util/localStorage/userStorage';
import UserWelcome from './UserWelcome';
import { useNavigate } from 'react-router-dom';
import {HttpAuth} from "../../http";

interface UserActionsProps {}

function UserActions({}: UserActionsProps) {
  const navigate = useNavigate();
  const [loginDialogOpen, setLoginDialogOpen] = useState<boolean>(false);
  const [activeForm, setActiveForm] = useState<LogInOrSignUpProcessParts>(
    LogInOrSignUpProcessParts.Login,
  );

  const routeChange = () => {
    navigate('/user/home');
  };

  return (
    <React.Fragment>
      {userStorage.getUserId()}
      <Grid item container xs={12} justifyContent="flex-end">
        {!userStorage.getUserId() ? (
          <Stack direction="row" alignItems="flex-start" gap={1} sx={{ mr: 1 }}>
            <DefaultStylesButton
              onClick={() => {
                setActiveForm(LogInOrSignUpProcessParts.Login);
                setLoginDialogOpen(true);
              }}
            >
              Acceso
            </DefaultStylesButton>
            <DefaultStylesButton
              onClick={() => {
                setActiveForm(LogInOrSignUpProcessParts.Signup);
                setLoginDialogOpen(true);
              }}
            >
              Registro
            </DefaultStylesButton>
          </Stack>
        ) : (
          <Grid item xs={6}>
            <UserWelcome />
          </Grid>
        )}
      </Grid>

      {loginDialogOpen && (
        <LogInDrawer
          onLoginOrRegister={routeChange}
          formPart={activeForm}
          title={
            activeForm === LogInOrSignUpProcessParts.Login
              ? 'Acceder'
              : 'Registro'
          }
          open={loginDialogOpen}
          onClose={() => setLoginDialogOpen(false)}
          fnAuthenticateUser={HttpAuth.authenticateUser}
          maxWidth="xs"
        />
      )}
    </React.Fragment>
  );
}

export default UserActions;
