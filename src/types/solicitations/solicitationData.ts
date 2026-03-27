import {
  BaseRequest,
  EntityWithId,
  EntityWithIdAndDescription,
} from '../baseEntities';
import { SolicitationClassificationTypeCode } from '../general/generalEnums';
import {
    SolicitationAlertType, SolicitationClassificationStatusType,
    SolicitationOffererStatusType,
    SolicitationStatusType, SolicitationTypes,
} from './solicitationEnums';
import { PersonTypes } from '../person/personEnums';
import { CompanyFileType } from '../company/companyEnums';
import {CompanyFilePublic} from "../companyFile/companyFileData";
import {SolicitationSurveyQuestionAnswer} from "./solicitationSurveyData";
import {FileSolicitation, SolicitationFileRequested} from "../files/filesData";
import {CompanySolicitationFileHistory} from "../company/companyData";

export enum SolicitationProductLineFields {
  ProductLineId = 'idProductoLinea',
  Line = 'descProductoLinea',
  OffererId = 'idOferente',
  OffererBusinessName = 'razonSocialOferente',
  CreationDate = 'fechaAlta',
  ExpirationDate = 'fechaVencimiento',
  CompanyBusinessName = 'razonSocialEmpresa',
  ListRequirements = 'listaRequerimientos',
  SolicitationStateCode = 'codSolicitudEstado',
  SolicitationStateDesc = 'descSolicitudEstado',
}

export interface SolicitationProductLine extends EntityWithId<number> {
  [SolicitationProductLineFields.ProductLineId]: number;
  [SolicitationProductLineFields.Line]: string;
  [SolicitationProductLineFields.OffererId]: number;
  [SolicitationProductLineFields.OffererBusinessName]: string;
  [SolicitationProductLineFields.CreationDate]: Date;
  [SolicitationProductLineFields.ExpirationDate]?: Date;
  [SolicitationProductLineFields.CompanyBusinessName]: string;
  [SolicitationProductLineFields.SolicitationStateCode]?: number;
  [SolicitationProductLineFields.SolicitationStateDesc]: string;
}

export enum SolicitationRequirementFields {
  ProductLineId = 'idProductoLinea',
  RequirementCode = 'codRequerimiento',
  RequirementDesc = 'descRequerimiento',
  ProductLineRequirementCode = 'idProductoLineaRequerimiento',
  ProductLineRequirementDesc = 'descProductoLineaRequerimiento',
  RequirementResponse = 'descRespuesta',
}

export interface SolicitationRequirement {
  [SolicitationRequirementFields.ProductLineId]: number;
  [SolicitationRequirementFields.RequirementCode]: number;
  [SolicitationRequirementFields.RequirementDesc]: string;
  [SolicitationRequirementFields.ProductLineRequirementCode]: number;
  [SolicitationRequirementFields.ProductLineRequirementDesc]: string;
  [SolicitationRequirementFields.RequirementResponse]: string;
}

export interface SolicitationRequirementInsert {
  [SolicitationRequirementFields.RequirementCode]: number;
  [SolicitationRequirementFields.ProductLineRequirementCode]: number;
  [SolicitationRequirementFields.RequirementResponse]: string;
}

export interface SolicitationProductLineInsert extends EntityWithId<number> {
  [SolicitationProductLineFields.ProductLineId]: number;
  [SolicitationProductLineFields.OffererId]: number;
  [SolicitationProductLineFields.ExpirationDate]?: Date;
  [SolicitationProductLineFields.ListRequirements]: SolicitationRequirementInsert[];
}

export enum SolicitationViewDTOFields {
  FileId = 'idLegajo',
  FileTypeCode = 'codLegajoTipo',
  SolicitationTypeCode = 'codSolicitudTipo',
  ProductLineId = 'idProductoLinea',
  CompanyId = 'idEmpresa',
  UserId = 'idUsuarioAlta',
  CompanyCUIT = 'cuitEmpresa',
  OffererId = 'idOferente',
  OffererUrlLogo = 'urlOferenteLogo',
  LufeRequestId = 'idLufeConsulta',
  ResponsibleUserId = 'idUsuarioResponsable',
  Date = 'fecha',
  ExpiryDate = 'fechaVto',
  CreationDate = 'fechaAlta',
  OffererSolicitationStatusTypeCode = 'codSolicitudEstadoOferente',
  OffererLastModified = 'fechaUltModEstadoOferente',
  OffererIncomeDate = 'fechaIngresoOferente',
  CompanySolicitationStatusTypeCode = 'codSolicitudEstadoEmpresa',
  CompanyLastModified = 'fechaUltModEstadoEmpresa',
  ProductDesc = 'descProducto',
  LineDesc = 'descProductoLinea',
  LongLineDesc = 'descProductoLineaLarga',
  OffererBusinessName = 'razonSocialOferente',
  CompanyBusinessName = 'razonSocialEmpresa',
  CompanyPersonTypeCode = 'codPersonaTipoEmpresa',
  ResponsibleBusinessName = 'razonSocialResponsable',
  
