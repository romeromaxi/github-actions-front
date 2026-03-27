import { AddressTypes } from '../general/generalEnums';

export enum BaseAddressFields {
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
  MunicipalityDesc = 'descLocalidad',
  DepartmentDesc = 'descPartido',
  ProvinceDesc = 'descProvincia',
  AddressTypeDesc = 'descDomicilioTipo',
  FullStreet = 'calleCompleta',
  FullAddress = 'calleCompletaConTipoDomicilio',
}

export interface BaseAddress {
  [BaseAddressFields.AddressTypeCode]: AddressTypes;
  [BaseAddressFields.Street]: string;
  [BaseAddressFields.Number]: string;
  [BaseAddressFields.Floor]: string;
  [BaseAddressFields.Apartment]: string;
  [BaseAddressFields.ZipCode]: string;
  [BaseAddressFields.MunicipalityCode]: number;
  [BaseAddressFields.DepartmentCode]: number;
  [BaseAddressFields.ProvinceCode]: number;
  [BaseAddressFields.CountryCode]: number;
  [BaseAddressFields.MunicipalityDesc]: string;
  [BaseAddressFields.DepartmentDesc]: string;
  [BaseAddressFields.ProvinceDesc]: string;
  [BaseAddressFields.AddressTypeDesc]: string;
  [BaseAddressFields.FullStreet]: string;
  [BaseAddressFields.FullAddress]: string;
}
