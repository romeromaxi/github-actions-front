import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {Grid, IconButton, Stack} from '@mui/material';
import { grey } from '@mui/material/colors';
import ClearIcon from '@mui/icons-material/Clear';
import { OffererContext } from '../../components/OffererContextProvider';

import { HttpProductLine } from '../../../../http';
import { HttpCacheProduct } from '../../../../http/cache/httpCacheProduct';
import {
  EntityWithIdAndDescription,
  EntityWithIdFields,
} from '../../../../types/baseEntities';
import { HttpCacheProductLine } from '../../../../http/cache/httpProductLine';
import { AsyncSelect, ControlledCheckBox } from '../../../../components/forms';
import { SearchButton } from '../../../../components/buttons/Buttons';
import { ProductLineOffererFilter, ProductLineOffererFilterFields } from 'types/lines/productLineData';
import ChipMultiselect from "../../../../components/forms/ChipMultiselect";

interface OffererSolicitationTableFilterProps {
  filter?: ProductLineOffererFilter;
  onClickSearch: (filter: ProductLineOffererFilter) => void;
}

function OffererLineTableFilter({
  filter,
  onClickSearch,
}: OffererSolicitationTableFilterProps) {
  const offerer = useContext(OffererContext);
  const [lineStateTypes, setLineStateTypes] =
    useState<EntityWithIdAndDescription[]>();

  const { control, handleSubmit, reset } = useForm<ProductLineOffererFilter>(
    {
      defaultValues: {
        ...filter,
      },
    },
  );

  const loadProducts = useCallback(() => {
    return HttpProductLine.getProducts();
  }, []);

  const loadServices = useCallback(() => {
    return HttpCacheProduct.getServicesByOffererId(
      offerer[EntityWithIdFields.Id],
    );
  }, []);

  const loadToolTypes = useCallback(() => {
    return HttpCacheProduct.getInstrumentTypes();
  }, []);

  const loadLineStateTypes = () => {
    HttpCacheProductLine.getStatesType().then((r) => setLineStateTypes(r));
  };

  useEffect(() => {
    loadLineStateTypes();
  }, []);

  const clearFilterProduct = () => {
    reset({
      [ProductLineOffererFilterFields.LineProductCode]: 0,
    });
  };

  const clearFilterService = () => {
    reset({
      [ProductLineOffererFilterFields.LineServiceCode]: 0,
    });
  };

  const clearInstrumentType = () => {
    reset({
      [ProductLineOffererFilterFields.LineToolTypeCode]: 0,
    });
  };

  const onSubmit = (data: ProductLineOffererFilter) => {
    onClickSearch({
      ...data,
      // [ProductLineOffererFilterFields.LineStateCods]: codsLineState
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} alignItems='center'>
            <Grid item md={1.25}>
                <ControlledCheckBox
                  label={'Alertas'}
                  name={'alertas'}
                  control={control}
                />
            </Grid>
            <Grid item md={3.25}>
                <AsyncSelect
                  control={control}
                  name={ProductLineOffererFilterFields.LineProductCode}
                  loadOptions={loadProducts}
                  label={'Producto'}
                  fullWidth={false}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => clearFilterProduct()}
                        sx={{ marginRight: 1 }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    ),
                  }}
                  type={'number'}
                />
            </Grid>
            <Grid item md={3.5}>
                <AsyncSelect
                  control={control}
                  name={ProductLineOffererFilterFields.LineServiceCode}
                  loadOptions={loadServices}
                  fullWidth={false}
                  label={'Servicio'}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => clearFilterService()}
                        sx={{ marginRight: 1 }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    ),
                  }}
                  type={'number'}
                />
            </Grid>
            <Grid item md={4}>
                <AsyncSelect
                  control={control}
                  fullWidth={false}
                  name={ProductLineOffererFilterFields.LineToolTypeCode}
                  loadOptions={loadToolTypes}
                  label={'Tipo Instrumento'}
                  
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        onClick={() => clearInstrumentType()}
                        sx={{ marginRight: 1 }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    ),
                  }}
                  type={'number'}
                />
            </Grid>
            <Grid item md={2.75}>
                <ChipMultiselect control={control}
                                 name={ProductLineOffererFilterFields.LineStateCods}
                                 label={'Estado Solicitud'}
                                 options={lineStateTypes}
                />
            </Grid>
            <Grid item md={7}></Grid>
            <Grid item md={1.4}>
                <SearchButton type={'submit'}>Buscar</SearchButton>
            </Grid>
            <Grid item md={0.85}></Grid>
      </Grid>
    </form>
  );
}

export default OffererLineTableFilter;
