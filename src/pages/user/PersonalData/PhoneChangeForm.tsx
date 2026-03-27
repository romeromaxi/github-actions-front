import React from 'react';
import { Stack, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { SendButton } from '../../../components/buttons/Buttons';
import * as yup from 'yup';
import {
  RequiredAreaCodeSchema,
  RequiredPhoneSchema, RequiredSchema,
} from '../../../util/validation/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { HttpUser } from '../../../http/user/httpUser';
import { ControlledAreaCodePhoneFieldFilled } from '../../../components/forms/ControlledAreaCodePhoneField';
import {
  UpdateUserPhoneRequest,
  UpdateUserPhoneRequestFields,
} from '../../../types/user';
import {
  Country,
  CountryFields,
} from '../../../types/general/generalAddressData';

enum PhoneChangeFormFields {
  AreaCode = 'codigoArea',
  PhoneNumber = 'telefono',
  PhoneCode = 'codigoTelefonico',
}

export type PhoneChangeFormData = {
  [PhoneChangeFormFields.AreaCode]: string;
  [PhoneChangeFormFields.PhoneNumber]: string;
  [PhoneChangeFormFields.PhoneCode]: Country;
};

interface MailChangeFormProps {
  onPhoneChanged: (data: PhoneChangeFormData) => void;
}

function PhoneChangeForm({ onPhoneChanged }: MailChangeFormProps) {
  const phoneFormSchema = yup.object().shape({
    [PhoneChangeFormFields.PhoneCode]: RequiredSchema,
    [PhoneChangeFormFields.AreaCode]: RequiredAreaCodeSchema,
    [PhoneChangeFormFields.PhoneNumber]: RequiredPhoneSchema,
  });
  const { control, handleSubmit } = useForm<PhoneChangeFormData>({
    resolver: yupResolver(phoneFormSchema),
  });

  const onSubmit = (data: PhoneChangeFormData) => {
    const submitData: UpdateUserPhoneRequest = {
      ...data,
      codModulo: 1,
      codOrigen: 1,
      [UpdateUserPhoneRequestFields.PhoneCode]:
        data[PhoneChangeFormFields.PhoneCode][CountryFields.PhoneCode],
    };

    HttpUser.addPhone(submitData).then(() => onPhoneChanged(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction={'column'} alignItems={'center'} gap={2}>
        <Typography variant={'h6'}>Cambio de Celular</Typography>

        <ControlledAreaCodePhoneFieldFilled
          control={control}
          nameAreaCode={PhoneChangeFormFields.AreaCode}
          namePhoneNumber={PhoneChangeFormFields.PhoneNumber}
          nameCountry={PhoneChangeFormFields.PhoneCode}
          labelPhoneNumber={'Teléfono Celular'}
          showCountries
        />

        <SendButton onClick={handleSubmit(onSubmit)}>Enviar</SendButton>
      </Stack>
    </form>
  );
}

export default PhoneChangeForm;