  CompanySolicitationStatusTypeDesc = 'descSolicitudEstadoEmpresa',
  CompanySolicitationClassificationStatusTypeDesc = 'descSolicitudEstadoClasificacionEmpresa',
  CompanySolicitationClassificationStatusTypeCode = 'codSolicitudEstadoClasificacionEmpresa',
  CompanySolicitationClassificationStatusTypeCod = 'codSolicitudEstadoClasificacionTipoEmpresa',
  
  OffererSolicitationStatusTypeDesc = 'descSolicitudEstadoOferente',
  OffererSolicitationStatusLabelDesc = 'descSolicitudEstadoEtiquetaOferente',
  OffererSolicitationClassificationStatusCode = 'codSolicitudEstadoClasificacionOferente',
  OffererSolicitationClassificationStatusDesc = 'descSolicitudEstadoClasificacionOferente',
  OffererSolicitationClassificationStatusTypeCode = 'codSolicitudEstadoClasificacionTipoOferente',
  
  StageResponsibleUserId = 'idUsuarioResponsableEtapa',
  StageResponsibleUserName = 'razonSocialResponsableEtapa',
  CommercialResponsibleUserId = 'idUsuarioResponsableComercial',
  CommercialResponsibleUserName = 'razonSocialResponsableComercial',
  HasAlert = 'tieneAlerta',
  AlertTypeCode = 'codAlerta',
  MessageId = 'idMensaje',
  InitialMessage = 'detalleMensajeInicial',
  RequestEditCompanyFile = 'solicitaEditarLegajo',
  LastRequestEditCompanyFileDate = 'fechaUltSolicitaEditarLegajo',
  SystemCode = 'codSistema',
  HasLufeIntegration = 'tieneIntegracionLufe',
  HasAssociatedLufeRequest = 'tieneConsultaLufeAsociada',
  IntermediaryOffererId = 'idOferenteIntermediario',
  IntermediaryOffererBusinessName = 'razonSocialOferenteIntermediario',
  IntermediaryOffererUrlLogo = 'urlOferenteLogoIntermediario',
  HasAssociatedSolicitations = 'tieneSolicitudesAsociadas',
  AssociatedNewSolicitationsSideCompanyQuantity = 'cantidadSolicitudesAsociadasNuevasVistaEmpresa',
  FolderId = 'idCarpeta',

  IsNewSolicitationSideCompany = 'esNuevaVistaEmpresa',
  OriginSolicitationId = 'idSolicitudOrigen',
  OriginSolicitationTypeDesc = 'descSolicitudTipoOrigen',
  HasPermissionsNextStage = 'tienePermisosEtapaSiguiente',
}

