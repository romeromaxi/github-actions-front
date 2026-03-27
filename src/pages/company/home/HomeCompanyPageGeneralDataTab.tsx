import React, {Fragment, useContext, useState} from "react";
import {Button, Skeleton} from "@mui/material";
import {NavsTabVertical} from "components/navs/NavsTab";
import NavsTabVerticalHeaderBase from "components/navs/NavsTabVerticalHeaderBase";
import { BriefcaseIcon, ShareIcon } from "lucide-react";
import {HomeCompanyPageContext} from "../HomeCompanyPage";
import {SecurityComponents, SideBarMenuItemsSecObjects } from "types/security";
import MyCompanyTab from "../tabs/MyCompanyTab";
import CompanyActivityTab from "../tabs/CompanyActivityTab";
import { FlowUseContextProvider, FlowUseSourceType } from "hooks/contexts/FlowUseContext";
import FlowPage from "../flow/FlowPage";
import { BalancesContextProvider, BalancesSourceType } from "hooks/contexts/BalancesContext";
import FinancialYearList from "../finance/FinancialYearList";
import CompanyDeclarationOfAssetsList from "../finance/declarationAssets/CompanyDeclarationOfAssetsList";
import { RelatedPersonContextProvider, RelatedPersonSourceType } from "hooks/contexts/RelatedPersonContext";
import RelatedPersonTable from "../relatedPeople/RelatedPersonTable";
import CompanyStatusVerificationCard from "../components/home/CompanyStatusVerificationCard";
import {WrapperIcons} from "../../../components/icons/Icons";
import CompanyHomeGeneralDataExportDialog from "../components/home/CompanyHomeGeneralDataExportDialog";

function HomeCompanyPageGeneralDataTab() {
    const { companyId, company, isLegalPerson, reloadCompany } = useContext(HomeCompanyPageContext);
    const [open, setOpen] = useState<boolean>(false);
    
    const HeaderTab = () => (
        <NavsTabVerticalHeaderBase title={'Datos'} 
                                   Icon={BriefcaseIcon} 
                                   description={'Gestioná tu información y reutilizala en cualquier gestión.'} />
    )
    
    const handleExportData = () => {
        setOpen(true);
    }
    
    return (
        <Fragment>
            <NavsTabVertical header={<HeaderTab />}
                             headerTab={<CompanyStatusVerificationCard marginBottom={2} />}
                             actionInside={
                <Button variant="outlined" color="secondary" startIcon={<WrapperIcons Icon={ShareIcon} /> } fullWidth onClick={handleExportData}>
                                 Exportar Datos
                </Button>}
                             lstTabs={[{ tabList: [
                                     {
                                         label: 'General',
                                         content: company ? <MyCompanyTab company={company} onReload={reloadCompany} /> : <Skeleton />,
                                         securityObject: SideBarMenuItemsSecObjects.LinkCompanyRepository,
                                         securityComponent: SecurityComponents.SideBarMenuItems,
                                         queryParam: 'generalData',
                                         id: "company-general-data-tab",
                                         default: true
                                     },
                                     {
                                         label: 'Actividad',
                                         content: company ? <CompanyActivityTab company={company} onReload={reloadCompany} /> : <Skeleton />,
                                         securityObject: SideBarMenuItemsSecObjects.LinkCompanyRepository,
                                         securityComponent: SecurityComponents.SideBarMenuItems,
                                         queryParam: 'activity',
                                         id: "company-activity-tab",
                                     },
                                     {
                                         label: 'Compras/ventas post balance',
                                         content: (
                                             <FlowUseContextProvider dataId={companyId ?? 0} dataSource={FlowUseSourceType.Company}>
                                                 <FlowPage dataId={companyId ?? 0} isLegalPerson={isLegalPerson} />
                                             </FlowUseContextProvider>
                                         ),
                                         securityObject: SideBarMenuItemsSecObjects.LinkCompanyRepository,
                                         securityComponent: SecurityComponents.SideBarMenuItems,
                                         queryParam: 'economicFinancial',
                                         id: "company-eco-financial-tab",
                                     },
                                     (
                                         isLegalPerson ?
                                             ({
                                                 label: 'Estados Contables',
                                                 content:
                                                     <BalancesContextProvider dataId={companyId ?? 0} dataSource={BalancesSourceType.Company}>
                                                         <FinancialYearList dataId={companyId ?? 0} dataSource={BalancesSourceType.Company}/>
                                                     </BalancesContextProvider>,
                                                 queryParam: 'financialStatements',
                                                 securityObject: SideBarMenuItemsSecObjects.LinkCompanyRepository,
                                                 securityComponent: SecurityComponents.SideBarMenuItems,
                                                 id: "company-accountable-states-tab"
                                             })
                                             :
                                             ({
                                                 label: 'Manifestación de Bienes',
                                                 content: <CompanyDeclarationOfAssetsList />,
                                                 queryParam: 'manifestationAssets',
                                                 securityObject: SideBarMenuItemsSecObjects.LinkCompanyRepository,
                                                 securityComponent: SecurityComponents.SideBarMenuItems,
                                                 id: "company-declaration-of-assets-tab"
                                             })
                                     ),
                                     {
                                         label: 'Personas Relacionadas',
                                         content: (
                                             <RelatedPersonContextProvider dataId={companyId ?? 0} dataSource={RelatedPersonSourceType.Company}>
                                                 <RelatedPersonTable legalPerson={isLegalPerson} />
                                             </RelatedPersonContextProvider>
                                         ),
                                         securityObject: SideBarMenuItemsSecObjects.LinkCompanyRepository,
                                         securityComponent: SecurityComponents.SideBarMenuItems,
                                         queryParam: 'relatedPeople',
                                         id: "company-related-people-tab"
                                     },
                                     {
                                         label: 'Bienes Relacionados',
                                         content: <div />,
                                         queryParam: 'customFolders',
                                         id: "company-custom-folders-tab",
                                         disabled: true,
                                         tooltip: 'Próximamente...'
                                     }
                                 ] }]} 
                             tabSize={3.6}
                             insideOtherTabs
                             alwaysSomeActiveTab
            />
            <CompanyHomeGeneralDataExportDialog open={open}
                                                onClose={() => setOpen(false)}
                                                companyId={companyId ?? 0}
            />
        </Fragment>
    )
}

export default HomeCompanyPageGeneralDataTab;