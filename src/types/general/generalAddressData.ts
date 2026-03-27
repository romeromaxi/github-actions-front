import { EntityWithIdAndDescription } from '../baseEntities';

export enum AddressDataFields {
  PostalCode = 'codigoPostal',
  Municipalities = 'listaLocalidades',
  Departments = 'listaPartidos',
  Provinces = 'listaProvincias',
}

export interface AddressDataWithPostalCode {
  [AddressDataFields.PostalCode]: string;
  [AddressDataFields.Municipalities]: Municipality[];
  [AddressDataFields.Departments]: Department[];
  [AddressDataFields.Provinces]: Province[];
}

export enum MunicipalityFields {
  ProvinceCode = 'codProvincia',
  CountryCode = 'codPais',
  DepartmentCode = 'codPartido',
}

export interface Municipality extends EntityWithIdAndDescription {
  [MunicipalityFields.ProvinceCode]: number;
  [MunicipalityFields.CountryCode]: number;
  [MunicipalityFields.DepartmentCode]: number;
}

export enum DepartmentFields {
  ProvinceCode = 'codProvincia',
  CountryCode = 'codPais',
}

export interface Department extends EntityWithIdAndDescription {
  [DepartmentFields.ProvinceCode]: number;
  [DepartmentFields.CountryCode]: number;
}

export enum ProvinceFields {
  CountryCode = 'codPais',
}

export interface Province extends EntityWithIdAndDescription {
  [ProvinceFields.CountryCode]: number;
}

export enum CountryFields {
  PhoneCode = 'codigoTelefonico',
  ISOCode = 'codigoISOPais',
}
export interface Country extends EntityWithIdAndDescription {
  [CountryFields.PhoneCode]: string;
  [CountryFields.ISOCode]: string;
}
