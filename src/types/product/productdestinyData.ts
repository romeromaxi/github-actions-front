import { EntityWithId, EntityWithIdAndDescription } from '../baseEntities';

export enum ProductDestinyTypes {
  WorkingCapital = 5,
  Investment = 6,
  AccountOpening = 7,
  Insurance = 8,
  Other = 99,
}

export enum ProductServiceTypes {
  Financing = 7, // Financiamiento
  Endorsements = 8, // Avales
  DiscountDocuments = 9, // Descuento de Documentos
  Insurance = 10, // Seguros
  AccountOpening = 11, // Apertura de Cuenta
}

export enum ProductDestinyFields {
  ProductDestinyCode = 'codProductoDestino',
  ProductDestinyDesc = 'descripcion',
  ProductCode = 'codProducto',
  ProductDesc = 'descProducto',
  Active = 'activo',
}

export interface ProductDestiny extends EntityWithIdAndDescription {
  [ProductDestinyFields.ProductDestinyCode]: number;
  [ProductDestinyFields.ProductCode]: number;
  [ProductDestinyFields.ProductDesc]: string;
  [ProductDestinyFields.Active]: boolean;
}

export interface ProductDestinyView extends EntityWithId<number> {
  [ProductDestinyFields.ProductDestinyCode]: number;
  [ProductDestinyFields.ProductDestinyDesc]: string;
}

export interface ProductDestinyInsert {
  [ProductDestinyFields.ProductDestinyCode]: number;
  [ProductDestinyFields.ProductDestinyDesc]: string;
  [ProductDestinyFields.Active]: boolean;
}
