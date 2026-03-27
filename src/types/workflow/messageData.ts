import { EntityWithId } from '../baseEntities';

export enum MessageFields {
  SystemId = 'codSistema',
  CurrentStageId = 'idEtapaActual',
  CurrentVirtualStageId = 'idEtapaVirtualActual',
  ExternalId = 'idExterno',
  DateEntryStage = 'fechaIngresoEtapa',
  MessageStateCode = 'codMensajeEstado',
  DateDeadline = 'fechaLimite',
  PreviousStageId = 'idEtapaAnterior',
  CumulativeAmount = 'montoAcumulado',
  SystemName = 'nombreSistema',
  GroupResponsibleName = 'nombreGrupoResponsable',
  CurrentStageName = 'nombreEtapaActual',
  PreviousStageName = 'nombreEtapaAnterior',
  PermissionTypeCode = 'codPermisoTipo',
  Warning = 'advertencia',
}

export interface MessageView extends EntityWithId<number> {
  [MessageFields.SystemId]: number;
  [MessageFields.CurrentStageId]: number;
  [MessageFields.CurrentVirtualStageId]?: number;
  [MessageFields.ExternalId]: number;
  [MessageFields.DateEntryStage]: Date;
  [MessageFields.MessageStateCode]: number;
  [MessageFields.DateDeadline]?: Date;
  [MessageFields.PreviousStageId]?: number;
  [MessageFields.CumulativeAmount]: number;
  [MessageFields.SystemName]: string;
  [MessageFields.SystemName]: string;
  [MessageFields.GroupResponsibleName]: string;
  [MessageFields.CurrentStageName]: string;
  [MessageFields.PreviousStageName]: string;
  [MessageFields.PermissionTypeCode]: number;
  [MessageFields.Warning]: string;
}
