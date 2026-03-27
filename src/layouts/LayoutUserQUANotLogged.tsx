import React, {useEffect, useMemo} from 'react';
import {
  Outlet,
  useNavigate,
} from 'react-router-dom';
import { userStorage } from 'util/localStorage/userStorage';
import { Box, Container } from '@mui/material';
import MenuHomeStyles from 'components/menu/MenuHome.styles';
import MarketFooter from './components/MarketFooter';
import { useAction } from 'hooks/useAction';
import {
  AppConfigAppBarFields,
  AppConfigFields,
} from "types/appConfigEntities";
import { AppbarBaseOLD } from "../components/appbar/AppBarBase";
import clsx from "clsx";
import ScrollTop from "./home/ScrollTop";

interface LayoutUserQUANotLoggedProps {
  children?: React.ReactNode;
  showLanding?: boolean;
}

function LayoutUserQUANotLogged(props: LayoutUserQUANotLoggedProps) {
  const routeDomNavigate = useNavigate();
  const isLogged = userStorage.isLogged();
  const classes = MenuHomeStyles();
  const { setFnLoadAvatar } = useAction();

  const paddingTopContent = useMemo(() => {
    const appBarHeight = window.APP_CONFIG[AppConfigFields.AppBar][AppConfigAppBarFields.Height];

    return `calc(${appBarHeight} + 20px)`;
  }, [])

  useEffect(() => {
    if (isLogged) {
      routeDomNavigate('/')
    }
    setFnLoadAvatar(undefined);
  }, [isLogged]);

  return (
      <Box sx={{ position: 'relative' }}>
          <Container>
              <AppbarBaseOLD position="fixed" 
                             elevation={0} 
                             className={clsx(classes.appBar, {
                                 [classes.appBarBlur]: true,
                             })}
              />

              <Box pt={paddingTopContent}>
                  {props.children}
                  <Outlet/>
              </Box>

          </Container>

          <ScrollTop />

          {props.showLanding && <MarketFooter/>}

      </Box>
  );
}

export default LayoutUserQUANotLogged;
