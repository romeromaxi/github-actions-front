import React from 'react';
import { NavsTabVertical } from '../../components/navs/NavsTab';
import LinesList from './lines/LinesList';
import OffererListPage from "./offerer/OffererListPage";
import ProfileSettingsPage from "./security/ProfileSettingsPage";
import ReportsPage from "./reports/ReportsPage";
import InternalMailList from "./mails/InternalMailList";
import AdsList from "./ad/AdsList";
import {AppRouteSecObjects, SecurityComponents} from "../../types/security";
import InternalTabVerticalHeader from "./InternalTabVerticalHeader";
import UserPersonalDataTabContent from "../user/PersonalData/UserPersonalDataTabContent";
import ProductList from "./product/ProductList";
import ProductInstrumentTypes from "./product/ProductInstrumentTypes";
import ProductInstrumentList from "./product/ProductInstrumentList";
import ProductDestinyList from "./product/ProductDestinyList";
import ProductServiceList from "./product/ProductServiceList";
import NeedList from "./need/NeedList";
import InternalValidatePersonPage from './person/InternalValidatePersonPage';
import SelectedLinesList from './lines/SelectedLinesList';
import InternalAllUsersList from 'pages/internal/users/InternalAllUsersList';

function HomeInternalUser() {

  return (
            <NavsTabVertical
              lstTabs={[
                {
                  tabList: [
                    {
                      label: 'Oferentes',
                      default: true,
                      content: (
                          <OffererListPage />
                      ),
                      securityComponent: SecurityComponents.AppRoutes,
                      securityObject: AppRouteSecObjects.InternalOffererConfigurationRoute,
                      queryParam: 'offerers'
                    },
                    {
                      label: 'Líneas',
                      content: (
                          <LinesList />
                      ),
                      securityComponent: SecurityComponents.AppRoutes,
                      securityObject: AppRouteSecObjects.InternalLinesRoute,
                      queryParam: 'lines'
                    },
                  ]
                },
                  {
                      label: 'Parametrizac. Productos',
                      tabList: [
                          {
                              label: 'Productos', 
                              content: <ProductList />, 
                              queryParam: 'products-parameters',
                              securityComponent: SecurityComponents.AppRoutes,
                              securityObject: AppRouteSecObjects.InternalProductParameterizationRoute,
                          },
                          {
                              label: 'Tipos de Instrumentos', 
                              content: <ProductInstrumentTypes />,
                              queryParam: 'instruments-types-parameters',
                              securityComponent: SecurityComponents.AppRoutes,
                              securityObject: AppRouteSecObjects.InternalProductParameterizationRoute,
                          },
                          {
                              label: 'Instrumentos',
                              content: <ProductInstrumentList />,
                              queryParam: 'instruments-parameters',
                              securityComponent: SecurityComponents.AppRoutes,
                              securityObject: AppRouteSecObjects.InternalProductParameterizationRoute,
                          },
                          {
                              label: 'Destinos',
                              content: <ProductDestinyList />, 
                              queryParam: 'destinations-parameters',
                              securityComponent: SecurityComponents.AppRoutes,
                              securityObject: AppRouteSecObjects.InternalProductParameterizationRoute,
                          },
                          {
                              label: 'Servicios', 
                              content: <ProductServiceList />, 
                              queryParam: 'services-parameters',
                              securityComponent: SecurityComponents.AppRoutes,
                              securityObject: AppRouteSecObjects.InternalProductParameterizationRoute,
                          },
                          {
                              label: 'Necesidades',
                              content: <NeedList />,
                              queryParam: 'needs-parameters',
                              securityComponent: SecurityComponents.AppRoutes,
                              securityObject: AppRouteSecObjects.InternalProductParameterizationRoute,
                          }
                      ],
                      securityComponent: SecurityComponents.AppRoutes,
                      securityObject: AppRouteSecObjects.InternalProductParameterizationRoute,
                  },
                  {
                      tabList: [
                          {
                              label: 'Perfiles',
                              content: (
                                  <ProfileSettingsPage />
                              ),
                              securityComponent: SecurityComponents.AppRoutes,
                              securityObject: AppRouteSecObjects.InternalProfileManagerRoute,
                              queryParam: 'profiles-managment'
                          },
                          {
                              label: 'Validación de Personas',
                              content: (
                                  <InternalValidatePersonPage />
                              ),
                              securityComponent: SecurityComponents.AppRoutes,
                              securityObject: AppRouteSecObjects.InternalPeopleValidationRoute,
                              queryParam: 'people-validation'
                          },
                          {
                              label: 'Reportes',
                              content: (
                                  <ReportsPage />
                              ),
                              securityComponent: SecurityComponents.AppRoutes,
                              securityObject: AppRouteSecObjects.InternalReportsListRoute,
                              queryParam: 'reports'
                          },
                          {
                              label: 'Plantillas de Mails',
                              content: (
                                  <InternalMailList />
                              ),
                              securityComponent: SecurityComponents.AppRoutes,
                              securityObject: AppRouteSecObjects.InternalCRUDEmailTemplatesRoute,
                              queryParam: 'mail-templates'
                          },
                          {
                              label: 'Publicidades',
                              content: (
                                  <AdsList />
                              ),
                              securityComponent: SecurityComponents.AppRoutes,
                              securityObject: AppRouteSecObjects.InternalAdsRoute,
                              queryParam: 'ads'
                          },
                          {
                              label: 'Líneas Destacadas',
                              content: (
                                  <SelectedLinesList />
                              ),
                              securityComponent: SecurityComponents.AppRoutes,
                              securityObject: AppRouteSecObjects.InternalSelectedLinesRoute,
                              queryParam: 'selected-lines'
                          },
                          {
                              label: 'Administrador de Usuarios',
                              content: (
                                  <InternalAllUsersList />
                              ),
                              securityComponent: SecurityComponents.AppRoutes,
                              securityObject: AppRouteSecObjects.InternalAllUsersRoute,
                              queryParam: 'users'
                          },
                          {
                              label: 'Mi Perfil de usuario',
                              content: <UserPersonalDataTabContent />,
                              securityComponent: SecurityComponents.AppRoutes,
                              securityObject: AppRouteSecObjects.InternalUserProfileRoute,
                              queryParam: 'my-profile'
                          }
                      ]
                  },
              ]}
              tabSize={3}
              header={<InternalTabVerticalHeader />}
              alwaysSomeActiveTab
            />
  );
}

export default HomeInternalUser;
