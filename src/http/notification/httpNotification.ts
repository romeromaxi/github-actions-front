import {
  BaseResponse,
  EntityListWithPagination,
} from '../../types/baseEntities';
import {
  NotificationSearchDTO,
  NotificationType,
  NotificationViewDTO,
  RelatedNotification,
} from '../../types/user/userNotification';
import { HttpAxiosRequest } from '../httpAxiosBase';

export const HttpNotification = {
  getEndpoint: (url: string = ''): string => `notificaciones${url}`,

  getPaginatedList: (
    filter: NotificationSearchDTO,
  ): Promise<EntityListWithPagination<NotificationViewDTO>> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpNotification.getEndpoint(),
      { ...filter },
    );
  },

  getById: (notificationId: number): Promise<NotificationViewDTO> => {
    return HttpAxiosRequest.get(
      HttpNotification.getEndpoint(`/${notificationId}`),
    );
  },

  getTypesByUser: (): Promise<NotificationType[]> =>
    HttpAxiosRequest.get(HttpNotification.getEndpoint(`/tipos`)),

  getRelatedByNotificationTypes: (
    codNotificationType: number,
  ): Promise<RelatedNotification[]> =>
    HttpAxiosRequest.get(
      HttpNotification.getEndpoint(
        `/tipos/${codNotificationType}/relacionados`,
      ),
    ),

  inactivateList: (notificationIds: number[]): Promise<BaseResponse> => {
    return HttpAxiosRequest.deleteWithBody(HttpNotification.getEndpoint(), {
      idsNotificaciones: notificationIds,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  postReadList: (notificationIds: number[]): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(HttpNotification.getEndpoint('/leidos'), {
      idsNotificaciones: notificationIds,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  postUnreadList: (notificationIds: number[]): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(HttpNotification.getEndpoint('/no-leidos'), {
      idsNotificaciones: notificationIds,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  postImportantList: (notificationIds: number[]): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(HttpNotification.getEndpoint('/importantes'), {
      idsNotificaciones: notificationIds,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  postNoImportantList: (notificationIds: number[]): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpNotification.getEndpoint('/no-importantes'),
      {
        idsNotificaciones: notificationIds,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  postRead: (notificationId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpNotification.getEndpoint(`/${notificationId}/leidos`),
      {},
    );
  },

  postUnread: (notificationId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpNotification.getEndpoint(`/${notificationId}/no-leidos`),
      {},
    );
  },

  postImportant: (notificationId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpNotification.getEndpoint(`/${notificationId}/importantes`),
      {},
    );
  },

  postNoImportant: (notificationId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpNotification.getEndpoint(`/${notificationId}/no-importantes`),
      {},
    );
  },
};
