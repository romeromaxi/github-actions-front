import { EntityWithId } from '../baseEntities';

export enum ProductNeedFields {
  ProductNeedCode = 'codNecesidad',
  ProductNeedDesc = 'descripcion',
  ProductCode = 'codProducto',
  ProductDesc = 'descProducto',
  Active = 'activo',
}

export interface ProductNeed extends EntityWithId<number> {
  [ProductNeedFields.ProductNeedCode]: number;
  [ProductNeedFields.ProductNeedDesc]: string;
  [ProductNeedFields.ProductCode]: number;
  [ProductNeedFields.ProductDesc]: string;
  [ProductNeedFields.Active]: boolean;
}

export interface ProductNeedView extends EntityWithId<number> {
  [ProductNeedFields.ProductNeedCode]: number;
  [ProductNeedFields.ProductNeedDesc]: string;
  [ProductNeedFields.Active]: boolean;
}

export interface ProductNeedInsert {
  [ProductNeedFields.ProductNeedCode]: number;
  [ProductNeedFields.ProductNeedDesc]: string;
  [ProductNeedFields.Active]: boolean;
}
