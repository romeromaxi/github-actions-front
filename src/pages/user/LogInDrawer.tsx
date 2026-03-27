import React, {useEffect, useState} from 'react';
import {CaretLeft, MonitorPlay} from "@phosphor-icons/react";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import {Box, Button, DrawerProps, useMediaQuery, useTheme} from '@mui/material';
import LogInProcess from './Login/LogInProcess';
import {LogInProcessParts} from 'types/form/login/login-enum';
import DrawerBase from '../../components/misc/DrawerBase';
import {AuthorizationRequest, AuthorizationResponse} from "types/user";
import {WrapperIcons} from "components/icons/Icons";
import {NavsTabHorizontal} from "../../components/navs/NavsTab";
import {useUser} from 'hooks/contexts/UserContext';
import {useSnackbarActions} from 'hooks/useSnackbarActions';
import {EnumSnackbarType} from '../../stores/reducer/snackbarReducer';
import ButtonSeeVideoInDialog from "../../components/dialog/ButtonSeeVideoInDialog";

interface LogInDialogProps extends DrawerProps {
  formPart?: LogInProcessParts;
  title?: string;
  onClose: () => void;
  onLogin?: (...args: any[]) => void;
  onCancel?: () => void;
  onRegister?: (...args: any[]) => void;
  allowsRegistration?: boolean;
  fnAuthenticateUser: (requestParams: AuthorizationRequest) => Promise<AuthorizationResponse>;
  hideTabs?: boolean;
}

interface LogInDrawerContextType {
  setActions: (_: React.SetStateAction<React.ReactNode>) => void;
}

export const LogInDrawerContext = React.createContext<LogInDrawerContextType>({
  setActions: (_: React.SetStateAction<React.ReactNode> | undefined) => { },
});

function LogInDrawer({
  formPart,
  title,
  onClose,
  onLogin,
  onCancel,
  onRegister,
  allowsRegistration,
  fnAuthenticateUser,
  hideTabs,
  ...dialogProps
}: LogInDialogProps) {
  const [activeForm, setActiveForm] = useState<LogInProcessParts>();
  const [actions, setActions] = useState<React.ReactNode>();
  const [tabValue, setTabValue] = useState<number>(0);
  const { setOffererSlug } = useUser();
  const { addSnackbarError } = useSnackbarActions();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const onHandleLogin = () => {
    onLogin && onLogin();
    onClose();
  };

  const renderDrawerTitle = () => {
    if (activeForm === LogInProcessParts.Login) {
      return 'Acceder';
    } else if (activeForm === LogInProcessParts.PassRecovery) {
      return 'Recuperación de contraseña';
    } else if (activeForm === LogInProcessParts.MailRecovery) {
      return 'Recuperación de Email';
    } else {
      return 'Registro de usuario';
    }
  };
  
  const changeActiveForm = (newForm: LogInProcessParts) => {
    if (activeForm !== newForm) {
      setActions(undefined);
      setActiveForm(newForm);
    }
  }
  
  const renderDrawerSubtitle = () => {
    if (activeForm === LogInProcessParts.Signup) {
      return 'La información debe corresponder a una Persona Humana'
    }
  }
  
  const renderTitleAction = () => {
    if (activeForm === LogInProcessParts.Signup)
      return (
          <ButtonSeeVideoInDialog source={'/videos/Cómo crear un usuario.mp4'}
                                  buttonText={'Cómo crear tu usuario'}
                                  icon={MonitorPlay}
          />
      )
  }
    
  useEffect(() => {
    setActiveForm(formPart ? formPart : LogInProcessParts.Login);
  }, [formPart]);
  
  useEffect(() => {
    const pingServices = async () => {
      if (dialogProps.open) {
        try {
          const { HttpAuth, HttpAuthPublicBases } = await import('../../http/index');
          await HttpAuth.ping();
          await HttpAuthPublicBases.ping();
        } catch (error) {
          addSnackbarError('Failed to ping services',);
        }
      }
    };
    
    pingServices();
    setOffererSlug('');
  }, [setOffererSlug, dialogProps.open]);
  
  const handleCancel = () => {
    onCancel && onCancel();
    onClose();
  };

  return (
      <LogInDrawerContext.Provider value={{ setActions }}>
        <DrawerBase
          title={renderDrawerTitle()}
          subtitle={renderDrawerSubtitle()}
          titleAction={renderTitleAction()}
          onCloseDrawer={handleCancel}
          show={dialogProps.open ?? false}
          contentProps={{ sx: { width: isMobile ? '100%' : '50%' } }}
          titleProps={{ sx: { width: '75%' } }}
          Icon={
            activeForm !== formPart ?
            <Box sx={{ cursor: 'pointer' }} onClick={() => changeActiveForm(LogInProcessParts.Login)}>
              <WrapperIcons Icon={CaretLeft} size={'sm'} />
            </Box>
            :
            undefined
          }
          action={
            <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2, mt: 1 }}>
              {!!actions && actions}
              
              {allowsRegistration && activeForm === LogInProcessParts.Login && (
                <Button
                  startIcon={<PersonAddOutlinedIcon />}
                  onClick={() => changeActiveForm(LogInProcessParts.Signup)}
                  variant="outlined"
                  color="primary"
                  size="medium"
                  sx={{ width: !isMobile ? 0.4 : 'auto' }}
                  fullWidth={isMobile}
                >
                  Soy Nuevo
                </Button>
              )}
          </Box>
          }
        >
          <Box>
            {
              (!hideTabs && activeForm === LogInProcessParts.Login) &&
              <NavsTabHorizontal lstTabs={[
                {tabList: [
                    {label: 'Soy PyME', default: true, content: <></>},
                    {label: 'Soy oferente', content: <></>}
                  ]}
              ]}
                                 fullWidth
                                 onChange={(num) => {
                                   setTabValue(num)
                                 }}
              />
            }
            {activeForm && (
              <LogInProcess
                onLogin={onHandleLogin}
                onClickNewUser={() => changeActiveForm(LogInProcessParts.Signup)}
                onClickPasswordRecovery={() => changeActiveForm(LogInProcessParts.PassRecovery)}
                onClickMailRecovery={() => changeActiveForm(LogInProcessParts.MailRecovery)}
                allowsRegistration={allowsRegistration}
                fnAuthenticateUser={tabValue == 0 ? fnAuthenticateUser : async (credentials) => {
                  const { HttpAuth } = await import('../../http/index');
                  return HttpAuth.authenticateOffererUser(credentials);
                }}
                activeForm={activeForm}
                setActiveForm={changeActiveForm}
              />
            )}
          </Box>
        </DrawerBase>
      </LogInDrawerContext.Provider>
  );
}

export default React.memo(LogInDrawer);