import React, {useContext} from 'react';

import {Button, Stack} from '@mui/material';
import CachedIcon from '@mui/icons-material/Cached';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { DefaultStylesButton } from 'components/buttons/Buttons';

import { ChangePersonalDataDrawerContext } from '../ChangePersonalDataDrawer';

import { PinConfirmationMode } from 'types/user/userAuth-enum';
import ControlledPin from 'components/forms/ControlledPin';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import * as yup from 'yup';
import { RequiredPinSchema } from 'util/validation/validationSchemas';
import { SubTitle } from 'components/text/SubTitle';
import { Disclaimer } from 'components/text/Disclaimer';
import {
  PinGenerationRequestFields,
  PinValidationRequestFields,
} from 'types/user';
import { HttpAuth } from 'http/index';
import { BaseResponseFields } from 'types/baseEntities';
import { useAction } from 'hooks/useAction';

enum ChangePersonalDataConfirmPinFields {
  PIN = 'pin',
}

interface ChangePersonalDataConfirmPinType {
  [ChangePersonalDataConfirmPinFields.PIN]: string;
}

function ChangePersonalDataConfirmPin() {
  const { snackbarSuccess, snackbarError } = useAction();
  const {
    pinMode,
    referentialDataType,
    referentialValue,
    setReferentialValue,
    setLoading,
    setValidPin,
  } = useContext(ChangePersonalDataDrawerContext);
  const isMailMode: boolean = pinMode === PinConfirmationMode.Mail;

  const authMethod = isMailMode
    ? HttpAuth.mailPinValidation
    : HttpAuth.phonePinValidation;

  const refreshMethod = isMailMode
    ? HttpAuth.mailPinGeneration
    : HttpAuth.phonePinGeneration;

  const changePersonalDataConfirmPinSchema = yup.object().shape({
    [ChangePersonalDataConfirmPinFields.PIN]: RequiredPinSchema,
  });

  const { control, handleSubmit } = useForm<ChangePersonalDataConfirmPinType>({
    resolver: yupResolver(changePersonalDataConfirmPinSchema),
  });

  const getDisclaimer = (): string => {
    if (isMailMode) return 'Ingresa la clave PIN que enviamos a tu email';

    return 'Ingresa la clave PIN que enviamos a tu celular';
  };

  const onChangeReferentialValue = () => setReferentialValue(undefined);

  const resendPin = () => {
    if (referentialValue) {
      setLoading(true);
      refreshMethod({
        [PinGenerationRequestFields.ReferentialData]: referentialValue,
      })
        .then(() => {
          snackbarSuccess('El PIN se ha generado exitosamente');
        })
        .catch((error) => {
          snackbarError(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const onConfirmReferentialValue = (
    data: ChangePersonalDataConfirmPinType,
  ) => {
    setLoading(true);

    authMethod({
      [PinValidationRequestFields.PIN]:
        data[ChangePersonalDataConfirmPinFields.PIN],
    })
      .then((response) => {
        if (response[BaseResponseFields.HasError]) {
          snackbarError(response[BaseResponseFields.ErrorDescription]);
        } else setValidPin(true);

        setLoading(false);
      })
      .catch(() => {
        snackbarError('Un error ocurrió');
        setLoading(false);
      });
  };

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="center"
      gap={1}
    >
      <form id="change-PersonalDataConfirmPin" onSubmit={handleSubmit(onConfirmReferentialValue)}>
        <SubTitle text={`Confirmación del ${referentialDataType}:`} />
  
        <Disclaimer text={getDisclaimer()} />
  
        <ControlledPin
          control={control}
          name={ChangePersonalDataConfirmPinFields.PIN}
        />
  
        <Stack direction="row" justifyContent="space-around" spacing={3}>
          <DefaultStylesButton
            startIcon={<EditOutlinedIcon />}
            onClick={onChangeReferentialValue}
          >
            {`Cambiar ${referentialDataType}`}
          </DefaultStylesButton>
          <Button
            variant={"contained"}
            startIcon={<CachedIcon />}
            onClick={resendPin}
          >
            Reenviar Pin
          </Button>
        </Stack>
  
      </form>
    </Stack>
  );
}

export default ChangePersonalDataConfirmPin;
