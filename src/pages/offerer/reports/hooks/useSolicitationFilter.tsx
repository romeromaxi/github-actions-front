import React, { useCallback } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { HttpCacheProduct } from '../../../../http/cache/httpCacheProduct';
import {
  EntityListWithPaginationFields,
  EntityPaginationFields,
  EntityWithIdAndDescription,
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from '../../../../types/baseEntities';
import { HttpOffererProductLine } from '../../../../http';
import { ProductLineFields } from '../../../../types/lines/productLineData';
import { HttpOffererWorkTeams } from '../../../../http/offerer/httpOffererWorkTeams';
import { Grid } from '@mui/material';
import { ControlledDatePicker } from '../../../../components/forms/ControlledDatePicker';
import { AsyncSelect } from '../../../../components/forms';

enum SolicitationStateChartFormFields {
  StartDate = 'fechaDesde',
  EndDate = 'fechaHasta',
  ProductCode = 'codProducto',
  LineCode = 'idProductoLinea',
  TeamCode = 'idOferenteEquipoTrabajo',
}

export type SolicitationStateChartForm = {
  [SolicitationStateChartFormFields.StartDate]?: Date;
  [SolicitationStateChartFormFields.EndDate]?: Date;
  [SolicitationStateChartFormFields.ProductCode]?: number;
  [SolicitationStateChartFormFields.LineCode]?: number;
  [SolicitationStateChartFormFields.TeamCode]?: number;
};

export const useSolicitationChartFilter = (offererId: number) => {
  const { control } = useForm<SolicitationStateChartForm>({
    defaultValues: {
      [SolicitationStateChartFormFields.StartDate]: undefined,
      [SolicitationStateChartFormFields.EndDate]: new Date(),
      [SolicitationStateChartFormFields.ProductCode]: undefined,
      [SolicitationStateChartFormFields.LineCode]: undefined,
      [SolicitationStateChartFormFields.TeamCode]: undefined,
    },
  });

  const formValues = useWatch({ control });

  const loadProducts = useCallback(() => {
    return HttpCacheProduct.getListByOffererId(offererId);
  }, []);

  const loadLines = (): Promise<EntityWithIdAndDescription[]> => {
    let lineList: EntityWithIdAndDescription[] = [];

    return HttpOffererProductLine.getListByOffererId(offererId, {
      [EntityPaginationFields.ActualPage]: 1,
      [EntityPaginationFields.PageSize]: 999,
    }).then((res) =>
      res[EntityListWithPaginationFields.List].map((line) => ({
        [EntityWithIdFields.Id]: line[EntityWithIdFields.Id],
        [EntityWithIdAndDescriptionFields.Description]:
          line[ProductLineFields.Line],
      })),
    );
  };

  const loadTeams = useCallback(() => {
    return HttpOffererWorkTeams.getListSummaryByOffererId(offererId);
  }, []);

  const Filters = () => (
    <Grid container gap={1}>
      <Grid container gap={1}>
        <Grid item xs={2}>
          <ControlledDatePicker
            control={control}
            name={SolicitationStateChartFormFields.StartDate}
            label={'Fecha Desde'}
            filled
          />
        </Grid>
        <Grid item xs={2}>
          <ControlledDatePicker
            control={control}
            name={SolicitationStateChartFormFields.EndDate}
            label={'Fecha Hasta'}
            filled
          />
        </Grid>
        <Grid item xs={2}>
          <AsyncSelect
            loadOptions={loadProducts}
            control={control}
            name={SolicitationStateChartFormFields.ProductCode}
            label={'Producto'}
          />
        </Grid>
        <Grid item xs={2.5}>
          <AsyncSelect
            loadOptions={loadLines}
            control={control}
            name={SolicitationStateChartFormFields.LineCode}
            label={'Linea'}
          />
        </Grid>
        <Grid item xs={2.5}>
          <AsyncSelect
            loadOptions={loadTeams}
            control={control}
            name={SolicitationStateChartFormFields.TeamCode}
            label={'Equipo'}
          />
        </Grid>
      </Grid>
    </Grid>
  );

  return { Filters, formValues: formValues };
};
