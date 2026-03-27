import {EntityWithIdAndDescription, EntityWithIdAndDescriptionQuantity} from '../baseEntities';
import {ReportTypes} from "./offererReportsEnums";

export enum PeriodicityTypes {
  Daily = 1,
  Weekly = 2,
  Monthly = 3,
}

export interface OffererReportLinesByProduct
  extends EntityWithIdAndDescriptionQuantity {}

export interface OffererReportSolicitationsByProduct
  extends EntityWithIdAndDescriptionQuantity {}

export enum OffererReportReceivedSolicitationsFields {
  Unassigned = 'cantSolicitudesSinAsignar',
  Analysis = 'cantSolicitudesEnAnalisis',
  Terminated = 'cantSolicitudesTerminadas',
  Prequalified = 'cantSolicitudesPrecalificadas',
}

export type OffererReportReceivedSolicitations = {
  [OffererReportReceivedSolicitationsFields.Unassigned]: number;
  [OffererReportReceivedSolicitationsFields.Analysis]: number;
  [OffererReportReceivedSolicitationsFields.Terminated]: number;
  [OffererReportReceivedSolicitationsFields.Prequalified]: number;
};

export enum OffererReportEvolutionViewsVsReceivedSolicitationsFields {
  Date = 'fecha',
  ReceivedSolicitations = 'solicitudes',
  Views = 'vistas',
}

export type OffererReportEvolutionViewsVsReceivedSolicitations = {
  [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: Date;
  [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: number;
  [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: number;
};

export enum OffererReportSolicitationsByStageAndTeamFields {
  TeamDesc = 'nombreEquipoTrabajo',
  Admission = 'cantSolicitudesAdmision',
  AdmissionApproval = 'cantSolicitudesAprobacionAdmision',
  PrequalificationAnalysis = 'cantSolicitudesAnalisisPrecalifacion',
  PrequalificationApproval = 'cantSolicitudesAprobacionPrecalifacion',
}

export interface OffererReportSolicitationsByStageAndTeam
  extends EntityWithIdAndDescriptionQuantity {
  [OffererReportSolicitationsByStageAndTeamFields.TeamDesc]: string;
  [OffererReportSolicitationsByStageAndTeamFields.Admission]: number;
  [OffererReportSolicitationsByStageAndTeamFields.AdmissionApproval]: number;
  [OffererReportSolicitationsByStageAndTeamFields.PrequalificationAnalysis]: number;
  [OffererReportSolicitationsByStageAndTeamFields.PrequalificationApproval]: number;
}

export enum OffererReportSolicitationsTimeByStageFields {
  Admission = 'promedioDiasEnAdmision',
  AdmissionApproval = 'promedioDiasEnAprobacionAdmision',
  PrequalificationAnalysis = 'promedioDiasEnAnalisisPrecalifacionAdmision',
  PrequalificationApproval = 'promedioDiasEnAprobacionPrecalifacion',
}

export interface OffererReportSolicitationsTimeByStage {
  [OffererReportSolicitationsTimeByStageFields.Admission]: number;
  [OffererReportSolicitationsTimeByStageFields.AdmissionApproval]: number;
  [OffererReportSolicitationsTimeByStageFields.PrequalificationAnalysis]: number;
  [OffererReportSolicitationsTimeByStageFields.PrequalificationApproval]: number;
}

export enum OffererReportSolicitationByTimeInStageFields {
  StageDesc = 'descSolicitudEstado',
  UnderTenDays = 'cantSolicitudesMenosDe10Dias',
  ElevenToThirtyDays = 'cantSolicitudesEntre11y30Dias',
  MoreThanThirtyDays = 'cantSolicitudesMasDe30Dias',
}

export interface OffererReportSolicitationByTimeInStage {
  [OffererReportSolicitationByTimeInStageFields.StageDesc]: string;
  [OffererReportSolicitationByTimeInStageFields.UnderTenDays]: number;
  [OffererReportSolicitationByTimeInStageFields.ElevenToThirtyDays]: number;
  [OffererReportSolicitationByTimeInStageFields.MoreThanThirtyDays]: number;
}


export enum OffererReportSummaryFields {
  ReportTypeCode = 'codReporteTipo',
  ReportTitle = 'reporteTitulo',
  ReportUrl = 'reporteUrl',
  ReportDatasetId = 'reporteDataSetId',
  ReportTableId = 'reporteTableId',
  ReportStoredProcedure = 'reporteStoredProcedure'
}


export interface OffererReportSummary extends EntityWithIdAndDescription {
  [OffererReportSummaryFields.ReportTypeCode]: ReportTypes;
  [OffererReportSummaryFields.ReportTitle]: string;
  [OffererReportSummaryFields.ReportUrl]: string;
  [OffererReportSummaryFields.ReportDatasetId]?: string;
  [OffererReportSummaryFields.ReportTableId]?: string;
  [OffererReportSummaryFields.ReportStoredProcedure]?: string;
}



export enum InternalReportSummaryTotalFields {
  TotalUsersQty = 'cantidadUsuariosTotal',
  ValidatedUsersQty = 'cantidadUsuariosValdiados',
  LastWeekNewUsersQty = 'cantidadUsuariosNuevasUltSemana',
  TotalCompaniesQty = 'cantidadEmpresasTotal',
  ValidatedCompaniesQty = 'cantidadEmpresasValidadas',
  LastWeekNewCompaniesQty = 'cantidadEmpresasNuevasUltSemana'
}


export interface InternalReportSummaryTotal {
  [InternalReportSummaryTotalFields.TotalUsersQty]: number;
  [InternalReportSummaryTotalFields.ValidatedUsersQty]: number;
  [InternalReportSummaryTotalFields.LastWeekNewUsersQty]: number;
  [InternalReportSummaryTotalFields.TotalCompaniesQty]: number;
  [InternalReportSummaryTotalFields.ValidatedCompaniesQty]: number;
  [InternalReportSummaryTotalFields.LastWeekNewCompaniesQty]: number;
}