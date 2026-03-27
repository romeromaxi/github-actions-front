import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import {
  NotificationViewDTO,
  NotificationViewDTOFields,
} from '../../../types/user/userNotification';
import {
  BackIconButton,
  MarkAsImportantEmptyButton,
  MarkAsImportantFilledButton,
  MarkAsReadEmptyButton,
  MarkAsReadFilledButton,
} from '../../../components/buttons/Buttons';
import React, { useEffect, useState } from 'react';
import { grey } from '@mui/material/colors';
import { dateFormatter } from '../../../util/formatters/dateFormatter';
import { HttpNotification } from '../../../http/notification/httpNotification';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { useAction } from '../../../hooks/useAction';
import {Skeleton} from "@mui/lab";

const UserNotificationDetail = () => {
  const { reloadUserSummary } = useAction();
  const navigate = useNavigate();
  const { notificationId } = useParams();
  const [notification, setNotification] = useState<NotificationViewDTO>();

  const getNotification = (id: number) =>
    HttpNotification.getById(id).then((r) => setNotification(r));

  const markAsRead = (id: number) =>
    HttpNotification.postRead(id)
      .then(() => getNotification(id))
      .finally(() => reloadUserSummary());

  const markAsUnread = (id: number) =>
    HttpNotification.postUnread(id)
      .then(() => getNotification(id))
      .finally(() => reloadUserSummary());

  const markAsImportant = (id: number) => {
    HttpNotification.postImportant(id).then(() => getNotification(id));
  };

  const markAsNotImportant = (id: number) => {
    HttpNotification.postNoImportant(id).then(() => getNotification(id));
  };

  useEffect(() => {
    notificationId && getNotification(parseInt(notificationId));
  }, [notificationId]);

  const renderAction = (notif: NotificationViewDTO) => {
    return (
      <Stack direction={'row'} alignItems={'center'} spacing={3}>
        <Typography fontSize={14} color={grey[600]} fontWeight={600}>
          {dateFormatter.toShortDate(notif[NotificationViewDTOFields.Date])}
        </Typography>
        {notif[NotificationViewDTOFields.Read] ? (
          <MarkAsReadFilledButton
            onClick={() => {
              markAsUnread(notif[EntityWithIdFields.Id]);
            }}
          />
        ) : (
          <MarkAsReadEmptyButton
            onClick={() => {
              markAsRead(notif[EntityWithIdFields.Id]);
            }}
          />
        )}
        {notif[NotificationViewDTOFields.Important] ? (
          <MarkAsImportantFilledButton
              tooltipTitle={'Desmarcar como importante'}
            onClick={() => {
              markAsNotImportant(notif[EntityWithIdFields.Id]);
            }}
          />
        ) : (
          <MarkAsImportantEmptyButton
            onClick={() => {
              markAsImportant(notif[EntityWithIdFields.Id]);
            }}
          />
        )}
        <BackIconButton
          tooltipTitle={'Volver al listado de notificaciones'}
          onClick={() => {
            navigate(-1);
          }}
        />
      </Stack>
    );
  };

  return (
    <Card>
      {notification ? (
        <React.Fragment>
          <CardContent>
            <Stack spacing={2}>
              <Stack direction='row' alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant='h5' fontWeight={600}>
                  {notification[NotificationViewDTOFields.Title]}
                </Typography>
                {renderAction(notification)}
              </Stack>
              <div
                dangerouslySetInnerHTML={{
                  __html: notification[NotificationViewDTOFields.Corpse],
                }}
              />
            </Stack>
          </CardContent>
        </React.Fragment>
      )
      :
          (
              <CardContent>
                <Stack spacing={4}>
                  <Skeleton sx={{width: '100% !important', height: '35px !important'}}/>
                  <Box sx={{width: '100% !important', textAlign: 'center', justifyContent: 'center', display: 'flex', alignItems: 'center', backgroundColor: 'rgb(236, 239, 241) !important'}}>
                    <Stack spacing={4} alignItems={'center'} paddingY={4}>
                      <Skeleton sx={{width: '160px', height: '80px'}}/>
                      <Box sx={{width: '600px !important', height: '525px !important', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'white !important', padding: '48px !important'}}>
                        <Skeleton sx={{width: '500px !important', height: '720px !important'}}/>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
          )
      }
    </Card>
  );
};

export default UserNotificationDetail;