export interface SolicitationViewDTO extends EntityWithId<number> {
  [SolicitationViewDTOFields.FileId]: number;
  [SolicitationViewDTOFields.FileTypeCode]: CompanyFileType;
  [SolicitationViewDTOFields.SolicitationTypeCode]: SolicitationTypes;
  [SolicitationViewDTOFields.ProductLineId]: number;
  [SolicitationViewDTOFields.OffererId]: number;
  [SolicitationViewDTOFields.OffererUrlLogo]?: string;
  [SolicitationViewDTOFields.CompanyId]: number;
  [SolicitationViewDTOFields.CompanyCUIT]: string;
  [SolicitationViewDTOFields.UserId]: number;
  [SolicitationViewDTOFields.ResponsibleUserId]: number;
  [SolicitationViewDTOFields.LufeRequestId]?: number;
  [SolicitationViewDTOFields.Date]: Date;
  [SolicitationViewDTOFields.ExpiryDate]: Date;
  [SolicitationViewDTOFields.CreationDate]: Date;
  [SolicitationViewDTOFields.OffererSolicitationStatusTypeCode]: SolicitationStatusType; // ver de cambiar por SolicitationOffererStatusType
  [SolicitationViewDTOFields.OffererLastModified]: Date;
  [SolicitationViewDTOFields.OffererIncomeDate]?: Date;
  [SolicitationViewDTOFields.CompanySolicitationStatusTypeCode]: number; //ver de cambiar por SolicitationStatusType
  [SolicitationViewDTOFields.CompanyLastModified]: Date;
  [SolicitationViewDTOFields.ProductDesc]: string;
  [SolicitationViewDTOFields.LineDesc]: string;
  [SolicitationViewDTOFields.LongLineDesc]: string;
  [SolicitationViewDTOFields.OffererBusinessName]: string;
  [SolicitationViewDTOFields.CompanyBusinessName]: string;
  [SolicitationViewDTOFields.CompanyPersonTypeCode]?: PersonTypes;
  [SolicitationViewDTOFields.ResponsibleBusinessName]: string;
  [SolicitationViewDTOFields.OffererSolicitationStatusTypeDesc]: string;
  [SolicitationViewDTOFields.OffererSolicitationStatusLabelDesc]: string;
  [SolicitationViewDTOFields.CompanySolicitationStatusTypeDesc]: string;
  [SolicitationViewDTOFields.CompanySolicitationClassificationStatusTypeCode]: SolicitationClassificationTypeCode;
  [SolicitationViewDTOFields.OffererSolicitationClassificationStatusCode]: SolicitationClassificationStatusType;
  [SolicitationViewDTOFields.CompanySolicitationClassificationStatusTypeDesc]: string;
  [SolicitationViewDTOFields.OffererSolicitationClassificationStatusDesc]: string;
  [SolicitationViewDTOFields.StageResponsibleUserId]: number;
  [SolicitationViewDTOFields.StageResponsibleUserName]: string;
  [SolicitationViewDTOFields.CommercialResponsibleUserId]: number;
  [SolicitationViewDTOFields.CommercialResponsibleUserName]: string;
  [SolicitationViewDTOFields.HasAlert]: boolean;
  [SolicitationViewDTOFields.AlertTypeCode]: SolicitationAlertType;
  [SolicitationViewDTOFields.MessageId]: number;
  [SolicitationViewDTOFields.InitialMessage]?: string;
  [SolicitationViewDTOFields.RequestEditCompanyFile]?: boolean;
  [SolicitationViewDTOFields.LastRequestEditCompanyFileDate]?: Date;
  [SolicitationViewDTOFields.SystemCode]: number;
  [SolicitationViewDTOFields.OffererSolicitationClassificationStatusTypeCode]?: number;
  [SolicitationViewDTOFields.CompanySolicitationClassificationStatusTypeCod]?: number;
  [SolicitationViewDTOFields.HasLufeIntegration]: boolean;
  [SolicitationViewDTOFields.HasAssociatedLufeRequest]: boolean;
  [SolicitationViewDTOFields.IntermediaryOffererId]?: number;
  [SolicitationViewDTOFields.IntermediaryOffererBusinessName]?: string;
  [SolicitationViewDTOFields.IntermediaryOffererUrlLogo]?: string;
  [SolicitationViewDTOFields.HasAssociatedSolicitations]?: boolean;
  [SolicitationViewDTOFields.FolderId]?: string;
  [SolicitationViewDTOFields.IsNewSolicitationSideCompany]?: boolean;
  [SolicitationViewDTOFields.AssociatedNewSolicitationsSideCompanyQuantity]?: number;
  [SolicitationViewDTOFields.OriginSolicitationId]?: number;
  [SolicitationViewDTOFields.OriginSolicitationTypeDesc]?: string;
  [SolicitationViewDTOFields.HasPermissionsNextStage]?: boolean;
}

export interface SolicitationAlertViewDTO extends EntityWithId<number> {
  [SolicitationViewDTOFields.AlertTypeCode]: SolicitationAlertType;
}

export enum SolicitationSummaryFields {
  CompanyId = 'idEmpresa',
  OffererId = 'idOferente',
  LineDesc = 'descProductoLinea',
  SolicitationStatusTypeCode = 'codSolicitudEstado',
  SolicitationStatusTypeDesc = 'descSolicitudEstado',
  LastModifyDate = 'fechaUltMod',
  ProductDesc = 'descProducto',
  CompanyBusinessName = 'razonSocialEmpresa',
  OffererBusinessName = 'razonSocialOferente',
}

export interface SolicitationSummaryViewDTO extends EntityWithId<number> {
  [SolicitationSummaryFields.CompanyId]: number;
  [SolicitationSummaryFields.OffererId]: number;
  [SolicitationSummaryFields.LineDesc]: string;
  [SolicitationSummaryFields.SolicitationStatusTypeCode]: number;
  [SolicitationSummaryFields.SolicitationStatusTypeDesc]: string;
  [SolicitationSummaryFields.LastModifyDate]: Date;
  [SolicitationSummaryFields.ProductDesc]: string;
  [SolicitationSummaryFields.CompanyBusinessName]: string;
  [SolicitationSummaryFields.OffererBusinessName]: string;
}

export enum SolicitationFilterFields {
  CompanyBusinessName = 'razonSocialEmpresa',
  StatusCodeList = 'codsSolicitudEstado',
  CompanyIds = 'idsEmpresa',
  ResponsibleUserStageId = 'idUsuarioResponsableEtapa',
  ResponsibleUserCommercialId = 'idUsuarioResponsableComercial',
  HasAlert = 'tieneAlerta',
  PageSize = 'pageSize',
  CurrentPage = 'actualPage',
  OrderBy = 'orderBy',
  SolicitationFilterCode = 'codSolicitudFiltro',
  SolicitationFilterContent = 'contenidoSolicitudFiltro',
}

