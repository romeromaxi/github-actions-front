import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, Button, Stack} from '@mui/material';
import {TypographyBase} from 'components/misc/TypographyBase';
import {BadgeAlert, BriefcaseIcon, ClipboardIcon, MailIcon, MessageSquareIcon, SendIcon,} from 'lucide-react';
import {PendingActionFields, PendingActionType, PendingActionView} from 'types/actions/actionData';
import {useAction} from 'hooks/useAction';
import {CompanyViewDTO, CompanyViewDTOFields} from 'types/company/companyData';
import {HttpCompany} from 'http/company/httpCompany';
import {HttpInvitations} from 'http/invitations';
import {userStorage} from 'util/localStorage/userStorage';
import {ValidationStatesType} from "../../types/person/personEnums";
import {LoaderBlockUI} from "../loader";
import CompanyInviteThroughMailDrawer from "../../pages/company/components/CompanyInviteThroughMailDrawer";
import {DialogAlert} from "../dialog";
import {WrapperIcons} from "../icons/Icons";
import {themeColorDefinition} from "../../util/themes/definitions";
import OffererLogo from "../../pages/offerer/components/OffererLogo";


export interface PendingActionContentProps {
  action: PendingActionView;
  size?: 'small' | 'medium' | 'large';
  containerSx?: any;
  onReload?: () => void;
}

