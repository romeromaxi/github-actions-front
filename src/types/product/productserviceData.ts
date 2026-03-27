import { EntityWithId, EntityWithIdAndDescription } from '../baseEntities';

export enum ProductServiceFields {
  ProductServiceCode = 'id',
  ProductServiceDesc = 'descripcion',
  ProductCode = 'codProducto',
  ProductDesc = 'Producto',
  Active = 'activo',
}

export interface ProductService extends EntityWithIdAndDescription {
  [ProductServiceFields.ProductCode]: number;
  [ProductServiceFields.ProductDesc]: string;
  [ProductServiceFields.Active]: boolean;
}

export interface ProductServiceView extends EntityWithId<number> {
  [ProductServiceFields.ProductServiceCode]: number;
  [ProductServiceFields.ProductServiceDesc]: string;
  [ProductServiceFields.Active]: boolean;
}

export interface ProductServiceInsert {
  [ProductServiceFields.ProductServiceCode]: number;
  [ProductServiceFields.ProductServiceDesc]: string;
  [ProductServiceFields.Active]: boolean;
}