export interface SolicitationFilter {
  [SolicitationFilterFields.CompanyBusinessName]?: string;
  [SolicitationFilterFields.StatusCodeList]?: number[];
  [SolicitationFilterFields.CompanyIds]?: number[];
  [SolicitationFilterFields.ResponsibleUserStageId]?: number;
  [SolicitationFilterFields.ResponsibleUserCommercialId]?: number;
  [SolicitationFilterFields.HasAlert]?: boolean | null;
  [SolicitationFilterFields.PageSize]?: number;
  [SolicitationFilterFields.CurrentPage]?: number;
  [SolicitationFilterFields.OrderBy]?: string;
  [SolicitationFilterFields.SolicitationFilterCode]?: number;
  [SolicitationFilterFields.SolicitationFilterContent]?: string | number[];
}

export enum SolicitationRequirementDTOFields {
  SolicitationId = 'idSolicitud',
  RequirementCode = 'codRequerimiento',
  ProductLineRequirementCode = 'idProductoLineaRequerimiento',
  ResponseDesc = 'descRespuesta',
  ProductLineId = 'idProductoLinea',
  ProductLineRequirementDesc = 'descProductoLineaRequerimiento',
  RequirementDesc = 'descRequerimiento',
  RequirementClassificationCode = 'codRequerimientoClasificacion',
}

export interface SolicitationRequirementDTO extends EntityWithId<number> {
  [SolicitationRequirementDTOFields.SolicitationId]: number;
  [SolicitationRequirementDTOFields.RequirementCode]: number;
  [SolicitationRequirementDTOFields.ProductLineRequirementCode]: number;
  [SolicitationRequirementDTOFields.ResponseDesc]: string;
  [SolicitationRequirementDTOFields.ProductLineId]: number;
  [SolicitationRequirementDTOFields.ProductLineRequirementDesc]: string;
  [SolicitationRequirementDTOFields.RequirementDesc]: string;
  [SolicitationRequirementDTOFields.RequirementClassificationCode]: number;
}

export enum SolicitationTotalsViewFields {
  SolicitationsQuantity = 'cantidadSolicitudes',
}

export interface SolicitationTotalsView extends EntityWithIdAndDescription {
  [SolicitationTotalsViewFields.SolicitationsQuantity]: number;
}

export enum SolicitationTotalsViewOffererFields {
  SolicitationsQuantity = 'cantidadSolicitudes',
  ActiveSolicitationsQuantity = 'cantidadSolicitudesActivas',
  AlertSolicitationsQuantity = 'cantidadSolicitudesConAlerta',
  UserAssignedSolicitationsQuantity = 'cantidadSolicitudesUsuario',
  UserAssignedAlertSolicitationsQuantity = 'cantidadSolicitudesUsuarioConAlerta',
  TeamUserUnassignedSolicitationsQuantity = 'cantidadSolicitudesEquipoSinAsignar',
  TeamUserActiveSolicitationsQuantity = 'cantidadSolicitudesEquipoActivas',
  TeamUserAlertSolicitationsQuantity = 'cantidadSolicitudesEquipoConAlerta',
  SolicitationsInProgressQuantity = 'cantidadSolicitudesEnProgeso',
  SolicitationsNewQuantity = 'cantidadSolicitudesNuevas',
  SolicitationsApprovedQuantity = 'cantidadSolicitudesAdmitidas'
}

export interface SolicitationTotalsViewOfferer
  extends EntityWithIdAndDescription {
  [SolicitationTotalsViewOffererFields.SolicitationsQuantity]: number;
  [SolicitationTotalsViewOffererFields.ActiveSolicitationsQuantity]: number;
  [SolicitationTotalsViewOffererFields.AlertSolicitationsQuantity]: number;
  [SolicitationTotalsViewOffererFields.UserAssignedSolicitationsQuantity]: number;
  [SolicitationTotalsViewOffererFields.UserAssignedAlertSolicitationsQuantity]: number;
  [SolicitationTotalsViewOffererFields.TeamUserUnassignedSolicitationsQuantity]: number;
  [SolicitationTotalsViewOffererFields.TeamUserActiveSolicitationsQuantity]: number;
  [SolicitationTotalsViewOffererFields.TeamUserAlertSolicitationsQuantity]: number;
  [SolicitationTotalsViewOffererFields.SolicitationsInProgressQuantity]: number;
  [SolicitationTotalsViewOffererFields.SolicitationsNewQuantity]: number;
  [SolicitationTotalsViewOffererFields.SolicitationsApprovedQuantity]: number;
}

export enum SolicitationTotalsViewCompanyFields {
    SolicitationsQuantity = 'cantidadSolicitudes',
    SolicitationsReadyToSend = 'cantidadSolicitudesListasParaEnviar',
    SolicitationsInProgress = 'cantidadSolicitudesEnProgreso',
    SolicitationsWithMessage = 'cantidadSolicitudesConMensaje',
}

