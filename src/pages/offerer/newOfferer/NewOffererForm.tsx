import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Stack } from '@mui/material';

import { AsyncSelect, ControlledTextFieldFilled } from 'components/forms';

import { PersonOffererConsultantDTO } from 'types/person/personNosisData';
import { HttpCacheOfferer } from 'http/cache/httpCacheOfferer';
import OffererLogo from '../components/OffererLogo';

function NewOffererForm() {
  const { control, setValue } = useFormContext();

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="stretch"
      spacing={2}
      mt={2}
    >
      <AsyncSelect
        label="Tipo"
        control={control}
        name={PersonOffererConsultantDTO.PersonClassificationCode}
        loadOptions={HttpCacheOfferer.getOffererTypes}
        fullWidth
      />
      <ControlledTextFieldFilled
        label="Email"
        control={control}
        name={PersonOffererConsultantDTO.Mail}
        fullWidth
      />
      <ControlledTextFieldFilled
          label="Nombre Acceso"
          control={control}
          name={PersonOffererConsultantDTO.LogInName}
          helperText={"No debe contener espacios ni caracteres especiales. Por ejemplo: login-oferente"}
          fullWidth
      />
      <ControlledTextFieldFilled
          label="Nombre de Fantasía"
          control={control}
          name={PersonOffererConsultantDTO.BusinessTradeName}
          fullWidth
      />
      <ControlledTextFieldFilled
        label="Teléfono"
        control={control}
        name={PersonOffererConsultantDTO.Telephone}
        fullWidth
      />
      <OffererLogo
        sx={{
          borderRadius: '0.475rem',
          width: 160,
          height: 110,
        }}
        onSaveLogo={(file) => setValue(PersonOffererConsultantDTO.Logo, file)}
      />
    </Stack>
  );
}

export default NewOffererForm;
