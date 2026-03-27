import React from 'react';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { Badge, IconButton, Tooltip } from '@mui/material';
import { SolicitationAlertType } from 'types/solicitations/solicitationEnums';
import { SvgIconProps } from '@mui/material/SvgIcon/SvgIcon';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import { SafetyComponent } from 'components/security';
import ButtonsStyles from 'components/buttons/Buttons.styles';

interface AlertIconProps extends SvgIconProps {
  AlertCode: SolicitationAlertType;
}

export function NewMessageAlertIcon({
  AlertCode,
  ...iconProps
}: AlertIconProps) {
  const activeAlert = [
    SolicitationAlertType.NewMessage,
    SolicitationAlertType.NewMessageAndNewDocument,
  ].includes(AlertCode);
  const tooltipTitle = activeAlert
    ? 'Hay nuevos mensajes'
    : 'No hay nuevos mensajes';

  return (
    <Tooltip title={tooltipTitle}>
      <Badge
        variant={'dot'}
        color={'success'}
        invisible={!activeAlert}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <MessageOutlinedIcon color={'primary'} {...iconProps} />
      </Badge>
    </Tooltip>
  );
}

export function NewDocumentAlertIcon({
  AlertCode,
  ...iconProps
}: AlertIconProps) {
  const activeAlert = [
    SolicitationAlertType.NewDocument,
    SolicitationAlertType.NewMessageAndNewDocument,
  ].includes(AlertCode);
  const tooltipTitle = activeAlert
    ? 'Te han enviado documentación'
    : 'No hay nueva documentación requerida';
  return (
    <Tooltip title={tooltipTitle}>
      <Badge
        variant={'dot'}
        color={'success'}
        invisible={!activeAlert}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <ArticleOutlinedIcon color={'primary'} {...iconProps} />
      </Badge>
    </Tooltip>
  );
}

export function NewAlertIcon({ AlertCode, ...iconProps }: AlertIconProps) {
  const activeAlert = [
    SolicitationAlertType.NewMessage,
    SolicitationAlertType.NewDocument,
    SolicitationAlertType.NewMessageAndNewDocument,
  ].includes(AlertCode);
  const tooltipTitle = activeAlert
    ? 'Hay notificaciones sin ver'
    : 'No hay nuevas notificaciones';
  const iconColor = activeAlert ? 'primary' : 'disabled';
  return (
    <Tooltip title={tooltipTitle}>
      <Badge
        variant={'dot'}
        color={'success'}
        invisible={!activeAlert}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <NotificationsActiveOutlinedIcon color={iconColor} {...iconProps} />
      </Badge>
    </Tooltip>
  );
}

export enum SolicitationAlertIconType {
  Message,
  Document,
}

interface SolicitationAlertIconButtonProps {
  AlertCode: SolicitationAlertType;
  type: SolicitationAlertIconType;
  onClick: () => void;
  securityComponentName?: string;
  securityObjectName?: string;
}

export function SolicitationAlertIconButton({
  AlertCode,
  type,
  onClick,
  securityComponentName,
  securityObjectName,
}: SolicitationAlertIconButtonProps) {
  const AlertIconComponent =
    type === SolicitationAlertIconType.Message
      ? NewMessageAlertIcon
      : NewDocumentAlertIcon;
  const classes = ButtonsStyles();

  const iconButtonComponent = (
    <IconButton onClick={onClick} className={`${classes.iconButton}`}>
      <AlertIconComponent sx={{ mt: 0.1 }} AlertCode={AlertCode} />
    </IconButton>
  );

  return securityComponentName && securityObjectName ? (
    <SafetyComponent
      componentName={securityComponentName}
      objectName={securityObjectName}
    >
      {iconButtonComponent}
    </SafetyComponent>
  ) : (
    iconButtonComponent
  );
}
