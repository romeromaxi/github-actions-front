import { PersonAddress } from './personReferentialData';

export enum PersonConsultantDTO {
  BusinessName = 'razonSocial',
  ModuleCode = 'codModulo',
}

export enum PersonCompanyConsultantDTO {
  PersonClassificationCode = 'codPersonaClasificacion',
  BusinessName = 'razonSocial',
  ModuleCode = 'codModulo',
}

export enum PersonCompanyConsultantResponseDTOFields {
  CompanyId = 'idEmpresa',
  CompanyBusinessName = 'razonSocial',
  PersonId = 'idPersona',
  FirstName = 'nombre',
  LastName = 'apellido',
  ExistingCompany = 'esEmpresaExistente',
  ActiveCompany = 'esEmpresaActiva',
  Valid = 'esValida',
  DescriptionState = 'descripcionEstado',
  PersonTypeCod = 'codPersonaTipo',
  ValidationStateCod = 'codValidacionEstado',
  HasTaxActivity = 'tieneActividadTributaria',
}

export interface PersonCompanyConsultantResponseDTO {
  [PersonCompanyConsultantResponseDTOFields.CompanyId]: number;
  [PersonCompanyConsultantResponseDTOFields.CompanyBusinessName]: string;
  [PersonCompanyConsultantResponseDTOFields.PersonId]: number;
  [PersonCompanyConsultantResponseDTOFields.ExistingCompany]: boolean;
  [PersonCompanyConsultantResponseDTOFields.ActiveCompany]: boolean;
  [PersonCompanyConsultantResponseDTOFields.Valid]: boolean;
  [PersonCompanyConsultantResponseDTOFields.FirstName]?: string;
  [PersonCompanyConsultantResponseDTOFields.LastName]?: string;
  [PersonCompanyConsultantResponseDTOFields.DescriptionState]: string;
  [PersonCompanyConsultantResponseDTOFields.PersonTypeCod]?: number;
  [PersonCompanyConsultantResponseDTOFields.ValidationStateCod]?: number;
  [PersonCompanyConsultantResponseDTOFields.HasTaxActivity]?: boolean;
}

export enum PersonConsultantResponseDTOFields {
  PersonId = 'idPersona',
  Valid = 'esValida',
  DescriptionState = 'descripcionEstado',
  FiscalAddress = 'domicilioFiscal',
  BusinessName = 'razonSocial'
}

export interface PersonConsultantResponseDTO {
  [PersonConsultantResponseDTOFields.PersonId]: number;
  [PersonConsultantResponseDTOFields.Valid]: boolean;
  [PersonConsultantResponseDTOFields.DescriptionState]: string;
  [PersonConsultantResponseDTOFields.FiscalAddress]: PersonAddress;
  [PersonConsultantResponseDTOFields.DescriptionState]: string;
  [PersonConsultantResponseDTOFields.BusinessName]: string;
}

export enum PersonOffererConsultantDTO {
  PersonResposibleId = 'cuitresponsable',
  PersonClassificationCode = 'tipo',
  Mail = 'mail',
  Telephone = 'telefono',
  ModuleCode = 'codModulo',
  Logo = 'logo',
  LogInName = 'nombreAcceso',
  BusinessTradeName = 'nombreFantasia'
}

export enum PersonOffererConsultantResponseDTOFields {
  OffererId = 'idOferente',
  OffererBusinessName = 'razonSocial',
  ExistingOfferer = 'esOferenteExistente',
  Valid = 'esValida',
  DescriptionState = 'descripcionEstado',
}

export interface PersonOffererConsultantResponseDTO {
  [PersonOffererConsultantResponseDTOFields.OffererId]: number;
  [PersonOffererConsultantResponseDTOFields.OffererBusinessName]: string;
  [PersonOffererConsultantResponseDTOFields.ExistingOfferer]: boolean;
  [PersonOffererConsultantResponseDTOFields.Valid]: boolean;
  [PersonOffererConsultantResponseDTOFields.DescriptionState]: string;
}
