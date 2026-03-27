import { EntityWithId } from '../baseEntities';

export enum ProductClassificationFields {
  ProductClassificationCode = 'id',
  ProductClassificationDesc = 'descripcion',
  Active = 'Activo',
}

export interface ProductClassification extends EntityWithId<number> {
  [ProductClassificationFields.ProductClassificationCode]: number;
  [ProductClassificationFields.ProductClassificationDesc]: string;
  [ProductClassificationFields.Active]: boolean;
}

export interface ProductClassificationView extends EntityWithId<number> {
  [ProductClassificationFields.ProductClassificationCode]: number;
  [ProductClassificationFields.ProductClassificationDesc]: string;
}

export interface ProductClassificationInsert {
  [ProductClassificationFields.ProductClassificationCode]: number;
  [ProductClassificationFields.ProductClassificationDesc]: string;
  [ProductClassificationFields.Active]: boolean;
}
