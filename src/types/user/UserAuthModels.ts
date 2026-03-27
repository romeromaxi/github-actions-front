import { BaseRequest, BaseResponse } from '../baseEntities';

export enum AuthorizationRequestFields {
  Mail = 'mail',
  Password = 'password',
  ClientIp = 'ipClient',
  CaptchaToken = 'captcha'
}

export interface AuthorizationRequest {
  [AuthorizationRequestFields.Mail]: string;
  [AuthorizationRequestFields.Password]: string;
  [AuthorizationRequestFields.ClientIp]: string;
  [AuthorizationRequestFields.CaptchaToken]?: string;
}

export enum AuthorizationOffererRequestFields {
  OffererSlug = 'nombreAcceso'
}

export enum AuthorizationResponseFields {
  UserId = 'idUsuario',
  PersonId = 'idPersona',
  ProfileId = 'idPerfil',
  ProfileIds = 'idsPerfil',
  Lastname = 'apellidoNombre',
  CUIT = 'cuit',
  DefaultLanguage = 'idiomaDefault',
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
  HasError = 'tieneError',
  ErrorDescription = 'descripcionError',
  UserType = 'codUsuarioTipo',
  Mail = 'mail',
  ConfirmedMail = 'confirmoMail',
  ConfirmedPhoneNumber = 'confirmoTelefono',
  ConfirmedPerson = 'confirmoPersona',
  ValidatedIdentity = 'validoIdentidad',
  HasTaxActivity = 'tieneActividadTributaria',
  ValidationIdentityStatusCode = 'codValidacionEstado',
  ValidationIdentityObservations = 'observacionValidacionEstado',
  MustChangePassword = 'debeCambiarPass',
  IsFirstLogin = 'esPrimerIngreso',
  LoginExtraField = 'campoExtraLogin'
}

export interface AuthorizationResponse {
  [AuthorizationResponseFields.UserId]: number;
  [AuthorizationResponseFields.Lastname]: string;
  [AuthorizationResponseFields.CUIT]: string;
  [AuthorizationResponseFields.DefaultLanguage]: string;
  [AuthorizationResponseFields.AccessToken]: string;
  [AuthorizationResponseFields.RefreshToken]: string;
  [AuthorizationResponseFields.HasError]: boolean;
  [AuthorizationResponseFields.ErrorDescription]: string;
  [AuthorizationResponseFields.UserType]: number;
  [AuthorizationResponseFields.ProfileId]: number;
  [AuthorizationResponseFields.ProfileIds]: number[];
  [AuthorizationResponseFields.Mail]: string;
  [AuthorizationResponseFields.ConfirmedMail]: boolean;
  [AuthorizationResponseFields.ConfirmedPhoneNumber]: boolean;
  [AuthorizationResponseFields.ConfirmedPerson]: boolean;
  [AuthorizationResponseFields.ValidatedIdentity]: boolean;
  [AuthorizationResponseFields.HasTaxActivity]: boolean;
  [AuthorizationResponseFields.ValidationIdentityStatusCode]: number;
  [AuthorizationResponseFields.ValidationIdentityObservations]: string;
  [AuthorizationResponseFields.MustChangePassword]: boolean;
  [AuthorizationResponseFields.IsFirstLogin]: boolean;
  [AuthorizationResponseFields.LoginExtraField]: string | null;
}

export enum ChangePasswordRequestFields {
  ActualPassword = 'passwordActual',
  NewPassword = 'passwordNueva',
}

export interface ChangePasswordRequest extends BaseRequest {
  [ChangePasswordRequestFields.ActualPassword]: string;
  [ChangePasswordRequestFields.NewPassword]: string;
}

export enum ForgotMailRequestFields {
  CUIT = 'cuit',
}

export interface ForgotMailRequest {
  [ForgotMailRequestFields.CUIT]: string;
}

export enum ForgotMailResponseFields {
  Mail = 'mail',
  CUIT = 'cuit',
  ExistingUser = 'perteneceUsuario',
}

export interface ForgotMailResponse {
  [ForgotMailResponseFields.Mail]: string;
  [ForgotMailResponseFields.CUIT]: string;
  [ForgotMailResponseFields.ExistingUser]: boolean;
}

export enum ForgotPasswordRequestFields {
  Mail = 'mail',
  Captcha = 'captcha'
}

export interface ForgotPasswordRequest {
  [ForgotPasswordRequestFields.Mail]: string;
  [ForgotPasswordRequestFields.Captcha]?: string;
}

export enum ResetPasswordRequestFields {
  IdentifierWeb = 'identificadorWeb',
  Password = 'password',
}

export interface ResettPasswordRequest {
  [ResetPasswordRequestFields.IdentifierWeb]: string;
  [ResetPasswordRequestFields.Password]: string;
}

export enum PinValidationRequestFields {
  PIN = 'pin',
}

export interface PinValidationRequest {
  [PinValidationRequestFields.PIN]: string;
}

export interface PinValidationResponse extends BaseResponse {}

export enum PinGenerationRequestFields {
  ReferentialData = 'datoReferencial',
}

export interface PinGenerationRequest {
  [PinGenerationRequestFields.ReferentialData]: string;
}
