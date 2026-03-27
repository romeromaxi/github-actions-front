import {EntityWithId} from "../baseEntities";

export enum PendingActionType {
    SOLICITUDES_LISTAS = 1,
    SOLICITUD_CHAT_PENDIENTE = 2,
    SOLICITUD_DOCUMENTACION_PENDIENTE = 3,
    EMPRESA_LEGAJO_INCOMPLETO = 4,
    EMPRESA_SIN_VERIFICACION = 5,
    INVITACION_RECIBIDA = 6,
}


export enum PendingActionFields {
    PendingActivityTypeCode = 'codActividadPendienteTipo',
    HeaderTitle = 'tituloCabecera',
    TitleDetail = 'tituloDetalle',
    RelatedId = 'idRelacionado',
    Date = 'fecha',
    CompanyId = 'idEmpresa',
    OffererId = 'idOferente',
    CompanyPersonTypeCode = 'codPersonaTipoEmpresa',
    CompanyBusinessName = 'razonSocialEmpresa',

    OffererBusinessName = 'razonSocialOferente',
    OffererUrlLogo = 'urlOferenteLogo',
}

export interface PendingActionView extends EntityWithId<number> {
    [PendingActionFields.PendingActivityTypeCode]: PendingActionType;
    [PendingActionFields.HeaderTitle]: string;
    [PendingActionFields.TitleDetail]: string;
    [PendingActionFields.RelatedId]?: number;
    [PendingActionFields.Date]: string;
    [PendingActionFields.CompanyId]?: number;
    [PendingActionFields.OffererId]?: number;
    [PendingActionFields.CompanyPersonTypeCode]?: number;
    [PendingActionFields.CompanyBusinessName]?: string;
    [PendingActionFields.OffererBusinessName]?: string;
    [PendingActionFields.OffererUrlLogo]?: string;
}

