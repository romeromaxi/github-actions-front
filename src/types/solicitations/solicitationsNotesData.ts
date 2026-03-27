import {BaseRequest, EntityWithId} from "../baseEntities";

export enum SolicitationNoteFields {
    Message = 'detalleNota',
    UserId = 'idUsuarioAlta',
    UserBusinessName = 'razonSocialUsuarioAlta',
    CreationDate = 'fechaAlta',
    RelatedDataCode = 'codSolicitudGestionDatoRelacionado',
    RelatedDataId = 'idDatoRelacionado',
}

export interface SolicitationNoteRelatedData {
    [SolicitationNoteFields.RelatedDataCode]?: number;
    [SolicitationNoteFields.RelatedDataId]?: number;
}

export interface SolicitationNote extends EntityWithId<number> {
    [SolicitationNoteFields.Message]: string;
    [SolicitationNoteFields.UserId]: number;
    [SolicitationNoteFields.UserBusinessName]: string;
    [SolicitationNoteFields.CreationDate]: Date;
}

export interface SolicitationNoteInsert extends BaseRequest {
    [SolicitationNoteFields.Message]: string;
    [SolicitationNoteFields.RelatedDataCode]?: number;
    [SolicitationNoteFields.RelatedDataId]?: number;
}