export interface SolicitationTotalsViewCompany extends EntityWithId<number> {
    [SolicitationTotalsViewCompanyFields.SolicitationsQuantity]: number;
    [SolicitationTotalsViewCompanyFields.SolicitationsReadyToSend]: number;
    [SolicitationTotalsViewCompanyFields.SolicitationsInProgress]: number;
    [SolicitationTotalsViewCompanyFields.SolicitationsWithMessage]: number;
}

export enum FileRequestedSolicitationInsertFields {
  Title = 'titulo',
  Observations = 'observaciones',
  Files = 'files',
  DocumentIds = 'idsDocumento',
}

export interface FileRequestedSolicitationInsert extends BaseRequest {
  [FileRequestedSolicitationInsertFields.Title]: string;
  [FileRequestedSolicitationInsertFields.Observations]?: string;
  [FileRequestedSolicitationInsertFields.Files]?: File[];
  [FileRequestedSolicitationInsertFields.DocumentIds]?: number[];
}

export enum CompanySolicitationFilterFields {
  ProductTypeCode = 'codProducto',
  OffererBusinessName = 'razonSocialOferente',
  HasAlert = 'tieneAlerta',
  PageSize = 'pageSize',
  CurrentPage = 'actualPage',
  OrderBy = 'orderBy',
}

export interface CompanySolicitationFilter {
  [CompanySolicitationFilterFields.ProductTypeCode]?: number;
  [CompanySolicitationFilterFields.OffererBusinessName]?: string;
  [CompanySolicitationFilterFields.HasAlert]?: boolean;
  [SolicitationFilterFields.PageSize]?: number;
  [SolicitationFilterFields.CurrentPage]?: number;
  [SolicitationFilterFields.OrderBy]?: string;
}


export enum GeneralSolicitationFilterFields {
  CompanyIds = 'idsEmpresa',
  ProductCodes = 'codsProducto',
  OnlyActiveStates = 'estadosActivos',
  OnlyWithAlert = 'soloConAlerta'
}

export interface GeneralSolicitationFilter {
  [GeneralSolicitationFilterFields.CompanyIds]?: number[];
  [GeneralSolicitationFilterFields.ProductCodes]?: number[];
  [GeneralSolicitationFilterFields.OnlyActiveStates]: boolean;
  [GeneralSolicitationFilterFields.OnlyWithAlert]?: boolean;
  [SolicitationFilterFields.PageSize]?: number;
  [SolicitationFilterFields.CurrentPage]?: number;
  [SolicitationFilterFields.OrderBy]?: string;
}

export enum InternalSolicitationFilterFields {
  OffererIds = 'idsOferentes',
  CompanyBusinessName = 'razonSocialEmpresa',
  CompanyCuit = 'cuitEmpresa'
}


export interface InternalSolicitationFilter {
  [InternalSolicitationFilterFields.OffererIds]: number[];
  [InternalSolicitationFilterFields.CompanyBusinessName]: string;
  [InternalSolicitationFilterFields.CompanyCuit]: string;
  [SolicitationFilterFields.PageSize]?: number;
  [SolicitationFilterFields.CurrentPage]?: number;
  [SolicitationFilterFields.OrderBy]?: string;
}

export enum SolicitationInitialMessageDTOFields {
  Message = 'detalleMensajeInicial',
}

export interface SolicitationInitialMessageDTO extends BaseRequest {
  [SolicitationInitialMessageDTOFields.Message]?: string;
}

export enum SolicitationFlagsFields {
  SolicitationChatViewAllowed = 'puedeVerChat',
  SolicitationChatEditionAllowed = 'puedeEnviarChat',
  SolicitationRequestedDocumentationSendAllowed = 'puedeEnviarDocumentacionRequerida',
  SolicitationDocumentationAddAllowed = 'puedeAgregarDocumentacion',
  SolicitationDocumentationSendAllowed = 'puedeEnviarDocumentacion',
  SolicitationRequestDocumentationAllowed = 'puedeSolicitarDocumentacion',
  SolicitationCancelAllowed = 'puedeCancelarSolicitud',
  SolicitationCommercialResponsibleAsignedAllowed = 'puedeAginarseResponsableComercial',
  SolicitationRequestEditCompanyFileAllowed = 'puedeSolicitarActualizacionLegajo',
  SolicitationAdmitAllowed = 'puedeAdmitirSolicitud',
  HasFullAccess = 'tieneAccesoFull',
}

