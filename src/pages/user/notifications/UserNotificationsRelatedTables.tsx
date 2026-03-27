import React, { useEffect, useState } from 'react';
import { Skeleton } from '@mui/lab';
import { Alert, Card, CardContent, Stack } from '@mui/material';

import {
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from 'types/baseEntities';
import { HttpNotification } from 'http/notification/httpNotification';
import UserNotificationsTable from './UserNotificationsTable';
import {
  RelatedNotification,
  RelatedNotificationFields,
} from '../../../types/user/userNotification';

interface UserNotificationsRelatedTablesProps {
  codNotificationType: number;
  onReload?: () => void;
}

function UserNotificationsRelatedTables(
  props: UserNotificationsRelatedTablesProps,
) {
  const [relatedSections, setRelatedSections] =
    useState<RelatedNotification[]>();

  const loadRelatedTables = () => {
    HttpNotification.getRelatedByNotificationTypes(
      props.codNotificationType,
    ).then(setRelatedSections);
  };

  const onReloadRelatedTables = () => {
    loadRelatedTables();
    props.onReload && props.onReload();
  };

  useEffect(() => {
    loadRelatedTables();
  }, [props.codNotificationType]);

  return (
    <Stack spacing={1}>
      {!!relatedSections ? (
        !!relatedSections.length ? (
          relatedSections.map((x) => (
            <UserNotificationsTable
              codNotificationType={props.codNotificationType}
              idRelated={x[EntityWithIdFields.Id]}
              title={x[EntityWithIdAndDescriptionFields.Description]}
              subtitle={x[RelatedNotificationFields.DetailDescription]}
              quantity={
                x[RelatedNotificationFields.NumberUnreadNotifications] ||
                undefined
              }
              onReload={onReloadRelatedTables}
              collapsable
            />
          ))
        ) : (
          <Alert severity="info">
            No se han encontrado notificaciones en esta categoría
          </Alert>
        )
      ) : (
        Array.from({ length: 4 }).map(() => (
          <Card>
            <CardContent>
              <Skeleton sx={{ marginTop: '1rem' }} />
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
}

export default UserNotificationsRelatedTables;
