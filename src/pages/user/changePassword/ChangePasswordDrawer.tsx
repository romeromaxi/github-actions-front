import React from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

import {Box, Stack} from '@mui/material';

import DrawerBase from 'components/misc/DrawerBase';
import { SendButton } from 'components/buttons/Buttons';
import { ControlledTextPasswordFieldFilled } from 'components/forms';

import { HttpAuth } from 'http/index';
import {
  RequiredPasswordSchema,
  RequiredSchema,
} from 'util/validation/validationSchemas';
import PasswordRulesList from "components/forms/PasswordRulesList";
import {useSnackbarActions} from "../../../hooks/useSnackbarActions";
import useAxios from "../../../hooks/useAxios";

export enum ChangePasswordFormFields {
  ActualPassword = 'actualPassword',
  NewPassword = 'newPassword',
  NewPasswordConfirm = 'newPasswordConfirm',
}

export interface ChangePasswordFormData {
  [ChangePasswordFormFields.ActualPassword]: string;
  [ChangePasswordFormFields.NewPassword]: string;
  [ChangePasswordFormFields.NewPasswordConfirm]: string;
}

interface ChangePasswordDrawerProps {
  show: boolean;
  onCloseDrawer: () => void;
  onFinishProcess: () => void;
}

function ChangePasswordDrawer(props: ChangePasswordDrawerProps) {
  const { addSnackbarSuccess } = useSnackbarActions();
  const { fetchData } = useAxios();

  let changePasswordFormSchema = yup.object().shape({
    [ChangePasswordFormFields.ActualPassword]: RequiredSchema,
    [ChangePasswordFormFields.NewPassword]: RequiredPasswordSchema,
    [ChangePasswordFormFields.NewPasswordConfirm]: RequiredPasswordSchema.oneOf(
      [yup.ref(ChangePasswordFormFields.NewPassword), null],
      'Las constraseñas no coinciden',
    ),
  });
  const { reset, control, handleSubmit, watch } = useForm<ChangePasswordFormData>({
    resolver: yupResolver(changePasswordFormSchema),
  });
  const watchPassword = watch(ChangePasswordFormFields.NewPassword);

  const onHandleClose = () => {
    props.onCloseDrawer();
    reset();
  };

  const onHandleSubmitClose = () => {
    props.onFinishProcess();
    reset();

    addSnackbarSuccess('La contraseña se ha modificado con éxito');
  };

  const onHandleSubmit = (data: ChangePasswordFormData): void => {
      fetchData(
          () => HttpAuth.changePassword(data.actualPassword, data.newPassword),
          true
      )
          .then(() => {
              onHandleSubmitClose();
          });
  };

  return (
    <DrawerBase
      show={props.show}
      title="Cambio de Contraseña"
      onCloseDrawer={onHandleClose}
      action={<SendButton onClick={handleSubmit(onHandleSubmit)}>Enviar</SendButton>}
    >
        <Stack
          direction="column"
          justifyContent="flex-start"
          alignItems="center"
          spacing={2}
          mt={2}
        >
          <ControlledTextPasswordFieldFilled
            label="Contraseña Actual"
            control={control}
            name={ChangePasswordFormFields.ActualPassword}
            fullWidth
          />

          <ControlledTextPasswordFieldFilled
            label="Nueva Contraseña"
            control={control}
            name={ChangePasswordFormFields.NewPassword}
            fullWidth
          />

          <ControlledTextPasswordFieldFilled
            label="Repetir Nueva Contraseña"
            control={control}
            name={ChangePasswordFormFields.NewPasswordConfirm}
            fullWidth
          />

          <Box width={1}>
            <PasswordRulesList password={watchPassword} />
          </Box>
        </Stack>
    </DrawerBase>
  );
}

export default ChangePasswordDrawer;
