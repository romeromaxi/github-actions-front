import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Stack, Typography } from '@mui/material';
import { ControlledTextFieldFilled } from 'components/forms';
import { SendButton } from 'components/buttons/Buttons';
import { RequiredMailSchema } from 'util/validation/validationSchemas';
import { HttpUser } from 'http/index';
import { BaseRequestFields } from 'types/baseEntities';

enum MailChangeFormFields {
  Mail = 'mail',
}

export type MailChangeFormData = {
  [MailChangeFormFields.Mail]: string;
};

interface MailChangeFormProps {
  onMailChanged: (data: MailChangeFormData) => void;
}

function MailChangeForm({ onMailChanged }: MailChangeFormProps) {
  const mailFormSchema = yup.object().shape({
    [MailChangeFormFields.Mail]: RequiredMailSchema,
  });
  const { control, handleSubmit } = useForm<MailChangeFormData>({
    resolver: yupResolver(mailFormSchema),
  });

  const onSubmit = (data: MailChangeFormData) => {
    console.log(JSON.stringify(data));
    HttpUser.addMail({
      ...data,
      [BaseRequestFields.ModuleCode]: 1,
      [BaseRequestFields.OriginCode]: 1,
    }).then(() => onMailChanged(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="pin-mail-change-form">
      <Stack direction={'column'} alignItems={'center'} gap={2}>
        <ControlledTextFieldFilled
          fullWidth
          control={control}
          name={MailChangeFormFields.Mail}
          label={'Nuevo Email'}
        />
        <Typography variant={'body2'} sx={{ textAlign: 'center' }}>
          Para confirmar tu Email vamos a enviar una clave PIN a la dirección
          que cargaste
        </Typography>
      </Stack>
    </form>
  );
}

export default MailChangeForm;
