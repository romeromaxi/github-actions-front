import * as React from 'react';
import { Route } from 'react-router-dom';
import { ThemedRoute } from 'routes/ThemedRoute';
import { SecurityComponents, AppRouteSecObjects } from 'types/security';
import { LoaderBlockUI } from 'components/loader';
import SafetyRouteMiddleware from 'components/security/SafetyRouteMiddleware';
import LazyPymeComponentsLoader from './LazyPymeComponentsLoader';
import {LayoutUserLoggedSections} from "../../layouts/LayoutUserLogged";
import MarketUserSolicitations from "../../pages/markets/solicitations/MarketUserSolicitations";

const PymeRoutes = {
  getThemedRoutes: (): React.ReactElement => {
    return (
      <>
          <Route element={
              <ThemedRoute element={
                  <React.Suspense fallback={<LoaderBlockUI/>}>
                      <LazyPymeComponentsLoader
                          componentName="LayoutUserLogged"
                          props={{ sectionActive: LayoutUserLoggedSections.CompanyHome }}
                      />
                  </React.Suspense>
              }/>
          }>
              <Route path="/mi-cuenta" 
                     element={
                        <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes} 
                                               objectName={AppRouteSecObjects.CompanyHomeRoute}>
                            <LazyPymeComponentsLoader componentName="HomeCompanyUser"/>
                        </SafetyRouteMiddleware>
                     }
              />

              <Route path="/nueva-pyme" 
                     element={
                        <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes} 
                                               objectName={AppRouteSecObjects.CompanyHomeRoute}
                        >
                            <LazyPymeComponentsLoader componentName="CreateCompanyPage" />
                        </SafetyRouteMiddleware>
                     }
              />
              <Route path="/validar-identidad" 
                     element={
                        <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes} 
                                               objectName={AppRouteSecObjects.CompanyHomeRoute}
                        >
                            <LazyPymeComponentsLoader componentName="UserValidationPage" />
                        </SafetyRouteMiddleware>
                     }
              />

              <Route path="/mis-presentaciones/:companyId/legajo/detalle" 
                     element={
                        <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes} 
                                               objectName={AppRouteSecObjects.CompanyFileDetailRoute}
                        >
                            <LazyPymeComponentsLoader componentName="CompanyPersonalInformationHome" />
                        </SafetyRouteMiddleware>
                     }
              />

              <Route path="/notificaciones" 
                     element={
                        <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes} 
                                               objectName={AppRouteSecObjects.CompanyNotificationsRoute}
                        >
                            <LazyPymeComponentsLoader componentName="HomeUserNotifications" />
                        </SafetyRouteMiddleware>
                     }
              />
              
              <Route path="/notificaciones/:notificationId" 
                     element={
                        <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes} 
                                               objectName={AppRouteSecObjects.CompanyNotificationsDetailRoute}
                        >
                            <LazyPymeComponentsLoader componentName="UserNotificationDetail" />
                        </SafetyRouteMiddleware>
                     }
              />
          </Route>

          <Route element={
              <ThemedRoute element={
                  <React.Suspense fallback={<LoaderBlockUI/>}>
                      <LazyPymeComponentsLoader
                          componentName="LayoutUserLogged"
                          props={{ sectionActive: LayoutUserLoggedSections.CompanySolicitations }}
                      />
                  </React.Suspense>
              }/>
          }>
              <Route path="/market/solicitudes" 
                     element={
                        <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes} 
                                               objectName={AppRouteSecObjects.MarketCompanySolicitationListRoute}
                        >
                            <MarketUserSolicitations />
                        </SafetyRouteMiddleware>
                     }
              />
          </Route>

          <Route element={
              <React.Suspense fallback={<LoaderBlockUI/>}>
                  <LazyPymeComponentsLoader componentName="CompanySolicitationContext" />
              </React.Suspense>
          }>
              <Route path="mis-solicitudes/:companyId/:solicitationId"
                     element={
                         <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                                objectName={AppRouteSecObjects.CompanySolicitationsRoute}
                         >
                             <LazyPymeComponentsLoader componentName="CompanySolicitationPage" />
                         </SafetyRouteMiddleware>
                     }
              />
          </Route>

          <Route path="mis-solicitudes/:companyId/:solicitationId/legajo"
                 element={
                     <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                            objectName={AppRouteSecObjects.CompanySolicitationsRoute}
                     >
                         <LazyPymeComponentsLoader componentName="CompanySolicitationCompanyFilePage" />
                     </SafetyRouteMiddleware>
                 }
          />
          
          <Route path="/mis-empresas/:companyId"
                 element={
                    <ThemedRoute element={
                        <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes} 
                                               objectName={AppRouteSecObjects.CompanyHomeDetailRoute}
                        >
                            <LazyPymeComponentsLoader componentName="HomeCompanyPage" />
                        </SafetyRouteMiddleware>}/>
                 }
          />
          
      </>
    );
  }
};

export default PymeRoutes;
