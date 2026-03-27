import { NotificationTypeFields } from '../../../types/user/userNotification';
import {
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from '../../../types/baseEntities';
import { useAction } from '../../../hooks/useAction';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HttpNotification } from '../../../http/notification/httpNotification';
import { OffererContext } from '../../offerer/components/OffererContextProvider';
import { OffererViewDTOFields } from '../../../types/offerer/offererData';
import { BackButton } from '../../../components/buttons/Buttons';
import UserNotificationsTable from './UserNotificationsTable';
import UserNotificationsRelatedTables from './UserNotificationsRelatedTables';
import FoldersTreeView, {
  FoldersTreeItem,
  FoldersTreeItemFields,
} from '../../../components/files/FoldersTreeView';
import { Alert, Card, CardContent, Grid, Stack } from '@mui/material';
import { Skeleton } from '@mui/lab';

const HomeUserNotifications = () => {
  const { setTitle } = useAction();
  const navigate = useNavigate();
  const offerer = useContext(OffererContext);

  const goToOffererHome = () => {
    navigate('/offerer/home');
  };

  offerer[EntityWithIdFields.Id]
    ? setTitle(
        `${offerer[OffererViewDTOFields.BusinessName]} - Notificaciones`,
        <BackButton size={'small'} onClick={goToOffererHome}>
          Mi LUC
        </BackButton>,
      )
    : setTitle('Notificaciones');

  const [folders, setFolders] = useState<FoldersTreeItem[]>();
  const [notificationTypesWithGrouping, setNotificationTypesWithGrouping] =
    useState<number[]>([]);
  const [codTypes, setCodTypes] = useState<number[]>([0]);

  const loadNotificationFolders = () => {
    setFolders(undefined);
    HttpNotification.getTypesByUser().then((notificationTypes) => {
      const folders: FoldersTreeItem[] = notificationTypes.map((x) => {
        return {
          id: x[EntityWithIdFields.Id],
          name: x[EntityWithIdAndDescriptionFields.Description],
          children: [],
          isFolder: true,
          quantity: x[NotificationTypeFields.NumberUnreadNotifications],
        } as FoldersTreeItem;
      });

      setFolders(folders);

      setNotificationTypesWithGrouping(
        notificationTypes
          .filter((x) => !!x[NotificationTypeFields.AllowsGrouping])
          .map((x) => x[EntityWithIdFields.Id]),
      );
    });
  };

  const searchRelatedTypes = async (id?: number) => {
    const actualNotificationType = !!codTypes.length ? codTypes[0] : 0;

    if (
      codTypes.length != 1 ||
      !id ||
      !notificationTypesWithGrouping.includes(actualNotificationType)
    )
      return [] as FoldersTreeItem[];

    const sections = await HttpNotification.getRelatedByNotificationTypes(id);

    if (sections && !!sections.length) {
      const folders: FoldersTreeItem[] = sections.map((x) => {
        return {
          id: x[EntityWithIdFields.Id],
          name: x[EntityWithIdAndDescriptionFields.Description],
          children: [],
          isFolder: true,
          quantity: x[NotificationTypeFields.NumberUnreadNotifications],
        } as FoldersTreeItem;
      });

      return folders.sort((a, b) =>
        a[FoldersTreeItemFields.Name].localeCompare(
          b[FoldersTreeItemFields.Name],
          'en',
          { numeric: true },
        ),
      );
    }

    return [] as FoldersTreeItem[];
  };

  useEffect(() => {
    loadNotificationFolders();
  }, []);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item md={2}>
            {folders ? (
              <Stack spacing={1}>
                <FoldersTreeView
                  items={folders}
                  currentFoldersIds={codTypes}
                  setCurrentFoldersIds={setCodTypes}
                  searchTreeItemsNodes={searchRelatedTypes}
                  badgeText={'Notificaciones sin leer en esta sección'}
                />
              </Stack>
            ) : (
              <Stack spacing={1}>
                {Array.from({ length: 6 }).map(() => (
                  <Skeleton />
                ))}
              </Stack>
            )}
          </Grid>
          <Grid item md={10}>
            {codTypes.length !== 0 ? (
              codTypes.length === 2 ? (
                <UserNotificationsTable
                  codNotificationType={codTypes[0] || undefined}
                  idRelated={codTypes[1]}
                  onReload={loadNotificationFolders}
                />
              ) : notificationTypesWithGrouping.includes(codTypes[0]) ? (
                <UserNotificationsRelatedTables
                  codNotificationType={codTypes[0]}
                  onReload={loadNotificationFolders}
                />
              ) : (
                <UserNotificationsTable
                  codNotificationType={codTypes[0] || undefined}
                  onReload={loadNotificationFolders}
                />
              )
            ) : (
              <Alert severity={'info'}>
                Seleccione una sección de la izquierda para ver las
                notificaciones correspondientes
              </Alert>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default HomeUserNotifications;
