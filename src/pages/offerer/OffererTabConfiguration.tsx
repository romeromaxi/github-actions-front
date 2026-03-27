import MyLucOfferer from "./components/MyLucOfferer";
import {SecurityComponents, SideBarMenuItemsSecObjects} from "../../types/security";
import HomeOffererReports from "./reports/HomeOffererReports";
import HomeOffererDocumentation from "./home/HomeOffererDocumentation";
import UserPersonalDataTabContent from "../user/PersonalData/UserPersonalDataTabContent";
import React from "react";
import {INavTab} from "../../components/navs/NavsTab";
import HomeOffererTemplates from "pages/offerer/templates/HomeOffererTemplates";
import OffererIntegration from "pages/offerer/integration/OffererIntegration";
import {
    FilesIcon,
    LinkIcon,
    PaperclipIcon,
    SquareActivityIcon,
    UserRoundCogIcon,
    UsersRoundIcon
} from "lucide-react";
import {WrapperIcons} from "../../components/icons/Icons";

export const offererTabs: INavTab[] = [
    /*{
        default: true,
        label: 'ABM de Líneas',
        content: <HomeOffererLine />,
        queryParam: 'lines',
        securityComponent: SecurityComponents.SideBarMenuItems,
        securityObject: SideBarMenuItemsSecObjects.LinkOffererLines
    },
    {
        label: 'Base por CUITs',
        content: <HomeOffererClientPortfolio />,
        queryParam: 'clientPortfolio',
        securityComponent: SecurityComponents.SideBarMenuItems,
        securityObject: SideBarMenuItemsSecObjects.LinkOffererProspects
    },*/
    {
        label: 'Archivos útiles',
        icon: <WrapperIcons Icon={PaperclipIcon} size={'md'} /> ,
        content: <HomeOffererDocumentation />,
        queryParam: 'documentation',
        securityComponent: SecurityComponents.SideBarMenuItems,
        securityObject: SideBarMenuItemsSecObjects.LinkOffererLibrary
    },
    {
        label: 'Listado de Documentación a Solicitar',
        icon: <WrapperIcons Icon={FilesIcon} size={'md'} />,
        content: <HomeOffererTemplates />,
        queryParam: 'templates',
        securityComponent: SecurityComponents.SideBarMenuItems,
        securityObject: SideBarMenuItemsSecObjects.LinkOffererDocumentTemplates
    },
    {
        label: 'Gestión de Usuarios',
        icon: <WrapperIcons Icon={UsersRoundIcon} size={'md'} />,
        content: <MyLucOfferer />,
        queryParam: 'usersSummary'
    },
    {
        label: 'Integraciones',
        icon: <WrapperIcons Icon={LinkIcon} size={'md'} />,
        content: <OffererIntegration />,
        queryParam: 'integration',
        securityComponent: SecurityComponents.SideBarMenuItems,
        securityObject: SideBarMenuItemsSecObjects.LinkOffererIntegration
    },
    {
        label: 'Reportes',
        icon: <WrapperIcons Icon={SquareActivityIcon} size={'md'} />,
        content: <HomeOffererReports />,
        queryParam: 'reports',
        securityComponent: SecurityComponents.SideBarMenuItems,
        securityObject: SideBarMenuItemsSecObjects.LinkOffererReports,
        disabled: true,
        tooltip: 'Próximamente...'
    },
    {
        label: 'Mi perfil de usuario',
        icon: <WrapperIcons Icon={UserRoundCogIcon} size={'md'} />,
        content: <UserPersonalDataTabContent />,
        queryParam: 'perfil'
    },
]