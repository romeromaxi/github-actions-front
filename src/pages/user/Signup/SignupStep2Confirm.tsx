import React from 'react';
import { Box, Button, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { stringFormatter } from '../../../util/formatters/stringFormatter';
import { WrapperIcons } from '../../../components/icons/Icons';
import { Info } from 'phosphor-react';
import { TypographyBase } from '../../../components/misc/TypographyBase';
// @ts-ignore
import userConfirmationImg from '../../../assets/img/person-confirm.svg';
import {themeColorDefinition} from "../../../util/themes/definitions";

const ButtonIdConfirmData: string = "btn-confirmar-datos-registracion";
const ButtonIdCancelData: string = "btn-cancela-datos-registracion";

interface SignupStep2ConfirmProps {
  userData: any;
  cuit: string;
  onConfirm: () => void;
  onBack: () => void;
}

export default function SignupStep2Confirm({ userData, cuit, onConfirm, onBack }: SignupStep2ConfirmProps) {
  const theme = useTheme();
  const mobileView = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack spacing={4}>
      <Stack>
        <TypographyBase color="primary" fontWeight={600} variant="eyebrow2">
          BIENVENIDO A LUC!
        </TypographyBase>
        <Typography variant="h4" fontWeight={600}>
          Confirmá si tus datos son correctos
        </Typography>
      </Stack>
      <Stack spacing={2.5}>
        <Stack direction={mobileView ? 'column' : "row"} alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 64,
              height: 64
            }}
            component="img"
            src={userConfirmationImg}
          />
          <Stack spacing={1}>
            <Typography fontWeight={600} variant="h4" color="primary" textAlign={mobileView ? 'center' : 'left'}>
              {userData.razonSocial}
            </Typography>
            <Typography fontWeight={500} fontSize={16} color="text.lighter" textAlign={mobileView ? 'center' : 'left'}>
              CUIT Nº {stringFormatter.formatCuit(cuit)}
            </Typography>
          </Stack>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <WrapperIcons Icon={Info} size="sm" color={themeColorDefinition.UIElements.texts.tertiary} />
          <Typography fontSize={13} color="text.tertiary">
            Estos son datos de acceso público en ARCA
          </Typography>
        </Stack>
      </Stack>
      <Stack direction={mobileView ? 'column-reverse' : "row"} spacing={2} justifyContent="space-between">
        <Button id={ButtonIdCancelData} variant="outlined" color="secondary" onClick={onBack} fullWidth={mobileView}>
          No, volver atrás
        </Button>
          
        <Button id={ButtonIdConfirmData} variant="contained" color="primary" onClick={onConfirm} fullWidth={mobileView}>
          Confirmar y continuar
        </Button>
      </Stack>
    </Stack>
  );
}

