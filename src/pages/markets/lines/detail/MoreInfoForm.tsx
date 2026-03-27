import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Grid, Typography } from '@mui/material';
import { ControlledTextFieldFilled } from '../../../../components/forms';
import { DefaultMarketButton } from '../../../../components/buttons/Buttons';
import {
  RequiredMailSchema,
  RequiredSchema,
} from '../../../../util/validation/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

type MoreInfoFormData = {
  name: string;
  email: string;
  company: string;
  question: string;
};

function MoreInfoForm() {
  const validationSchema = yup.object().shape({
    name: RequiredSchema,
    email: RequiredMailSchema,
    company: RequiredSchema,
    question: RequiredSchema,
  });

  const { control, handleSubmit } = useForm<MoreInfoFormData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: MoreInfoFormData) => {
    console.log(JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant={'h5'} sx={{ fontSize: '1.5rem' }}>
            Consulta sobre esta línea
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography
            variant={'body2'}
            sx={{ fontSize: '1rem', color: '#444' }}
          >
            Descripción sobre enviar consulta
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            control={control}
            name={'name'}
            label={'Nombre y Apellido'}
          />
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            control={control}
            name={'email'}
            label={'E-mail'}
          />
        </Grid>
        <Grid item xs={4}>
          <ControlledTextFieldFilled
            control={control}
            name={'company'}
            label={'Empresa'}
          />
        </Grid>
        <Grid item xs={12}>
          <ControlledTextFieldFilled
            control={control}
            name={'question'}
            label={'Consulta'}
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={3}>
          <DefaultMarketButton type={'submit'}>
            Enviar mi consulta
          </DefaultMarketButton>
        </Grid>
      </Grid>
    </form>
  );
}

export default MoreInfoForm;
