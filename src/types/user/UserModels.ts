import {BaseRequest, EntityFilterPagination, EntityWithId} from '../baseEntities';
import { AuthorizationResponseFields } from './UserAuthModels';

export enum UserCompanySelectedFields {
  ClientId = 'clientId',
  BusinessName = 'businessName',
  CUIT = 'cuit',
}

export interface UserCompanySelected {
  [UserCompanySelectedFields.ClientId]: number;
  [UserCompanySelectedFields.BusinessName]: string;
  [UserCompanySelectedFields.CUIT]: string;
}

export enum NewUserRequestFields {
  Mail = 'mail',
  Password = 'password',
  CUIT = 'cuit',
  PhoneNumber = 'telefono',
  AreaCode = 'codArea',
  PhoneCode = 'codigoTelefonico',
  Captcha = 'captcha'
}

export interface NewUserRequest {
  [NewUserRequestFields.Mail]: string;
  [NewUserRequestFields.Password]: string;
  [NewUserRequestFields.CUIT]: string;
  [NewUserRequestFields.PhoneNumber]: string;
  [NewUserRequestFields.AreaCode]?: string;
  [NewUserRequestFields.PhoneCode]: string;
  [NewUserRequestFields.Captcha]?: string
}

export enum NewUserResponseFields {
  UserId = 'idUsuario',
  HasError = 'tieneError',
  ErrorDescription = 'descripcionError',
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
}

export interface NewUserResponse {
  [NewUserResponseFields.UserId]: number;
  [NewUserResponseFields.HasError]: boolean;
  [NewUserResponseFields.ErrorDescription]: string;
  [NewUserResponseFields.AccessToken]: string;
  [NewUserResponseFields.RefreshToken]: string;
  [AuthorizationResponseFields.UserType]: number;
  [AuthorizationResponseFields.ProfileId]: number;
  [AuthorizationResponseFields.ProfileIds]: number[];
  [AuthorizationResponseFields.HasTaxActivity]: boolean;
  [AuthorizationResponseFields.DefaultLanguage]: string;
  [AuthorizationResponseFields.Lastname]: string;
  [AuthorizationResponseFields.CUIT]: string;
  [AuthorizationResponseFields.ValidationIdentityStatusCode]: number;
  [AuthorizationResponseFields.ValidationIdentityObservations]: string;
  [AuthorizationResponseFields.MustChangePassword]: boolean;
  [AuthorizationResponseFields.IsFirstLogin]: boolean;
}

export enum LinkPersonToUserRequestFields {
  ModuleCode = 'codModulo',
  OriginCode = 'codOrigen',
  BusinessName = 'razonSocial',
  CUIT = 'cuit',
  LastName = 'apellido',
  FirstName = 'nombre',
  PersonTypeCode = 'codPersonaTipo',
  Gender = 'sexo',
  PhoneNumber = 'telefono',
}

export interface LinkPersonToUserRequest {
  [LinkPersonToUserRequestFields.ModuleCode]: number;
  [LinkPersonToUserRequestFields.OriginCode]: number;
  [LinkPersonToUserRequestFields.BusinessName]: string;
  [LinkPersonToUserRequestFields.CUIT]: string;
  [LinkPersonToUserRequestFields.LastName]: string;
  [LinkPersonToUserRequestFields.FirstName]: string;
  [LinkPersonToUserRequestFields.PersonTypeCode]: number;
  [LinkPersonToUserRequestFields.Gender]: string;
  [LinkPersonToUserRequestFields.PhoneNumber]: string;
}

export enum UpdateUserMailRequestFields {
  Mail = 'mail',
}

export interface UpdateUserMailRequest extends BaseRequest {
  [UpdateUserMailRequestFields.Mail]: string;
}

export enum UpdateUserPhoneRequestFields {
  AreaCode = 'codigoArea',
  PhoneNumber = 'telefono',
  PhoneCode = 'codigoTelefonico',
}

export interface UpdateUserPhoneRequest extends BaseRequest {
  [UpdateUserPhoneRequestFields.AreaCode]: string;
  [UpdateUserPhoneRequestFields.PhoneNumber]: string;
  [UpdateUserPhoneRequestFields.PhoneCode]: string;
}

export enum UserModelViewFields {
  PersonId = 'idPersona',
  UserName = 'apellidoNombre',
  Mail = 'mail',
  CUIT = 'cuit',
  AreaCode = 'codigoArea',
  PhoneNumber = 'telefono',
  DocumentNumber = 'numeroDocumento',
  ValidationIdentityStatusCode = 'codValidacionEstado',
  ValidationIdentityStatusDesc = 'descValidacionEstado',
  ValidationIdentityObservations = 'observacionValidacionEstado',
  ValidatedIdentity = 'validoIdentidad',
  AllowMailNotifications = 'permiteNotificacionesMail'
}

