import React, {useState} from 'react';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {useAction} from 'hooks/useAction';
import {yupResolver} from '@hookform/resolvers/yup';

import {ConfirmButton, EditIconButton, RefreshIconButton,} from 'components/buttons/Buttons';
import ControlledPin from 'components/forms/ControlledPin';
import {Box, Divider, Stack, Tooltip, Typography} from '@mui/material';
import {ControlledTextFieldFilled} from 'components/forms';
import {RequiredMailSchema, RequiredPinSchema, RequiredStringSchema,} from 'util/validation/validationSchemas';
import {HttpAuth} from 'http/index';
import {PinGenerationRequestFields, PinValidationRequestFields,} from 'types/user';
import DrawerBase from 'components/misc/DrawerBase';
import MailChangeForm, {MailChangeFormData,} from '../PersonalData/MailChangeForm';
import CheckIcon from '@mui/icons-material/Check';
import {PinConfirmationMode} from 'types/user/userAuth-enum';
import PhoneChangeForm, {PhoneChangeFormData,} from '../PersonalData/PhoneChangeForm';
import {BaseResponseFields} from 'types/baseEntities';
import {grey} from '@mui/material/colors';
import {stringFormatter} from 'util/formatters/stringFormatter';
import {CountryFields} from '../../../types/general/generalAddressData';
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useMediaQuery, useTheme, width } from '@mui/system';

export enum PinFormFields {
  ReferentialData = 'referentialData',
  PIN = 'PIN',
}

type PinFormData = {
  [PinFormFields.ReferentialData]: string;
  [PinFormFields.PIN]: string;
};

interface PinFormProps {
  mode: PinConfirmationMode;
  referentialData: string;
  onPinConfirmed: (data: PinFormData) => void;
  initConfirmed?: boolean;
  isMobile?: boolean;
  onReferentialDataChange?: (newReferentialData: string) => void;
}