export const PendingActionContent: React.FC<PendingActionContentProps> = ({ action, size = 'medium', onReload }) => {
  const navigate = useNavigate();
  const { snackbarSuccess, snackbarWarning } = useAction();
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState<CompanyViewDTO | null>(null);
  const [openInviteResponsible, setOpenInviteResponsible] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [showConfirmOwnAccept, setShowConfirmOwnAccept] = useState(false);
  const paddingYInternal = { xs: 'auto', md: '16px !important' };

  const handleClick = () => {
    switch (action[PendingActionFields.PendingActivityTypeCode]) {
      case PendingActionType.SOLICITUDES_LISTAS:
        navigate(`/mis-empresas/${action[PendingActionFields.CompanyId]}/?tab=sentSolicitations`);
        break;
      case PendingActionType.SOLICITUD_CHAT_PENDIENTE:
        navigate(`/mis-solicitudes/${action[PendingActionFields.CompanyId]}/${action[PendingActionFields.RelatedId]}?tab=chat`);
        break;
      case PendingActionType.SOLICITUD_DOCUMENTACION_PENDIENTE:
        navigate(`/mis-solicitudes/${action[PendingActionFields.CompanyId]}/${action[PendingActionFields.RelatedId]}?tab=docsExchange`);
        break;
      case PendingActionType.EMPRESA_LEGAJO_INCOMPLETO:
        navigate(`/mis-empresas/${action[PendingActionFields.CompanyId]}/?tab=company-file`);
        break;
      case PendingActionType.EMPRESA_SIN_VERIFICACION:
        handleVerificationClick();
        break;
      case PendingActionType.INVITACION_RECIBIDA:
        setShowConfirmOwnAccept(true);
        break;
      default:
        break;
    }
  };

  const handleVerificationClick = async () => {
    setLoading(true);
    try {
      const companyData = await HttpCompany.getCompanyById(action[PendingActionFields.CompanyId]!);
      setCompany(companyData);
      if (companyData[CompanyViewDTOFields.AllowResponsibleInvitation] || 
          companyData[CompanyViewDTOFields.AllowGetResponsability] || companyData[CompanyViewDTOFields.AllowViewDocumentationResponsability]) {
        setOpenInviteResponsible(true);
      } 
    } catch (error) {
      console.error('Error loading company:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      await HttpInvitations.rejectInvitation(action[PendingActionFields.RelatedId]!);
      snackbarSuccess('La invitación fue rechazada correctamente');
      onReload?.();
    } catch (error) {
      console.error('Error rejecting invitation:', error);
    }
    setShowReject(false);
  };

  const handleAccept = async () => {
    if (userStorage.getValidatedIdentityCode() === ValidationStatesType.Validated) {
      try {
        await HttpInvitations.acceptInvitationCompany(action[PendingActionFields.RelatedId]!);
        snackbarSuccess('La invitación fue aceptada correctamente');
        onReload?.();
      } catch (error) {
        console.error('Error accepting invitation:', error);
      }
    } else {
      snackbarWarning('No puedes aceptar esta invitación hasta que se valide tu identidad');
    }
    setShowConfirmOwnAccept(false);
  };

  const getActionConfig = () => {
    switch (action[PendingActionFields.PendingActivityTypeCode]) {
      case PendingActionType.SOLICITUDES_LISTAS:
        return {
          icon: SendIcon,
          titleColor: themeColorDefinition.systemFeedback.warning.primary,
          buttonText: `Enviar solicitudes`,
          buttonVariant: 'contained' as const,
          buttonColor: 'primary' as const,
          onClick: handleClick,
        };
      case PendingActionType.SOLICITUD_CHAT_PENDIENTE:
        return {
          icon: MessageSquareIcon,
          titleColor: themeColorDefinition.systemFeedback.accentNotifications.primary,
          buttonText: 'Ir a la Solicitud',
          buttonVariant: 'outlined' as const,
          buttonColor: 'secondary' as const,
          onClick: handleClick,
        };
      case PendingActionType.SOLICITUD_DOCUMENTACION_PENDIENTE:
        return {
          icon: BriefcaseIcon,
          titleColor: themeColorDefinition.systemFeedback.accentNotifications.primary,
          buttonText: 'Ir a Documentos',
          buttonVariant: 'outlined' as const,
          buttonColor: 'secondary' as const,
          onClick: handleClick,
        };
      case PendingActionType.EMPRESA_LEGAJO_INCOMPLETO:
        return {
          icon: ClipboardIcon,
          titleColor: themeColorDefinition.systemFeedback.warning.primary,
          buttonText: 'Ir a mi legajo',
          buttonVariant: 'outlined' as const,
          buttonColor: 'secondary' as const,
          onClick: handleClick,
        };
      case PendingActionType.EMPRESA_SIN_VERIFICACION:
        return {
          icon: BadgeAlert,
          titleColor: themeColorDefinition.systemFeedback.warning.primary,
          buttonText: 'Verificar PyME',
          buttonVariant: 'outlined' as const,
          buttonColor: 'secondary' as const,
          onClick: handleClick,
        };
      case PendingActionType.INVITACION_RECIBIDA:
        return {
          icon: MailIcon,
          titleColor: themeColorDefinition.systemFeedback.success.primary,
          buttonText: 'Aceptar',
          buttonVariant: 'contained' as const,
          buttonColor: 'success' as const,
          secondaryButton: true,
          onClick: handleClick,
        };
      default:
        return {
          icon: BriefcaseIcon,
          titleColor: themeColorDefinition.UIElements.texts.default,
          buttonText: 'Ver más',
          buttonVariant: 'outlined' as const,
          buttonColor: 'secondary' as const,
          onClick: () => {},
        };
    }
  };

  const config = getActionConfig();

  return (
    <>
    {loading && <LoaderBlockUI />}
      <Stack direction={{ xs: 'column', md: 'row' }} 
             spacing={1.5} alignItems="center" justifyContent={'space-between'}
             paddingY={paddingYInternal}
             paddingRight={2}
             sx={{ width: '100%' }}>
          <Stack spacing={1.5} direction={'row'}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {
                      !!action[PendingActionFields.OffererId] ?
                          <OffererLogo offererId={action[PendingActionFields.OffererId]} 
                                       offererUrlLogo={action[PendingActionFields.OffererUrlLogo]} 
                                       size={'sm'} />
                          :
                          <WrapperIcons Icon={config.icon} size={'md'} color={themeColorDefinition.UIElements.texts.lighter} weight={'thin'} />
                  }
              </Box>
              <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
                  <TypographyBase variant={'subtitle1'} sx={{ color: config.titleColor }}>
                      {action[PendingActionFields.HeaderTitle]}
                  </TypographyBase>
                  <TypographyBase variant="body2" fontWeight={600}>{action[PendingActionFields.TitleDetail]}</TypographyBase>
              </Stack>    
          </Stack>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} sx={{ flexShrink: 0 }}>
              {config.secondaryButton && (
                  <Button variant="text" color="error" size={size} onClick={() => setShowReject(true)}>
                      Rechazar
                  </Button>
              )}
              <Button variant={config.buttonVariant} color={config.buttonColor} size={size} onClick={config.onClick}>
                  {config.buttonText}
              </Button>
          </Stack>
      </Stack>  
        
      {company && (
        <>
          <CompanyInviteThroughMailDrawer
            open={openInviteResponsible}
            onClose={() => setOpenInviteResponsible(false)}
            onConfirm={() => {
              setOpenInviteResponsible(false);
              onReload?.();
            }}
            company={company}
            inProcess={false}
          />
        </>
      )}

      <DialogAlert
        open={showReject}
        title="Rechazar invitación"
        textContent="¿Estás seguro que deseás rechazar esta invitación?"
        severity="error"
        onClose={() => setShowReject(false)}
        onConfirm={handleReject}
      />

      <DialogAlert
        open={showConfirmOwnAccept}
        title="Aceptar invitación"
        textContent="¿Estás seguro que deseás aceptar esta invitación?"
        children="Al aceptar estás dando de alta la empresa y validando el vínculo de quien te envió la solicitud. Podrás modificarlo desde “Roles”, ingresando a tu empresa."
        onClose={() => setShowConfirmOwnAccept(false)}
        onConfirm={handleAccept}
      />
    </>
  );
};
