import React, {useCallback, useEffect, useState} from 'react';
import {Box, Button, Divider, Paper, Stack} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useModuleNavigate} from '../../hooks/useModuleNavigate';
import {LogInProcessParts, Module} from '../../types/form/login/login-enum';
import LogInDrawer from '../../pages/user/LogInDrawer';
import {
  AppConfigFields,
  AppConfigFooter,
  AppConfigFooterFields,
  AppConfigLogosFields,
  AppConfigSizeFields
} from '../../types/appConfigEntities';
import {useUser} from '../../hooks/contexts/UserContext';
import {useSnackbarActions} from '../../hooks/useSnackbarActions';
import {useProfileActions} from '../../hooks/useProfileActions';
import {AppRoutesDefinitions, useAppNavigation} from "../../hooks/navigation";
import {TypographyBase} from "../../components/misc/TypographyBase";
import MarketFooterSocialMedia from "./MarketFooterSocialMedia";
import {User} from '@phosphor-icons/react';

const ButtonIdLogin: string = "btn-login-footer";
const ButtonIdSignUp: string = "btn-registrate-footer";

function MarketFooter() {
  const { user, logout, isLoggedIn, isUserContextLoading } = useUser();
  const { addSnackbarWarning } = useSnackbarActions();
  const { setProfile } = useProfileActions();
  const routeDomNavigate = useNavigate();
  const { navigate } = useAppNavigation();
  const moduleNavigate = useModuleNavigate();
  const [isProcessingLogin, setIsProcessingLogin] = useState(false);
  const [loginPart, setLoginPart] = useState<LogInProcessParts>();

  const appConfigFooter: AppConfigFooter = window.APP_CONFIG[AppConfigFields.Footer];
  
  const handleLoginSuccess = useCallback(() => {
    if (user?.lackConfirmation && user.mail) {
      const encodedMail = encodeURIComponent(user.mail);
      routeDomNavigate(`/signup/confirmation?mail=${encodedMail}`);
    } else if (user?.userType === Module.Offerer) {
      moduleNavigate(Module.Offerer);
    } else {
      moduleNavigate(Module.Company)
    }
    setIsProcessingLogin(false);
  }, [user, routeDomNavigate, moduleNavigate]);

  const handleLoginFailure = useCallback(() => {
    logout();
    setProfile(undefined);
    addSnackbarWarning('El usuario ingresado no corresponde a la sección solicitada');
    setIsProcessingLogin(false);
  }, [setProfile, addSnackbarWarning]);

  useEffect(() => {
    if (!isProcessingLogin) return;

    if (!isUserContextLoading) {
      if (user) {
        handleLoginSuccess();
      } else {
        handleLoginFailure();
      }
    }
  }, [isProcessingLogin, isUserContextLoading, user, handleLoginSuccess, handleLoginFailure]);
  
  const onLogIn = () => {
    if (isUserContextLoading || isProcessingLogin) return;
    setIsProcessingLogin(true);
  };

  const closeLogin = () => setLoginPart(undefined);

  const onClickSignUp = () => routeDomNavigate('/signup');

  const onClickLogIn = () => routeDomNavigate('/login');
  
  const goToMarketLanding = () => navigate(AppRoutesDefinitions.MarketLanding);
  
  const goToAboutLuc = () => navigate(AppRoutesDefinitions.LucAboutPage);
  
  const goToFAQLuc = () => navigate(AppRoutesDefinitions.LucFAQPage);

  const goToContactLuc = () => navigate(AppRoutesDefinitions.LucContactPage);
  
  return (
    <Box style={{ position: 'relative', left: 0, bottom: 0, right: 0, marginTop: 20 }} id="main-footer-market">
      <Paper
        component={'footer'}
        sx={{
          position: 'relative', left: 0, bottom: 0, right: 0, width: 1, borderRadius: 0, backgroundColor: 'transparent', mt: 0,
        }}
      >
        <Box paddingX={{ xs: 3, md: 6 }} paddingY={6}>
          <Stack spacing={3}>
            <Stack direction={'row'} justifyContent={'space-between'}
                   alignItems={'end'}
            >
              <Box component={'img'}
                   sx={{
                     height: appConfigFooter[AppConfigFooterFields.Logo][AppConfigSizeFields.Height],
                     width: appConfigFooter[AppConfigFooterFields.Logo][AppConfigSizeFields.Width],
                   }}
                   alt={'LOGO'}
                   src={window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full]}
              />
              
              <Box display={{ xs: 'none', md: 'block' }}>
                <MarketFooterSocialMedia />
              </Box>
            </Stack>

            <Stack direction={{ xs: 'column', md: 'row'}} spacing={3} justifyContent={'space-between'}>
              <Stack direction={'row'} spacing={1}>
                {
                  !isLoggedIn &&
                    <React.Fragment>
                      <Button id={ButtonIdSignUp} color={'primary'} variant={'contained'} size={'small'} onClick={onClickSignUp}>
                        Crear Usuario
                      </Button>
                      <Button color={'secondary'} variant={'contained'} size={'small'}
                              id={ButtonIdLogin}
                              startIcon={<User />}
                              onClick={onClickLogIn}
                      >
                        Ingresar
                      </Button>
                    </React.Fragment>
                }
              </Stack>
              
              <Stack direction={{ xs: 'column', md: 'row'}} spacing={3}>
                <Stack display={{ xs: 'block', md: 'none' }}>
                  <Divider sx={{ borderColor: '#BFBFBF !important', borderBottom: 'none' }} />
                </Stack>
                
                <Button color={'secondary'} variant={'outlined'} size={'small'}
                        onClick={goToMarketLanding}
                >
                  Tienda LUC
                </Button>
                
                <Button color={'secondary'} variant={'min-contained'} size={'small'}
                        onClick={goToAboutLuc}
                >
                  Sobre LUC
                </Button>
                
                <Button color={'secondary'} variant={'min-contained'} size={'small'}
                        onClick={goToFAQLuc}
                >
                  Preguntas Frecuentes
                </Button>
                
                <Button color={'secondary'} variant={'min-contained'} size={'small'}
                        onClick={goToContactLuc}
                >
                  Contacto
                </Button>
              </Stack>
            </Stack>
            

            <Box alignSelf={'center'} display={{ xs: 'block', md: 'none' }}>
              <MarketFooterSocialMedia />
            </Box>

            {
              appConfigFooter[AppConfigFooterFields.RightReservedText] &&
                <TypographyBase fontSize={'.875rem'} alignSelf={'center'}>
                  {appConfigFooter[AppConfigFooterFields.RightReservedText]}
                </TypographyBase>
            }

          </Stack>
        </Box>
      </Paper>
  
      {/* Dialogs and Popups */}
      <LogInDrawer open={!!loginPart}
                   formPart={loginPart}
                   onLogin={onLogIn}
                   title={'Acceder'}
                   allowsRegistration
                   onClose={closeLogin}
                   fnAuthenticateUser={async (credentials) => {
                     const { HttpAuth } = await import('../../http/index');
                     return HttpAuth.authenticateUser(credentials);
                   }}
      />
      
    </Box>
  );
}

export default MarketFooter;