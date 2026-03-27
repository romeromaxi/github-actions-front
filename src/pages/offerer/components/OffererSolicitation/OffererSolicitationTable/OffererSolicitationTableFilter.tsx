import React, { useContext, useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Grid, IconButton } from '@mui/material';
import { grey } from '@mui/material/colors';
import { OffererContext } from '../../OffererContextProvider';
import {
  SolicitationFilter,
  SolicitationFilterFields,
} from '../../../../../types/solicitations/solicitationData';
import {
  EntityWithIdAndDescription,
  EntityWithIdFields,
} from '../../../../../types/baseEntities';
import { HttpCacheSolicitation, HttpSolicitation } from '../../../../../http';
import {
  AsyncSelect,
  ControlledCheckBox,
  ControlledTextFieldFilled,
} from '../../../../../components/forms';
import { ControlledMultipleSelect } from '../../../../../components/forms/ControlledMultipleSelect';
import { SearchButton } from '../../../../../components/buttons/Buttons';
import ClearIcon from '@mui/icons-material/Clear';

interface OffererSolicitationTableFilterProps {
  filter?: SolicitationFilter;
  onClickSearch: (filter: SolicitationFilter) => void;
}

function OffererSolicitationTableFilter({
  filter,
  onClickSearch,
}: OffererSolicitationTableFilterProps) {
  const offerer = useContext(OffererContext);

  const { control, handleSubmit, setValue, reset } =
    useForm<SolicitationFilter>({
      defaultValues: {
        ...filter,
        [SolicitationFilterFields.StatusCodeList]: [],
      },
    });
  const watchStatusCode = useWatch({
    control: control,
    name: SolicitationFilterFields.StatusCodeList,
    defaultValue: [],
  });
  const [responsibleUsers, setResponsibleUsers] =
    useState<EntityWithIdAndDescription[]>();
  const [responsibleCommercialUsers, setCommercialResponsibleUsers] =
    useState<EntityWithIdAndDescription[]>();
  const [statusCodes, setStatusCodes] =
    useState<EntityWithIdAndDescription[]>();

  const onSubmit = (data: SolicitationFilter) => {
    onClickSearch(data);
  };

  const loadUsers = () => {
    if (responsibleUsers) return Promise.resolve(responsibleUsers);

    return undefined;
  };

  const loadCommercialResponsibles = () => {
    if (responsibleCommercialUsers)
      return Promise.resolve(responsibleCommercialUsers);

    return undefined;
  };

  useEffect(() => {
    if (!statusCodes)
      HttpCacheSolicitation.getSolicitationStatusesForOfferer().then(
        (statuses) => setStatusCodes(statuses),
      );
  });

  useEffect(() => {
    if (!responsibleUsers)
      HttpSolicitation.getResponsibles(offerer[EntityWithIdFields.Id]).then(
        setResponsibleUsers,
      );
  });

  useEffect(() => {
    if (!responsibleCommercialUsers)
      HttpSolicitation.getCommercialResponsibles(
        offerer[EntityWithIdFields.Id],
      ).then(setCommercialResponsibleUsers);
  });

  const clearFilterStage = () => {
    reset({
      [SolicitationFilterFields.ResponsibleUserStageId]: 0,
    });
  };

  const clearFilterCommercial = () => {
    reset({
      [SolicitationFilterFields.ResponsibleUserCommercialId]: 0,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid
        item
        container
        spacing={2}
        sx={{ mb: 2 }}
        justifyContent={'flex-end'}
      >
        <Grid item xs={5}>
          <ControlledTextFieldFilled
            control={control}
            name={SolicitationFilterFields.CompanyBusinessName}
            label={'Empresa'}
            sx={{ backgroundColor: '#F5F8FA' }}
            InputLabelProps={{
              style: { color: grey[600] },
            }}
          />
        </Grid>

        <Grid item xs={10} md={5}>
          <ControlledMultipleSelect
            sx={{ width: '100%', backgroundColor: 'white' }}
            fullWidth
            id={'solicitation-status-select'}
            field={SolicitationFilterFields.StatusCodeList}
            label={'Estado Solicitud'}
            lstData={statusCodes}
            valuesSelected={watchStatusCode!}
            onHandleChange={(field: string, value?: number[]) => {
              setValue(SolicitationFilterFields.StatusCodeList, value);
            }}
            labelProps={{ sx: { color: grey[600], width: '100%' } }}
          />
        </Grid>
        <Grid item xs={2}>
          <ControlledCheckBox
            label={'Alertas'}
            name={SolicitationFilterFields.HasAlert}
            control={control}
            sx={{ display: 'inline' }}
          />
        </Grid>
        <Grid item xs={6} md={5}>
          <AsyncSelect
            control={control}
            name={SolicitationFilterFields.ResponsibleUserStageId}
            loadOptions={loadUsers}
            label={'Usuario Asignado'}
            sx={{ backgroundColor: '#F5F8FA' }}
            InputLabelProps={{
              style: { color: grey[600] },
            }}
            InputProps={{
              endAdornment: (
                <IconButton onClick={clearFilterStage} sx={{ marginRight: 1 }}>
                  <ClearIcon fontSize="small" />
                </IconButton>
              ),
            }}
            type={'number'}
          />
        </Grid>
        <Grid item xs={6} md={5}>
          <AsyncSelect
            control={control}
            name={SolicitationFilterFields.ResponsibleUserCommercialId}
            loadOptions={loadCommercialResponsibles}
            label={'Referente Comercial'}
            sx={{ backgroundColor: '#F5F8FA' }}
            InputLabelProps={{
              style: { color: grey[600] },
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={clearFilterCommercial}
                  sx={{ marginRight: 1 }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ),
            }}
            type={'number'}
          />
        </Grid>
        <Grid item xs={2}>
          <SearchButton type={'submit'}>Buscar</SearchButton>
        </Grid>
      </Grid>
    </form>
  );
}

export default OffererSolicitationTableFilter;
