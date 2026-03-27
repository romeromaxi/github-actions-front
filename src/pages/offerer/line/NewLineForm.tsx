import React, { useCallback, useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

import { Alert, Stack } from '@mui/material';
import { AsyncSelect } from 'components/forms';

import { HttpCacheProduct } from 'http/cache/httpCacheProduct';
import {
  RequiredSchema,
  RequiredSelectSchema,
} from 'util/validation/validationSchemas';
import { NewLineContext } from './NewLineDrawer';
import {
  ProductLineInsert,
  ProductLineInsertFields,
} from 'types/lines/productLineData';
import { ControlledTextFieldFilled } from '../../../components/forms';
import { HttpOffererWorkTeams } from '../../../http/offerer/httpOffererWorkTeams';
import { OffererWorkTeamViewFields } from '../../../types/offerer/offererSolicitationData';
import {
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from '../../../types/baseEntities';

interface NewLineFormProps {
  offererId: number;
}

function NewLineForm(props: NewLineFormProps) {
  const { setOffererNewLine, setLoading } = useContext(NewLineContext);

  const [error, setError] = useState<string>();

  const NewLineTypeFormSchema = yup.object().shape({
    [ProductLineInsertFields.ProductCode]: RequiredSelectSchema,
    [ProductLineInsertFields.Line]: RequiredSchema,
  });

  const { control, handleSubmit, setValue, watch } = useForm<ProductLineInsert>(
    {
      resolver: yupResolver(NewLineTypeFormSchema),
    },
  );

  const watchProductServiceCode = watch(
    ProductLineInsertFields.ProductServiceCode,
  );
  const watchProductInstrumentCode = watch(
    ProductLineInsertFields.ProductInstrumentCode,
  );
  const watchProductInstrumentTypeCode = watch(
    ProductLineInsertFields.ProductInstrumentTypeCode,
  );
  const enterFilters: boolean =
    !!watchProductServiceCode &&
    !!watchProductInstrumentTypeCode &&
    !!watchProductInstrumentCode;

  const onHandleSubmit = (data: ProductLineInsert) => {
    setLoading(true);
    setError(undefined);
    setOffererNewLine(data);
  };

  const loadProductInstrument = useCallback(async () => {
    if (!!watchProductInstrumentTypeCode)
      return await HttpCacheProduct.getInstrumentsByType(
        watchProductInstrumentTypeCode,
      );

    return [];
  }, [watchProductInstrumentTypeCode]);

  const loadProductServices = useCallback(async () => {
    return await HttpCacheProduct.getServicesByOffererId(props.offererId);
  }, []);

  const loadProducts = useCallback(async () => {
    if (
      watchProductServiceCode &&
      watchProductInstrumentTypeCode &&
      watchProductInstrumentCode
    )
      return await HttpCacheProduct.getFilteredList(
        watchProductServiceCode || undefined,
        watchProductInstrumentTypeCode || undefined,
        watchProductInstrumentCode || undefined,
      );

    return [];
  }, [
    watchProductServiceCode,
    watchProductInstrumentTypeCode,
    watchProductInstrumentCode,
  ]);

  const loadTeamWorks = useCallback(async () => {
    if (
      watchProductServiceCode &&
      watchProductInstrumentTypeCode &&
      watchProductInstrumentCode
    )
      return (
        await HttpOffererWorkTeams.getListByOffererId(props.offererId)
      ).map((x) => {
        return {
          [EntityWithIdFields.Id]: x[EntityWithIdFields.Id],
          [EntityWithIdAndDescriptionFields.Description]:
            x[OffererWorkTeamViewFields.Name],
        };
      });

    return [];
  }, [
    watchProductServiceCode,
    watchProductInstrumentTypeCode,
    watchProductInstrumentCode,
  ]);

  useEffect(() => {
    setValue(ProductLineInsertFields.ProductCode, undefined);
  }, [
    watchProductServiceCode,
    watchProductInstrumentTypeCode,
    watchProductInstrumentCode,
  ]);

  useEffect(() => {
    setValue(ProductLineInsertFields.ProductInstrumentCode, 0);
  }, [watchProductInstrumentTypeCode]);

  return (
    <form onSubmit={handleSubmit(onHandleSubmit)} id="offerer-new-line-form">
      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        mt={2}
      >
        {error && <Alert severity={'error'}>{error}</Alert>}
        <AsyncSelect
          label="Servicio"
          control={control}
          loadOptions={loadProductServices}
          name={ProductLineInsertFields.ProductServiceCode}
          fullWidth
        />

        <AsyncSelect
          label="Tipo Instrumento"
          control={control}
          loadOptions={HttpCacheProduct.getInstrumentTypes}
          name={ProductLineInsertFields.ProductInstrumentTypeCode}
          fullWidth
        />

        <AsyncSelect
          label="Instrumento"
          control={control}
          loadOptions={loadProductInstrument}
          name={ProductLineInsertFields.ProductInstrumentCode}
          disabled={!watchProductInstrumentTypeCode}
          fullWidth
        />

        <Alert severity="info">
          Debe completar todos los filtros para poder habilitar la siguiente
          sección
        </Alert>

        <AsyncSelect
          label="Producto"
          control={control}
          disabled={!enterFilters}
          loadOptions={loadProducts}
          name={ProductLineInsertFields.ProductCode}
          fullWidth
          required
        />

        <ControlledTextFieldFilled
          label="Nombre de la línea"
          control={control}
          name={ProductLineInsertFields.Line}
          fullWidth
          disabled={!enterFilters}
          required
        />

        <AsyncSelect
          label="Equipo de Trabajo"
          control={control}
          disabled={!enterFilters}
          loadOptions={loadTeamWorks}
          name={ProductLineInsertFields.OffererWorkTeamsId}
          fullWidth
        />
      </Stack>
    </form>
  );
}

export default NewLineForm;
