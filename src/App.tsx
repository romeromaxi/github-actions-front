import React, { createContext, useEffect, useMemo, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTop from "./layouts/home/components/ScrollToTop";
import { DictionaryTemplateConfig } from './types/productLineTemplate/ProductLineTemplateData';
import { ErrorBoundary } from "react-error-boundary";
import { DictionarySecurityObject } from 'types/security/SecurityData';
import { isMobile } from 'react-device-detect';
import { useUser } from './hooks/contexts/UserContext';
import { Module } from './types/form/login/login-enum';
import { ThemedRoute } from './routes/ThemedRoute';
import MarketRoutes from 'routes/market/MarketRoutes';
import GuestRoutes from 'routes/guest/GuestRoutes';
import FallbackRoute from './routes/FallbackRoute';
import SecurityManager from './pages/managers/SecurityManager';
import ProductLineManager from "./pages/managers/ProductLineManager";
import HomeNew from "./pages/home/HomeNew";
import ErrorPage from "./pages/home/ErrorPage";
import UserSummaryInformationManager from "./pages/managers/UserSummaryInformationManager";
import {ThemeItaptecUX} from "./util/themes/ThemeItapTecUX";
import SignupPage from "./pages/user/Signup/SignupPage";
import LoginPage from "./pages/user/Login/LoginPage";
import ApplicationCommonContextProvider from "./hooks/contexts/ApplicationCommonContext";
import LayoutUserNotLogged from "./layouts/LayoutUserNotLogged";
import LayoutMinimal from "./layouts/LayoutMinimal";

const UserMustChangePasswordDialog = React.lazy(() => import('./pages/user/changePassword/UserMustChangePasswordDialog'));

export const ProductLineTemplateContext = React.createContext<{
  dictionaryTemplateConfig: DictionaryTemplateConfig | undefined
}>({
  dictionaryTemplateConfig: undefined
});

export const SecurityObjectContext = createContext({
  dictionarySecurityObject: {} as DictionarySecurityObject | undefined,
});

interface RouteModule {
  getThemedRoutes?: () => React.ReactNode;
  getUnthemedRoutes?: () => React.ReactNode;
  getRoute?: () => React.ReactNode;
}

function App() {
  const [dictionarySecurityObject, setDictionarySecurityObject] = useState<DictionarySecurityObject | undefined>();
  const [dictionaryTemplateConfig, setDictionaryTemplateConfig] = useState<DictionaryTemplateConfig | undefined>();
  const [showMobileAlert, setShowMobileAlert] = useState<boolean>(isMobile);
  const { user } = useUser();
  const [routeModules, setRouteModules] = useState<{
    pyme: RouteModule | null;
    offerer: RouteModule | null;
    internal: RouteModule | null;
  }>({
    pyme: null,
    offerer: null,
    internal: null,
  });

  const contextValue = useMemo(() => ({
    dictionaryTemplateConfig
  }), [dictionaryTemplateConfig]);

  const userType = user?.userType;

  const onCloseMobileAlert = () => setShowMobileAlert(false);

  useEffect(() => {
    if (!userType) return;
    
    const loadUserSpecificRoutes = async () => {
      switch(userType) {
        case Module.Company:
          const pymeModule = await import('routes/pyme/PymeRoutes').then(module => module.default);
          setRouteModules(prev => ({...prev, pyme: pymeModule}));
          break;
        case Module.Offerer:
          const offererModule = await import('routes/offerer/OffererRoutes').then(module => module.default);
          setRouteModules(prev => ({...prev, offerer: offererModule}));
          break;
        case Module.Internal:
          const internalModule = await import('routes/internal/InternalRoutes').then(module => module.default);
          setRouteModules(prev => ({...prev, internal: internalModule}));
          break;
        default:
          break;
      }
    };
    
    loadUserSpecificRoutes();
  }, [userType]);


  return (
    <SecurityObjectContext.Provider value={{ dictionarySecurityObject }}>
      <SecurityManager
        setDictionarySecurityObject={setDictionarySecurityObject}
      />
      <ErrorBoundary FallbackComponent={ErrorPage} onReset={() => window.location.href='/'}>
        <ProductLineTemplateContext.Provider value={contextValue}>
          <ProductLineManager setDictionaryTemplateConfig={setDictionaryTemplateConfig} />
          <Router>
            <UserSummaryInformationManager/>
            <ScrollToTop>
              <Routes>
                  <Route element={<ThemedRoute element={<ApplicationCommonContextProvider />}/>}>
                      <Route element={<ThemedRoute element={<LayoutUserNotLogged gridBackground />}/>} >
                          <Route path="/" element={<HomeNew />} />
                      </Route>
                      
                      <Route element={<ThemedRoute element={<LayoutMinimal gridBackground />} /> }>
                          <Route path="/login" element={<LoginPage />} />
                          <Route path="/signup" element={<SignupPage />} />
                      </Route>
                      
                    {MarketRoutes.getThemedRoutes()}
                    
                    {GuestRoutes.getThemedRoutes()}
    
                    {userType === Module.Company && routeModules.pyme && routeModules.pyme.getThemedRoutes && 
                      routeModules.pyme.getThemedRoutes()}
                    
                    {userType === Module.Offerer && routeModules.offerer && (
                      <React.Fragment>
                        {routeModules.offerer.getThemedRoutes && routeModules.offerer.getThemedRoutes()}
                      </React.Fragment>
                    )}
                    
                    {userType === Module.Internal && routeModules.internal && (
                      <React.Fragment>
                        {routeModules.internal.getThemedRoutes && routeModules.internal.getThemedRoutes()}
                      </React.Fragment>
                    )}
    
                    {FallbackRoute.getRoute()}
                  </Route>
              </Routes>
            </ScrollToTop>
          </Router>
        </ProductLineTemplateContext.Provider>
      </ErrorBoundary>
      <ThemeItaptecUX>
        <React.Suspense fallback={null}>
          <UserMustChangePasswordDialog />
        </React.Suspense>
        
        {/*<UserDialogAlertMobile open={showMobileAlert} onClose={onCloseMobileAlert} />*/}
        
      </ThemeItaptecUX>
    </SecurityObjectContext.Provider>
  );
}

export default App;