import { BaseRequest, EntityWithId } from '../baseEntities';

export enum SolicitationDocumentationApprovalViewDTOFields {
  SolicitationDocumentationAnalysisId = 'idSolicitudDocumentacionAnalisis',
  SolicitationId = 'idSolicitud',
  Justification = 'justificacion',
  ApprovalResultDate = 'fechaAprobacionResultado',
  SolicitationApprovalResultCode = 'codSolicitudAprobacionResultado',
  SolicitationApprovalResultDesc = 'descSolicitudAprobacionResultado',
}

export interface SolicitationDocumentationApprovalViewDTO
  extends EntityWithId<number> {
  [SolicitationDocumentationApprovalViewDTOFields.SolicitationDocumentationAnalysisId]: number;
  [SolicitationDocumentationApprovalViewDTOFields.SolicitationId]: number;
  [SolicitationDocumentationApprovalViewDTOFields.Justification]: string;
  [SolicitationDocumentationApprovalViewDTOFields.ApprovalResultDate]: Date;
  [SolicitationDocumentationApprovalViewDTOFields.SolicitationApprovalResultCode]: number;
  [SolicitationDocumentationApprovalViewDTOFields.SolicitationApprovalResultDesc]: string;
}

export enum SolicitationDocumentationApprovalUpdateDTOFields {
  Justification = 'justificacion',
  SolicitationApprovalResultCode = 'codSolicitudAprobacionResultado',
}

export interface SolicitationDocumentationApprovalUpdateDTO
  extends BaseRequest {
  [SolicitationDocumentationApprovalUpdateDTOFields.Justification]: string;
  [SolicitationDocumentationApprovalUpdateDTOFields.SolicitationApprovalResultCode]: number;
}
