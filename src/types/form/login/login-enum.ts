export enum LogInProcessParts {
  Login = 'login',
  Signup = 'signup',
  PassRecovery = 'passwordRecovery',
  MailRecovery = 'mailRecovery',
}

export enum SignUpProcessParts {
  MailAndPassword = 'mailAndPassword',
  Pin = 'pin',
  CUIT = 'cuit',
  Phone = 'phone',
}

export enum LogInOrSignUpProcessParts {
  Login = 'login',
  Signup = 'signup',
}

export enum Module {
  None = 0,
  Company = 1,
  Offerer = 2,
  Internal = 3,
  Market = 4,
}
