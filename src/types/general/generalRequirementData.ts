import { EntityWithIdAndDescription } from '../baseEntities';

export enum RequirementViewFields {
  RequirementClassificationCode = 'codRequerimientoClasificacion',
  RequirementClassificationDesc = 'descRequerimientoClasificacion',
  RequirementDetail = 'detalleRequerimiento',
}

export interface RequirementView extends EntityWithIdAndDescription {
  [RequirementViewFields.RequirementClassificationCode]: number;
  [RequirementViewFields.RequirementClassificationDesc]: string;
  [RequirementViewFields.RequirementDetail]: string;
}