export interface UserModelView extends EntityWithId<number> {
  [UserModelViewFields.PersonId]: number;
  [UserModelViewFields.UserName]: string;
  [UserModelViewFields.Mail]: string;
  [UserModelViewFields.CUIT]: string;
  [UserModelViewFields.AreaCode]: number;
  [UserModelViewFields.PhoneNumber]: number;
  [UserModelViewFields.DocumentNumber]: string;
  [UserModelViewFields.ValidatedIdentity]: boolean;
  [UserModelViewFields.ValidationIdentityStatusCode]: number;
  [UserModelViewFields.ValidationIdentityStatusDesc]: string;
  [UserModelViewFields.ValidationIdentityObservations]: string;
  [UserModelViewFields.AllowMailNotifications]: boolean;
}

export enum UserConfirmationsFields {
  PersonId = 'idPersona',
  Lastname = 'apellidoNombre',
  CUIT = 'cuit',
  Mail = 'mail',
  AreaCode = 'codigoArea',
  PhoneNumber = 'telefono',
  PhoneCode = 'codigoTelefonico',
  ConfirmedMail = 'confirmoMail',
  ConfirmedPhoneNumber = 'confirmoTelefono',
  ConfirmedPerson = 'confirmoPersona',
}

export interface UserConfirmations extends EntityWithId<number> {
  [UserConfirmationsFields.Lastname]: string;
  [UserConfirmationsFields.CUIT]: string;
  [UserConfirmationsFields.Mail]: string;
  [UserConfirmationsFields.AreaCode]: string;
  [UserConfirmationsFields.PhoneNumber]: string;
  [UserConfirmationsFields.PhoneCode]: string;
  [UserConfirmationsFields.ConfirmedMail]: boolean;
  [UserConfirmationsFields.ConfirmedPhoneNumber]: boolean;
  [UserConfirmationsFields.ConfirmedPerson]: boolean;
}

export enum UserResponseInvitationFields {
  UserId = 'idUsuario',
  BusinessName = 'apellidoNombre',
  CUIT = 'cuit',
  Mail = 'mail',
  AreaCode = 'codigoArea',
  PhoneNumber = 'telefono',
  PhoneCode = 'codigoTelefonico',
  ConfirmedMail = 'confirmoMail',
  ConfirmedPhoneNumber = 'confirmoTelefono',
  ConfirmedPerson = 'confirmoPersona',
  ValidatedIdentity = 'validoIdentidad',
  HasTaxActivity = 'tieneActividadTributaria',
  ValidationIdentityStatusCode = 'codValidacionEstado',
  ValidationIdentityObservations = 'observacionValidacionEstado',
  MustChangePassword = 'debeCambiarPass',
  IsFirstLogin = 'esPrimerIngreso',
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
  DefaultLanguage = 'idiomaDefault',
  HasError = 'tieneError',
  ErrorDescription = 'descripcionError',
}

export interface UserResponseInvitation {
  [UserResponseInvitationFields.UserId]: number;
  [UserResponseInvitationFields.BusinessName]: string;
  [UserResponseInvitationFields.CUIT]: string;
  [UserResponseInvitationFields.Mail]: string;
  [UserResponseInvitationFields.AreaCode]: string;
  [UserResponseInvitationFields.PhoneNumber]: string;
  [UserResponseInvitationFields.PhoneCode]: string;
  [UserResponseInvitationFields.ConfirmedMail]: boolean;
  [UserResponseInvitationFields.ConfirmedPhoneNumber]: boolean;
  [UserResponseInvitationFields.ConfirmedPerson]: boolean;
  [UserResponseInvitationFields.ValidatedIdentity]: boolean;
  [UserResponseInvitationFields.HasTaxActivity]: boolean;
  [UserResponseInvitationFields.ValidationIdentityStatusCode]: number;
  [UserResponseInvitationFields.ValidationIdentityObservations]: string;
  [UserResponseInvitationFields.MustChangePassword]: boolean;
  [UserResponseInvitationFields.IsFirstLogin]: boolean;
  [UserResponseInvitationFields.AccessToken]: string;
  [UserResponseInvitationFields.RefreshToken]: string;
  [UserResponseInvitationFields.DefaultLanguage]: string;
  [UserResponseInvitationFields.HasError]: boolean;
  [UserResponseInvitationFields.ErrorDescription]: string;
}

