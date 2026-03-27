import { SolicitationEventType } from './solicitationEventEnums';

export enum SolicitationEventViewFields {
  Date = 'fecha',
  EventTypeCode = 'codEventoTipo',
  EventTypeCompanyDesc = 'descEventoEmpresa',
  EventTypeOffererDesc = 'descEventoOferente',
  EventData = 'descEventoDetalle',
  UserId = 'idUsuarioAlta',
  UserDesc = 'descUsuarioAlta',
}

export interface SolicitationEventView {
  [SolicitationEventViewFields.Date]: Date;
  [SolicitationEventViewFields.EventTypeCode]: SolicitationEventType;
  [SolicitationEventViewFields.EventTypeCompanyDesc]: string;
  [SolicitationEventViewFields.EventTypeOffererDesc]: string;
  [SolicitationEventViewFields.EventData]: string;
  [SolicitationEventViewFields.UserId]: number;
  [SolicitationEventViewFields.UserDesc]: string;
}
