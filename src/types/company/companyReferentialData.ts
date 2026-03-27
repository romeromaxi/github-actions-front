import { BaseRequest } from '../baseEntities';
import {
  EntityAddress,
  EntityPhoneNumber,
} from '../general/generalReferentialData';
import { PhoneType } from '../general/generalEnums';
import { CompanyDetailFormFields } from '../../pages/company/components/CompanyDetailCard';

export enum CompanyMailFields {
  MailTypeCode = 'codMailTipo',
  Mail = 'mail',
}

export interface CompanyMailInsert {
  [CompanyMailFields.MailTypeCode]: number;
  [CompanyMailFields.Mail]: string;
}

export enum CompanyPhoneNumberFields {
  PhoneTypeCode = 'codTelefonoTipo',
  AreaCode = 'codigoArea',
  PhoneNumber = 'telefono',
  Whatsapp = 'bitWhatsapp',
}

export interface CompanyPhoneNumberInsert {
  [CompanyPhoneNumberFields.PhoneTypeCode]: PhoneType;
  [CompanyPhoneNumberFields.AreaCode]?: string;
  [CompanyPhoneNumberFields.PhoneNumber]: string;
  [CompanyPhoneNumberFields.Whatsapp]: boolean;
}

export enum CompanyMailViewDTOFields {
  CompanyId = 'idEmpresa',
  MailTypeCode = 'codMailTipo',
  Mail = 'mail',
  MailTypeDesc = 'descMailTipo',
}

export interface CompanyMailViewDTO {
  [CompanyMailViewDTOFields.CompanyId]: number;
  [CompanyMailViewDTOFields.MailTypeCode]: number;
  [CompanyMailViewDTOFields.Mail]: string;
  [CompanyMailViewDTOFields.MailTypeDesc]: string;
}

export enum CompanyPhoneViewDTOFields {
  CompanyId = 'idEmpresa',
  PhoneTypeCode = 'codTelefonoTipo',
  AreaCode = 'codigoArea',
  PhoneNumber = 'telefono',
  PhoneTypeDesc = 'descTelefonoTipo',
  MainPhone = 'bitTelefonoPrincipal',
}

export interface CompanyPhoneViewDTO extends EntityPhoneNumber {
  [CompanyPhoneViewDTOFields.CompanyId]: number;
}

export enum CompanyAddressViewDTOFields {
  CompanyId = 'idEmpresa',
}

export interface CompanyAddressViewDTO extends EntityAddress {
  [CompanyAddressViewDTOFields.CompanyId]: number;
}

export enum CompanyAddressInsertDTOFields {
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

export interface CompanyAddressInsertDTO extends BaseRequest, EntityAddress {}

export interface CompanyPhoneInsertDTO extends EntityPhoneNumber {}