export enum UserInvitationActivationRequestFields {
  IdentifierWeb = 'identificador',
  PersonId = 'idPersona',
  Password = 'password',
}

export enum UserInfoSummaryFields {
  UnreadNotifications = 'cantidadNotificacionNoLeidas',
  UnansweredInvitations = 'cantidadInvitacionesSinResponder',
  LinesMarketFavorites = 'cantidadFavoritosMarket',
  SolicitationsAlerts = 'cantidadSolicitudesConAlerta'
}

export interface UserInfoSummaryView {
  [UserInfoSummaryFields.UnreadNotifications]: number;
  [UserInfoSummaryFields.UnansweredInvitations]: number;
  [UserInfoSummaryFields.LinesMarketFavorites]: number;
  [UserInfoSummaryFields.SolicitationsAlerts]: number;
}

export interface UserValidateIdentity extends EntityWithId<number> {
  [UserModelViewFields.ValidationIdentityStatusCode]: number;
  [UserModelViewFields.ValidationIdentityObservations]: string;
}

export enum UserValidateIdentityRequestFields {
  DocumentTypeCode = 'codPersonaDocumentoTipo',
  ProcedureNumber = 'numeroTramite',
  DocumentNumber = 'numeroDocumento',
  GenderCode = 'codPersonaGenero',
  DocumentFront = 'fileDNIFrente',
  DocumentBack = 'fileDNIDorso',
}

export interface UserValidateIdentityRequest {
  [UserValidateIdentityRequestFields.DocumentTypeCode]: number;
  [UserValidateIdentityRequestFields.ProcedureNumber]: number;
  [UserValidateIdentityRequestFields.DocumentNumber]: string;
  [UserValidateIdentityRequestFields.GenderCode]: number;
  [UserValidateIdentityRequestFields.DocumentFront]: File;
  [UserValidateIdentityRequestFields.DocumentBack]: File;
}

export enum UserValidateIdentityPublicBasesFields {
  Document = 'documento',
  BusinessName = 'razonSocial',
  Sex = 'sexo',
  BirthDate = 'fechaNacimiento',
  ProcessIdNumber = 'nroTramiteDNI',
  WaitBackgroundProcessing = 'esperarProcesamientoBackground'
}

export interface UserValidateIdentityPublicBases {
  [UserValidateIdentityPublicBasesFields.Document]: string,
  [UserValidateIdentityPublicBasesFields.BusinessName]: string,
  [UserValidateIdentityPublicBasesFields.Sex]: string,
  [UserValidateIdentityPublicBasesFields.BirthDate]: Date,
  [UserValidateIdentityPublicBasesFields.ProcessIdNumber]?: string
  [UserValidateIdentityPublicBasesFields.WaitBackgroundProcessing]?: boolean
}

export enum BaseQueryResultFields {
  IsValid = 'esValida',
  StateDescription = 'descripcionEstado',
  QueryId = 'idConsulta',
  PersonData = 'datosPersona'
}


export interface BaseQueryResult {
  [BaseQueryResultFields.IsValid]: boolean,
  [BaseQueryResultFields.StateDescription]: string,
  [BaseQueryResultFields.QueryId]: number,
  [BaseQueryResultFields.PersonData]?: UserValidateIdentityPublicBases
}

export enum ValidationQuestionaryFields {
  QuestionId = 'idPregunta',
  Question = 'pregunta',
  Options = 'opciones'
}

export interface ValidationQuestionary {
  [ValidationQuestionaryFields.QuestionId]: number,
  [ValidationQuestionaryFields.Question]: string,
  [ValidationQuestionaryFields.Options]: string[]
}

export enum ValidationQueryResultFields {
  Questionary = 'cuestionario',
  AppliesQuestionary = 'aplicaCuestionario',
  RequiresEvaluation = 'requiereEvaluacion'
}


export interface ValidationQueryResult extends BaseQueryResult {
  [ValidationQueryResultFields.Questionary]: ValidationQuestionary[],
  [ValidationQueryResultFields.AppliesQuestionary]: boolean,
  [ValidationQueryResultFields.RequiresEvaluation]: boolean
}

export enum EvaluationQueryResultFields {
  ApprovesQuestionary = 'apruebaCuestionario',
  ApprovesEvaluation = 'apruebaEvaluacion'
}

export interface EvaluationQueryResult extends BaseQueryResult {
  [EvaluationQueryResultFields.ApprovesQuestionary]: boolean,
  [EvaluationQueryResultFields.ApprovesEvaluation]: boolean
}

