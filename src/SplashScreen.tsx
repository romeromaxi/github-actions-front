import React, {useEffect} from "react";
import {Provider} from "react-redux";
import {Helmet, HelmetProvider} from 'react-helmet-async';
import {store} from "./stores";
import {AppConfigFields, AppConfigLogosFields} from "./types/appConfigEntities";
import { ThemeItaptec } from "./util/themes/ThemeItapTec";
import { ThemeItaptecUX } from "./util/themes/ThemeItapTecUX";
import {LogoutActionsProvider} from "./hooks/useLogoutActions";
import CompanyFlowContextProvider from "./hooks/contexts/CompanyFlowContext";
import App from "./App";
import { UserProvider } from "./hooks/contexts/UserContext";
import LoaderManager from "./pages/managers/LoaderManager";
import SnackbarProvider from "./pages/managers/SnackbarProvider";
import SnackbarManager from "./pages/managers/SnackbarManager";

const SplashScreen  = () => {
    
    const configUrlIcon = (id: string, url: string) => {
        const link = document.getElementById(id);
        if (link && link.href !== url)
            link.href = url;
    }
    
    const configMetaProperty = (id: string, content: string) => {
        const meta = document.getElementById(id);
        if (meta && meta.content !== content)
            meta.content = content;
    }
    
    useEffect(() => {
        const configTitle = window.APP_CONFIG[AppConfigFields.Title];
        if (document.title !== configTitle)
            document.title = configTitle;

        configMetaProperty('meta-og-tittle', window.APP_CONFIG[AppConfigFields.Title]);
        configMetaProperty('meta-og-description', window.APP_CONFIG[AppConfigFields.Description]);
        configMetaProperty('meta-og-image-300', window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.icon300]);
        configMetaProperty('meta-description', window.APP_CONFIG[AppConfigFields.Description]);
        configUrlIcon('shortcut-icon', window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Ico]);
        configUrlIcon('favicon-icon-page', window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Icon]);
        configUrlIcon('apple-touch-icon-192', window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Icon192]);
    }, []);

    return (
      <div>
        <Provider store={store}>
          <LoaderManager/>
          <LogoutActionsProvider>
            <CompanyFlowContextProvider>
              <ThemeItaptecUX>
                <HelmetProvider>
                    <Helmet>
                        <title>{window.APP_CONFIG[AppConfigFields.Title]}</title>
                        <meta name="meta-og-tittle" content={window.APP_CONFIG[AppConfigFields.Title]} />
                        <meta name="meta-og-description" content={window.APP_CONFIG[AppConfigFields.Description]} />
                        <meta name="meta-description" content={window.APP_CONFIG[AppConfigFields.Description]} />
                    </Helmet>
                    
                    <UserProvider>
                      <SnackbarProvider>
                        <ThemeItaptec>
                          <SnackbarManager />
                          <App/>
                        </ThemeItaptec>
                      </SnackbarProvider>
                    </UserProvider>
                </HelmetProvider>  
              </ThemeItaptecUX>
            </CompanyFlowContextProvider>
          </LogoutActionsProvider>
        </Provider>
      </div>
    );
};

export { SplashScreen }