export interface SolicitationFlags extends EntityWithId<number> {
  [SolicitationFlagsFields.SolicitationChatViewAllowed]: boolean;
  [SolicitationFlagsFields.SolicitationChatEditionAllowed]: boolean;
  [SolicitationFlagsFields.SolicitationRequestedDocumentationSendAllowed]: boolean;
  [SolicitationFlagsFields.SolicitationDocumentationAddAllowed]: boolean;
  [SolicitationFlagsFields.SolicitationDocumentationSendAllowed]: boolean;
  [SolicitationFlagsFields.SolicitationRequestDocumentationAllowed]: boolean;
  [SolicitationFlagsFields.SolicitationCancelAllowed]: boolean;
  [SolicitationFlagsFields.SolicitationCommercialResponsibleAsignedAllowed]: boolean;
  [SolicitationFlagsFields.SolicitationRequestEditCompanyFileAllowed]: boolean;
  [SolicitationFlagsFields.SolicitationAdmitAllowed]: boolean;
  [SolicitationFlagsFields.HasFullAccess]: boolean;
}


export enum SolicitationAllowAccessFields {
  InvitedAccessMail = 'mailAccesoInvitado',
  FinancialEntityId = 'idEntidadFinanciera',
  InvitedAccessUserId = 'idUsuarioAccesoInvitado'
}

export interface SolicitationAllowAccess {
  [SolicitationAllowAccessFields.InvitedAccessMail]: string,
  [SolicitationAllowAccessFields.FinancialEntityId]: number,
  [SolicitationAllowAccessFields.InvitedAccessUserId]: number
}

export enum SolicitationShareDerivationFields {
  FinancialEntityId = 'idEntidadFinanciera',
  AttachDocumentation = 'adjuntarDocumentacion'
}


export interface SolicitationShareDerivation extends BaseRequest {
  [SolicitationShareDerivationFields.FinancialEntityId]: number;
  [SolicitationShareDerivationFields.AttachDocumentation]: boolean;
}

export enum SolicitationAccessViewFields {
  DateSent = 'fechaEnvio',
  MailInvitationAccess = 'mailAccesoInvitado',
  HasDefinedResult = 'tieneResultadoDefinido',
  ReportedTrackingOfferer = 'seComunicoSegumientoOferente',
  SolicitationAccessStateCode = 'codSolicitudAccesoEstado',
  SolicitationAccessStateDesc = 'descSolicitudAccesoEstado',
  ObservationsAccessState = 'observacionesAccesoEstado',
  DateLastSolicitationAccessState = 'fechaUltSolicitudAccesoEstado',
  FinancialEntityId = 'idEntidadFinanciera',
  FinancialEntityBusinessName = 'razonSocialOferente',
  AllowPlatformDerivation = 'permiteDerivacionPlataforma'
}


export interface SolicitationAccessView extends EntityWithId<number> {
  [SolicitationAccessViewFields.DateSent]: Date,
  [SolicitationAccessViewFields.MailInvitationAccess]: string,
  [SolicitationAccessViewFields.HasDefinedResult]: boolean,
  [SolicitationAccessViewFields.ReportedTrackingOfferer]: boolean,
  [SolicitationAccessViewFields.SolicitationAccessStateCode]: number,
  [SolicitationAccessViewFields.SolicitationAccessStateDesc]: string,
  [SolicitationAccessViewFields.ObservationsAccessState]: string,
  [SolicitationAccessViewFields.DateLastSolicitationAccessState]: Date,
  [SolicitationAccessViewFields.FinancialEntityId]: number,
  [SolicitationAccessViewFields.FinancialEntityBusinessName]: string,
  [SolicitationAccessViewFields.AllowPlatformDerivation]: boolean
}


export enum SolicitationAccessResultFields {
  SolicitationAccessStateCode = 'codSolicitudAccesoEstado',
  SolicitationAccessObservations = 'observacionesAccesoEstado',
  HasDefinedResult = 'tieneResultadoDefinido'
}


export interface SolicitationAccessResult {
  [SolicitationAccessResultFields.SolicitationAccessStateCode]: number,
  [SolicitationAccessResultFields.SolicitationAccessObservations]: string,
  [SolicitationAccessResultFields.HasDefinedResult]: boolean
}

export interface SolicitationAccessResultData {
  [SolicitationAccessResultFields.SolicitationAccessStateCode]: number,
  [SolicitationAccessResultFields.SolicitationAccessObservations]: string
}

export enum SolicitationAccessStateViewDTOFields {
  Detail = 'detalle',
  ActionId = 'idAccion',
  PositiveState = 'esResultadoPositivo',
  NegativeState = 'esResultadoNegativo'
}


export interface SolicitationAccessStateViewDTO extends EntityWithIdAndDescription {
  [SolicitationAccessStateViewDTOFields.Detail]: string,
  [SolicitationAccessStateViewDTOFields.ActionId]: number,
  [SolicitationAccessStateViewDTOFields.PositiveState]: boolean,
  [SolicitationAccessStateViewDTOFields.NegativeState]: boolean
}


