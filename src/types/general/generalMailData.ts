import {EntityWithIdAndDescription} from "../baseEntities";

export enum MailViewFields { 
    Subject = 'subject',
    Body = 'body',
    HasAssociatedEvent = 'tieneEventoAsociado',
    GeneratesMail = 'generaMail',
    GeneratesNotification = 'generaNotificacion',
    Order = 'orden',
    Active = 'activo',
    ClassificationCode = 'codMailPlantillaClasificacion',
    ClassificationDesc = 'descMailPlantillaClasificacion'
}

export interface MailView extends EntityWithIdAndDescription {
    [MailViewFields.Subject]: string;
    [MailViewFields.Body]?: string;
    [MailViewFields.HasAssociatedEvent]: boolean;
    [MailViewFields.GeneratesMail]: boolean;
    [MailViewFields.GeneratesNotification]: boolean;
    [MailViewFields.Order]?: number;
    [MailViewFields.Active]?: boolean;
    [MailViewFields.ClassificationCode]?: number;
    [MailViewFields.ClassificationDesc]?: string;
}


export enum MailSendTestFields {
    SendTo = 'enviarA',
    Subject = 'subject',
    Body = 'body'
}
export interface MailSendTest {
    [MailSendTestFields.SendTo]: string,
    [MailSendTestFields.Subject]: string,
    [MailSendTestFields.Body]: string
}