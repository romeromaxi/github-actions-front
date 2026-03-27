import React, {useEffect, useState} from 'react';
import {Box, Container, Stack} from '@mui/material';
import {CompanyFileCompletenessView, CompanyViewDTO, CompanyViewDTOFields} from 'types/company/companyData';
import {HttpCompany} from 'http/company/httpCompany';
import {NavsTabInsideAppBar} from 'components/navs/NavsTab';
import {CompanyHeaderSecObjects, SecurityComponents, SideBarMenuItemsSecObjects} from "types/security";
import {BureauInformationContextProvider, BureauInformationSourceType} from "hooks/contexts/BureauInformationContext";
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";
import ScrollTop from "layouts/home/ScrollTop";
import {
    BriefcaseIcon,
    ChartSplineIcon,
    ClipboardIcon,
    PaperclipIcon,
    ScanEyeIcon,
    SendIcon,
    UsersIcon
} from "lucide-react";
import HomeCompanyPageLibraryTab from "./home/HomeCompanyPageLibraryTab";
import HomeCompanyPageBureauTab from "./home/HomeCompanyPageBureauTab";
import HomeCompanyPageUserManagementTab from "./home/HomeCompanyPageUserManagementTab";
import HomeCompanyPageSolicitationsTab from "./home/HomeCompanyPageSolicitationsTab";
import useSecurityObject from 'hooks/useSecurityObject';
import {useModuleNavigate} from 'hooks/useModuleNavigate';
import {Module} from "../../types/form/login/login-enum";
import HomeCompanyPageSummaryTab from "./home/HomeCompanyPageSummaryTab";
import { useUser } from 'hooks/contexts/UserContext';
import HomeCompanyPageGeneralDataTab from "./home/HomeCompanyPageGeneralDataTab";
import HomeCompanyPageCompanyFileTab from "./home/HomeCompanyPageCompanyFileTab";
import {useLoaderActions} from "../../hooks/useLoaderActions";
import CompanyUserSelector from './components/CompanyUserSelector';
import { CompanyHeaderAction } from './components/CompanyHeader';
import {PersonTypes} from "../../types/person/personEnums";

const TAB_SIZE_DEFAULT: number = 3.6;

type HomeCompanyPageContextType = {
    companyId?: number,
    company?: CompanyViewDTO,
    companyCompleteness?: CompanyFileCompletenessView,
    isLegalPerson: boolean,
    reloadCompany: () => void,
    tabSize: number
}

export const HomeCompanyPageContext = React.createContext<HomeCompanyPageContextType>({
    companyId: undefined as number | undefined,
    company: undefined as CompanyViewDTO | undefined,
    companyCompleteness: undefined as CompanyFileCompletenessView | undefined,
    isLegalPerson: false as boolean,
    reloadCompany: () => { },
    tabSize: TAB_SIZE_DEFAULT
})

