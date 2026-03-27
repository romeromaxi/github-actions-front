import {
  Box,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import React, {Fragment, useEffect, useState} from 'react';
import { SaveButton, UpdateButton } from '../../../components/buttons/Buttons';
import { grey } from '@mui/material/colors';
import { ControlledTextPasswordFieldFilled } from '../../../components/forms';
import { useAction } from '../../../hooks/useAction';
import * as yup from 'yup';
import {
  RequiredPasswordSchema,
  RequiredSchema,
} from '../../../util/validation/validationSchemas';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { HttpAuth } from '../../../http';
import {
  ChangePasswordFormData,
  ChangePasswordFormFields,
} from './ChangePasswordDrawer';
import useAxios from '../../../hooks/useAxios';
import { userStorage } from '../../../util/localStorage/userStorage';
import {AppConfigFields, AppConfigLogosFields} from "types/appConfigEntities";
import PasswordRulesList from "components/forms/PasswordRulesList";
import DrawerBase from "../../../components/misc/DrawerBase";

const UserMustChangePasswordDialog = () => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const { snackbarSuccess } = useAction();
  const { fetchData } = useAxios();
  const [showChangePassword, setShowChangePassword] = useState<boolean>(
    userStorage.mustChangePassword(),
  );

  const onCloseChangePassword = () => {
    setShowChangePassword(false);
    userStorage.setMustChangePassword(false);
  };

  const logged = userStorage.isLogged();

  useEffect(() => {
    if (logged) {
      const hasToChange = userStorage.mustChangePassword();
      setShowChangePassword(hasToChange);
    }
  }, [logged]);

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

  const onHandleSubmitClose = () => {
    onCloseChangePassword();
    reset();

    snackbarSuccess('La contraseña se ha modificado con éxito');
  };

  const onHandleSubmit = (data: ChangePasswordFormData): void => {
    fetchData(
      () => HttpAuth.changePassword(data.actualPassword, data.newPassword),
      true,
    ).then(() => onHandleSubmitClose());
  };
  const onShowForm = () => setShowForm(true);

  return (
      <DrawerBase show={showChangePassword}
                  onCloseDrawer={() => {}}
                  title={showForm
                      ? 'Actualizar contraseña'
                      : 'Debe actualizar su contraseña'}
                  action={showForm ? (
                      <SaveButton onClick={handleSubmit(onHandleSubmit)}>
                        Guardar
                      </SaveButton>
                  ) : (
                      <UpdateButton onClick={onShowForm}>
                        Actualizar contraseña
                      </UpdateButton>
                  )}
      >
        <Grid container spacing={2} pt={3}>
          {
            !showForm &&
              <Grid item xs={12}>
                <Stack spacing={3}>
                  <Box
                      component={'img'}
                      sx={{
                        height: 80,
                        width: 125,
                        m: '0 auto !important',
                      }}
                      src={window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full]}
                  />
                </Stack>
              </Grid>
          }
          
          {showForm ? (
              <Fragment>
                <Grid item xs={12}>
                  <ControlledTextPasswordFieldFilled
                      label="Contraseña Actual"
                      control={control}
                      name={ChangePasswordFormFields.ActualPassword}
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <ControlledTextPasswordFieldFilled
                      label="Nueva Contraseña"
                      control={control}
                      name={ChangePasswordFormFields.NewPassword}
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <ControlledTextPasswordFieldFilled
                      label="Repetir Nueva Contraseña"
                      control={control}
                      name={ChangePasswordFormFields.NewPasswordConfirm}
                      fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <PasswordRulesList password={watchPassword} />
                </Grid>
              </Fragment>
          ) : (
              <Grid item xs={12}>
                <Typography color='text.lighter'>
                  Su contraseña ha expirado. Necesita actualizarla para continuar
                  utilizando nuestros servicios.
                </Typography>
              </Grid>
          )}
        </Grid>
      </DrawerBase>
  );
};

export default UserMustChangePasswordDialog;
