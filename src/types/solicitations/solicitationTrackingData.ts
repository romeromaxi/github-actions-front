import {EntityWithId} from "types/baseEntities";

export enum SolicitationTrackingFields {
    FinancialEntityId = 'idEntidadFinanciera',
    FinancialEntityBusinessName = 'razonSocialEntidadFinanciera',
    SolicitationTrackingStatusCode = 'codSolicitudSeguimientoEstado',
    SolicitationTrackingStatusDesc = 'descSolicitudSeguimientoEstado',
    Observations = 'observacionesSeguimiento',
    ContactInformation = 'datosContacto',
    RelatedLink = 'enlaceRelacionado',
    HasDefiniteResults = 'tieneResultadoDefinido',
    IsTrackedByPlatform = 'tieneSeguimientoPorPlataforma',
    BeginDate = 'fechaAlta',
    LastModifiedStatusDate = 'fechaUltModEstado',
}

export interface SolicitationTrackingView extends EntityWithId<number> {
    [SolicitationTrackingFields.FinancialEntityId]: number,
    [SolicitationTrackingFields.FinancialEntityBusinessName]: string,
    [SolicitationTrackingFields.SolicitationTrackingStatusCode]: number,
    [SolicitationTrackingFields.SolicitationTrackingStatusDesc]: string,
    [SolicitationTrackingFields.Observations]: string,
    [SolicitationTrackingFields.ContactInformation]: string,
    [SolicitationTrackingFields.RelatedLink]: string,
    [SolicitationTrackingFields.HasDefiniteResults]: boolean,
    [SolicitationTrackingFields.IsTrackedByPlatform]: boolean,
    [SolicitationTrackingFields.BeginDate]: Date,
    [SolicitationTrackingFields.LastModifiedStatusDate]?: Date,
}

export interface SolicitationTrackingUpdateStatus {
    [SolicitationTrackingFields.SolicitationTrackingStatusCode]: number,
    [SolicitationTrackingFields.Observations]: string,
}

export interface SolicitationTrackingInstrumentationView extends EntityWithId<number> {
    [SolicitationTrackingFields.SolicitationTrackingStatusCode]: number,
    [SolicitationTrackingFields.SolicitationTrackingStatusDesc]: string,
    [SolicitationTrackingFields.Observations]: string,
    [SolicitationTrackingFields.BeginDate]: Date,
    [SolicitationTrackingFields.LastModifiedStatusDate]?: Date,
}
