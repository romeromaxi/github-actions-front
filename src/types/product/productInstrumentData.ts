import { EntityWithId } from '../baseEntities';

export enum ProductInstrumentFields {
  ProductInstrumentCode = 'id',
  ProductInstrumentDesc = 'descripcion',
  ProductInstrumentTypeCode = 'codProductoInstrumentoTipo',
  ProductInstrumentTypeDesc = 'descProductoInstrumentoTipo',
  ProductDestinyCode = 'codProductoDestino',
  ProductDestinyDesc = 'descProductoDestino',
  Active = 'activo',
}

export interface ProductInstrument extends EntityWithId<number> {
  [ProductInstrumentFields.ProductInstrumentCode]: number;
  [ProductInstrumentFields.ProductInstrumentDesc]: string;
  [ProductInstrumentFields.ProductInstrumentTypeCode]: number;
  [ProductInstrumentFields.ProductInstrumentTypeDesc]: string;
  [ProductInstrumentFields.ProductDestinyCode]: number;
  [ProductInstrumentFields.ProductDestinyDesc]: string;
  [ProductInstrumentFields.Active]: boolean;
}

export interface ProductInstrumentInsert {
  [ProductInstrumentFields.ProductInstrumentCode]: number;
  [ProductInstrumentFields.ProductInstrumentDesc]: string;
  [ProductInstrumentFields.ProductDestinyCode]: number;
  [ProductInstrumentFields.Active]: boolean;
}

export enum ProductInstrumentTypeFields {
  Code = 'id',
  Description = 'descripcion',
  ProductModuleCode = 'codModulo',
  ProductSourceCode= 'codOrigen',
  IsVisible = 'estaVisible',
  Active = 'activo',
}

export interface ProductInstrumentType extends EntityWithId<number> {
  [ProductInstrumentTypeFields.Code]: number;
  [ProductInstrumentTypeFields.Description]: string;
  [ProductInstrumentTypeFields.IsVisible]: boolean;
  [ProductInstrumentTypeFields.Active]: boolean;
}

export interface ProductInstrumentTypeInsert {
  [ProductInstrumentTypeFields.Code]: number;
  [ProductInstrumentTypeFields.Description]: string;
  [ProductInstrumentTypeFields.ProductModuleCode]: number;
  [ProductInstrumentTypeFields.ProductSourceCode]: number;
  [ProductInstrumentTypeFields.Active]: boolean;
}
