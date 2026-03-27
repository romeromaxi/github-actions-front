import React, { useEffect, useState } from 'react';
import {
  createSearchParams,
  Link,
  Outlet,
  useNavigate, useParams,
} from 'react-router-dom';
import { userStorage } from '../util/localStorage/userStorage';
import { LogInProcessParts, Module } from '../types/form/login/login-enum';
import {AppBar, Box, Button, Container, Stack} from '@mui/material';
import MenuHomeStyles from '../components/menu/MenuHome.styles';
import { useModuleNavigate } from '../hooks/useModuleNavigate';

import MarketFooter from './components/MarketFooter';
import LogInDrawer from '../pages/user/LogInDrawer';
import { useAction } from '../hooks/useAction';
import ScrollBottom from './home/ScrollBottom';
import {
  MarketCategoryNode,
  MarketCategoryNodeFields
} from "../components/menu/MenuMarketCategories";
import {HttpAuth} from "../http";
import FailRedirectMarketDialog from "../pages/markets/home/components/FailRedirectMarketDialog";
import {EntityWithIdFields} from "../types/baseEntities";
import {AuthorizationRequest} from "../types/user";
import {
  AppConfigAppBarFields,
  AppConfigFields,
  AppConfigLogosFields,
  AppConfigSizeFields
} from "types/appConfigEntities";
import {useLogoutActions} from "../hooks/useLogoutActions";
import {AppRoutesDefinitions, useAppNavigation} from "../hooks/navigation";

interface LayoutUserOffererNotLoggedProps {
  children?: React.ReactNode;
  showLanding?: boolean;
}

function LayoutUserOffererNotLogged(props: LayoutUserOffererNotLoggedProps) {
  const { offererSlug } = useParams();
  
  const routerDomNavigate = useNavigate();
  const { navigate } = useAppNavigation();
  const moduleNavigate = useModuleNavigate();
  const { executeLogoutActions } = useLogoutActions();
  const isLogged = userStorage.isLogged();
  const classes = MenuHomeStyles();
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const [failRedirect, setFailRedirect] = useState<boolean>(false);
  const { setProfile, setFnLoadAvatar } = useAction();

  const fnAuthenticateUser = (requestParams: AuthorizationRequest) =>
      HttpAuth.authenticateOffererUser(requestParams, offererSlug || "");
  

  const onLogIn = () => {
    const user = userStorage.get();

    if (user) {
      if (offererSlug) {
        userStorage.setOffererSlug(offererSlug)
      }
      if (user.lackConfirmation) {
        const params = { mail: user.mail };

        routerDomNavigate({
          pathname: '/signup/confirmation',
          search: `?${createSearchParams(params)}`,
        });
      } else moduleNavigate(Module.Offerer);
    } else {
      userStorage.removeFromStorage();
      setProfile(undefined);
    }

  };

  const onClickIngresar = () => {
      routeDomNavigate('/login')
  };

  const findParentCategoryNode = (
      parentId: number,
      categories: MarketCategoryNode[] | null,
  ): number[] | null => {
    if (!categories || !categories.length) return null;

    // No se puede usar el categories.forEach porque no corta en el return interno
    for (let index = 0; index < categories.length; index++) {
      const node = categories[index];

      if (node[EntityWithIdFields.Id] == parentId) return [index];

      const childrenNode = node[MarketCategoryNodeFields.Children];
      if (childrenNode.length) {
        const leafIndexes = findParentCategoryNode(parentId, childrenNode);

        if (!!leafIndexes) return [index, ...leafIndexes];
      }
    }

    return null;
  };


  useEffect(() => {
    setFnLoadAvatar(undefined);
  }, []);

  const onLogOut = () => {
    executeLogoutActions()
        .finally(() => {
          userStorage.removeFromStorage();
          setProfile(undefined);
          if (!!offererSlug) routerDomNavigate(`/offerer/login/${offererSlug}`);
          else routerDomNavigate('/');
        })
  };

  const goToContactLuc = () => navigate(AppRoutesDefinitions.LucContactPage);

  return (
    <Stack>
      <AppBar
          position={'fixed'}
          className={classes.appBar}
          sx={{
            paddingY: '18px !important',
            justifyContent: 'center !important',
            height: `${window.APP_CONFIG[AppConfigFields.AppBar][AppConfigAppBarFields.Height]} !important`,
            paddingX: {
              xs: '16px !important',
              sm: '16px !important',
              md: '32px !important',
              lg: '64px !important',
              xl: '96px !important',
            }
          }}
      >
        <Stack
            direction={'row'}
            sx={{ 
                width: 1,
                height: `${window.APP_CONFIG[AppConfigFields.AppBar][AppConfigAppBarFields.Height]} !important`,
                backgroundColor: 'transparent'
            }}
            justifyContent={'space-around'}
            alignItems={'center'}
        >
          <Link to={'/'} style={{ textDecoration: 'none' }}>
            <Box
                component={'img'}
                sx={{
                  height: window.APP_CONFIG[AppConfigFields.AppBar][AppConfigAppBarFields.Logo][AppConfigSizeFields.Height],
                  width: window.APP_CONFIG[AppConfigFields.AppBar][AppConfigAppBarFields.Logo][AppConfigSizeFields.Width],
                  '&:hover': { cursor: 'pointer' },
                }}
                alt={'LOGO'}
                src={window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full]}
                onClick={() => routerDomNavigate('/')}
            />
          </Link>

          <Stack direction={'row'} alignItems={'center'} spacing={2}>
            <Button variant='text' color='primary' size={'small'} onClick={goToContactLuc}>
              Contactanos
            </Button>
            {!isLogged && (
              <React.Fragment>
                <Button size={'small'} variant={'contained'} color={'primary'} onClick={onClickIngresar}>
                  Ingresá
                </Button>

                <LogInDrawer
                    formPart={LogInProcessParts.Login}
                    title={'Ingresar'}
                    open={openLogin}
                    onClose={() => setOpenLogin(false)}
                    onLogin={onLogIn}
                    hideTabs
                    fnAuthenticateUser={fnAuthenticateUser}
                />
              </React.Fragment>
            )}
            {
              isLogged &&
                <Button onClick={onLogOut} variant={'contained'}>
                  Cerrar sesión
                </Button>
            }
          </Stack>
        </Stack>
      </AppBar>

      <div dangerouslySetInnerHTML={{ __html: `` }}></div>

      {props.showLanding && (
        <>
          <Box component={'img'} height={'100vh'} src={'/images/home/home-oferente.png'} onClick={onClickIngresar} />

          <MarketFooter />
        </>
      )}

      <Container>
        {props.children}

        <Outlet />
      </Container>
      <ScrollBottom />
      <FailRedirectMarketDialog
          open={failRedirect}
          onClose={() => setFailRedirect(false)}
      />
    </Stack>
  );
}

export default LayoutUserOffererNotLogged;
