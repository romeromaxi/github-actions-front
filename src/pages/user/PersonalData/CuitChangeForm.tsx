import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {ControlledTextFieldFilled} from 'components/forms';
import { RequiredCuitSchema } from 'util/validation/validationSchemas';

enum CuitChangeFormFields {
  CUIT = 'cuit',
}

type CuitChangeFormData = {
  [CuitChangeFormFields.CUIT]: string;
};

interface CuitChangeFormProps {
  onCuitChanged: (data: CuitChangeFormData) => void;
}

function CuitChangeForm({ onCuitChanged }: CuitChangeFormProps) {
  const cuitChangeSchema = yup.object().shape({
    [CuitChangeFormFields.CUIT]: RequiredCuitSchema,
  });
  const { control, handleSubmit } = useForm<CuitChangeFormData>({
    resolver: yupResolver(cuitChangeSchema),
  });

  const onSubmit = (data: CuitChangeFormData) => {
    onCuitChanged(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id={'form-change-current-cuit'}>
        <ControlledTextFieldFilled
          label={'Nuevo CUIT'}
          control={control}
          name={CuitChangeFormFields.CUIT}
          fullWidth
        />
    </form>
  );
}

export default CuitChangeForm;
