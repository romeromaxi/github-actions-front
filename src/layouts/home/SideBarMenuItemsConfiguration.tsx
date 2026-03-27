import React from 'react';
import {ItemMenuType, MenuCode, MenuLayoutType} from 'types/menu/menuLink';

import {
  AccountBalanceTwoTone,
  AdminPanelSettingsTwoTone,
  AssessmentTwoTone,
  FactoryTwoTone,
  GamesTwoTone,
  InboxTwoTone,
  InsertDriveFileTwoTone,
  ListAltTwoTone,
  ManageSearchTwoTone,
  MediationTwoTone,
  ViewListTwoTone,
  AdsClickTwoTone, PeopleTwoTone
} from '@mui/icons-material';
import CollectionsBookmarkTwoToneIcon from '@mui/icons-material/CollectionsBookmarkTwoTone';
import VerifiedTwoToneIcon from '@mui/icons-material/VerifiedTwoTone';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ManageAccountsTwoToneIcon from '@mui/icons-material/ManageAccountsTwoTone';
import LayersTwoToneIcon from '@mui/icons-material/LayersTwoTone';
import {SideBarMenuPopUpCompany} from './components/SideBarMenuPopUp';
import {SideBarMenuItemsSecObjects} from '../../types/security';
import {HomeCompanyUserIcon} from './components/ItemsMenuSpecialIcon';
import MailIcon from "@mui/icons-material/Mail";
import IntegrationInstructionsTwoToneIcon from "@mui/icons-material/IntegrationInstructionsTwoTone";

const listItemsMenuHome = (urlParam = ''): ItemMenuType[] => {
  return [
    {
      code: MenuCode.Home,
      label: 'Mi LUC',
      icon: <HomeCompanyUserIcon />,
      to: '/mi-cuenta',
    },
    {
      code: MenuCode.PymeCompanySelect,
      label: 'Mis cuentas MiPyME',
      icon: <FactoryTwoTone />,
      menu: SideBarMenuPopUpCompany,
      securityObject: SideBarMenuItemsSecObjects.LinkCompanyMyCompanies,
    },
    {
      code: MenuCode.PymeHome,
      label: 'Mis Repositorios',
      icon: <LayersTwoToneIcon />,
      to: `/mis-empresas/${urlParam}`,
      disabled: !urlParam,
      children: true,
      securityObject: SideBarMenuItemsSecObjects.LinkCompanyRepository,
    },
    {
      code: MenuCode.Solicitations,
      label: 'Solicitudes Enviadas',
      icon: <ShoppingCartCheckoutIcon />,
      to: `/mis-solicitudes/${urlParam}`,
      disabled: !urlParam,
      children: true,
      securityObject: SideBarMenuItemsSecObjects.LinkCompanySolicitations,
    },
    {
      code: MenuCode.Library,
      label: 'Mi Biblioteca',
      icon: <LibraryBooksIcon />,
      to: `/biblioteca/${urlParam}`,
      disabled: !urlParam,
      children: true,
      securityObject: SideBarMenuItemsSecObjects.LinkCompanyLibrary,
    },
    {
      code: MenuCode.PublicInfo,
      label: 'Información Pública',
      icon: <QueryStatsIcon />,
      to: `/bureau/${urlParam}/detalle`,
      disabled: !urlParam,
      children: true,
      securityObject: SideBarMenuItemsSecObjects.LinkCompanyBureau,
    }
  ];
};

