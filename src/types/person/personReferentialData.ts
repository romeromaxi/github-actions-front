import { EntityWithId } from '../baseEntities';

export enum PersonMailFields {
  MailTypeCode = 'codMailTipo',
  Mail = 'mail',
  PersonId = 'idPersona',
  MailTypeDesc = 'descMailTipo',
}

export interface PersonMail extends EntityWithId<number> {
  [PersonMailFields.PersonId]: number;
  [PersonMailFields.MailTypeCode]: number;
  [PersonMailFields.MailTypeDesc]: string;
  [PersonMailFields.Mail]: string;
}

export enum PersonAddressFields {
  PersonId = 'idPersona',
  AddressTypeCode = 'codDomicilioTipo',
  Street = 'calle',
  StreetNumber = 'calleNro',
  Floor = 'piso',
  Apartment = 'departamento',
  Neighborhood = 'barrio',
  PostalCode = 'codigoPostal',
  MunicipalityCode = 'codLocalidad',
  DepartmentCode = 'codPartido',
  ProvinceCode = 'codProvincia',
  CountryCode = 'codPais',
  AddressTypeDesc = 'descDomicilioTipo',
  MunicipalityDesc = 'descLocalidad',
  DepartmentDesc = 'descPartido',
  ProvinceDesc = 'descProvincia',
  StreetWithNumber = 'calleCompleta',
  FullAddress = 'calleCompletaConTipoDomicilio',
}

export interface PersonAddress extends EntityWithId<number> {
  [PersonAddressFields.PersonId]?: number;
  [PersonAddressFields.AddressTypeCode]?: number;
  [PersonAddressFields.Street]?: string;
  [PersonAddressFields.StreetNumber]?: string;
  [PersonAddressFields.Floor]?: string;
  [PersonAddressFields.Apartment]?: string;
  [PersonAddressFields.Neighborhood]?: string;
  [PersonAddressFields.PostalCode]?: string;
  [PersonAddressFields.MunicipalityCode]?: number | null;
  [PersonAddressFields.DepartmentCode]?: number | null;
  [PersonAddressFields.ProvinceCode]?: number | null;
  [PersonAddressFields.CountryCode]?: number | null;
  [PersonAddressFields.AddressTypeDesc]?: string;
  [PersonAddressFields.MunicipalityDesc]?: string;
  [PersonAddressFields.DepartmentDesc]?: string;
  [PersonAddressFields.ProvinceDesc]?: string;
  [PersonAddressFields.StreetWithNumber]?: string;
  [PersonAddressFields.FullAddress]?: string;
}

export enum PersonPhoneNumberFields {
  PhoneTypeCode = 'codTelefonoTipo',
  PhoneTypeDesc = 'descTelefonoTipo',
  PhoneNumber = 'telefono',
  PersonId = 'idPersona',
}

export interface PersonPhoneNumber extends EntityWithId<number> {
  [PersonPhoneNumberFields.PersonId]: number;
  [PersonPhoneNumberFields.PhoneTypeCode]: number;
  [PersonPhoneNumberFields.PhoneNumber]: string;
  [PersonPhoneNumberFields.PhoneTypeDesc]: string;
}

export interface PersonMailInsert {
  [PersonMailFields.MailTypeCode]: number;
  [PersonMailFields.Mail]: string;
}

export interface PersonPhoneNumberInsert {
  [PersonPhoneNumberFields.PhoneTypeCode]: number;
  [PersonPhoneNumberFields.PhoneNumber]: string;
}

export interface PersonAddressInsert {
  [PersonAddressFields.AddressTypeCode]?: number;
  [PersonAddressFields.Street]?: string;
  [PersonAddressFields.StreetNumber]?: string;
  [PersonAddressFields.Floor]?: string;
  [PersonAddressFields.Apartment]?: string;
  [PersonAddressFields.PostalCode]?: string;
  [PersonAddressFields.MunicipalityCode]?: number | null;
  [PersonAddressFields.DepartmentCode]?: number | null;
  [PersonAddressFields.ProvinceCode]?: number | null;
  [PersonAddressFields.CountryCode]?: number | null;
}

export enum PersonAddressInsertListFields {
  ListPersonAddresses = 'listaDomicilio',
  ModuleCode = 'codModulo',
  OriginCode = 'codOrigen',
}