function PinForm({
  referentialData,
  onPinConfirmed,
  mode,
  initConfirmed,
  isMobile,
  onReferentialDataChange,
}: PinFormProps) {
  const theme = useTheme();
  const isMediumScreenSize = useMediaQuery(theme.breakpoints.down("md"));

  const { snackbarError, snackbarSuccess, showLoader, hideLoader } =
    useAction();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pinConfirmed, setPinConfirmed] = useState(!!initConfirmed);
  const mailPinFormSchema = yup.object().shape({
    [PinFormFields.ReferentialData]:
      mode === PinConfirmationMode.Mail
        ? RequiredMailSchema
        : RequiredStringSchema,
    [PinFormFields.PIN]: RequiredPinSchema,
  });
  const { control, getValues, setValue, handleSubmit } = useForm<PinFormData>({
    defaultValues: {
      [PinFormFields.ReferentialData]: referentialData,
    },
    resolver: yupResolver(mailPinFormSchema),
  });

  const authMethod =
    mode === PinConfirmationMode.Mail
      ? HttpAuth.mailPinValidation
      : HttpAuth.phonePinValidation;

  const refreshMethod =
    mode === PinConfirmationMode.Mail
      ? HttpAuth.mailPinGeneration
      : HttpAuth.phonePinGeneration;

  const openDrawer = () => setDrawerOpen(true);

  const closeDrawer = () => setDrawerOpen(false);

  const refreshPin = () => {
    refreshMethod({
      [PinGenerationRequestFields.ReferentialData]: getValues(
        PinFormFields.ReferentialData,
      ),
    })
      .then(() => {
        snackbarSuccess('PIN generado correctamente');
        setPinConfirmed(false);
      })
      .catch((error) => {
        snackbarError(error.message);
      });
  };

  const onSubmit = (data: PinFormData) => {
    const { PIN } = data;
    showLoader();
    authMethod({
      [PinValidationRequestFields.PIN]: PIN,
    })
      .then((response) => {
        if (response[BaseResponseFields.HasError]) {
          snackbarError(response[BaseResponseFields.ErrorDescription]);
        } else {
          setPinConfirmed(true);
          onPinConfirmed(data);
        }
      })
      .catch(() => snackbarError('Un error ocurrió'))
      .finally(() => hideLoader());
  };

  const onMailChanged = (data: MailChangeFormData) => {
    setValue(PinFormFields.ReferentialData, data.mail);
    refreshPin();
    setDrawerOpen(false);
    onReferentialDataChange && onReferentialDataChange(data.mail);
  };

  const onPhoneChanged = (data: PhoneChangeFormData) => {
    const phoneNumber = `+${data.codigoTelefonico[CountryFields.PhoneCode]} ${stringFormatter.phoneNumberWithAreaCode(data.codigoArea, data.telefono)}`;
    setValue(PinFormFields.ReferentialData, phoneNumber);
    refreshPin();
    setDrawerOpen(false);
    onReferentialDataChange && onReferentialDataChange(phoneNumber);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isMobile ?
        <Stack direction={'column'} spacing={2}>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <EditIconButton onClick={openDrawer} tooltipTitle={'Editar'} />
            <ControlledTextFieldFilled
              control={control}
              name={PinFormFields.ReferentialData}
              disabled
              fullWidth
              sx={{ width: '100%' }}
            />
            <Tooltip
              title={
                mode === PinConfirmationMode.Mail
                  ? 'En caso de no recibir el PIN revisa la bandeja de SPAM, chequea el correo ingresado, reintenta el envío, o contactanos'
                  : 'En caso de no recibir el PIN revisa el número ingresado, reintenta el envío, o contactanos.'
              }
            >
              <HelpOutlineIcon fontSize={'small'} color={'info'} />
            </Tooltip>
          </Stack>
          {!pinConfirmed ? (
            <Stack
              direction={'column'}
              alignItems={'center'}
              spacing={1}
            >
              <Stack 
                direction={'row'} 
                alignItems={'center'} 
                spacing={1} 
                sx={{ width: isMobile ? '100%' : 'auto', justifyContent: 'center' }}
              >
                <Stack direction={'row'} spacing={1} sx={{ width: isMobile ? 'auto' : 'auto' }}>
                  <ControlledPin control={control} name={PinFormFields.PIN} sx={{ width: isMobile ? '20%' : 'auto' }} />
                </Stack>
                <RefreshIconButton color={'primary'} onClick={refreshPin} tooltipTitle={'Recargar'} />
              </Stack>
              <ConfirmButton type="submit" sx={{ width: '80%' }}>
                  Verificar
                </ConfirmButton>
            </Stack>
          ) : (
            <Stack direction={'row'} alignItems={'center'} gap={2}>
              <Typography variant={'body2'} color={'primary'}>
                {`${getValues(PinFormFields.ReferentialData)}`}
              </Typography>
              <CheckIcon color={'primary'} />
            </Stack>
          )}
        </Stack>
      :
        <Stack direction={isMobile ? 'column' : 'row'} spacing={2} alignItems={'center'}>
          <Stack direction={'row'} spacing={1} alignItems={'center'} sx={{ flexGrow: 1 }}>
            <EditIconButton onClick={openDrawer} tooltipTitle={'Editar'} />

            <Stack direction="row" alignItems="center" spacing={1} sx={{ width: isMobile ? '100%' : isMediumScreenSize ? '80%' : '50%' }}>
              <ControlledTextFieldFilled
                control={control}
                name={PinFormFields.ReferentialData}
                disabled
                fullWidth
              />

              <Tooltip 
                title={
                  mode === PinConfirmationMode.Mail
                    ? 'En caso de no recibir el PIN revisa la bandeja de SPAM, chequea el correo ingresado, reintenta el envío, o contactanos'
                    : 'En caso de no recibir el PIN revisa el número ingresado, reintenta el envío, o contactanos.'
                }
              >
                <Box display="flex" alignItems="center">
                  <HelpOutlineIcon fontSize={'small'} color={'info'} />
                </Box>
              </Tooltip>
            </Stack>
          </Stack>

          {!pinConfirmed ? (
            <Stack
              direction={isMobile ? 'column' : 'row'}
              alignItems={'center'}
              spacing={1}
              sx={{ width: isMobile ? '100%' : 'auto' }}
            >
              <ControlledPin control={control} name={PinFormFields.PIN} sx={{ width: isMobile ? '20%' : 'auto' }} />

              <Stack direction="row" alignItems="center" spacing={2}>
                <ConfirmButton 
                  type="submit" 
                  sx={{ 
                    width: isMobile ? '100%' : 'auto',  
                    alignSelf: isMobile ? 'stretch' : 'flex-start' 
                  }}
                >
                  Verificar
                </ConfirmButton>
                <RefreshIconButton color={'primary'} onClick={refreshPin} tooltipTitle={'Recargar'} />
              </Stack>
            </Stack>
          ) : (
            <Stack direction={'row'} alignItems={'center'} gap={2}>
              <Typography variant={'body2'} color={'primary'}>
                {`${getValues(PinFormFields.ReferentialData)}`}
              </Typography>
              <CheckIcon color={'primary'} />
            </Stack>
          )}
        </Stack>
      }
      
      <DrawerBase show={drawerOpen} title={'Modificar Datos Personales'} onCloseDrawer={closeDrawer}>
        <Box mt={3}>
          {mode === PinConfirmationMode.Mail ? <MailChangeForm onMailChanged={onMailChanged} /> : <PhoneChangeForm onPhoneChanged={onPhoneChanged} />}
        </Box>
      </DrawerBase>
    </form>
  );

}

export default PinForm;
