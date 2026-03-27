import React, { ReactElement } from "react";
import { Route } from "react-router-dom";
import { ThemedRoute } from "../ThemedRoute";
import { AppRouteSecObjects, SecurityComponents } from "types/security";
import { LoaderBlockUI } from "components/loader/LoaderBlockUI";
import SafetyRouteMiddleware from "components/security/SafetyRouteMiddleware";
import LazyInternalComponentsLoader from "./LazyInternalComponentsLoader";
import LazyPymeComponentsLoader from "../pyme/LazyPymeComponentsLoader";
import {LayoutUserLoggedSections} from "layouts/LayoutUserLogged";

const InternalRoutes = {
  getThemedRoutes(): ReactElement {
    return (
      <>
          <Route element={
              <ThemedRoute element={
                  <React.Suspense fallback={<LoaderBlockUI/>}>
                      <LazyPymeComponentsLoader componentName="LayoutUserLogged"
                                                props={{ sectionActive: LayoutUserLoggedSections.InternalHome }}
                      />
                  </React.Suspense>
              }/>
          }>
              <Route path="/internal/home"
                     element={
                         <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                                objectName={AppRouteSecObjects.InternalHomeRoute}
                         >
                             <LazyInternalComponentsLoader componentName="HomeInternalUser" />
                         </SafetyRouteMiddleware>
                     }
              />

              <Route element={
                  <ThemedRoute element={
                      <LazyInternalComponentsLoader componentName="ProductLineDetailContext" />}
                  />
              }>
                  <Route path="/internal/lines/:lineId"
                         element={
                             <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                                    objectName={AppRouteSecObjects.InternalLinesDetailRoute}
                             >
                                 <LazyInternalComponentsLoader componentName="ProductLineDetailPage" />
                             </SafetyRouteMiddleware>
                         }
                  />
              </Route>

              <Route path="internal/notificaciones"
                     element={
                         <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                                objectName={AppRouteSecObjects.InternalNotificationsRoute}
                         >
                             <LazyInternalComponentsLoader componentName="HomeUserNotifications" />
                         </SafetyRouteMiddleware>
                     }
              />
              <Route path="internal/notificaciones/:notificationId"
                     element={
                         <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                                objectName={AppRouteSecObjects.InternalNotificationsDetailRoute}
                         >
                             <LazyInternalComponentsLoader componentName="UserNotificationDetail" />
                         </SafetyRouteMiddleware>
                     }
              />
          </Route>

          <Route element={
              <ThemedRoute element={
                  <React.Suspense fallback={<LoaderBlockUI/>}>
                      <LazyPymeComponentsLoader componentName="LayoutUserLogged"
                                                props={{ sectionActive: LayoutUserLoggedSections.InternalCompanies }}
                      />
                  </React.Suspense>
              }/>
          }>
              <Route path="/internal/companies" 
                     element={
                      <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes} 
                                             objectName={AppRouteSecObjects.InternalPymeUserListRoute}
                      >
                          <LazyInternalComponentsLoader componentName="InternalCompaniesPage" />
                      </SafetyRouteMiddleware>
                  }
              />
          </Route>

          <Route element={
              <ThemedRoute element={
                  <React.Suspense fallback={<LoaderBlockUI/>}>
                      <LazyPymeComponentsLoader componentName="LayoutUserLogged"
                                                props={{ sectionActive: LayoutUserLoggedSections.InternalSolicitations }}
                      />
                  </React.Suspense>
              }/>
          }>
              <Route path="/internal/solicitations"
                     element={
                         <ThemedRoute element={
                             <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                                    objectName={AppRouteSecObjects.InternalSolicitationsRoute}
                             >
                                 <LazyInternalComponentsLoader componentName={"InternalSolicitationsPage"} />
                             </SafetyRouteMiddleware>}
                         />
                     }
              />

              <Route element={
                      <React.Suspense fallback={<LoaderBlockUI/>}>
                          <LazyInternalComponentsLoader componentName="SolicitationsContextProvider" />
                      </React.Suspense>
              }>
                  <Route path="/internal/solicitations/:solicitationId"
                         element={
                             <ThemedRoute element={
                                 <SafetyRouteMiddleware componentName={SecurityComponents.AppRoutes}
                                                        objectName={AppRouteSecObjects.InternalSolicitationsRoute}
                                 >
                                     <LazyInternalComponentsLoader componentName={"InternalSolicitationDetailPage"} />
                                 </SafetyRouteMiddleware>}
                             />
                         }
                  />
              </Route>
          </Route>
      </>
    )
  }
}

export default InternalRoutes;
