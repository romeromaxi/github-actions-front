import {
  EntityListWithPagination,
  EntityListWithPaginationFields,
  EntityWithIdFields,
} from 'types/baseEntities';
import {
  Alert,
  Badge,
  Box,
  Checkbox,
  Collapse,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { useAction } from 'hooks/useAction';
import {
  DeleteIconButton,
  MarkAsImportantEmptyButton,
  MarkAsImportantFilledButton,
  MarkAsReadEmptyButton,
  MarkAsReadFilledButton,
  ForwardIconButton,
  ButtonDropdown
} from 'components/buttons/Buttons';
import { dateFormatter } from 'util/formatters/dateFormatter';
import { grey } from '@mui/material/colors';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@mui/lab';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import {
  NotificationViewDTO,
  NotificationViewDTOFields,
} from 'types/user/userNotification';
import useAxios from 'hooks/useAxios';
import { Pagination } from 'components/table';
import { DialogAlert } from 'components/dialog';
import { HttpNotification } from '../../../../http/notification/httpNotification';
import { boxSx } from '../../../company/activity/components/ActivityBox.styles';
import {BaseIconWrapper} from "../../../../components/icons/Icons";
import {CaretDown, CaretUp} from "@phosphor-icons/react";
import {BookmarkBorderOutlined, BookmarkRemoveOutlined} from "@mui/icons-material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface NotificationsTableProps {
  title?: string;
  subtitle?: string;
  notifications?: EntityListWithPagination<NotificationViewDTO>;
  collapsable?: boolean;
  onReloadNotifications: () => void;
  onPaging: (actualPage: number) => void;
  quantity?: number;
}

