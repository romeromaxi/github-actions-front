import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useAction } from '../../../hooks/useAction';
import { useForm } from 'react-hook-form';
import {
  ButtonDropdown,
  SearchButton,
} from '../../../components/buttons/Buttons';
import React, { useEffect, useState } from 'react';
import {
  EntityListWithPagination,
  EntityListWithPaginationFields,
  EntityPaginationFields,
} from '../../../types/baseEntities';
import {
  HttpCachePerson,
  HttpPerson,
} from 'http/index';
import {
  PersonQuaFilterSearch,
  PersonQuaFilterSearchFields,
  PersonSummaryView,
} from '../../../types/person/personData';
import InternalValidatePersonTableList from './InternalValidatePersonTableList';
import {ControlledTextFieldFilled} from "../../../components/forms";
import TabSectionCardHeader from "../../../components/cards/TabSectionCardHeader";
import {SealCheck} from "@phosphor-icons/react";
import {ControlledMultipleSelectAsync} from "../../../components/forms/ControlledMultipleSelectAsync";

const InternalValidatePersonPage = () => {
  const { setTitle } = useAction();
  const [personSearchFilter, setPersonSearchFilter] =
    useState<PersonQuaFilterSearch>({
      [PersonQuaFilterSearchFields.BusinessName]: '',
      [PersonQuaFilterSearchFields.Cuit]: '',
      [PersonQuaFilterSearchFields.ValidationStateCodes]: [],
      [EntityPaginationFields.PageSize]: 10,
      [EntityPaginationFields.ActualPage]: 1,
    });
  const [persons, setPersons] =
    useState<EntityListWithPagination<PersonSummaryView>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [order, setOrder] = useState<string>(
    'Fecha de Última Modificación Descendente',
  );

  const { control, handleSubmit } = useForm<PersonQuaFilterSearch>({
    defaultValues: { ...personSearchFilter },
  });

  setTitle('Validación de Personas');

  const changeToBusinessNameAsc = () => {
    setOrder('Razón Social Ascendente');
    const newFilter: PersonQuaFilterSearch = {
      ...personSearchFilter,
      [EntityPaginationFields.OrderBy]: 'razonSocialASC',
    };

    searchPersons(newFilter);
    setPersonSearchFilter(newFilter);
  };

  const changeToBusinessNameDesc = () => {
    setOrder('Razón Social Descendente');
    const newFilter: PersonQuaFilterSearch = {
      ...personSearchFilter,
      [EntityPaginationFields.OrderBy]: 'razonSocialDESC',
    };

    searchPersons(newFilter);
    setPersonSearchFilter(newFilter);
  };

  const changeToLastModifiedAsc = () => {
    setOrder('Fecha de Última Modificación Ascendente');
    const newFilter: PersonQuaFilterSearch = {
      ...personSearchFilter,
      [EntityPaginationFields.OrderBy]: 'fechaUltModEstadoASC',
    };

    searchPersons(newFilter);
    setPersonSearchFilter(newFilter);
  };

  const changeToLastModifiedDesc = () => {
    setOrder('Fecha de Última Modificación Descendente');
    const newFilter: PersonQuaFilterSearch = {
      ...personSearchFilter,
      [EntityPaginationFields.OrderBy]: 'fechaUltModEstadoDESC',
    };

    searchPersons(newFilter);
    setPersonSearchFilter(newFilter);
  };

  const searchPersons = (filter: PersonQuaFilterSearch) => {
    setLoading(true);

    HttpPerson.searchByFilter(filter)
      .then(setPersons)
      .finally(() => setLoading(false));
  };
  
  useEffect(() => {
    searchPersons(personSearchFilter);
  }, []);

  const onSubmit = (data: PersonQuaFilterSearch) => {
    setPersonSearchFilter(data);
    searchPersons(data);
  };

  return (
    <Stack spacing={3}>
      <TabSectionCardHeader icon={SealCheck}
                            sectionTitle={'Validación de personas'}
      />
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container alignItems={'center'} spacing={5}>
              <Grid item xs={6} md={3.5}>
                <ControlledTextFieldFilled
                  control={control}
                  label={'Razón Social'}
                  name={PersonQuaFilterSearchFields.BusinessName}
                />
              </Grid>
              <Grid item xs={6} md={2}>
                <ControlledTextFieldFilled
                  control={control}
                  label={'CUIT'}
                  name={PersonQuaFilterSearchFields.Cuit}
                />
              </Grid>
              <Grid item xs={8} md={4.25}>                
                <ControlledMultipleSelectAsync id={'selMulCompanyStatesSearch'} 
                                               label={'Estado'}
                                               name={PersonQuaFilterSearchFields.ValidationStateCodes} 
                                               control={control}
                                               loadOptions={HttpCachePerson.getStates}
                                               fullWidth
                />
              </Grid>
              <Grid item xs={4} md={2.25}>
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
            {
              label: 'Fecha de Última Modificación Descendente',
              onClick: changeToLastModifiedDesc,
            },
            {
              label: 'Fecha de Última Modificación Ascendente',
              onClick: changeToLastModifiedAsc,
            },
            {
              label: 'Razón Social Descendente',
              onClick: changeToBusinessNameDesc,
            },
            {
              label: 'Razón Social Ascendente',
              onClick: changeToBusinessNameAsc,
            },
          ]}
        />
      </Stack>

      <InternalValidatePersonTableList
        loading={loading}
        persons={persons?.[EntityListWithPaginationFields.List]}
        searchPersons={searchPersons}
        prevFilter={personSearchFilter}
        pagination={persons?.[EntityListWithPaginationFields.Pagination]}
      />
    </Stack>
  );
};

export default InternalValidatePersonPage;
