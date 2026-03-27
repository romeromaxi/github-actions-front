import React, { useEffect, useState } from 'react';
import { Stack } from '@mui/material';

import { LoaderBlockUI } from 'components/loader';
import DrawerBase from 'components/misc/DrawerBase';

import ChangePersonalDataForm from './components/ChangePersonalDataForm';
import ChangePersonalDataConfirmPin from './components/ChangePersonalDataConfirmPin';

import { PinConfirmationMode } from 'types/user/userAuth-enum';
import { useAction } from 'hooks/useAction';
import {DefaultStylesButton} from "../../../components/buttons/Buttons";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

interface ChangePersonalDataDrawerProps {
  show: boolean;
  pinMode: PinConfirmationMode;
  onCloseDrawer: () => void;
  onFinishProcess: () => void;
}

export const ChangePersonalDataDrawerContext = React.createContext({
  pinMode: {} as PinConfirmationMode | undefined,
  referentialDataType: '' as string | undefined,
  referentialValue: '' as string | undefined,
  setReferentialValue: (value: string | undefined) => {},
  setLoading: (value: boolean) => {},
  setValidPin: (value: boolean) => {}
});

function ChangePersonalDataDrawer(props: ChangePersonalDataDrawerProps) {
  const { snackbarSuccess } = useAction();
  const referentialDataType: string =
    props.pinMode === PinConfirmationMode.Mail ? 'Email' : 'Celular';

  const [referentialValue, setReferentialValue] = useState<string>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [validPin, setValidPin] = useState<boolean>(false);
  const resetForm = () => {
    setReferentialValue(undefined);
    setValidPin(false);
  };

  const onHandleClose = () => {
    resetForm();
    props.onCloseDrawer();
  };

  const onHandleSubmitClose = () => {
    resetForm();
    props.onFinishProcess();
  };

  useEffect(() => {
    if (validPin) {
      onHandleSubmitClose();

      snackbarSuccess('El dato se ha modificado exitosamente');
    }
  }, [validPin]);

  return (
    <DrawerBase
      show={props.show}
      onCloseDrawer={onHandleClose}
      action={
        <DefaultStylesButton
            type={'submit'} form={!referentialValue ? 'changePersonalDataForm-form' : 'change-PersonalDataConfirmPin'}
            endIcon={<KeyboardDoubleArrowRightIcon />}
        >
          {!referentialValue ? 'Enviar': `Confirmar ${referentialDataType}`}
        </DefaultStylesButton>}
      title={`Cambio de ${referentialDataType}`}
    >

      <Stack
        direction="column"
        justifyContent="flex-start"
        alignItems="center"
        gap={1}
      >
        <ChangePersonalDataDrawerContext.Provider
          value={{
            pinMode: props.pinMode,
            referentialDataType,
            referentialValue,
            setReferentialValue,
            setLoading,
            setValidPin
          }}
        >
          <ChangePersonalDataForm />
          {!!referentialValue && <ChangePersonalDataConfirmPin />}
        </ChangePersonalDataDrawerContext.Provider>
      </Stack>

      {isLoading && <LoaderBlockUI />}
    </DrawerBase>
  );
}

export default ChangePersonalDataDrawer;