function HomeCompanyPage() {
    const { hasReadPermission } = useSecurityObject();  
    const { showLoader, hideLoader } = useLoaderActions();
    const { companyId } = useApplicationCommon();
    const navigate = useModuleNavigate();
    const { user } = useUser();
    
    const [company, setCompany] = useState<CompanyViewDTO>();
    const [companyCompleteness, setCompanyCompleteness] = useState<CompanyFileCompletenessView>();
    
    const loadCompany = () => {
        showLoader();
        setCompany(undefined);
        if (companyId){
            Promise.all([
                HttpCompany.getCompanyById(companyId),
                HttpCompany.getCompletenessPercentage(companyId),
            ])
                .then(([responseCompany, responseFileCompleteness]) => {
                    setCompany(responseCompany);
                    setCompanyCompleteness(responseFileCompleteness);
                    hideLoader();
                })
        }
    }
    
    useEffect(() => {
        const sidebarComponent = SecurityComponents.SideBarMenuItems;
        if (
            !hasReadPermission(sidebarComponent, SideBarMenuItemsSecObjects.LinkCompanySolicitations) &&
            !hasReadPermission(sidebarComponent, SideBarMenuItemsSecObjects.LinkCompanyBureau) &&
            !hasReadPermission(sidebarComponent, SideBarMenuItemsSecObjects.LinkCompanyRepository) &&
            !hasReadPermission(sidebarComponent, SideBarMenuItemsSecObjects.LinkCompanyLibrary)
        ) {
            navigate(user?.userType || Module.Market);
        }
    }, []);
    
    useEffect(() => {
        loadCompany();
    }, [companyId]);
    
  return (
      <Box sx={{ position: 'relative' }}>
          <Container>
              <HomeCompanyPageContext.Provider value={{
                  companyId: companyId,
                  company: company,
                  companyCompleteness: companyCompleteness,
                  isLegalPerson: company?.[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Legal,
                  reloadCompany: loadCompany,
                  tabSize: TAB_SIZE_DEFAULT
              }}>
                  <BureauInformationContextProvider dataId={companyId}
                                                    dataSource={BureauInformationSourceType.Company}>
                      <NavsTabInsideAppBar title={'Detalle de tu PyME'}
                                           tabAction={
                                               <Stack direction="row" alignItems="center" spacing={2}
                                                      pt={{ xs: '16px !important', md: '0px !important' }}
                                               >
                                                   <Box minWidth={{ xs: 'auto', md: '300px' }}
                                                        maxWidth={{ xs: 'auto', md: '300px' }}
                                                   >
                                                       <CompanyUserSelector companyId={companyId} />
                                                   </Box>
                                               </Stack>
                                           }
                                           tabList={[
                                               {
                                                   label: "Resumen",
                                                   content: <HomeCompanyPageSummaryTab />,
                                                   id: "company-summary-tab",
                                                   queryParam: "summary",
                                                   icon: <ChartSplineIcon />,
                                                   default: true
                                               },
                                               {
                                                   label: "Legajo",
                                                   content: <HomeCompanyPageCompanyFileTab />,
                                                   id: "company-file-tab",
                                                   queryParam: "company-file",
                                                   icon: <ClipboardIcon />,
                                                   alwaysRender: true
                                               },
                                               {
                                                   label: "Datos",
                                                   content: <HomeCompanyPageGeneralDataTab />,
                                                   id: "company-general-data-tab",
                                                   queryParam: "generalData",
                                                   securityObject: SideBarMenuItemsSecObjects.LinkCompanyRepository,
                                                   securityComponent: SecurityComponents.SideBarMenuItems,
                                                   icon: <BriefcaseIcon />
                                               },
                                               {
                                                   label: "Documentos",
                                                   content: <HomeCompanyPageLibraryTab />,
                                                   id: "company-library-tab",
                                                   queryParam: "library",
                                                   icon: <PaperclipIcon />,
                                                   securityObject: SideBarMenuItemsSecObjects.LinkCompanyLibrary,
                                                   securityComponent: SecurityComponents.SideBarMenuItems,
                                               },
                                               {
                                                   label: "Ver cómo me ven",
                                                   content: <HomeCompanyPageBureauTab />,
                                                   id: "company-bureau-tab",
                                                   queryParam: "bureau",
                                                   securityObject: SideBarMenuItemsSecObjects.LinkCompanyBureau,
                                                   securityComponent: SecurityComponents.SideBarMenuItems,
                                                   icon: <ScanEyeIcon />
                                               },
                                               {
                                                   label: "Solicitudes",
                                                   content: <HomeCompanyPageSolicitationsTab />,
                                                   id: "company-sent-solicitations-tab",
                                                   queryParam: "sentSolicitations",
                                                   icon: <SendIcon />,
                                                   securityObject: SideBarMenuItemsSecObjects.LinkCompanySolicitations,
                                                   securityComponent: SecurityComponents.SideBarMenuItems,
                                               },
                                               {
                                                   label: "Gestión de usuarios",
                                                   content: <HomeCompanyPageUserManagementTab />,
                                                   id: "company-roles-tab",
                                                   queryParam: "roles",
                                                   securityObject: CompanyHeaderSecObjects.ViewRolesButton,
                                                   securityComponent: SecurityComponents.CompanyHeader,
                                                   icon: <UsersIcon />
                                               }
                                           ]}
                                           alwaysSomeActiveTab
                                           titleAction={company ? <CompanyHeaderAction company={company} /> : null}
                      />
                  </BureauInformationContextProvider>
              </HomeCompanyPageContext.Provider>
          </Container>

          <ScrollTop />
      </Box>
  );
}

export default HomeCompanyPage;
