import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack } from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import { DefaultStylesButton } from 'components/buttons/Buttons';

import {
  RequiredPhoneSchema,
  RequiredMailSchema,
  RequiredAreaCodeSchema,
  RequiredDaySchema,
  RequiredMonthSchema,
} from 'util/validation/validationSchemas';

import { Disclaimer } from 'components/text/Disclaimer';
import { HttpCompany } from 'http/company/httpCompany';
import { ControlledTextFieldFilled } from '../../../components/forms';
import { ControlledAreaCodePhoneFieldFilled } from '../../../components/forms/ControlledAreaCodePhoneField';
import { UserModelView, UserModelViewFields } from '../../../types/user';
import useAxios from 'hooks/useAxios';

enum NewCompanyFormFields {
  Mail = 'mail',
  AreaCode = 'codigoArea',
  PhoneNumber = 'telefono',
  Web = 'web',
  CloseDay = 'diaCierre',
  CloseMonth = 'mesCierre',
}

export type NewCompanyFormData = {
  [NewCompanyFormFields.Mail]: string;
  [NewCompanyFormFields.AreaCode]: string;
  [NewCompanyFormFields.PhoneNumber]: string;
  [NewCompanyFormFields.Web]: string;
  [NewCompanyFormFields.CloseDay]: string;
  [NewCompanyFormFields.CloseMonth]: string;
};

interface NewCompanyFormProps {
  companyId: number;
  onSubmitted: () => void;
  userDetails?: UserModelView;
}

function NewCompanyForm({
  companyId,
  onSubmitted,
  userDetails,
}: NewCompanyFormProps) {
  const closeDay: string = userDetails ? '31' : '';
  const closeMonth: string = userDetails ? '12' : '';

  const { fetchData } = useAxios();

  const newCompanySchema = yup.object().shape({
    [NewCompanyFormFields.Mail]: RequiredMailSchema,
    [NewCompanyFormFields.AreaCode]: RequiredAreaCodeSchema,
    [NewCompanyFormFields.PhoneNumber]: RequiredPhoneSchema,
    [NewCompanyFormFields.CloseDay]: RequiredDaySchema,
    [NewCompanyFormFields.CloseMonth]: RequiredMonthSchema,
  });

  const { control, handleSubmit } = useForm<NewCompanyFormData>({
    resolver: yupResolver(newCompanySchema),
    defaultValues: {
      [NewCompanyFormFields.Mail]: userDetails?.[UserModelViewFields.Mail],
      [NewCompanyFormFields.AreaCode]:
        userDetails?.[UserModelViewFields.AreaCode].toString(),
      [NewCompanyFormFields.PhoneNumber]: userDetails?.[
        UserModelViewFields.PhoneNumber
      ]
        .toString()
        .trim(),
      [NewCompanyFormFields.CloseDay]: closeDay,
      [NewCompanyFormFields.CloseMonth]: closeMonth,
    },
  });

  const onSubmit = async (data: NewCompanyFormData) => {
    fetchData(() => HttpCompany.finishRegister(companyId, data), true).then(
      () => onSubmitted(),
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {!userDetails ? (
          <Stack
            direction="column"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}
            mt={2}
          >
            <Stack
              direction={'row'}
              alignItems={'center'}
              spacing={3}
              sx={{ width: '100%' }}
            >
              <ControlledTextFieldFilled
                control={control}
                placeholder="dd"
                label="Dia de Cierre"
                name={NewCompanyFormFields.CloseDay}
              />
              <ControlledTextFieldFilled
                control={control}
                placeholder="mm"
                label="Mes de cierre del Ejercicio"
                name={NewCompanyFormFields.CloseMonth}
              />
            </Stack>
            <ControlledTextFieldFilled
              control={control}
              label="Mail"
              name={NewCompanyFormFields.Mail}
              fullWidth
            />

            <Stack width={1}>
              <ControlledAreaCodePhoneFieldFilled
                control={control}
                nameAreaCode={NewCompanyFormFields.AreaCode}
                namePhoneNumber={NewCompanyFormFields.PhoneNumber}
              />
            </Stack>
            <ControlledTextFieldFilled
              control={control}
              label="Web"
              name={NewCompanyFormFields.Web}
              fullWidth
            />

            <DefaultStylesButton
              type="submit"
              endIcon={<KeyboardDoubleArrowRightIcon />}
            >
              Cargar Cuenta MiPyME
            </DefaultStylesButton>
          </Stack>
        ) : (
          <DefaultStylesButton
            type="submit"
            endIcon={<KeyboardDoubleArrowRightIcon />}
            sx={{ mt: 3 }}
          >
            Crear Repositorio
          </DefaultStylesButton>
        )}
      </form>
    </>
  );
}

export default NewCompanyForm;
