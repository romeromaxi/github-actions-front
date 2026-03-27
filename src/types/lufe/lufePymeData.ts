import {EntityWithId} from "../baseEntities";


export enum LufePymeRequestFields {
    RequestId = 'idLufeConsulta',
    CUIT = 'cuit',
    Name = 'nombre',
    MainActivityCode = 'actividad_principal',
    LegalForm = 'forma_juridica',
    SocialContractDate = 'fecha_contrato_social',
    Personery = 'personeria',
    Taxes = 'impuestos',
    Activities = 'actividades',
    PymeCertificate = 'certificado_pyme',
    //Contacts = 'contactos',
    ModifiedDate = 'fecha_modificacion',
    Employment = 'empleo',
    FiscalAddress = 'domicilio_fiscal',
    //Regimens = 'regimenes',
    LastModifications = 'ultimas_modificaciones'
}

export interface LufePymeRequest extends EntityWithId<number> {
    [LufePymeRequestFields.RequestId]: number,
    [LufePymeRequestFields.CUIT]?: string,
    [LufePymeRequestFields.Name]?: string,
    [LufePymeRequestFields.MainActivityCode]?: string,
    [LufePymeRequestFields.LegalForm]?: string,
    [LufePymeRequestFields.SocialContractDate]?: Date,
    [LufePymeRequestFields.Personery]?: string,
    [LufePymeRequestFields.Taxes]?: LufePymeTax[],
    [LufePymeRequestFields.Activities]?: LufePymeActivity[],
    [LufePymeRequestFields.PymeCertificate]?: LufePymeCertificate,
    [LufePymeRequestFields.ModifiedDate]?: Date,
    [LufePymeRequestFields.Employment]?: LufePymeEmployment[],
    [LufePymeRequestFields.FiscalAddress]?: string,
    [LufePymeRequestFields.LastModifications]?: LufePymeLastModifications
}

export enum LufePymeTaxFields {
    RequestId = 'idLufeConsulta',
    CharacterizationCode = 'codigo_caracterizacion',
    TaxDesc = 'descripcionImpuesto',
    State = 'estado',
    StateDesc = 'descripcionEstado',
    Origin = 'origen',
    CurrentIdentificationState = 'identificacion_estado_vigente',
    CurrentPeriod = 'periodo_vigencia',
    UpdateDate = 'fecha_actualizacion'
}

export interface LufePymeTax extends EntityWithId<number> {
    [LufePymeTaxFields.RequestId]: number,
    [LufePymeTaxFields.CharacterizationCode]?: string,
    [LufePymeTaxFields.TaxDesc]?: string,
    [LufePymeTaxFields.State]?: string,
    [LufePymeTaxFields.StateDesc]?: string,
    [LufePymeTaxFields.Origin]?: string,
    [LufePymeTaxFields.CurrentIdentificationState]?: string,
    [LufePymeTaxFields.CurrentPeriod]?: string,
    [LufePymeTaxFields.UpdateDate]?: Date
}


export enum LufePymeActivityFields {
    RequestId = 'idLufeConsulta',
    ActivityCode = 'codigo',
    ActivityDesc = 'descripcionActividad',
    State = 'estado',
    StateDesc = 'descripcionEstado',
    Origin = 'origen',
    Current = 'vigente',
    CurrentPeriod = 'periodo_vigencia',
    UpdateDate = 'fecha_actualizacion'
}

export interface LufePymeActivity extends EntityWithId<number> {
    [LufePymeActivityFields.RequestId]?: number,
    [LufePymeActivityFields.ActivityCode]?: string,
    [LufePymeActivityFields.ActivityDesc]?: string,
    [LufePymeActivityFields.State]?: string,
    [LufePymeActivityFields.StateDesc]?: string,
    [LufePymeActivityFields.Origin]?: string,
    [LufePymeActivityFields.Current]?: string,
    [LufePymeActivityFields.CurrentPeriod]?: string,
    [LufePymeActivityFields.UpdateDate]?: Date
}

export enum LufePymeCertificateFields {
    RequestId = 'idLufeConsulta',
    Category = 'categoria',
    DateFrom = 'desde',
    EmissionDate = 'fecha_emision',
    DateTo = 'hasta',
    RegisterNumber = 'nro_registro',
    Sector = 'sector',
    Transaction = 'transaccion'
}

export interface LufePymeCertificate extends EntityWithId<number> {
    [LufePymeCertificateFields.RequestId]: number,
    [LufePymeCertificateFields.Category]?: string,
    [LufePymeCertificateFields.DateFrom]?: Date,
    [LufePymeCertificateFields.DateTo]?: Date,
    [LufePymeCertificateFields.EmissionDate]?: Date,
    [LufePymeCertificateFields.RegisterNumber]?: string,
    [LufePymeCertificateFields.Sector]?: string,
    [LufePymeCertificateFields.Transaction]?: string
}

export enum LufePymeEmploymentFields {
    RequestId = 'idLufeConsulta',
    Period = 'Periodo',
    PresentationDate = 'Fecha_present',
    RectificationNumber = 'numero_rectif',
    EmployeeQuantity = 'Empleo',
    GrossSalaryMass = 'Masa_salarial_bruta'
}

export interface LufePymeEmployment extends EntityWithId<number> {
    [LufePymeEmploymentFields.RequestId]: number,
    [LufePymeEmploymentFields.Period]?: string,
    [LufePymeEmploymentFields.PresentationDate]?: Date,
    [LufePymeEmploymentFields.RectificationNumber]?: string,
    [LufePymeEmploymentFields.EmployeeQuantity]?: number,
    [LufePymeEmploymentFields.GrossSalaryMass]?: number
}


export enum LufePymeLastModificationsFields {
    RequestId = 'idLufeConsulta',
    LastIndicatorsAct = 'indicadores',
    LastDocumentsAct = 'documentos',
    LastAuthoritiesAct = 'autoridades'
}

export interface LufePymeLastModifications extends EntityWithId<number> {
    [LufePymeLastModificationsFields.RequestId]: number,
    [LufePymeLastModificationsFields.LastIndicatorsAct]?: Date,
    [LufePymeLastModificationsFields.LastDocumentsAct]?: Date,
    [LufePymeLastModificationsFields.LastAuthoritiesAct]?: Date
}