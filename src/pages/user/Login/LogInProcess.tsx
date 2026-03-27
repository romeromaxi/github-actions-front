import React from 'react';
import LogInForm from './LogInForm';
import SignUpProcess from '../Signup/SignUpProcess';
import PasswordRecoveryForm from './PasswordRecoveryForm';
import MailRecoveryForm from './MailRecoveryForm';
import { LogInProcessParts } from '../../../types/form/login/login-enum';
import {AuthorizationRequest, AuthorizationResponse} from "../../../types/user";

interface LogInProcessProps {
  onLogin: (...args: any[]) => void;
  onClickNewUser: () => void;
  allowsRegistration?: boolean;
  onClickPasswordRecovery: (...args: any[]) => void | undefined;
  onClickMailRecovery: (...args: any[]) => void | undefined;
  fnAuthenticateUser: (requestParams: AuthorizationRequest) => Promise<AuthorizationResponse>;
  activeForm: LogInProcessParts,
  setActiveForm: (form: LogInProcessParts) => void
}

function LogInProcess({
  onLogin,
  onClickNewUser,
  allowsRegistration,
  onClickPasswordRecovery,
  onClickMailRecovery,
  fnAuthenticateUser,
  activeForm,
  setActiveForm
}: LogInProcessProps) {
  const setPasswordRecovery = () =>
    setActiveForm(LogInProcessParts.PassRecovery);
  const setMailRecovery = () => setActiveForm(LogInProcessParts.MailRecovery);

  const formParts: { [key in LogInProcessParts]: JSX.Element } = {
    [LogInProcessParts.Login]: (
      <LogInForm
        onLogin={onLogin}
        onClickNewUser={onClickNewUser}
        onClickPasswordRecovery={
          onClickPasswordRecovery || setPasswordRecovery()
        }
        onClickMailRecovery={onClickMailRecovery || setMailRecovery()}
        allowsRegistration={allowsRegistration}
        fnAuthenticateUser={fnAuthenticateUser}
      />
    ),
    [LogInProcessParts.Signup]: (
      <SignUpProcess />
    ),
    [LogInProcessParts.PassRecovery]: (
      <PasswordRecoveryForm
        onClickReturn={() => setActiveForm(LogInProcessParts.Login)}
      />
    ),
    [LogInProcessParts.MailRecovery]: (
      <MailRecoveryForm
        onClickNewUser={onClickNewUser}
        onClickReturn={() => setActiveForm(LogInProcessParts.Login)}
      />
    ),
  };

  return <div>{formParts[activeForm]}</div>;
}

export default LogInProcess;
