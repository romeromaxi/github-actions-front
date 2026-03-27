import { EntityWithId, EntityWithIdAndDescription } from '../baseEntities';

export enum ProductFields {
  ProductCode = 'id',
  ProductDesc = 'descripcion',
  ProductTemplateCode = 'codProductoPlantilla',
  ProductTemplateDesc = 'descProductoPlantilla',
  ProductInstrumentCode = 'codProductoInstrumento',
  ProductInstrumentDesc = 'descProductoInstrumento',
  ProductServiceCode = 'codProductoServicio',
  ProductServiceDesc = 'descProductoServicio',
  Active = 'activo',
}

export interface Product extends EntityWithIdAndDescription {
  [ProductFields.ProductTemplateCode]: number;
  [ProductFields.ProductTemplateDesc]: string;
  [ProductFields.ProductInstrumentCode]: number;
  [ProductFields.ProductInstrumentDesc]: string;
  [ProductFields.ProductServiceCode]?: number;
  [ProductFields.ProductServiceDesc]?: string;
  [ProductFields.Active]: boolean;
}

export interface ProductPost {
  [ProductFields.ProductCode]: number;
  [ProductFields.ProductDesc]: string;
  [ProductFields.ProductInstrumentCode]: number;
  [ProductFields.ProductServiceCode]: number;
  [ProductFields.Active]: boolean;
}

export interface ProductAmortizationType extends EntityWithIdAndDescription {}

export enum ProductRateTypeFields {
  IsVariableRate = 'esTasaVariable',
}

export interface ProductRateType extends EntityWithIdAndDescription {
  [ProductRateTypeFields.IsVariableRate]: boolean;
}

export interface ProductTemplate extends EntityWithIdAndDescription {}
