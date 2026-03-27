import { EntityWithIdAndDescription } from 'types/baseEntities';

export enum SecurityObjectFields {
  PermissionTypeCode = 'codPermisoTipo',
  HasPermissions = 'tienePermiso',
  Observations = 'observaciones',
}

export interface SecurityObject extends EntityWithIdAndDescription {
  [SecurityObjectFields.PermissionTypeCode]: number;
}

export interface DictionarySecurityObject {
  [key: string]: SecurityObject[];
}

export enum PermissionType {
  None = 0,
  Read = 1,
  Write = 2,
}

export interface SecurityObjectDetail extends EntityWithIdAndDescription {
  [SecurityObjectFields.HasPermissions]: boolean;
  [SecurityObjectFields.Observations]: string;
}


export enum SecurityObjectGroupedDetailFields {
  Observations = 'observaciones',
  SecurityObjects = 'objetosSeguridad'
}

export interface SecurityObjectGroupedDetail extends EntityWithIdAndDescription {
  [SecurityObjectGroupedDetailFields.Observations]: string;
  [SecurityObjectGroupedDetailFields.SecurityObjects]: SecurityObjectDetail[]
}
