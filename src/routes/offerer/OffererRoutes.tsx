import React, { ReactElement } from "react";
import { Route } from "react-router-dom";
import { ThemedRoute } from "routes/ThemedRoute";
import { SecurityComponents, AppRouteSecObjects } from "types/security";
import { LoaderBlockUI } from "components/loader/LoaderBlockUI";
import SafetyRouteMiddleware from "components/security/SafetyRouteMiddleware";
import LazyOffererComponentsLoader from "./LazyOffererComponentsLoader";
import {LayoutUserLoggedSections} from "layouts/LayoutUserLogged";

const OffererRoutes = {
  getThemedRoutes(): ReactElement {
    return (
      <>
        <Route element={
          <ThemedRoute element={
            <React.Suspense fallback={<LoaderBlockUI/>}>
                <LazyOffererComponentsLoader
                    componentName="OffererContextProvider"
                >
                    <LazyOffererComponentsLoader componentName="LayoutUserLogged"
                                                 props={{ sectionActive: LayoutUserLoggedSections.OffererHome }}
                    />
                </LazyOffererComponentsLoader>
            </React.Suspense>
          }/>
        }>
            <Route path="/offerer/home"
                   element={
                       <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                              objectName={AppRouteSecObjects.OffererHomeRoute}
                       >
                           <LazyOffererComponentsLoader componentName="HomeOfferer" />
                       </SafetyRouteMiddleware>
                   }
            />

            <Route path="offerer/notificaciones"
                   element={
                       <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                              objectName={AppRouteSecObjects.OffererNotificationsRoute}
                       >
                           <LazyOffererComponentsLoader componentName="HomeUserNotifications" />
                       </SafetyRouteMiddleware>
                   }
            />

            <Route path="offerer/notificaciones/:notificationId"
                   element={
                       <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                              objectName={AppRouteSecObjects.OffererNotificationsDetailRoute}
                       >
                           <LazyOffererComponentsLoader componentName="UserNotificationDetail" />
                       </SafetyRouteMiddleware>
                   }
            />
        </Route>

          <Route element={
              <ThemedRoute element={
                  <React.Suspense fallback={<LoaderBlockUI/>}>
                      <LazyOffererComponentsLoader
                          componentName="OffererContextProvider"
                      >
                          <LazyOffererComponentsLoader componentName="LayoutUserLogged"
                                                       props={{ sectionActive: LayoutUserLoggedSections.OffererSolicitations }}
                          />
                      </LazyOffererComponentsLoader>
                  </React.Suspense>
              }/>
          }>
              <Route path="/offerer/solicitations" 
                     element={
                      <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes} 
                                             objectName={AppRouteSecObjects.OffererSolicitationsRoute}
                      >
                          <LazyOffererComponentsLoader componentName="HomeOffererSolicitations" />
                      </SafetyRouteMiddleware>
                  }
              />
          </Route>
          <Route element={
              <ThemedRoute element={
                  <React.Suspense fallback={<LoaderBlockUI/>}>
                      <LazyOffererComponentsLoader
                          componentName="OffererContextProvider"
                      >
                          <LazyOffererComponentsLoader componentName="LayoutUserLogged"
                                                       props={{ sectionActive: LayoutUserLoggedSections.OffererUserBase }}
                          />
                      </LazyOffererComponentsLoader>
                  </React.Suspense>
              }/>
          }>
              <Route path="/offerer/clientPortfolio"
                     element={
                         <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                                objectName={AppRouteSecObjects.OffererProspectsRoute}
                         >
                             <LazyOffererComponentsLoader componentName="HomeOffererClientPortfolio" />
                         </SafetyRouteMiddleware>
                     }
              />
          </Route>
          
          <Route element={
              <ThemedRoute element={
                  <React.Suspense fallback={<LoaderBlockUI/>}>
                      <LazyOffererComponentsLoader
                          componentName="OffererContextProvider"
                      >
                          <LazyOffererComponentsLoader componentName="LayoutUserLogged"
                                                       props={{ sectionActive: LayoutUserLoggedSections.OffererProducts }}
                          />
                      </LazyOffererComponentsLoader>
                  </React.Suspense>
              }/>
          }>
              <Route path="/offerer/lines"
                     element={
                         <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                                objectName={AppRouteSecObjects.OffererLinesRoute}
                         >
                             <LazyOffererComponentsLoader componentName="HomeOffererLine" />
                         </SafetyRouteMiddleware>
                     }
              />
              <Route element={
                  <React.Suspense fallback={<LoaderBlockUI/>}>
                      <LazyOffererComponentsLoader componentName="ProductLineDetailContext"
                                                   props={{ offerer: true }}
                      />
                  </React.Suspense>
              }>
                  <Route path="/offerer/lines/:lineId"
                         element={
                             <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                                    objectName={AppRouteSecObjects.OffererLinesDetailRoute}
                             >
                                 <LazyOffererComponentsLoader componentName="ProductLineDetailPage" />
                             </SafetyRouteMiddleware>
                         }
                  />
              </Route>
          </Route>

          <Route path="/offerer/clientPortfolio/:clientPortfolioGuid" 
                 element={
                    <ThemedRoute element={
                      <React.Suspense fallback={<LoaderBlockUI/>}>
                          <LazyOffererComponentsLoader componentName="OffererContextProvider">

                              <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                                     objectName={AppRouteSecObjects.OffererProspectsDetailRoute}
                              >
                                  <LazyOffererComponentsLoader componentName="OffererClientPortfolioPage" />
                              </SafetyRouteMiddleware>
                          </LazyOffererComponentsLoader>
                      </React.Suspense>
                  }/>
          } />


          <Route element={
              <ThemedRoute element={
                  <React.Suspense fallback={<LoaderBlockUI/>}>
                      <LazyOffererComponentsLoader
                          componentName="OffererContextProvider"
                      >
                          <LazyOffererComponentsLoader componentName="LayoutUserLogged"
                                                       props={{ sectionActive: LayoutUserLoggedSections.OffererSolicitations }}
                          />
                      </LazyOffererComponentsLoader>
                  </React.Suspense>
              }/>
          }>
              <Route path="/offerer/solicitations"
                     element={
                         <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                                objectName={AppRouteSecObjects.OffererSolicitationsRoute}
                         >
                             <LazyOffererComponentsLoader componentName="HomeOffererSolicitations" />
                         </SafetyRouteMiddleware>
                     }
              />
          </Route>

          <Route element={
              <ThemedRoute element={
                  <React.Suspense fallback={<LoaderBlockUI/>}>
                      <LazyOffererComponentsLoader
                          componentName="OffererContextProvider"
                      >
                          <LazyOffererComponentsLoader componentName="SolicitationsContextProvider" />
                      </LazyOffererComponentsLoader>
                  </React.Suspense>
              }/>
          }>
              <Route path="/offerer/solicitations/:solicitationId"
                     element={
                         <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                                objectName={AppRouteSecObjects.OffererSolicitationsDetailRoute}
                         >
                             <LazyOffererComponentsLoader componentName="OffererSolicitationPage" />
                         </SafetyRouteMiddleware>
                     }
              />
          </Route>

          <Route element={
              <ThemedRoute element={
                <React.Suspense fallback={<LoaderBlockUI/>}>
                    <LazyOffererComponentsLoader
                        componentName="OffererContextProvider"
                    >
                        <LazyOffererComponentsLoader componentName="LayoutUserLogged"
                                                     props={{ sectionActive: LayoutUserLoggedSections.OffererConfiguration }}
                        />
                    </LazyOffererComponentsLoader>
                </React.Suspense>
              }/>
        }>
            <Route path="/offerer/configuration"
                   element={
                       <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                              objectName={AppRouteSecObjects.OffererConfigurationRoute}
                       >
                           <LazyOffererComponentsLoader componentName="OffererConfigurationPage" />
                       </SafetyRouteMiddleware>
                   }
            />
        </Route>
      </>
    );
  }
};

export default OffererRoutes;