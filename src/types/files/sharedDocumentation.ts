import {BaseRequest, BaseRequestFields, EntityWithId} from "../baseEntities";


export enum SharedDocumentationPostFields {
    MailsToShare = 'mailsACompartir',
    Observations = 'observaciones',
    ShareDocumentsIdLst = 'idsDocumentosACompartir'
}


export interface SharedDocumentationPost extends BaseRequest {
    [SharedDocumentationPostFields.MailsToShare]: string[],
    [SharedDocumentationPostFields.ShareDocumentsIdLst]: number[],
    [SharedDocumentationPostFields.Observations]: string
}


export enum SharedDocumentationDataFields {
    Observations = 'observaciones',
    DateSent = 'fechaEnvio',
    SenderMail = 'mailRemitente'
}


export interface SharedDocumentationData extends EntityWithId<number> {
    [SharedDocumentationDataFields.Observations]: string,
    [SharedDocumentationDataFields.DateSent]: Date,
    [SharedDocumentationDataFields.SenderMail]: string
}


export enum SharedDocumentationValidationFields {
    Pin = 'pin',
    Captcha = 'captcha'
}


export interface SharedDocumentationValidation {
    [BaseRequestFields.ModuleCode]: number,
    [SharedDocumentationValidationFields.Pin]: string,
    [SharedDocumentationValidationFields.Captcha]: string
}