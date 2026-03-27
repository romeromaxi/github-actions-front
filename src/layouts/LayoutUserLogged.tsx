import React, {useEffect, useMemo, useContext} from "react";
import {Box, Button, Container} from "@mui/material";
import {Outlet, useParams} from "react-router-dom";
import ScrollTop from "./home/ScrollTop";
import {AppBarBase} from "../components/appbar/AppBarBase";
import {Building2Icon, HomeIcon, SendIcon, StoreIcon, LayoutListIcon, BookUserIcon, Settings2Icon} from "lucide-react";
import {useUser} from "../hooks/contexts/UserContext";
import {Module} from "../types/form/login/login-enum";
import {useAppNavigation} from "../hooks/navigation";
import {PymeRoute} from "../routes/pyme/routeAppPymeData";
import {OffererRoute} from "../routes/offerer/routeAppOffererData";
import {InternalRoute} from "../routes/internal/routeAppInternalData";
import {MarketRoute} from "../routes/market/routeAppMarketData";
import {useAction} from "../hooks/useAction";
import LayoutUserNotLogged, {LayoutUserNotLoggedProps} from "./LayoutUserNotLogged";
import {ApplicationCommonTopContentType, useApplicationCommon} from "../hooks/contexts/ApplicationCommonContext";
import {SafetyComponent} from "../components/security";
import {AppRouteSecObjects, SecurityComponents, SideBarMenuItemsSecObjects} from "types/security";
import useSecurityObject from "../hooks/useSecurityObject";
import {LayoutCommonProps} from "./LayoutCommonProps";
import { OffererContext } from "../pages/offerer/components/OffererContextProvider";
import OffererLogo from "../pages/offerer/components/OffererLogo";
import { OffererViewDTOFields } from "../types/offerer/offererData";
import { EntityWithIdFields } from "../types/baseEntities";

export enum LayoutUserLoggedSections {
    Idle,
    CompanyHome,
    CompanySolicitations,
    OffererHome,
    OffererSolicitations,
    OffererProducts,
    OffererUserBase,
    OffererConfiguration,
    InternalHome,
    InternalSolicitations,
    InternalCompanies,
    FAQLuc,
    ContactLuc,
    BlogLuc,
    GlossaryLuc,
    Market
}

interface LayoutUserLoggedProps extends LayoutCommonProps {
    sectionActive?: LayoutUserLoggedSections,
    notLoggedProps?: LayoutUserNotLoggedProps,
}

function LayoutUserLogged({
                              children,
                              fullBanner,
                              sectionActive,
                              notLoggedProps,
                              topContent = ApplicationCommonTopContentType.Normal
                          }: LayoutUserLoggedProps) {
    const {isLoggedIn, user} = useUser();
    const {getPaddingTopContent} = useApplicationCommon();
    const userModule = useMemo(() => user?.userType, [user]);
    const offerer = useContext(OffererContext);
    const bannerTopContent = useMemo(() => (
        !!fullBanner ? getPaddingTopContent(topContent) : 0
    ), [fullBanner, topContent, getPaddingTopContent]);

    const finalTopContent = useMemo(() => (
        getPaddingTopContent(topContent, !!fullBanner)
    ), [fullBanner, topContent, getPaddingTopContent]);

    const params = useParams();
    const companyId: number = parseInt(params.companyId ?? '');
    const {setCompany} = useAction();
    useEffect(() => {
        if (companyId) {
            setCompany(companyId);
        }
    }, [companyId, setCompany]);
    
    const offererLogoSuffix = useMemo(() => {
        if (userModule === Module.Offerer && offerer && offerer[EntityWithIdFields.Id]) {
            return (
                <OffererLogo 
                    offererId={offerer[EntityWithIdFields.Id]}
                    offererUrlLogo={offerer[OffererViewDTOFields.OffererUrlLogo]}
                    size={36}
                    sx={{ height: 36, width: 'auto', maxWidth: 80 }}
                />
            );
        }
        return undefined;
    }, [userModule, offerer]);
    
    if (!isLoggedIn)
        return (
            <LayoutUserNotLogged fullBanner={fullBanner}
                                 topContent={topContent}
                                 {...notLoggedProps}
            >
                {children}
            </LayoutUserNotLogged>
        );

    return (
        <Box sx={{ position: 'relative' }}>
            {
                fullBanner &&
                    <Box pt={bannerTopContent}>
                        {fullBanner}
                    </Box>
            }

            <Container>
                <AppBarBase showUserAvatar
                            showNotifications
                            showUsefulInformation
                            logoSuffix={offererLogoSuffix}
                >
                    <AppBarBase.Left>
                        <LayoutUserLoggedLeftPanel sectionActive={sectionActive} />
                    </AppBarBase.Left>
                </AppBarBase>
                
                <Box pt={finalTopContent} pb={4}>
                    {children}
                    <Outlet/>
                </Box>
            </Container>

            <ScrollTop />
        </Box>
    )
}

