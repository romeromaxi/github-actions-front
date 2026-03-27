import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Card, CardContent, CardHeader, Grid, Stack } from '@mui/material';
import { ControlledDatePicker } from '../../../../../../components/forms/ControlledDatePicker';
import { AsyncSelect } from '../../../../../../components/forms';
import { EntityWithIdAndDescription } from '../../../../../../types/baseEntities';
import SolicitationEvolutionChart from './SolicitationEvolutionChart';

export enum SolicitationEvolutionChartFormFields {
  StartDate = 'fechaDesde',
  EndDate = 'fechaHasta',
  PeriodicityCode = 'codPeriodicidad',
}

export type SolicitationEvolutionChartForm = {
  [SolicitationEvolutionChartFormFields.StartDate]?: Date;
  [SolicitationEvolutionChartFormFields.EndDate]?: Date;
  [SolicitationEvolutionChartFormFields.PeriodicityCode]?: number;
};

interface SolicitationEvolutionChartWithFilterProps {
  offererId: number;
}

function SolicitationEvolutionChartWithFilter({
  offererId,
}: SolicitationEvolutionChartWithFilterProps) {
  const { control } = useForm<SolicitationEvolutionChartForm>({
    defaultValues: {
      [SolicitationEvolutionChartFormFields.StartDate]: undefined,
      [SolicitationEvolutionChartFormFields.EndDate]: new Date(),
      [SolicitationEvolutionChartFormFields.PeriodicityCode]: undefined,
    },
  });

  const formValues = useWatch({ control });

  //TODO: meter esto en un endpoint cache
  const loadPeriodicity = (): Promise<EntityWithIdAndDescription[]> => {
    return Promise.resolve([
      {
        id: 1,
        descripcion: 'Día',
      },
      {
        id: 2,
        descripcion: 'Semana',
      },
      {
        id: 3,
        descripcion: 'Mes',
      },
    ]);
  };

  return (
    <Stack direction={'column'} gap={1}>
      <Card>
        <CardHeader title={'Filtros'} />
        <CardContent>
          <Grid item container xs={10} gap={1} justifyContent={'flex-start'}>
            <Grid item xs={3}>
              <ControlledDatePicker
                control={control}
                name={SolicitationEvolutionChartFormFields.StartDate}
                label={'Fecha Desde'}
              />
            </Grid>
            <Grid item xs={3}>
              <ControlledDatePicker
                control={control}
                name={SolicitationEvolutionChartFormFields.EndDate}
                label={'Fecha Hasta'}
              />
            </Grid>
            <Grid item xs={3}>
              <AsyncSelect
                loadOptions={loadPeriodicity}
                control={control}
                name={SolicitationEvolutionChartFormFields.PeriodicityCode}
                label={'Periodicidad'}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <SolicitationEvolutionChart offererId={offererId} filter={formValues} />
    </Stack>
  );
}

export default SolicitationEvolutionChartWithFilter;
