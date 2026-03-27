import React, { useContext } from "react";
import { Skeleton } from "@mui/material";
import {NavsTabVertical} from "components/navs/NavsTab";
import NavsTabVerticalHeaderBase from "components/navs/NavsTabVerticalHeaderBase";
import { FileStackIcon, FolderIcon, PaperclipIcon } from "lucide-react";
import {HomeCompanyPageContext} from "../HomeCompanyPage";
import CompanyLibraryPage from "../library/CompanyLibraryPage";
import {SecurityComponents, SideBarMenuItemsSecObjects } from "types/security";
import CompanyCustomLibraryPage from "../library/custom/CompanyCustomLibraryPage";
import {EntityWithIdFields} from "types/baseEntities";
import CompanyStatusVerificationCard from "../components/home/CompanyStatusVerificationCard";

function HomeCompanyPageLibraryTab() {
    const { company } = useContext(HomeCompanyPageContext);
    
    const HeaderTab = () => (
        <NavsTabVerticalHeaderBase title={'Documentos'} 
                                   Icon={PaperclipIcon} 
                                   description={'Gestioná tus documentos, mantenelos en carpetas y accedé a ellos cuando lo necesites.'} />
    )
    
    return (
        <NavsTabVertical header={<HeaderTab />}
                         headerTab={<CompanyStatusVerificationCard marginBottom={2} />}
                         lstTabs={[{ tabList: [
                                 {
                                     label: 'Todos los documentos',
                                     content: company ? <CompanyLibraryPage company={company} /> : <Skeleton />,
                                     securityObject: SideBarMenuItemsSecObjects.LinkCompanyLibrary,
                                     securityComponent: SecurityComponents.SideBarMenuItems,
                                     queryParam: 'library',
                                     id: "company-library-tab",
                                     icon: <FileStackIcon />,
                                     iconPosition: 'start',
                                     default: true
                                 },
                                 {
                                     label: 'Carpetas personalizadas',
                                     content: company ? <CompanyCustomLibraryPage companyId={company[EntityWithIdFields.Id]} /> : <Skeleton />,
                                     securityObject: SideBarMenuItemsSecObjects.LinkCompanyLibrary,
                                     securityComponent: SecurityComponents.SideBarMenuItems,
                                     queryParam: 'customFolders',
                                     id: "company-custom-folders-tab",
                                     icon: <FolderIcon />,
                                     iconPosition: 'start'
                                 }
                             ] }]} 
                         tabSize={3.6}
                         insideOtherTabs
                         alwaysSomeActiveTab
        />
    )
}

export default HomeCompanyPageLibraryTab;