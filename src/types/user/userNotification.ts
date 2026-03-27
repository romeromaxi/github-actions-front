import {
  EntityPagination,
  EntityWithId,
  EntityWithIdAndDescription,
} from '../baseEntities';

export enum NotificationViewDTOFields {
  Title = 'titulo',
  Date = 'fecha',
  Read = 'estaLeido',
  Important = 'esImportante',
  Corpse = 'cuerpo',
  Url = 'urlDireccionable',
}

export interface NotificationViewDTO extends EntityWithId<number> {
  [NotificationViewDTOFields.Title]: string;
  [NotificationViewDTOFields.Date]: Date;
  [NotificationViewDTOFields.Read]: boolean;
  [NotificationViewDTOFields.Important]: boolean;
  [NotificationViewDTOFields.Corpse]: string;
  [NotificationViewDTOFields.Url]: string;
}

export enum NotificationSearchDTOFields {
  NotificationTypeCode = 'codNotificacionTipo',
  RelatedId = 'idRelacionado',
  OnlyImportants = 'soloImportantes',
  OnlyNoRead = 'soloNoLeidos',
}

export enum RelatedNotificationFields {
  DetailDescription = 'detalle',
  NumberUnreadNotifications = 'cantidadNotificacionesSinLeer',
}

export interface RelatedNotification extends EntityWithIdAndDescription {
  [RelatedNotificationFields.DetailDescription]?: string;
  [RelatedNotificationFields.NumberUnreadNotifications]?: number;
}

export interface NotificationSearchDTO extends EntityPagination {
  [NotificationSearchDTOFields.NotificationTypeCode]?: number;
  [NotificationSearchDTOFields.RelatedId]?: number;
  [NotificationSearchDTOFields.OnlyImportants]: boolean;
  [NotificationSearchDTOFields.OnlyNoRead]: boolean;
}

export enum NotificationTypeFields {
  NumberUnreadNotifications = 'cantidadNotificacionesSinLeer',
  AllowsGrouping = 'permiteAgrupamiento',
}

export interface NotificationType extends EntityWithIdAndDescription {
  [NotificationTypeFields.NumberUnreadNotifications]: number;
  [NotificationTypeFields.AllowsGrouping]?: boolean;
}
