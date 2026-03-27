import { EntityWithId } from '../baseEntities';

export enum NeedFields {
  NeedCode = 'id',
  NeedDesc = 'descripcion',
  Active = 'activo',
}

export interface Need extends EntityWithId<number> {
  [NeedFields.NeedCode]: number;
  [NeedFields.NeedDesc]: string;
  [NeedFields.Active]: boolean;
}

export interface NeedInsert {
  [NeedFields.NeedCode]: number;
  [NeedFields.NeedDesc]: string;
  [NeedFields.Active]: boolean;
}