export enum SolicitationSharedViewDTOFields {
  StartDate = 'fechaAlta',
  ProductDesc = 'descProducto',
  ProductLineDesc = 'descProductoLinea',
  ProductLineLongDesc = 'descProductoLineaLarga',
  BusinessNameOfferer = 'razonSocialOferente',
  BusinessNameCompany = 'razonSocialEmpresa',
  CompanyCuit = 'cuitEmpresa',
  CompanyFile = 'legajo',
  SurveyQuestionAnswer = 'encuesta'
}


export interface SolicitationSharedViewDTO extends EntityWithId<number> {
  [SolicitationSharedViewDTOFields.StartDate]: Date,
  [SolicitationSharedViewDTOFields.ProductDesc]: string,
  [SolicitationSharedViewDTOFields.ProductLineDesc]: string,
  [SolicitationSharedViewDTOFields.ProductLineLongDesc]: string,
  [SolicitationSharedViewDTOFields.BusinessNameOfferer]: string,
  [SolicitationSharedViewDTOFields.BusinessNameCompany]: string,
  [SolicitationSharedViewDTOFields.CompanyCuit]: string,
  [SolicitationSharedViewDTOFields.CompanyFile]: CompanyFilePublic,
  [SolicitationSharedViewDTOFields.SurveyQuestionAnswer]: SolicitationSurveyQuestionAnswer[],
}

export enum SolicitationStepFields {
  Title = 'titulo',
  Description = 'descripcion',
  IsCurrentStep = 'esPasoActual',
  CompletedStep = 'pasoCompletado',
  IsResultStep = 'esResultado',  
  IsFavorableResult = 'esResultadoFavorable'  
}


export interface SolicitationStep extends EntityWithId<number> {
  [SolicitationStepFields.Title]: string,
  [SolicitationStepFields.Description]: string,
  [SolicitationStepFields.IsCurrentStep]: boolean,
  [SolicitationStepFields.CompletedStep]: boolean,
  [SolicitationStepFields.IsResultStep]: boolean,
  [SolicitationStepFields.IsFavorableResult]: boolean,
}

export enum SolicitationCompanyRequirementDataViewFields {
  Description = 'descNombreDato',
  Value = 'valorDato',
  ApprovesRequirement = 'apruebaRequisito',
  ShowDataValue = 'muestraValorDato',
  ShowDataDescription = 'muestraNombreDato',
  IsPublicBases = 'esDatoInformacionPublica',
}

export interface SolicitationCompanyRequirementDataView {
  [SolicitationCompanyRequirementDataViewFields.Description]: string,
  [SolicitationCompanyRequirementDataViewFields.Value]: string,
  [SolicitationCompanyRequirementDataViewFields.ApprovesRequirement]: boolean,
  [SolicitationCompanyRequirementDataViewFields.ShowDataValue]: boolean,
  [SolicitationCompanyRequirementDataViewFields.ShowDataDescription]: boolean,
  [SolicitationCompanyRequirementDataViewFields.IsPublicBases]: boolean,
}

export enum SolicitationCompanyDataHeaderContainerFields {
    InformationDate = 'fechaInformacionDatos',
    LastUpdatePublicBasesDate = 'fechaUltAcualizacionBasesPublicas',
    CompliesRestrictions = 'cumpleRestricciones',
    DataHeaders = 'datosCabecera',
}

export interface SolicitationCompanyDataHeaderContainer {
    [SolicitationCompanyDataHeaderContainerFields.InformationDate]?: Date,
    [SolicitationCompanyDataHeaderContainerFields.LastUpdatePublicBasesDate]?: Date,
    [SolicitationCompanyDataHeaderContainerFields.CompliesRestrictions]: boolean,
    [SolicitationCompanyDataHeaderContainerFields.DataHeaders]: SolicitationCompanyDataHeader[],
}

export enum SolicitationCompanyDataHeaderFields {
    Description = 'descNombreDato',
    Value = 'valorDato',
    IsHighlighted = 'esDatoDestacado'
}

export interface SolicitationCompanyDataHeader {
    [SolicitationCompanyDataHeaderFields.Description]: string,
    [SolicitationCompanyDataHeaderFields.Value]?: string,
    [SolicitationCompanyDataHeaderFields.IsHighlighted]: boolean,
}

export enum SolicitationCompanyRequirementFields {
  CompanyFileDate = 'fechaInformacionLegajo',
  LastUpdatePublicBasesDate = 'fechaUltAcualizacionBasesPublicas',
  RequirementData = 'datos'
}

export interface SolicitationCompanyRequirement {
  [SolicitationCompanyRequirementFields.CompanyFileDate]: Date,
  [SolicitationCompanyRequirementFields.LastUpdatePublicBasesDate]?: Date,
  [SolicitationCompanyRequirementFields.RequirementData]: SolicitationCompanyRequirementDataView[],
}

export enum SolicitationMessageCheckoutFields {
  TitleStep = 'tituloPaso',
  SingularMessage = 'descMensajeSingular',
  Step = 'paso',
  IsConfirmationMessage = 'esMensajeConfirmacion'
}

