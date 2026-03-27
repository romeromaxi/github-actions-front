

export enum SitesContactFormFields {
    Name = 'nombre',
    Mail = 'mail',
    Subject = 'asunto',
    Message = 'mensaje'
}


export interface SitesContactForm {
    [SitesContactFormFields.Name]: string,
    [SitesContactFormFields.Message]: string,
    [SitesContactFormFields.Subject]: string,
    [SitesContactFormFields.Mail]: string
}