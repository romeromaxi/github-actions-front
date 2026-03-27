import {
  BaseRequest,
  EntityWithId,
  EntityWithIdAndDescription,
} from '../baseEntities';
import {SolicitationApprovalResultType} from "./solicitationEnums";

export enum SolicitationApprovalViewDTOFields {
  SolicitationAnalysisId = 'idSolicitudAnalisis',
  SolicitationId = 'idSolicitud',
  Justification = 'justificacion',
  ApprovalResultDate = 'fechaAprobacionResultado',
  SolicitationApprovalResultCode = 'codSolicitudAprobacionResultado',
  SolicitationApprovalResultDesc = 'descSolicitudAprobacionResultado',
  HasDefiniteResult = 'esResultadoDefinido',
  IsPositiveResult = 'esResultadoPositivo',
  ApprovalResultUserId = 'idUsuarioAprobacionResultado',
  ApprovalResultUserName = 'razonSocialUsuarioAprobacionResultado',
}

export interface SolicitationApprovalViewDTO extends EntityWithId<number> {
  [SolicitationApprovalViewDTOFields.SolicitationAnalysisId]: number;
  [SolicitationApprovalViewDTOFields.SolicitationId]: number;
  [SolicitationApprovalViewDTOFields.Justification]: string;
  [SolicitationApprovalViewDTOFields.ApprovalResultDate]: Date;
  [SolicitationApprovalViewDTOFields.SolicitationApprovalResultCode]: SolicitationApprovalResultType;
  [SolicitationApprovalViewDTOFields.SolicitationApprovalResultDesc]: string;
  [SolicitationApprovalViewDTOFields.HasDefiniteResult]?: boolean;
  [SolicitationApprovalViewDTOFields.IsPositiveResult]?: boolean;
  [SolicitationApprovalViewDTOFields.ApprovalResultUserId]?: number;
  [SolicitationApprovalViewDTOFields.ApprovalResultUserName]?: string;
}

export enum SolicitationApprovalUpdateDTOFields {
  Justification = 'justificacion',
  SolicitationApprovalResultCode = 'codSolicitudAprobacionResultado',
}

export interface SolicitationApprovalUpdateDTO extends BaseRequest {
  [SolicitationApprovalUpdateDTOFields.Justification]: string;
  [SolicitationApprovalUpdateDTOFields.SolicitationApprovalResultCode]: number;
}

export enum SolicitationApprovalResultViewDTOFields {
  Detail = 'detalle',
  PositiveState = 'esResultadoPositivo',
}

export interface SolicitationApprovalResultViewDTO
  extends EntityWithIdAndDescription {
  [SolicitationApprovalResultViewDTOFields.Detail]: string;
  [SolicitationApprovalResultViewDTOFields.PositiveState]: boolean;
}


export enum SolicitationFilterViewDTOFields {
  SolicitationFilterTypeCode = 'codSolicitudFiltroTipo'
}


export interface SolicitationFilterViewDTO extends EntityWithIdAndDescription {
    [SolicitationFilterViewDTOFields.SolicitationFilterTypeCode]: number;
}