export interface SolicitationMessageCheckout extends EntityWithIdAndDescription {
  [SolicitationMessageCheckoutFields.TitleStep]?: string,
  [SolicitationMessageCheckoutFields.SingularMessage]?: string,
  [SolicitationMessageCheckoutFields.Step]: number,
  [SolicitationMessageCheckoutFields.IsConfirmationMessage]: boolean,
}


export enum SolicitationInterchangedDocsContainerFields {
  Title = 'titulo',
  Sent = 'fueEnviada',
  Requested = 'esSolicitada',
  BeginDate = 'fechaAlta',
  SendDate = 'fechaEnvio',
  DirectionTypeFileCode = 'codArchivoSolicitudSentidoTipo',
  Data = 'datos'
}

export enum SolicitationDirectionTypeFileEnum {
  DocumentationSolicitation = 1, // Solicitud de Documentación (Receptor -> Solicitante)
  DocumentationSendFromReceiver = 2, // Envío de Documentación (Receptor -> Solicitante)
  DocuementationSendToReceiver = 3, // Envío de Documentación (Solicitante -> Receptor)
  CompanySolicitationFileSent = -1,
  CompanySolicitationFilePending = -2
}

export interface SolicitationInterchangedDocsContainer {
  [SolicitationInterchangedDocsContainerFields.Title]: string,
  [SolicitationInterchangedDocsContainerFields.Sent]: boolean,
  [SolicitationInterchangedDocsContainerFields.Requested]: boolean,
  [SolicitationInterchangedDocsContainerFields.SendDate]: Date,
  [SolicitationInterchangedDocsContainerFields.BeginDate]: Date,
  [SolicitationInterchangedDocsContainerFields.DirectionTypeFileCode]?: SolicitationDirectionTypeFileEnum,
  [SolicitationInterchangedDocsContainerFields.Data]: SolicitationFileRequested | FileSolicitation | CompanySolicitationFileHistory
}


export enum SolicitationReadyToSendFilterFields {
  SolicitationTypeCode = 'codSolicitudTipo',
  CompanyFileCode = 'codLegajoTipo'
}


export interface SolicitationReadyToSendFilter {
  [SolicitationReadyToSendFilterFields.SolicitationTypeCode]?: SolicitationTypes,
  [SolicitationReadyToSendFilterFields.CompanyFileCode]?: CompanyFileType
}

export enum SolicitationCancelMultipleFields {
    SolicitationsIdsList = 'idsSolicitudes',
}

export interface SolicitationCancelMultiple extends BaseRequest {
    [SolicitationCancelMultipleFields.SolicitationsIdsList]: number[]
}

export enum SolicitationOffererResultViewFields {
    ResultMessage = 'mensajeResultado',
    IsPositiveResult = 'esResultadoPositivo',
    ResultDate = 'fechaResultado',
    UserAnalysisId = 'idUsuarioAnalisis',
    UserAnalysisName = 'razonSocialUsuarioAnalisis',
    UserApprovalId = 'idUsuarioAprobacion',
    UserApprovalName = 'razonSocialUsuarioAprobacion',
    MessageCompany = 'mensajePyME',
}

export interface SolicitationOffererResultView {
    [SolicitationOffererResultViewFields.ResultMessage]: string,
    [SolicitationOffererResultViewFields.IsPositiveResult]: boolean,
    [SolicitationOffererResultViewFields.ResultDate]: Date,
    [SolicitationOffererResultViewFields.UserAnalysisId]?: number,
    [SolicitationOffererResultViewFields.UserAnalysisName]?: string,
    [SolicitationOffererResultViewFields.UserApprovalId]?: number,
    [SolicitationOffererResultViewFields.UserApprovalName]?: string,
    [SolicitationOffererResultViewFields.MessageCompany]?: string,
}

export enum SolicitationHistoryViewFields {
    RelatedDataCode = 'codSolicitudGestionDatoRelacionado',
    Date = 'fecha',
    UserId = 'idUsuario',
    UserName = 'razonSocialUsuario',
    IsPositiveResult = 'esResultadoPositivo',
    ResultCode = 'codResultado',
    ResultDesc = 'descResultado',
    RelatedId = 'idRelacionado',
    MessageCompany = 'mensaje',
}

export interface SolicitationHistoryView extends EntityWithId<number> {
    [SolicitationHistoryViewFields.RelatedDataCode]: number,
    [SolicitationHistoryViewFields.Date]: Date,
    [SolicitationHistoryViewFields.UserId]?: number,
    [SolicitationHistoryViewFields.UserName]?: string,
    [SolicitationHistoryViewFields.IsPositiveResult]: boolean,
    [SolicitationHistoryViewFields.ResultCode]: number,
    [SolicitationHistoryViewFields.ResultDesc]: string,
    [SolicitationHistoryViewFields.RelatedId]?: number,
    [SolicitationHistoryViewFields.MessageCompany]: string,
}