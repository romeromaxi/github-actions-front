import { useSearchParams } from 'react-router-dom';
import {Box, Card, CardContent, Stack, Typography, useMediaQuery, useTheme} from '@mui/material';
import { ControlledTextPasswordFieldFilled } from 'components/forms';
import { SendButton } from 'components/buttons/Buttons';
import React from 'react';
import * as yup from 'yup';
import { RequiredPasswordSchema } from 'util/validation/validationSchemas';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import useAxios from 'hooks/useAxios';
import { HttpAuth } from 'http/index';
import { useAction } from 'hooks/useAction';
import PasswordRulesList from "components/forms/PasswordRulesList";
import {TypographyBase} from "components/misc/TypographyBase";
import {useAppNavigation} from "../../../hooks/navigation";
import {GuestRoute} from "../../../routes/guest/routeAppGuestData";

enum ResetPasswordFormFields {
  NewPassword = 'newPassword',
  NewPasswordConfirm = 'newPasswordConfirm',
}

interface ResetPasswordFormData {
  [ResetPasswordFormFields.NewPassword]: string;
  [ResetPasswordFormFields.NewPasswordConfirm]: string;
}

function UserResetPassword() {
  const { snackbarSuccess } = useAction();
  const { fetchData } = useAxios();
  const { navigate } = useAppNavigation();
  let [searchParams] = useSearchParams();
  const identifierWeb = searchParams.get('identifier') || '';

  const theme = useTheme();
  const isMobileScreenSize = useMediaQuery(theme.breakpoints.down(800));
    
  let resetPasswordFormSchema = yup.object().shape({
    [ResetPasswordFormFields.NewPassword]: RequiredPasswordSchema,
    [ResetPasswordFormFields.NewPasswordConfirm]: RequiredPasswordSchema.oneOf(
      [yup.ref(ResetPasswordFormFields.NewPassword), null],
      'Las constraseñas no coinciden',
    ),
  });

  const { control, handleSubmit, watch } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordFormSchema),
  });
  const watchPassword = watch(ResetPasswordFormFields.NewPassword);

  const onHandleClose = () => navigate(GuestRoute.Login);

  const onHandleSubmit = (data: ResetPasswordFormData) =>
    fetchData(
      () =>
        HttpAuth.resetPassword(
          identifierWeb,
          data[ResetPasswordFormFields.NewPassword],
        ),
      true,
    ).then(() => {
      snackbarSuccess('La contraseña se ha modificado con éxito');
      onHandleClose();
    });

  return (
      <Box sx={{width: '100%' , justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
          <Card variant={'onboarding'}>
              <CardContent sx={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
                  <Stack spacing={3}>
                      <Stack spacing={1}>
                          <TypographyBase variant="eyebrow2" color="primary">RECURPERÁ TU CONTRASEÑA</TypographyBase>
                          <Typography variant="h4" fontWeight={600}>Recuperación de contraseña</Typography>
                      </Stack>

                      <Stack
                          direction="column"
                          justifyContent="flex-start"
                          alignItems="center"
                          spacing={2}
                          mt={2}
                      >
                          <ControlledTextPasswordFieldFilled
                              label="Ingresa una contraseña nueva"
                              control={control}
                              name={ResetPasswordFormFields.NewPassword}
                              fullWidth
                          />

                          <ControlledTextPasswordFieldFilled
                              label="Repite la contraseña nueva"
                              control={control}
                              name={ResetPasswordFormFields.NewPasswordConfirm}
                              fullWidth
                          />

                          <PasswordRulesList password={watchPassword} />
                      </Stack>

                      <Stack direction={"row"}
                             justifyContent={'end'}
                             alignItems={'center'}
                             spacing={2}
                             width={1}
                      >
                          <SendButton onClick={handleSubmit(onHandleSubmit)}
                                      fullWidth={isMobileScreenSize}
                          >
                              Enviar
                          </SendButton>
                      </Stack>
                  </Stack>
              </CardContent>
          </Card>
      </Box>
  );
}

export default UserResetPassword;
