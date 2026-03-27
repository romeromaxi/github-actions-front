import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import {
  AddButton,
  ButtonDropdown,
  SearchButton,
} from '../../../components/buttons/Buttons';
import {
  Offerer,
  OffererQuaFilterSearch,
  OffererQuaFilterSearchFields,
} from '../../../types/offerer/offererData';
import { HttpOfferer } from '../../../http';
import OffererTableList from './OffererTableList';
import NewOffererDrawer from '../../offerer/newOfferer/NewOffererDrawer';
import { ControlledTextFieldFilled } from '../../../components/forms';
import { useForm } from 'react-hook-form';
import {
  EntityListWithPagination,
  EntityListWithPaginationFields,
  EntityPaginationFields,
} from '../../../types/baseEntities';
import { HttpCacheOfferer } from '../../../http/cache/httpCacheOfferer';
import TabSectionCardHeader from "../../../components/cards/TabSectionCardHeader";
import {Users} from "phosphor-react";
import {ControlledMultipleSelectAsync} from "../../../components/forms/ControlledMultipleSelectAsync";

function OffererListPage() {
  const [loading, setLoading] = useState<boolean>(true);
  const [offerers, setOfferers] = useState<EntityListWithPagination<Offerer>>();
  const [openDialogNew, setOpenDialogNew] = useState<boolean>(false);
  const [order, setOrder] = useState<string>('Oferente Ascendiente');

  const [offererSearchFilter, setOffererSearchFilter] =
    useState<OffererQuaFilterSearch>({
      [OffererQuaFilterSearchFields.OffererName]: '',
      [OffererQuaFilterSearchFields.OffererCuit]: '',
      [OffererQuaFilterSearchFields.OffererTypeCods]: [],
      [EntityPaginationFields.PageSize]: 10,
      [EntityPaginationFields.ActualPage]: 1,
    });

  const changeToProdAsc = () => {
    setOrder('Tipo Oferente Ascendiente');
    const newFilter: OffererQuaFilterSearch = {
      ...offererSearchFilter,
      [EntityPaginationFields.OrderBy]: 'oferenteTipoASC',
    };

    searchOfferers(newFilter);
    setOffererSearchFilter(newFilter);
  };

  const changeToProdDesc = () => {
    setOrder('Tipo Oferente Descendiente');
    const newFilter: OffererQuaFilterSearch = {
      ...offererSearchFilter,
      [EntityPaginationFields.OrderBy]: 'oferenteTipoDESC',
    };

    searchOfferers(newFilter);
    setOffererSearchFilter(newFilter);
  };

  const changeToOffererAsc = () => {
    setOrder('Oferente Ascendiente');
    const newFilter: OffererQuaFilterSearch = {
      ...offererSearchFilter,
      [EntityPaginationFields.OrderBy]: 'razonSocialASC',
    };

    searchOfferers(newFilter);
    setOffererSearchFilter(newFilter);
  };

  const changeToOffererDesc = () => {
    setOrder('Oferente Descendiente');
    const newFilter: OffererQuaFilterSearch = {
      ...offererSearchFilter,
      [EntityPaginationFields.OrderBy]: 'razonSocialDESC',
    };

    searchOfferers(newFilter);
    setOffererSearchFilter(newFilter);
  };

  const { control, handleSubmit } = useForm<OffererQuaFilterSearch>({
    defaultValues: {
      ...offererSearchFilter,
    },
  });

  const searchOfferers = (filter: OffererQuaFilterSearch) => {
    setLoading(true);

    HttpOfferer.getOffererPaginatedList(filter).then((response) => {
      setOfferers(response);
      setLoading(false);
    });
  };

  useEffect(() => {
    searchOfferers(offererSearchFilter);
  }, []);

  const onSearch = (data: OffererQuaFilterSearch) => {
    setOffererSearchFilter(data);
    searchOfferers(data);
  };

  return (
    <Stack spacing={3}>
      <TabSectionCardHeader icon={Users}
                            sectionTitle={'Oferentes'}
                            actions={<AddButton size={'small'} onClick={() => setOpenDialogNew(true)}>
                              Agregar Oferente
                            </AddButton>}
      />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSearch)}>
            <Grid container alignItems={'center'} spacing={5}>
              <Grid item xs={6} md={3.5}>
                <ControlledTextFieldFilled
                  control={control}
                  label={'Oferente'}
                  name={OffererQuaFilterSearchFields.OffererName}
                />
              </Grid>
              <Grid item xs={6} md={2.5}>
                <ControlledTextFieldFilled
                  control={control}
                  label={'CUIT'}
                  name={OffererQuaFilterSearchFields.OffererCuit}
                />
              </Grid>
              <Grid item xs={6} md={3.5}>
                <ControlledMultipleSelectAsync
                    id={'selMulOffererTypesSearch'}
                    label={'Tipo'}
                    loadOptions={HttpCacheOfferer.getOffererTypes}
                    control={control}
                    name={OffererQuaFilterSearchFields.OffererTypeCods}
                    sx={{ width: '100%', backgroundColor: 'white' }}
                    fullWidth
                />
              </Grid>
              <Grid item xs={2.5}>
                <SearchButton type={'submit'}>Buscar</SearchButton>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        justifyContent={'flex-end'}
      >
        <Typography fontWeight={500} color={'grey.700'}>
          Ordenar por:
        </Typography>
        <ButtonDropdown
          label={order}
          items={[
            { label: 'Oferente Ascendiente', onClick: changeToOffererAsc },
            { label: 'Oferente Descendiente', onClick: changeToOffererDesc },
            { label: 'Tipo Oferente Ascendiente', onClick: changeToProdAsc },
            { label: 'Tipo Oferente Descendiente', onClick: changeToProdDesc },
          ]}
        />
      </Stack>
      <OffererTableList
        loading={loading}
        offerers={offerers?.[EntityListWithPaginationFields.List]}
        pagination={offerers?.[EntityListWithPaginationFields.Pagination]}
        searchOfferers={searchOfferers}
        prevFilter={offererSearchFilter}
      />

      <NewOffererDrawer
        show={openDialogNew}
        onCloseDrawer={() => setOpenDialogNew(false)}
        onFinishProcess={() => {
          setOpenDialogNew(false);
          searchOfferers(offererSearchFilter);
        }}
      />
    </Stack>
  );
}

export default OffererListPage;