function LayoutUserLoggedLeftPanel({sectionActive}: LayoutUserLoggedProps) {
    const { user } = useUser();
    const { navigate } = useAppNavigation();
    const { hasReadPermission } = useSecurityObject();
    const userModule = useMemo(() => user?.userType, [user]);
    
    const sectionsByModule = useMemo(() => {
        switch (userModule) {
            case Module.Company:
                return {
                    home: LayoutUserLoggedSections.CompanyHome,
                    solicitations: LayoutUserLoggedSections.CompanySolicitations
                }

            case Module.Offerer:
                return {
                    home: LayoutUserLoggedSections.OffererHome,
                    solicitations: LayoutUserLoggedSections.OffererSolicitations
                }

            case Module.Internal:
                return {
                    home: LayoutUserLoggedSections.InternalHome,
                    solicitations: LayoutUserLoggedSections.InternalSolicitations
                }

            default:
                return {
                    home: LayoutUserLoggedSections.Idle,
                    solicitations: LayoutUserLoggedSections.Idle
                }
        }
    }, [userModule]);
    
    const canViewSolicitationButton = useMemo(() => {
        switch (userModule) {
            case Module.Internal:
                return hasReadPermission(
                    SecurityComponents.AppRoutes,
                    AppRouteSecObjects.InternalSolicitationsRoute
                );

            case Module.Company:
            case Module.Offerer:
            default:
                return true
        }
    }, [userModule])

    const onViewHome = () => {
        switch (userModule) {
            case Module.Company:
                navigate(PymeRoute.PymeHome);
                return;
            case Module.Offerer:
                navigate(OffererRoute.OffererHome);
                return;
            case Module.Internal:
                navigate(InternalRoute.InternalHome);
                return;
        }
    }
    
    const onViewSolicitations = () => {
        switch (userModule) {
            case Module.Company:
                navigate(MarketRoute.MarketSolicitationList);
                return;
            case Module.Offerer:
                navigate(OffererRoute.OffererSolicitations);
                return;
            case Module.Internal:
                navigate(InternalRoute.InternalSolicitations);
                return;
        }
    }
    
    const onViewInternalCompanies = () => navigate(InternalRoute.InternalCompanies);
    
    const onViewMarket = () => navigate(MarketRoute.MarketLanding);

    const onViewOffererProducts = () => navigate(OffererRoute.OffererLines);

    const onViewOffererUserBase = () => navigate(OffererRoute.OffererProspects);

    const onViewOffererConfiguration = () => navigate(OffererRoute.OffererConfiguration);


    return (
        <React.Fragment>
            <Button variant={'appbar'}
                    size={'small'}
                    startIcon={<HomeIcon />}
                    active={sectionActive === sectionsByModule.home}
                    onClick={onViewHome}
            >
                Home
            </Button>

            {
                (userModule === Module.Internal) &&
                <SafetyComponent componentName={SecurityComponents.AppRoutes} 
                                 objectName={AppRouteSecObjects.InternalPymeUserListRoute}>
                    <Button variant={'appbar'}
                            size={'small'}
                            startIcon={<Building2Icon />}
                            active={sectionActive === LayoutUserLoggedSections.InternalCompanies}
                            onClick={onViewInternalCompanies}
                    >
                        Usuarios PyME
                    </Button>
                </SafetyComponent>
            }

            {
                canViewSolicitationButton && (
                    <Button variant={'appbar'}
                            size={'small'}
                            startIcon={<SendIcon />}
                            active={sectionActive === sectionsByModule.solicitations}
                            onClick={onViewSolicitations}
                    >
                        Solicitudes
                    </Button>
                )
            }

            {
                (userModule === Module.Offerer) && (
                    <>
                        <SafetyComponent componentName={SecurityComponents.SideBarMenuItems}
                                         objectName={SideBarMenuItemsSecObjects.LinkOffererLines}>
                            <Button variant={'appbar'}
                                    size={'small'}
                                    startIcon={<LayoutListIcon/>}
                                    active={sectionActive === LayoutUserLoggedSections.OffererProducts}
                                    onClick={onViewOffererProducts}
                            >
                                Productos
                            </Button>
                        </SafetyComponent>

                        <SafetyComponent componentName={SecurityComponents.SideBarMenuItems}
                                         objectName={SideBarMenuItemsSecObjects.LinkOffererProspects}>
                            <Button variant={'appbar'}
                                    size={'small'}
                                    startIcon={<BookUserIcon/>}
                                    active={sectionActive === LayoutUserLoggedSections.OffererUserBase}
                                    onClick={onViewOffererUserBase}
                            >
                                Base de Clientes
                            </Button>
                        </SafetyComponent>

                        <Button variant={'appbar'}
                                size={'small'}
                                startIcon={<Settings2Icon/>}
                                active={sectionActive === LayoutUserLoggedSections.OffererConfiguration}
                                onClick={onViewOffererConfiguration}
                        >
                            Configuración
                        </Button>
                    </>
                )
            }
            {
                (userModule !== Module.Offerer) && (
                    <Button variant={'appbar'}
                            size={'small'}
                            startIcon={<StoreIcon/>}
                            active={sectionActive === LayoutUserLoggedSections.Market}
                            onClick={onViewMarket}
                    >
                        Tienda LUC
                    </Button>
                )
            }
        </React.Fragment>
    )
}

export default LayoutUserLogged;