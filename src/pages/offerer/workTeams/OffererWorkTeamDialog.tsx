import {
  OffererWorkTeamForm,
  OffererWorkTeamFormFields,
  OffererWorkTeamRelationship,
  OffererWorkTeamRelationshipFields,
  OffererWorkTeamView,
} from '../../../types/offerer/offererSolicitationData';
import {
  Alert,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import BaseDialogTitle from '../../../components/dialog/BaseDialogTitle';
import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { SaveButton } from '../../../components/buttons/Buttons';
import { ControlledTextFieldFilled } from '../../../components/forms';
import useAxios from '../../../hooks/useAxios';
import { HttpOffererWorkTeams } from '../../../http/offerer/httpOffererWorkTeams';
import { useAction } from '../../../hooks/useAction';
import {
  BaseRequestFields,
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from '../../../types/baseEntities';

interface OffererWorkTeamDialogProps {
  open: boolean;
  onClose: () => void;
  offererId: number;
  onReload: () => void;
  workTeam?: OffererWorkTeamView;
}

const OffererWorkTeamDialog = ({
  open,
  onClose,
  offererId,
  onReload,
  workTeam,
}: OffererWorkTeamDialogProps) => {
  const { handleSubmit, control, reset } = useForm<OffererWorkTeamForm>();
  const { fetchData } = useAxios();
  const [teamUsers, setTeamUsers] = useState<OffererWorkTeamRelationship[]>();
  const [teamLines, setTeamLines] = useState<OffererWorkTeamRelationship[]>();
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const { snackbarSuccess } = useAction();

  useEffect(() => {
    if (open) {
      if (workTeam) {
        reset(workTeam);
        HttpOffererWorkTeams.getUserRelationshipsByWorkTeamId(
          offererId,
          workTeam[EntityWithIdFields.Id],
        ).then((r) => setTeamUsers(r));

        HttpOffererWorkTeams.getProductLinesByWorkTeamId(
          offererId,
          workTeam[EntityWithIdFields.Id],
        ).then((r) => setTeamLines(r));
      } else {
        reset({
          [OffererWorkTeamFormFields.Name]: '',
          [OffererWorkTeamFormFields.Description]: '',
        });
      }
    }
  }, [workTeam, open]);

  useEffect(() => {
    if (workTeam) {
      if (teamLines && teamLines.length !== 0) {
        const defaultItems = teamLines.filter(
          (item) => item[OffererWorkTeamRelationshipFields.PresentWorkTeam],
        );
        const defaultLineIds = defaultItems.map(
          (it) => it[EntityWithIdAndDescriptionFields.Id],
        );
        setSelectedLines(defaultLineIds);
      }
      if (teamUsers && teamUsers.length !== 0) {
        const defaultItems = teamUsers.filter(
          (item) => item[OffererWorkTeamRelationshipFields.PresentWorkTeam],
        );
        const defaultUserIds = defaultItems.map(
          (it) => it[EntityWithIdAndDescriptionFields.Id],
        );
        setSelectedUsers(defaultUserIds);
      }
    }
  }, [workTeam, teamLines, teamUsers]);

  const onHandleClose = () => {
    setTeamUsers(undefined);
    setTeamLines(undefined);
    onClose();
  };

  const onSubmit = (data: OffererWorkTeamForm) => {
    const submitData: OffererWorkTeamForm = {
      ...data,
      [BaseRequestFields.OriginCode]: 1,
      [BaseRequestFields.ModuleCode]: 1,
    };

    if (workTeam) {
      const updateData: OffererWorkTeamForm = {
        ...submitData,
        [OffererWorkTeamFormFields.UserIds]: selectedUsers,
        [OffererWorkTeamFormFields.ProductLineIds]: selectedLines,
      };

      fetchData(
        () =>
          HttpOffererWorkTeams.update(
            offererId,
            workTeam[EntityWithIdFields.Id],
            updateData,
          ),
        true,
      )
        .then(() => {
          snackbarSuccess('Se ha actualizado el equipo de trabajo');
          onReload();
        })
        .finally(onHandleClose);
    } else {
      fetchData(() => HttpOffererWorkTeams.insert(offererId, submitData), true)
        .then(() => {
          snackbarSuccess('Se ha creado un nuevo equipo de trabajo');
          onReload();
        })
        .finally(onHandleClose);
    }
  };

  const onSelectItem = (
    event: React.ChangeEvent<HTMLInputElement>,
    user: boolean,
    id?: number,
  ) => {
    if (id) {
      let newSelectedIds: number[];

      if (event.target.checked) {
        if (user) {
          newSelectedIds = [...selectedUsers, id];
          setSelectedUsers(newSelectedIds);
        } else {
          newSelectedIds = [...selectedLines, id];
          setSelectedLines(newSelectedIds);
        }
      } else {
        if (user) {
          newSelectedIds = [...selectedUsers].filter(
            (folderId) => folderId !== id,
          );
          setSelectedUsers(newSelectedIds);
        } else {
          newSelectedIds = [...selectedLines].filter(
            (folderId) => folderId !== id,
          );
          setSelectedLines(newSelectedIds);
        }
      }
    }
  };

  return (
    <Dialog open={open} onClose={onHandleClose} maxWidth={'sm'} fullWidth>
      <BaseDialogTitle
        onClose={onHandleClose}
        title={`${workTeam ? 'Editar' : 'Nuevo'} equipo de trabajo`}
      />
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Alert severity={'info'}>
              Al eliminar una línea de la selección, si esta tiene solicitudes
              en curso, va a quedar sin asignación
            </Alert>
          </Grid>
          <Grid item xs={12}>
            <ControlledTextFieldFilled
              control={control}
              name={OffererWorkTeamFormFields.Name}
              label={'Nombre'}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <ControlledTextFieldFilled
              control={control}
              name={OffererWorkTeamFormFields.Description}
              label={'Descripción'}
              multiline
              rows={3}
              fullWidth
            />
          </Grid>
          {workTeam && (
            <Grid item md={6} xs={12}>
              <Typography fontWeight={600} fontSize={16}>
                Usuarios
              </Typography>
              <Divider sx={{ paddingTop: 1 }} />
              <Stack spacing={1}>
                {teamUsers ? (
                  teamUsers.length !== 0 ? (
                    teamUsers.map((user) => (
                      <Stack
                        direction={'row'}
                        spacing={1}
                        alignItems={'center'}
                        key={user[EntityWithIdAndDescriptionFields.Id]}
                      >
                        {!user[OffererWorkTeamRelationshipFields.Available] ? (
                          <Tooltip
                            title={
                              'No se puede seleccionar dado que este usuario ya forma parte de un equipo de trabajo'
                            }
                          >
                            <Checkbox
                              value={user[EntityWithIdAndDescriptionFields.Id]}
                              onChange={(e) =>
                                onSelectItem(
                                  e,
                                  true,
                                  user[EntityWithIdAndDescriptionFields.Id],
                                )
                              }
                              checked={selectedUsers.some(
                                (sel) =>
                                  sel ===
                                  user[EntityWithIdAndDescriptionFields.Id],
                              )}
                              disabled
                            />
                          </Tooltip>
                        ) : (
                          <Checkbox
                            value={user[EntityWithIdAndDescriptionFields.Id]}
                            onChange={(e) =>
                              onSelectItem(
                                e,
                                true,
                                user[EntityWithIdAndDescriptionFields.Id],
                              )
                            }
                            checked={selectedUsers.some(
                              (sel) =>
                                sel ===
                                user[EntityWithIdAndDescriptionFields.Id],
                            )}
                          />
                        )}
                        <Typography>
                          {user[EntityWithIdAndDescriptionFields.Description]}
                        </Typography>
                      </Stack>
                    ))
                  ) : (
                    <Alert severity={'info'}>No hay usuarios cargados</Alert>
                  )
                ) : (
                  Array.from({ length: 3 }).map((d, k) => <Skeleton key={k} />)
                )}
              </Stack>
            </Grid>
          )}
          {workTeam && (
            <Grid item md={6} xs={12}>
              <Typography fontWeight={600} fontSize={16}>
                Líneas
              </Typography>
              <Divider sx={{ paddingTop: 1 }} />
              <Stack spacing={1}>
                {teamLines ? (
                  teamLines.length !== 0 ? (
                    teamLines.map((line) =>
                      !line[OffererWorkTeamRelationshipFields.Available] ? (
                        <Tooltip
                          title={
                            'No se puede seleccionar dado que esta línea ya forma parte de un equipo de trabajo'
                          }
                        >
                          <Stack
                            direction={'row'}
                            spacing={1}
                            alignItems={'center'}
                            key={line[EntityWithIdAndDescriptionFields.Id]}
                          >
                            <Checkbox
                              value={line[EntityWithIdAndDescriptionFields.Id]}
                              onChange={(e) =>
                                onSelectItem(
                                  e,
                                  false,
                                  line[EntityWithIdAndDescriptionFields.Id],
                                )
                              }
                              checked={selectedLines.some(
                                (sel) =>
                                  sel ===
                                  line[EntityWithIdAndDescriptionFields.Id],
                              )}
                              disabled
                            />
                            <Typography>
                              {
                                line[
                                  EntityWithIdAndDescriptionFields.Description
                                ]
                              }
                            </Typography>
                          </Stack>
                        </Tooltip>
                      ) : (
                        <Stack
                          direction={'row'}
                          spacing={1}
                          alignItems={'center'}
                          key={line[EntityWithIdAndDescriptionFields.Id]}
                        >
                          <Checkbox
                            value={line[EntityWithIdAndDescriptionFields.Id]}
                            onChange={(e) =>
                              onSelectItem(
                                e,
                                false,
                                line[EntityWithIdAndDescriptionFields.Id],
                              )
                            }
                            checked={selectedLines.some(
                              (sel) =>
                                sel ===
                                line[EntityWithIdAndDescriptionFields.Id],
                            )}
                          />
                          <Typography>
                            {line[EntityWithIdAndDescriptionFields.Description]}
                          </Typography>
                        </Stack>
                      ),
                    )
                  ) : (
                    <Alert severity={'info'}>No hay líneas cargadas</Alert>
                  )
                ) : (
                  Array.from({ length: 3 }).map((d, k) => <Skeleton key={k} />)
                )}
              </Stack>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <SaveButton onClick={handleSubmit(onSubmit)}>Guardar</SaveButton>
      </DialogActions>
    </Dialog>
  );
};

export default OffererWorkTeamDialog;
