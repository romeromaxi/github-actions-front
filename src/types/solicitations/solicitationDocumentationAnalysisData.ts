import { BaseRequest, EntityWithId } from '../baseEntities';
import { SolicitationApprovalResultType } from './solicitationEnums';

export enum SolicitationDocumentationAnalysisViewDTOFields {
  Considerations = 'consideraciones',
  IsSuitable = 'estaApto',
  AptitudeDate = 'fechaAptitud',
  AptitudeMessage = 'mensajeAptitud',
  HasDefinedAptitude = 'tieneAptitudDefinida',
}

export interface SolicitationDocumentationAnalysisViewDTO
  extends EntityWithId<number> {
  [SolicitationDocumentationAnalysisViewDTOFields.Considerations]: string;
  [SolicitationDocumentationAnalysisViewDTOFields.IsSuitable]: boolean;
  [SolicitationDocumentationAnalysisViewDTOFields.AptitudeDate]: Date;
  [SolicitationDocumentationAnalysisViewDTOFields.AptitudeMessage]: string;
  [SolicitationDocumentationAnalysisViewDTOFields.HasDefinedAptitude]: boolean;
}

export enum SolicitationDocumentationAnalysisInsertFields {
  Considerations = 'consideraciones',
  IsSuitable = 'estaApto',
  AditionalAptitudeMessageList = 'listaMensajeAptitudAdicionales',
}

export interface SolicitationDocumentationAnalysisInsert extends BaseRequest {
  [SolicitationDocumentationAnalysisInsertFields.Considerations]: string;
  [SolicitationDocumentationAnalysisInsertFields.IsSuitable]: boolean;
  [SolicitationDocumentationAnalysisInsertFields.AditionalAptitudeMessageList]?: string[];
}

export enum SolicitationDocumentationAnalysisHistoricViewDTOFields {
  Considerations = 'consideraciones',
  IsSuitable = 'estaApto',
  AptitudeMessage = 'mensajeAptitud',
  AptitudeDate = 'fechaAptitud',
  HasDefinedAptitude = 'tieneAptitudDefinida',
  SolicitationDocumentationApprovalId = 'idSolicitudDocumentacionAprobacion',
  ApprovalResultDate = 'fechaAprobacionResultado',
  Justification = 'justificacion',
  SolicitationApprovalResultCode = 'codSolicitudAprobacionResultado',
  SolicitationApprovalResultDesc = 'descSolicitudAprobacionResultado',
}

export interface SolicitationDocumentationAnalysisHistoricViewDTO
  extends EntityWithId<number> {
  [SolicitationDocumentationAnalysisHistoricViewDTOFields.Considerations]: string;
  [SolicitationDocumentationAnalysisHistoricViewDTOFields.IsSuitable]: boolean;
  [SolicitationDocumentationAnalysisHistoricViewDTOFields.AptitudeMessage]: string;
  [SolicitationDocumentationAnalysisHistoricViewDTOFields.AptitudeDate]: Date;
  [SolicitationDocumentationAnalysisHistoricViewDTOFields.HasDefinedAptitude]: boolean;
  [SolicitationDocumentationAnalysisHistoricViewDTOFields.SolicitationDocumentationApprovalId]: number;
  [SolicitationDocumentationAnalysisHistoricViewDTOFields.ApprovalResultDate]: Date;
  [SolicitationDocumentationAnalysisHistoricViewDTOFields.Justification]: string;
  [SolicitationDocumentationAnalysisHistoricViewDTOFields.SolicitationApprovalResultCode]: SolicitationApprovalResultType;
  [SolicitationDocumentationAnalysisHistoricViewDTOFields.SolicitationApprovalResultDesc]: string;
}

export enum SolicitationAptitudeFormViewDTOFields {
  FormTexts = 'listaTextosFormularios',
  HasFinalAdditionalField = 'tieneCampoAdicionalFinal',
}

export interface SolicitationAptitudeFormViewDTO {
  [SolicitationAptitudeFormViewDTOFields.FormTexts]: string[];
  [SolicitationAptitudeFormViewDTOFields.HasFinalAdditionalField]: boolean;
}

export enum SolicitationDocumentationAnalysisUpdateConsiderationsFields {
  Considerations = 'consideraciones',
}

export interface SolicitationDocumentationAnalysisUpdateConsiderations extends BaseRequest {
  [SolicitationDocumentationAnalysisUpdateConsiderationsFields.Considerations]: string;
}


export enum SolicitationDerivationResultViewFields {
  SolicitationId = 'idSolicitud',
  CompanyFileId = 'idLegajo',
  OffererId = 'idOferente',
  AccessStateSolicitationCode = 'codSolicitudAccesoEstado',
  AccessStateObservations = 'observacionesAccesoEstado',
  HasDefinedResult = 'tieneResultadoDefinido',
  OffererComunicatedFollowing = 'seComunicoSegumientoOferente',
  LastModifiedDate = 'fechaUltSolicitudAccesoEstado',
  LastModifiedUserBusinessName = 'razonSocialUsuarioUltAccesoEstado',
  SolicitationIdPlatformDerivation = 'idSolicitudDerivacionPlataforma'  
}


export interface SolicitationDerivationResultView {
  [SolicitationDerivationResultViewFields.SolicitationId]: number;
  [SolicitationDerivationResultViewFields.CompanyFileId]: number;
  [SolicitationDerivationResultViewFields.OffererId]: number;
  [SolicitationDerivationResultViewFields.AccessStateSolicitationCode]: number;
  [SolicitationDerivationResultViewFields.AccessStateObservations]: string;
  [SolicitationDerivationResultViewFields.HasDefinedResult]: boolean;
  [SolicitationDerivationResultViewFields.OffererComunicatedFollowing]: boolean;
  [SolicitationDerivationResultViewFields.LastModifiedDate]?: Date;
  [SolicitationDerivationResultViewFields.LastModifiedUserBusinessName]?: string;
  [SolicitationDerivationResultViewFields.SolicitationIdPlatformDerivation]?: number;
}