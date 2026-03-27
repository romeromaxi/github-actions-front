import {
  BaseRequest,
  EntityWithId,
  EntityWithIdAndDescription,
} from '../baseEntities';
import { SolicitationApprovalResultType } from './solicitationEnums';

export enum SolicitationAnalysisViewDTOFields {
  Considerations = 'consideraciones',
  IsSuitable = 'estaApto',
  AptitudeDate = 'fechaAptitud',
  AptitudeMessage = 'mensajeAptitud',
  HasDefinedAptitude = 'tieneAptitudDefinida',
  AptitudeUserId = 'idUsuarioAptitud',
  AptitudeUserName = 'razonSocialUsuarioAptitud',
}

export interface SolicitationAnalysisViewDTO extends EntityWithId<number> {
  [SolicitationAnalysisViewDTOFields.Considerations]: string;
  [SolicitationAnalysisViewDTOFields.IsSuitable]: boolean;
  [SolicitationAnalysisViewDTOFields.AptitudeDate]: Date;
  [SolicitationAnalysisViewDTOFields.AptitudeMessage]: string;
  [SolicitationAnalysisViewDTOFields.HasDefinedAptitude]: boolean;
  [SolicitationAnalysisViewDTOFields.AptitudeUserId]?: number;
  [SolicitationAnalysisViewDTOFields.AptitudeUserName]: string;
}

export enum SolicitationAnalysisInsertFields {
  Considerations = 'consideraciones',
  IsSuitable = 'estaApto',
  AditionalAptitudeMessageList = 'listaMensajeAptitudAdicionales',
  FileSubtypeCodesList = 'codsArchivoSubtipo',
}

export interface SolicitationAnalysisInsert extends BaseRequest {
  [SolicitationAnalysisInsertFields.Considerations]: string;
  [SolicitationAnalysisInsertFields.IsSuitable]: boolean;
  [SolicitationAnalysisInsertFields.AditionalAptitudeMessageList]?: string[];
  [SolicitationAnalysisInsertFields.FileSubtypeCodesList]?: EntityWithIdAndDescription[];
}

export enum SolicitationAnalysisHistoricViewDTOFields {
  Considerations = 'consideraciones',
  IsSuitable = 'estaApto',
  AptitudeDate = 'fechaAptitud',
  AptitudeMessage = 'mensajeAptitud',
  HasDefinedAptitude = 'tieneAptitudDefinida',
  SolicitationApprovalId = 'idSolicitudAprobacion',
  ApprovalResultDate = 'fechaAprobacionResultado',
  Justification = 'justificacion',
  SolicitationApprovalResultCode = 'codSolicitudAprobacionResultado',
  SolicitationApprovalResultDesc = 'descSolicitudAprobacionResultado',
}

export interface SolicitationAnalysisHistoricViewDTO
  extends EntityWithId<number> {
  [SolicitationAnalysisHistoricViewDTOFields.Considerations]: string;
  [SolicitationAnalysisHistoricViewDTOFields.IsSuitable]: boolean;
  [SolicitationAnalysisHistoricViewDTOFields.AptitudeDate]: Date;
  [SolicitationAnalysisHistoricViewDTOFields.AptitudeMessage]: string;
  [SolicitationAnalysisHistoricViewDTOFields.HasDefinedAptitude]: boolean;
  [SolicitationAnalysisHistoricViewDTOFields.SolicitationApprovalId]: number;
  [SolicitationAnalysisHistoricViewDTOFields.ApprovalResultDate]: Date;
  [SolicitationAnalysisHistoricViewDTOFields.Justification]: string;
  [SolicitationAnalysisHistoricViewDTOFields.SolicitationApprovalResultCode]: SolicitationApprovalResultType;
  [SolicitationAnalysisHistoricViewDTOFields.SolicitationApprovalResultDesc]: string;
}

export interface SolicitationAnalysisResultViewDTO {
  [SolicitationAnalysisHistoricViewDTOFields.IsSuitable]: boolean;
  [SolicitationAnalysisHistoricViewDTOFields.AptitudeDate]: Date;
  [SolicitationAnalysisHistoricViewDTOFields.AptitudeMessage]: string;
  [SolicitationAnalysisHistoricViewDTOFields.HasDefinedAptitude]: boolean;
}
