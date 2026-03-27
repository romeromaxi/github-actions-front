import {
  Alert,
  Checkbox,
  Chip,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import { useFormContext } from 'react-hook-form';
import { ControlledTextFieldFilled } from 'components/forms';
import {
  OffererRole,
  OffererRoleFields,
  OffererRolePost,
  RoleFields,
} from 'types/offerer/rolesData';
import { HttpCacheOfferer } from 'http/cache/httpCacheOfferer';
import {
  EntityWithIdAndDescriptionAndDetailFields,
  EntityWithIdFields,
} from 'types/baseEntities';
import {
  OffererWorkTeamView,
  OffererWorkTeamViewFields,
} from '../../../../types/offerer/offererSolicitationData';
import { HttpOffererWorkTeams } from '../../../../http/offerer/httpOffererWorkTeams';
import { HttpOffererRoles } from '../../../../http';
import { useAction } from '../../../../hooks/useAction';
import useAxios from '../../../../hooks/useAxios';
import { OffererRolesListContext } from '../OffererRolesList';
import { stringFormatter } from '../../../../util/formatters/stringFormatter';
import {ControlledMultipleSelectAsync} from "../../../../components/forms/ControlledMultipleSelectAsync";

interface RoleMultipleEditComponentProps {
  role: OffererRole;
  onSave?: () => void;
}

function RoleMultipleEditComponent({
  role,
  onSave,
}: RoleMultipleEditComponentProps) {
  const methods = useFormContext<OffererRolePost>();

  const watchSelectedGroupList = methods.watch(OffererRoleFields.GroupIds);
  const errors = methods.formState.errors;
  const errorGroupList = !!errors
    ? errors?.[OffererRoleFields.GroupIds]
    : undefined;
  const [workTeamsUsersId, setWorkTeamsUsersId] = useState<number[]>([]);
  const [workTeams, setWorkTeams] = useState<OffererWorkTeamView[]>();
  const { snackbarSuccess } = useAction();
  const { fetchData } = useAxios();
  const { reloadRoles } = useContext(OffererRolesListContext);

  const onSubmit = (data: OffererRolePost) => {
    const submitData: OffererRolePost = {
      ...data,
      [OffererRoleFields.WorkTeamIds]: workTeamsUsersId,
    };

    fetchData(
      () =>
        HttpOffererRoles.updateRole(
          data[RoleFields.OffererId],
          role[OffererRoleFields.UserId],
          submitData,
        ),
      true,
    ).then(() => {
      reloadRoles();
      onSave && onSave();
      snackbarSuccess('El registro se ha guardado correctamente');
    });
  };

  const renderTitle = () => (
    <Stack direction={'row'} justifyContent={'space-between'}>
      <Typography fontSize={18} fontWeight={600}>
        {role[RoleFields.LegalName]}
      </Typography>

      <Tooltip arrow title="CUIT" placement="top">
        <Chip
          color="info"
          size="small"
          label={stringFormatter.formatCuit(role?.[RoleFields.CUIT] ?? '')}
        />
      </Tooltip>
    </Stack>
  );

  useEffect(() => {
    HttpOffererWorkTeams.getListByOffererId(
      role[OffererRoleFields.OffererId],
    ).then((r) => setWorkTeams(r));
  }, [role]);

  useEffect(() => {
    if (workTeams) {
      setWorkTeamsUsersId(role[OffererRoleFields.WorkTeamIds]);
    }
  }, [workTeams]);

  const loadRolesOptions = useCallback(async () => {
    const roles = await HttpCacheOfferer.getRolesTypes();
    return roles.map(role => ({
      ...role,
      [EntityWithIdAndDescriptionAndDetailFields.Id]: role.id,
      [EntityWithIdAndDescriptionAndDetailFields.Description]: role.descripcion,
      [EntityWithIdAndDescriptionAndDetailFields.Detalle]: role.detalle,
    }));
  }, []);

  useEffect(() => {
    if (!!watchSelectedGroupList && !!watchSelectedGroupList.length)
      methods.clearErrors(OffererRoleFields.GroupIds);
  }, [watchSelectedGroupList]);

  const onSelectItem = (
    event: React.ChangeEvent<HTMLInputElement>,
    id?: number,
  ) => {
    if (id) {
      let newSelectedIds: number[];

      if (event.target.checked) {
        newSelectedIds = [...workTeamsUsersId, id];
        setWorkTeamsUsersId(newSelectedIds);
      } else {
        newSelectedIds = [...workTeamsUsersId].filter(
          (workTeamId) => workTeamId !== id,
        );
        setWorkTeamsUsersId(newSelectedIds);
      }
    }
  };

  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} id="form-offerer-edit-role">
      {renderTitle()}
      <Grid container spacing={1} mt={2}>
        <Grid item xs={12}>
          <ControlledMultipleSelectAsync label="Rol" 
                                         loadOptions={loadRolesOptions} 
                                         id={`selMulCodGroupIdsRole`} 
                                         name={OffererRoleFields.GroupIds} 
                                         control={methods.control} 
                                         fullWidth 
                                         error={!!errorGroupList} 
                                         helperText={!!errorGroupList ? errorGroupList.message : undefined}
                                         optionsWithTooltip
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ControlledTextFieldFilled
            label={'Mail'}
            control={methods.control}
            name={RoleFields.Mail}
            fullWidth
            disabled
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <ControlledTextFieldFilled
            control={methods.control}
            label={'Sector'}
            fullWidth
            name={OffererRoleFields.Sector}
          />
        </Grid>
        <Grid item md={3} xs={12}>
          <ControlledTextFieldFilled
            control={methods.control}
            label={'Id Origen'}
            fullWidth
            name={OffererRoleFields.OriginId}
          />
        </Grid>
        <Grid item xs={12} mt={1}>
          <Typography fontSize={16} fontWeight={600}>
            Equipos de trabajo
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        {workTeams ? (
          workTeams.length !== 0 ? (
            workTeams.map((team) => (
              <Grid item xs={12}>
                <Stack direction={'row'} alignItems={'center'} spacing={1}>
                  <Checkbox
                    value={team[EntityWithIdFields.Id]}
                    checked={workTeamsUsersId.some(
                      (t) => t === team[EntityWithIdFields.Id],
                    )}
                    onChange={(e) =>
                      onSelectItem(e, team[EntityWithIdFields.Id])
                    }
                  />
                  <Typography>
                    {team[OffererWorkTeamViewFields.Name]}
                  </Typography>
                </Stack>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert severity={'info'}>
                Al parecer no hay equipos de trabajo
              </Alert>
            </Grid>
          )
        ) : (
          Array.from({ length: 6 }).map((d) => (
            <Grid item xs={12} md={6}>
              <Skeleton />
            </Grid>
          ))
        )}
      </Grid>
    </form>
  );
}

export default RoleMultipleEditComponent;
