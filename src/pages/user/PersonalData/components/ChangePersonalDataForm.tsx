import React, { useContext } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

import {Stack} from '@mui/material';

import { ControlledTextFieldFilled } from 'components/forms';
import { Disclaimer } from 'components/text/Disclaimer';

import { ChangePersonalDataDrawerContext } from '../ChangePersonalDataDrawer';

import { PinConfirmationMode } from 'types/user/userAuth-enum';
import {
  RequiredAreaCodeSchema,
  RequiredMailSchema,
  RequiredPhoneSchema, RequiredSchema,
} from 'util/validation/validationSchemas';
import {HttpAuth} from '../../../../http';
import { PinGenerationRequestFields } from '../../../../types/user';
import {
  ControlledAreaCodePhoneFieldFilled
} from "../../../../components/forms/ControlledAreaCodePhoneField";
import {Country} from "../../../../types/general/generalAddressData";

export enum PersonalDataFormFields {
  ReferentialData = 'referentialData',
}

export interface PersonalDataFormType {
  [PersonalDataFormFields.ReferentialData]: string;
}

function ChangePersonalDataForm() {
  const {
    pinMode,
    referentialDataType,
    referentialValue,
    setReferentialValue,
    setLoading,
  } = useContext(ChangePersonalDataDrawerContext);
  const isMailMode: boolean = pinMode === PinConfirmationMode.Mail;

  const generationMethod = isMailMode
      ? HttpAuth.mailPinGeneration
      : HttpAuth.phonePinGeneration;

  const changePersonalDataFormSchema = yup.object().shape({
    [PersonalDataFormFields.ReferentialData]: isMailMode
        ? RequiredMailSchema
        : RequiredPhoneSchema,
  });

  const {control, handleSubmit} = useForm<PersonalDataFormType>({
    resolver: yupResolver(changePersonalDataFormSchema),
  });

  const getDisclaimerText = (): string => {
    if (isMailMode)
      return 'Para confirmar tu Email vamos a enviar una clave PIN a la dirección que cargaste.';

    return 'Para confirmar tu Celular vamos a enviar una clave PIN vía SMS al número que cargaste.';
  };

  const onHandleSubmit = (data: PersonalDataFormType) => {
    setLoading(true);

    generationMethod({
      [PinGenerationRequestFields.ReferentialData]:
          data[PersonalDataFormFields.ReferentialData],
    })
        .then(() => {
          setReferentialValue(data[PersonalDataFormFields.ReferentialData]);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
  };

  return (
      <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          gap={1}
          mt={2}
      >
        {isMailMode ?
            <form
                id="changePersonalDataForm-form"
                onSubmit={handleSubmit(onHandleSubmit)}
            >
              <ControlledTextFieldFilled
                  control={control}
                  label={`Nuevo ${referentialDataType}`}
                  name={PersonalDataFormFields.ReferentialData}
                  disabled={!!referentialValue}
              />
            </form>
            :
            <ChangePersonalPhoneForm/>
        }
        {!referentialValue && (
            <Disclaimer text={getDisclaimerText()}/>
        )}
      </Stack>
  )
}

export default ChangePersonalDataForm;


interface PersonalPhoneFormType {
  codigoTelefonico: Country,
  telefono: string,
  codigoArea: string,
  numeroEntero?: string
}

const ChangePersonalPhoneForm = () => {
  const {
    referentialDataType,
    referentialValue,
    setReferentialValue,
    setLoading,
  } = useContext(ChangePersonalDataDrawerContext);

  const generationMethod = HttpAuth.phonePinGeneration;

  const changePersonalDataFormSchema = yup.object().shape({
    codigoTelefonico: RequiredSchema,
    telefono: RequiredPhoneSchema,
    codigoArea: RequiredAreaCodeSchema
  });

  const { control, handleSubmit, setValue } = useForm<PersonalPhoneFormType>({
    resolver: yupResolver(changePersonalDataFormSchema),
  });

  const onHandleSubmit = (data: PersonalPhoneFormType) => {
    setLoading(true);

    const parsedData = `${data.codigoTelefonico.codigoTelefonico} ${data.codigoArea} ${data.telefono}`
    setValue('numeroEntero', parsedData)
    
    generationMethod({
      [PinGenerationRequestFields.ReferentialData]: parsedData
    })
        .then(() => {
          setReferentialValue(parsedData);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
  };
  
  
  return (
      <form
          id="changePersonalDataForm-form"
          onSubmit={handleSubmit(onHandleSubmit)}
      >
        {
          !!referentialValue ?
              <ControlledTextFieldFilled
                  control={control}
                  label={`${referentialDataType}`}
                  name={'numeroEntero'}
                  disabled={!!referentialValue}
              />
              :
              <ControlledAreaCodePhoneFieldFilled control={control}
                                            nameAreaCode={'codigoArea'}
                                            namePhoneNumber={'telefono'}
                                            nameCountry={'codigoTelefonico'}
                                            showCountries
                                            labelPhoneNumber={`Nuevo ${referentialDataType}`}
              />
        }
      </form>
  )
}