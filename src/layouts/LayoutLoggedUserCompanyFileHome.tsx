import React, { createContext, useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import MenuHomeMarket from '../components/menu/MenuHomeMarket';
import MarketFooter from './components/MarketFooter';
import { Grid, Stack } from '@mui/material';
import SideBarMenu from './home/SideBarMenu';
import { userStorage } from 'util/localStorage/userStorage';
import ScrollBottom from './home/ScrollBottom';
import { useAction } from '../hooks/useAction';
import ContactForm from "./components/ContactForm";
import MarketStepsHelper from "./components/MarketStepsHelper";

interface LayoutLoggedUserCompanyFileMarketProps {
  children?: React.ReactNode;
  hideFooter?: boolean
}

type LayoutContext = {
  setShouldWarnBeforeSwitch: (value: boolean) => void;
  shouldWarnBeforeSwitch: boolean;
  // onTabChange: (item:any) => void;
  // setOnTabChange: React.Dispatch<React.SetStateAction<() => void>>;
};

export const LayoutContext = createContext<LayoutContext>({
  setShouldWarnBeforeSwitch: (value: boolean) => {},
  shouldWarnBeforeSwitch: false,
  // onTabChange: (item:any) => {console.log('asd')},
  // setOnTabChange: () => {},
});

function LayoutLoggedUserCompanyFileMarketHome({
  children, hideFooter
}: LayoutLoggedUserCompanyFileMarketProps) {
  const navigate = useNavigate();
  const isLogged = userStorage.isLogged();
  const { setFnLoadAvatar } = useAction();
  const landingHome = window.location.toString().includes('landing')

  const [shouldWarnBeforeSwitch, setShouldWarnBeforeSwitch] =
    useState<boolean>(false);

  useEffect(() => {
    setFnLoadAvatar(undefined);
  }, []);

  return (
    <Stack>
      <LayoutContext.Provider
        value={{
          shouldWarnBeforeSwitch: shouldWarnBeforeSwitch,
          setShouldWarnBeforeSwitch: setShouldWarnBeforeSwitch,
          // onTabChange: onTabChange,
          // setOnTabChange: (func) => setOnTabChange(() => func)
        }}
      >
        <Grid container sx={{ overflowX: 'hidden' }}>
            
          {isLogged && (
            <Grid item xs={0.6}>
              <SideBarMenu layoutType={userStorage.getMenuLayoutType()} />
            </Grid>
          )}

          <Grid item xs={isLogged ? 11.4 : 12} pt={1.5}>
            <MenuHomeMarket
              bottomToolbar
              links={[
                {
                  text: 'Mis cuentas MiPyME',
                  onClick: () => navigate('/mi-cuenta'),
                },
                { text: 'Market', onClick: () => navigate('/market/lines') },
              ]}
            />
            <div style={{marginBottom: '100px'}}>
                {children}
            </div>
            <Outlet />
            {landingHome && <MarketStepsHelper />}
            {landingHome && <ContactForm />}
            {!hideFooter && <MarketFooter />}
          </Grid>
        </Grid>
      </LayoutContext.Provider>
      <ScrollBottom />
    </Stack>
  );
}

export default LayoutLoggedUserCompanyFileMarketHome;