const listItemsMenuOffererHome: ItemMenuType[] = [
  {
    code: MenuCode.OffererHome,
    label: 'Mi LUC',
    icon: <GamesTwoTone />,
    to: '/offerer/home',
  },
  {
    code: MenuCode.OffererLines,
    label: 'ABM de líneas',
    icon: <ListAltTwoTone />,
    to: '/offerer/lines',
    securityObject: SideBarMenuItemsSecObjects.LinkOffererLines,
  },
  {
    code: MenuCode.OffererSolicitations,
    label: 'Solicitudes',
    icon: <InboxTwoTone />,
    to: '/offerer/solicitations',
    securityObject: SideBarMenuItemsSecObjects.LinkOffererSolicitations,
  },
  {
    code: MenuCode.OffererProspects,
    label: 'Base de PyMEs',
    icon: <ManageSearchTwoTone />,
    to: '/offerer/clientPortfolio',
    securityObject: SideBarMenuItemsSecObjects.LinkOffererProspects
  },
  {
    code: MenuCode.OffererLibrary,
    label: 'Biblioteca de Archivos',
    icon: <InsertDriveFileTwoTone />,
    to: '/offerer/documentation',
    securityObject: SideBarMenuItemsSecObjects.LinkOffererLibrary,
  },
  {
    code: MenuCode.OffererSummary,
    label: 'ABM de usuarios',
    icon: <ManageAccountsTwoToneIcon />,
    to: '/offerer/summary',
    securityObject: SideBarMenuItemsSecObjects.LinkOffererUserMnagement,
  },
  {
    code: MenuCode.OffererTemplates,
    label: 'Listado de Documentos',
    icon: <CollectionsBookmarkTwoToneIcon />,
    to: '/offerer/templates',
    securityObject: SideBarMenuItemsSecObjects.LinkOffererDocumentTemplates,
  },
  {
    code: MenuCode.OffererReports,
    label: 'Reportes',
    icon: <AssessmentTwoTone />,
    to: '/offerer/reports',
    securityObject: SideBarMenuItemsSecObjects.LinkOffererReports,
  },
  {
    code: MenuCode.OffererIntegration,
    label: "Integración",
    icon: <IntegrationInstructionsTwoToneIcon/>,
    to: '/offerer/integration',
    securityObject: SideBarMenuItemsSecObjects.LinkOffererIntegration,
  },
];

const listItemsMenuInternalHome: ItemMenuType[] = [
  {
    code: MenuCode.InternalHome,
    label: 'Oferentes',
    icon: <AccountBalanceTwoTone />,
    to: '/internal/home',
  },
  {
    code: MenuCode.InternalCompanies,
    label: 'Usuarios PyME',
    icon: <FactoryTwoTone />,
    to: '/internal/companies'
  },
  {
    code: MenuCode.InternalLines,
    label: 'Líneas',
    icon: <ViewListTwoTone />,
    to: '/internal/lines',
  },
  {
    code: MenuCode.InternalParameters,
    label: 'Parametrización de Productos',
    icon: <MediationTwoTone />,
    to: '/internal/parameters',
  },
  {
    code: MenuCode.InternalSelectedLines,
    label: 'Líneas destacadas',
    icon: <ViewListTwoTone />,
    to: '/internal/selected-lines',
  },
  {
    code: MenuCode.InternalAdminProfile,
    label: 'Perfiles',
    icon: <AdminPanelSettingsTwoTone />,
    to: '/internal/admin/profile',
  },
  {
    code: MenuCode.InternalVerifyPerson,
    label: 'Validación de Personas',
    icon: <VerifiedTwoToneIcon />,
    to: '/internal/persons',
  },
  {
    code: MenuCode.InternalReports,
    label: 'Reportes',
    icon: <AssessmentTwoTone />,
    to: '/internal/reports'
  },
  {
    code: MenuCode.MailTemplates,
    label: 'Plantillas de mails',
    icon: <MailIcon />,
    to: '/internal/mails'
  },
  {
    code: MenuCode.InternalSolicitations,
    label: 'Solicitudes',
    icon: <ShoppingCartCheckoutIcon />,
    to: '/internal/solicitations'
  },
  {
    code: MenuCode.InternalAds,
    label: 'Publicidades',
    icon: <AdsClickTwoTone />,
    to: '/internal/ads'
  },
  {
    code: MenuCode.InternalAllUsers,
    label: 'Todos los usuarios',
    icon: <PeopleTwoTone />,
    to: '/internal/allUsers'
  }
];

export const ListMenuTypeByLayoutType: Record<
  MenuLayoutType,
  ItemMenuType[] | (() => ItemMenuType[])
> = {
  [MenuLayoutType.Home]: listItemsMenuHome,
  [MenuLayoutType.OffererHome]: listItemsMenuOffererHome,
  [MenuLayoutType.InternalHome]: listItemsMenuInternalHome,
};