export enum UserEvaluateIdentityPublicBasesFields {
  QueryId = 'idConsulta',
  Questionary = 'cuestionario',
  WaitBackgroundProcessing = 'esperarProcesamientoBackground'
}

export interface UserEvaluateIdentityPublicBases {
  [UserEvaluateIdentityPublicBasesFields.QueryId]: number,
  [UserEvaluateIdentityPublicBasesFields.Questionary]: string, //esto va en formato {idPregunta}-{nroOpcion},{idPregunta}-{nroOpcion}
  [UserEvaluateIdentityPublicBasesFields.WaitBackgroundProcessing]?: boolean
}


export enum UserCompanyFilterFields {
    BusinessName = 'razonSocial',
    CUIT = 'cuit'
}


export interface UserCompanyFilter extends EntityFilterPagination {
  [UserCompanyFilterFields.BusinessName]?: string,
  [UserCompanyFilterFields.CUIT]?: string
}


export enum AllUsersInternalFilterFields {
  Mail = 'mail',
  UserTypeCodes = 'codsUsuarioTipo',
  OffererIds = 'idsOferente'
}


export interface AllUsersInternalFilter extends UserCompanyFilter {
  [AllUsersInternalFilterFields.Mail]?: string;
  [AllUsersInternalFilterFields.UserTypeCodes]?: number[];
  [AllUsersInternalFilterFields.OffererIds]?: number[];
}

export enum UserCompanyFields {
  BusinessName = 'razonSocial',
  CUIT = 'cuit',
  Mail = 'mail',
  PhoneCode = 'codigoTelefonico',
  AreaCode = 'codigoArea',
  PhoneNumber = 'telefono',
  LastAccessDate = 'fechaUltAcceso',
  MailConfirmed = 'confirmoMail',
  PhoneConfirmed = 'confirmoTelefono',
  IdentityValidated = 'validoIdentidad',
  Blocked = 'bloqueado',
  Active = 'activo',
  RelatedCompanies = 'empresasRelacionadas'
}


export interface UserCompany extends EntityWithId<number> {
  [UserCompanyFields.BusinessName]: string;
  [UserCompanyFields.CUIT]: string;
  [UserCompanyFields.Mail]: string;
  [UserCompanyFields.PhoneCode]: string;
  [UserCompanyFields.AreaCode]: string;
  [UserCompanyFields.PhoneNumber]: string;
  [UserCompanyFields.LastAccessDate]: Date;
  [UserCompanyFields.MailConfirmed]: boolean;
  [UserCompanyFields.PhoneConfirmed]: boolean;
  [UserCompanyFields.IdentityValidated]: boolean;
  [UserCompanyFields.Blocked]: boolean;
  [UserCompanyFields.Active]: boolean;
  [UserCompanyFields.RelatedCompanies]: string;
}


export enum UserSummaryFields {
  PersonId = 'idPersona',
  Fullname = 'apellidoNombre',
  Mail = 'mail',
  Cuit = 'cuit',
  UserTypeCode = 'codUsuarioTipo',
  PasswordLastModifyDate = 'fechaUltModPassword',
  LastAccessDate = 'fechaUltAcceso',
  UserTypeDesc = 'descUsuarioTipo',
  GroupIds = 'idsGrupo'
}


export interface UserSummary extends EntityWithId<number> {
  [UserSummaryFields.PersonId]: number;
  [UserSummaryFields.Fullname]: string;
  [UserSummaryFields.Mail]: string;
  [UserSummaryFields.Cuit]: string;
  [UserSummaryFields.UserTypeCode]: UserTypeCodes;
  [UserSummaryFields.UserTypeDesc]: string;
  [UserSummaryFields.PasswordLastModifyDate]: Date;
  [UserSummaryFields.LastAccessDate]: Date;
  [UserSummaryFields.GroupIds]?: string;
}


export enum UserTypeCodes {
  Company = 1,
  Offerer = 2,
  Internal = 3,
  Temp = 4,
  Guest = 5
}

export enum InternalUserCreateFields {
  Mail = 'mail',
  CUIT = 'cuit',
  GroupIds = 'idsGrupo',
  PersonId = 'idPersona'
}


export interface InternalUserCreate extends BaseRequest {
  [InternalUserCreateFields.Mail]: string;
  [InternalUserCreateFields.CUIT]?: string;
  [InternalUserCreateFields.GroupIds]: number[];
  [InternalUserCreateFields.PersonId]?: number;
}


export enum InternalUserGroupUpdateFields {
  GroupIds = 'idsGrupo',
}

export interface InternalUserGroupUpdate extends BaseRequest {
  [InternalUserGroupUpdateFields.GroupIds]: number[];
}