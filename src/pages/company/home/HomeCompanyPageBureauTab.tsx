import React, { useContext } from "react";
import {INavTab, NavsTabVertical} from "components/navs/NavsTab";
import NavsTabVerticalHeaderBase from "components/navs/NavsTabVerticalHeaderBase";
import { ScanEyeIcon } from "lucide-react";
import {HomeCompanyPageContext} from "pages/company//HomeCompanyPage";
import {SecurityComponents, SideBarMenuItemsSecObjects } from "types/security";
import CompanyBureauSummary from "pages/bureau/CompanyBureauSummary";
import CompanyBureauContributions from "pages/bureau/Contributions/CompanyBureauContributions";
import CompanyBureauTabWrapper from "pages/bureau/CompanyBureauTabWrapper";
import CompanyStatusVerificationCard from "../components/home/CompanyStatusVerificationCard";
import CompanyBureauQuerySelector from "pages/bureau/selector/CompanyBureauQuerySelector";
import ScoreTab from "pages/bureau/Score/ScoreTab";
import AfipBureauInfoTab from "pages/bureau/afip/AfipBureauInfoTab";
import DebtFinancialInfoTab from "../../bureau/BCRA/DebtFinancialInfoTab";
import BouncedChecksTab from "../../bureau/Cheques/BouncedChecksTab";
import {BalancesSourceType} from "../../../hooks/contexts/BalancesContext";
import BureauFinanceTab from "../../bureau/finance/BureauFinanceTab";

function HomeCompanyPageBureauTab() {
    const { companyId, isLegalPerson } = useContext(HomeCompanyPageContext);
    
    const HeaderTab = () => (
        <NavsTabVerticalHeaderBase title={'Ver cómo me ven'} 
                                   Icon={ScanEyeIcon} 
                                   description={'La información de tu empresa disponible en bases públicas y de bureau de crédito. LUC te acerca esa mirada para que entiendas cómo te evalúan.'}
                                   >
            <CompanyBureauQuerySelector companyId={companyId} />
        </NavsTabVerticalHeaderBase>
    )
    
    const tabList : INavTab[] = [
        {
            label: 'Resumen',
            content: <CompanyBureauSummary companyId={companyId} />,
            securityObject: SideBarMenuItemsSecObjects.LinkCompanyBureau,
            securityComponent: SecurityComponents.SideBarMenuItems,
            queryParam: 'bureauSummary',
            id: "company-bureau-summary-tab",
            default: true
        },
        {
            label: 'Información fiscal',
            content: <AfipBureauInfoTab />,
            securityObject: SideBarMenuItemsSecObjects.LinkCompanyBureau,
            securityComponent: SecurityComponents.SideBarMenuItems,
            queryParam: 'bureauGeneral',
            id: "company-fiscal-information-tab"
        },
        {
            label: 'Créditos en el sistema financiero',
            content: <DebtFinancialInfoTab />,
            securityObject: SideBarMenuItemsSecObjects.LinkCompanyBureau,
            securityComponent: SecurityComponents.SideBarMenuItems,
            queryParam: 'bureauBank',
            id: "company-financial-credits-tab"
        },
        {
            label: 'Cheques',
            content: <BouncedChecksTab />,
            securityObject: SideBarMenuItemsSecObjects.LinkCompanyBureau,
            securityComponent: SecurityComponents.SideBarMenuItems,
            queryParam: 'bureauChecks',
            id: "company-bureau-cheques-tab"
        },
        {
            label: 'Aportes previsionales',
            content:
                <CompanyBureauTabWrapper isPhysicalPerson={!isLegalPerson}>
                    <CompanyBureauContributions />
                </CompanyBureauTabWrapper>,
            securityObject: SideBarMenuItemsSecObjects.LinkCompanyBureau,
            securityComponent: SecurityComponents.SideBarMenuItems,
            queryParam: 'bureauContributions',
            id: "company-provisional-contributions-tab",
            disabled: true,
            tooltip: 'Próximamente...'
        },
        {
            label: 'Score crediticio',
            content: <ScoreTab />,
            securityObject: SideBarMenuItemsSecObjects.LinkCompanyBureau,
            securityComponent: SecurityComponents.SideBarMenuItems,
            queryParam: 'bureauScore',
            id: "company-bureau-score-tab"
        },
        {
            label: 'Indicadores financieros',
            content:
                <BureauFinanceTab dataId={companyId || 0}
                                  dataSource={BalancesSourceType.Company}
                />,
            securityObject: SideBarMenuItemsSecObjects.LinkCompanyBureau,
            securityComponent: SecurityComponents.SideBarMenuItems,
            queryParam: 'bureauFinance',
            id: "company-financial-indicators-tab"
        },
    ]
    
    return (
        <NavsTabVertical header={<HeaderTab />}
                         headerTab={<CompanyStatusVerificationCard marginBottom={2} />}
                         lstTabs={[{ tabList: tabList }]} 
                         tabSize={3.6}
                         insideOtherTabs
                         alwaysSomeActiveTab
        />
    )
}

export default HomeCompanyPageBureauTab;