import {
  NotificationSearchDTO,
  NotificationSearchDTOFields,
  NotificationViewDTO,
} from '../../../types/user/userNotification';
import {
  EntityListWithPagination,
  EntityPaginationFields,
} from '../../../types/baseEntities';
import { useAction } from '../../../hooks/useAction';
import React, { useEffect, useState } from 'react';
import { HttpNotification } from '../../../http/notification/httpNotification';
import { DialogAlert } from '../../../components/dialog';
import useAxios from '../../../hooks/useAxios';
import NotificationsTable from './components/NotificationsTable';

interface UserNotificationsTableProps {
  title?: string;
  subtitle?: string;
  codNotificationType?: number;
  idRelated?: number;
  collapsable?: boolean;
  quantity?: number;
  onReload?: () => void;
}

const UserNotificationsTable = (props: UserNotificationsTableProps) => {
  const { snackbarSuccess, reloadUserSummary } = useAction();
  const { fetchData } = useAxios();
  const [notifications, setNotifications] =
    useState<EntityListWithPagination<NotificationViewDTO>>();
  const [idNotificationToDelete, setIdNotificationToDelete] =
    useState<number>();

  const defaultFilter: NotificationSearchDTO = {
    [NotificationSearchDTOFields.RelatedId]: props.idRelated,
    [NotificationSearchDTOFields.NotificationTypeCode]:
      props.codNotificationType,
    [NotificationSearchDTOFields.OnlyNoRead]: false,
    [NotificationSearchDTOFields.OnlyImportants]: false,
    [EntityPaginationFields.PageSize]: 10,
    [EntityPaginationFields.ActualPage]: 1,
    [EntityPaginationFields.CantPages]: 1,
    [EntityPaginationFields.CantRecords]: 10,
  };

  const [filter, setFilter] = useState<NotificationSearchDTO>(defaultFilter);

  const getNotifications = (filterSearch: NotificationSearchDTO) => {
    setNotifications(undefined);
    HttpNotification.getPaginatedList(filterSearch).then(setNotifications);
  };

  const onReloadNotifications = () => {
    getNotifications(filter);
    props.onReload && props.onReload();
  };

  const onConfirmDelete = () => {
    if (idNotificationToDelete) {
      let dummy: number[] = [];
      dummy.push(idNotificationToDelete);
      fetchData(() => HttpNotification.inactivateList(dummy), true).then(() => {
        onCancelDelete();
        snackbarSuccess('La notificación fue eliminada con éxito');
        onReloadNotifications();
        reloadUserSummary();
      });
    }
  };

  const onCancelDelete = () => setIdNotificationToDelete(undefined);

  useEffect(() => {
    const filterSearch: NotificationSearchDTO = {
      ...filter,
      [NotificationSearchDTOFields.RelatedId]: props.idRelated,
      [NotificationSearchDTOFields.NotificationTypeCode]:
        props.codNotificationType,
    };

    getNotifications(filterSearch);
  }, [props.idRelated, props.codNotificationType]);

  const onPaging = (actualPage: number) => {
    const newFilter: NotificationSearchDTO = {
      [NotificationSearchDTOFields.RelatedId]: props.idRelated,
      [NotificationSearchDTOFields.NotificationTypeCode]:
        props.codNotificationType,
      [NotificationSearchDTOFields.OnlyNoRead]: false,
      [NotificationSearchDTOFields.OnlyImportants]: false,
      [EntityPaginationFields.PageSize]: 10,
      [EntityPaginationFields.ActualPage]: actualPage,
      [EntityPaginationFields.CantPages]: 1,
      [EntityPaginationFields.CantRecords]: 10,
    };

    setFilter(newFilter);
    getNotifications(newFilter);
  };

  return (
    <>
      <NotificationsTable
        title={props.title}
        subtitle={props.subtitle}
        notifications={notifications}
        collapsable={props.collapsable}
        onReloadNotifications={onReloadNotifications}
        onPaging={onPaging}
        quantity={props.quantity}
      />

      <DialogAlert
        open={!!idNotificationToDelete}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
        textContent={`¿Estás seguro que deseás eliminar la notificación?`}
      />
    </>
  );
};

export default UserNotificationsTable;
