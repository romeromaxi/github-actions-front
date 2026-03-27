import { EntityWithId } from '../baseEntities';
import { AddressTypes } from './generalEnums';

export enum EntityMailFields {
  Mail = 'mail',
  MailTypeCode = 'codMailTipo',
  MailTypeDesc = 'descMailTipo',
  PersonId = 'idPersona',
}

export interface EntityMail extends EntityWithId<number> {
  [EntityMailFields.Mail]: string;
  [EntityMailFields.MailTypeCode]: number;
  [EntityMailFields.MailTypeDesc]: string;
  [EntityMailFields.PersonId]?: number;
}

export enum EntityAddressFields {
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

export interface EntityAddress extends EntityWithId<number> {
  [EntityAddressFields.AddressTypeCode]: AddressTypes;
  [EntityAddressFields.Street]?: string;
  [EntityAddressFields.StreetNumber]?: string;
  [EntityAddressFields.Floor]?: string;
  [EntityAddressFields.Apartment]?: string;
  [EntityAddressFields.Neighborhood]?: string;
  [EntityAddressFields.PostalCode]?: string;
  [EntityAddressFields.MunicipalityCode]?: number | null;
  [EntityAddressFields.DepartmentCode]?: number | null;
  [EntityAddressFields.ProvinceCode]?: number | null;
  [EntityAddressFields.CountryCode]?: number | null;
  [EntityAddressFields.AddressTypeDesc]?: string;
  [EntityAddressFields.MunicipalityDesc]?: string;
  [EntityAddressFields.DepartmentDesc]?: string;
  [EntityAddressFields.ProvinceDesc]?: string;
  [EntityAddressFields.StreetWithNumber]?: string;
  [EntityAddressFields.FullAddress]?: string;
}

export enum EntityPhoneNumberFields {
  PhoneTypeCode = 'codTelefonoTipo',
  PhoneTypeDesc = 'descTelefonoTipo',
  PhoneNumber = 'telefono',
  AreaCode = 'codigoArea',
  Whatsapp = 'tieneWhatsApp',
  MainPhone = 'esTelefonoPrincipal',
}

export interface EntityPhoneNumber extends EntityWithId<number> {
  [EntityPhoneNumberFields.PhoneTypeCode]: number;
  [EntityPhoneNumberFields.PhoneNumber]: string;
  [EntityPhoneNumberFields.PhoneTypeDesc]?: string;
  [EntityPhoneNumberFields.AreaCode]: string;
  [EntityPhoneNumberFields.Whatsapp]?: boolean;
  [EntityPhoneNumberFields.MainPhone]?: boolean;
}

export interface EntityMailInsert {
  [EntityMailFields.MailTypeCode]: number;
  [EntityMailFields.Mail]: string;
}

export interface EntityPhoneNumberInsert {
  [EntityPhoneNumberFields.PhoneTypeCode]: number;
  [EntityPhoneNumberFields.PhoneNumber]: string;
}

export interface EntityAddressInsert extends EntityWithId<number> {
  [EntityAddressFields.AddressTypeCode]?: number;
  [EntityAddressFields.Street]?: string;
  [EntityAddressFields.StreetNumber]?: string;
  [EntityAddressFields.Floor]?: string;
  [EntityAddressFields.Apartment]?: string;
  [EntityAddressFields.PostalCode]?: string;
  [EntityAddressFields.MunicipalityCode]?: number | null;
  [EntityAddressFields.DepartmentCode]?: number | null;
  [EntityAddressFields.ProvinceCode]?: number | null;
  [EntityAddressFields.CountryCode]?: number | null;
}

export enum EntityAddressInsertListFields {
  ListAddresses = 'listaDomicilio',
  ModuleCode = 'codModulo',
  OriginCode = 'codOrigen',
}