const NotificationsTable = (props: NotificationsTableProps) => {
  const { snackbarSuccess, reloadUserSummary, showLoader, hideLoader } =
    useAction();
  const { fetchData } = useAxios();
  const navigate = useNavigate();
  const [idNotificationToDelete, setIdNotificationToDelete] =
    useState<number>();
  const [selectedNotificationIds, setSelectedNotificationIds] = useState<
    number[]
  >([]);
  const [showTable, setShowTable] = useState<boolean>(!props.collapsable);

  const onSelectNotification = (
    event: React.ChangeEvent<HTMLInputElement>,
    notificationId: number,
  ) => {
    let newSelectedFiles: number[];
    if (event.target.checked) {
      newSelectedFiles = [...selectedNotificationIds, notificationId];
      setSelectedNotificationIds(newSelectedFiles);
    } else {
      newSelectedFiles = [...selectedNotificationIds].filter(
        (notificationFoundId) => notificationFoundId !== notificationId,
      );
      setSelectedNotificationIds(newSelectedFiles);
    }
  };

  const onConfirmDelete = () => {
    if (idNotificationToDelete) {
      let dummy: number[] = [];
      dummy.push(idNotificationToDelete);
      fetchData(() => HttpNotification.inactivateList(dummy), true).then(() => {
        onCancelDelete();
        snackbarSuccess('La notificación fue eliminada con éxito');
        props.onReloadNotifications();
        reloadUserSummary();
      });
    }
  };

  const onCancelDelete = () => setIdNotificationToDelete(undefined);

  const markAsRead = (id: number) =>
    HttpNotification.postRead(id)
      .then(() => props.onReloadNotifications())
      .finally(() => reloadUserSummary());

  const markAsUnread = (id: number) =>
    HttpNotification.postUnread(id)
      .then(() => props.onReloadNotifications())
      .finally(() => reloadUserSummary());

  const markAsImportant = (id: number) => {
    HttpNotification.postImportant(id).then(() =>
      props.onReloadNotifications(),
    );
  };

  const markAsNotImportant = (id: number) => {
    HttpNotification.postNoImportant(id).then(() =>
      props.onReloadNotifications(),
    );
  };

  const onGoToNotification = (notif: NotificationViewDTO) =>
    (window.location.href = notif[NotificationViewDTOFields.Url]);

  const onDetail = (notif: NotificationViewDTO) => {
    markAsRead(notif[EntityWithIdFields.Id]);
    if (window.location.toString().includes('offerer')) {
      navigate(`/offerer/notificaciones/${notif[EntityWithIdFields.Id]}`);
    } else if (window.location.toString().includes('internal')) {
      navigate(`/internal/notificaciones/${notif[EntityWithIdFields.Id]}`);
    } else {
      navigate(`/notificaciones/${notif[EntityWithIdFields.Id]}`);
    }
  };

  const onMarkAsReadAll = () => {
    showLoader();
    const readNotifications = selectedNotificationIds.map((id) => {
      return HttpNotification.postRead(id);
    });

    Promise.all(readNotifications).then(() => {
      props.onReloadNotifications();
      hideLoader();
      reloadUserSummary()
      setSelectedNotificationIds([]);
    });
  };

  const onMarkAsUnreadAll = () => {
    showLoader();
    const unreadNotifications = selectedNotificationIds.map((id) => {
      return HttpNotification.postUnread(id);
    });

    Promise.all(unreadNotifications).then(() => {
      props.onReloadNotifications();
      hideLoader();
      reloadUserSummary()
      setSelectedNotificationIds([]);
    });
  };

  const onDeleteAll = () => {
    fetchData(
      () => HttpNotification.inactivateList(selectedNotificationIds),
      true,
    ).then(() => {
      onCancelDelete();
      snackbarSuccess(
        'Las notificaciones seleccionadas fueron eliminadas con éxito',
      );
      props.onReloadNotifications();
      reloadUserSummary();
      setSelectedNotificationIds([]);
    });
  };

  const onMarkAsImportantAll = () => {
    showLoader();
    const importantNotifications = selectedNotificationIds.map((id) => {
      return HttpNotification.postImportant(id);
    });

    Promise.all(importantNotifications).then(() => {
      props.onReloadNotifications();
      hideLoader();
      setSelectedNotificationIds([]);
    });
  };

  const onMarkAsNotImportantAll = () => {
    showLoader();
    const notImportantNotifications = selectedNotificationIds.map((id) => {
      return HttpNotification.postNoImportant(id);
    });

    Promise.all(notImportantNotifications).then(() => {
      props.onReloadNotifications();
      hideLoader();
      setSelectedNotificationIds([]);
    });
  };

  const notificationHeader = () => (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      sx={{ padding: '0px 0px 6px 0px' }}
    >
      <Stack direction={'row'} alignItems={'center'} spacing={3}>
        <Stack>
          <Stack direction={'row'} alignItems={'center'} spacing={3}>
            {props.title && (
              <Typography fontSize={20} fontWeight={600}>
                {props.title}
              </Typography>
            )}
            {props.quantity &&
              (props.notifications ? (
                <Tooltip title={'Notificaciones sin leer en esta agrupación'}>
                  <Badge badgeContent={props.quantity} color={'success'} />
                </Tooltip>
              ) : (
                <Skeleton variant={'circular'} width={'16px'} />
              ))}
          </Stack>

          {props.subtitle && (
            <Typography fontSize={15} fontWeight={400} color={'text.disabled'}>
              {props.subtitle}
            </Typography>
          )}
        </Stack>
      </Stack>
      <Stack direction={'row'} alignItems={'center'} spacing={2}>
        {selectedNotificationIds.length !== 0 && (
          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <Typography
              fontSize={14}
              fontWeight={600}
            >{`${selectedNotificationIds.length} seleccionada(s)`}</Typography>
            <ButtonDropdown
              label={'Acciones'}
              items={[
                {
                  label: 'Marcar como leídas',
                  onClick: onMarkAsReadAll,
                  icon: <DraftsOutlinedIcon fontSize={'small'} color={'primary'}/>,
                },
                {
                  label: 'Desmarcar como leídas',
                  onClick: onMarkAsUnreadAll,
                  icon: <MarkEmailUnreadOutlinedIcon fontSize={'small'} color={'primary'}/>,
                },
                {
                  label: 'Marcar como importantes',
                  onClick: onMarkAsImportantAll,
                  icon: <BookmarkBorderOutlined fontSize={'small'} color={'primary'}/>,
                },
                {
                  label: 'Desmarcar como importantes',
                  onClick: onMarkAsNotImportantAll,
                  icon: <BookmarkRemoveOutlined fontSize={'small'} color={'primary'}/>,
                },
                {
                  label: 'Eliminar seleccionadas',
                  onClick: onDeleteAll,
                  icon: <DeleteOutlineIcon fontSize={'small'} color={'primary'}/>,
                },
              ]}
              size={'small'}
            />
          </Stack>
        )}
        {props.collapsable && (
            <Box onClick={() => setShowTable(!showTable)}>
              <BaseIconWrapper Icon={showTable ? CaretUp : CaretDown} size={'sm'} bg={'#F7FAFC'} width={'32px'} height={'32px'}/>
            </Box>
        )}
      </Stack>
    </Stack>
  );

  return (
    <Box sx={props.collapsable ? { ...boxSx, p: '0.8rem !important' } : {}} onClick={props.collapsable ? () => setShowTable(!showTable) : undefined}>
      {notificationHeader()}
      <Collapse in={showTable}>
        {props.notifications ? (
          props.notifications[EntityListWithPaginationFields.List].length !==
          0 ? (
            <TableContainer sx={{overflowX: 'auto !important', width: '100% !important'}}>
              <Table sx={{ width: '100%' }}>
                <TableBody>
                  {props.notifications?.[
                    EntityListWithPaginationFields.List
                  ].map((notif) => (
                    <TableRow
                      key={notif[EntityWithIdFields.Id]}
                      sx={{
                        width: '100%',
                        p: '0 !important',
                        '&:last-of-type td': { border: 0 },
                        '&:first-of-type td': {
                          borderTop: (theme) =>
                            `1px solid ${theme.palette.divider}`,
                        },
                        backgroundColor: notif[NotificationViewDTOFields.Read]
                          ? '#F2F6FC !important'
                          : 'white',
                      }}
                      hover
                    >
                      <TableCell>
                        <Stack
                          direction={'row'}
                          alignItems={'center'}
                          spacing={1}
                        >
                          <Checkbox
                            onChange={(e) =>
                              onSelectNotification(
                                e,
                                notif[EntityWithIdFields.Id],
                              )
                            }
                            size={'small'}
                            value={notif[EntityWithIdFields.Id]}
                          />
                          {notif[NotificationViewDTOFields.Read] ? (
                            <MarkAsReadFilledButton
                              onClick={() => {
                                markAsUnread(notif[EntityWithIdFields.Id]);
                              }}
                              size={'small'}
                            />
                          ) : (
                            <MarkAsReadEmptyButton
                              onClick={() => {
                                markAsRead(notif[EntityWithIdFields.Id]);
                              }}
                              size={'small'}
                            />
                          )}
                          {notif[NotificationViewDTOFields.Important] ? (
                            <MarkAsImportantFilledButton
                                tooltipTitle={'Desmarcar como importante'}
                              onClick={() => {
                                markAsNotImportant(
                                  notif[EntityWithIdFields.Id],
                                );
                              }}
                              size={'small'}
                            />
                          ) : (
                            <MarkAsImportantEmptyButton
                              onClick={() => {
                                markAsImportant(notif[EntityWithIdFields.Id]);
                              }}
                              size={'small'}
                            />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell
                        sx={{ cursor: 'pointer' }}
                        onClick={() => {
                          onDetail(notif);
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '14px !important',
                            fontWeight: notif[NotificationViewDTOFields.Read]
                              ? '400 !important'
                              : '600 !important',
                            textAlign: 'start',
                          }}
                        >
                          {notif[NotificationViewDTOFields.Title]}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack
                          direction="row"
                          alignItems={'center'}
                          spacing={3}
                          justifyContent="flex-end"
                          pr={2}
                        >
                          <Typography
                            fontSize={14}
                            fontWeight={600}
                            color={grey[600]}
                          >
                            {dateFormatter.toShortDate(
                              notif[NotificationViewDTOFields.Date],
                            )}
                          </Typography>
                          {notif[NotificationViewDTOFields.Url] && (
                            <ForwardIconButton
                              onClick={() => {
                                onGoToNotification(notif);
                              }}
                              tooltipTitle={'Ir a la notificación'}
                            />
                          )}
                          <DeleteIconButton
                            onClick={() => {
                              setIdNotificationToDelete(
                                notif[EntityWithIdFields.Id],
                              );
                            }}
                            tooltipTitle={'Eliminar'}
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <Pagination
                  entityPagination={
                    props.notifications?.[
                      EntityListWithPaginationFields.Pagination
                    ]
                  }
                  onPaging={props.onPaging}
                  isLoading={!props.notifications}
                />
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ width: '100%' }}>
              <Alert severity="info">
                No se han encontrado notificaciones en esta categoría
              </Alert>
            </Box>
          )
        ) : (
          Array.from({ length: 10 }).map(() => (
            <Skeleton sx={{ marginTop: '1rem' }} />
          ))
        )}
      </Collapse>

      <DialogAlert
        open={!!idNotificationToDelete}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
        textContent={`¿Estás seguro que deseás eliminar la notificación?`}
      />
    </Box>
  );
};

export default NotificationsTable;
