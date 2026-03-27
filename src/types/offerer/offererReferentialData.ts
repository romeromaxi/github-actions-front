import { BaseRequest } from '../baseEntities';
import { EntityAddress } from '../general/generalReferentialData';

export enum OffererMailFields {
  MailTypeCode = 'codMailTipo',
  Mail = 'mail',
}

export interface OffererMailInsert {
  [OffererMailFields.MailTypeCode]: number;
  [OffererMailFields.Mail]: string;
}

export enum OffererPhoneNumberFields {
  PhoneTypeCode = 'codTelefonoTipo',
  PhoneNumber = 'telefono',
}

export interface OffererPhoneNumberInsert {
  [OffererPhoneNumberFields.PhoneTypeCode]: number;
  [OffererPhoneNumberFields.PhoneNumber]: string;
}

export enum OffererMailViewDTOFields {
  OffererId = 'idEmpresa',
  MailTypeCode = 'codMailTipo',
  Mail = 'mail',
  MailTypeDesc = 'descMailTipo',
}

export interface OffererMailViewDTO {
  [OffererMailViewDTOFields.OffererId]: number;
  [OffererMailViewDTOFields.MailTypeCode]: number;
  [OffererMailViewDTOFields.Mail]: string;
  [OffererMailViewDTOFields.MailTypeDesc]: string;
}

export enum OffererPhoneViewDTOFields {
  OffererId = 'idEmpresa',
  PhoneTypeCode = 'codTelefonoTipo',
  PhoneNumber = 'telefono',
  PhoneTypeDesc = 'descTelefonoTipo',
}

export interface OffererPhoneViewDTO {
  [OffererPhoneViewDTOFields.OffererId]: number;
  [OffererPhoneViewDTOFields.PhoneTypeCode]: number;
  [OffererPhoneViewDTOFields.PhoneNumber]: string;
  [OffererPhoneViewDTOFields.PhoneTypeDesc]: string;
}

export enum OffererAddressViewDTOFields {
  OffererId = 'idEmpresa',
}

export interface OffererAddressViewDTO extends EntityAddress {
  [OffererAddressViewDTOFields.OffererId]: number;
}

export enum OffererAddressInsertDTOFields {
  AddressTypeCode = 'codDomicilioTipo',
  Street = 'calle',
  Number = 'calleNro',
  Floor = 'piso',
  Apartment = 'departamento',
  ZipCode = 'codigoPostal',
  MunicipalityCode = 'codLocalidad',
  DepartmentCode = 'codPartido',
  ProvinceCode = 'codProvincia',
  CountryCode = 'codPais',
  OriginCode = 'codOrigen',
}

export interface OffererAddressInsertDTO extends BaseRequest, EntityAddress {}
