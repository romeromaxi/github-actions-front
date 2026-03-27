import {Box, Button, Container, useMediaQuery} from "@mui/material";
import {AppBarBase} from "../components/appbar/AppBarBase";
import {Outlet} from "react-router-dom";
import ScrollTop from "./home/ScrollTop";
import React, {startTransition, useMemo} from "react";
import {AppRoutesDefinitions, useAppNavigation} from "../hooks/navigation";
import { MarketRoute } from "routes/market/routeAppMarketData";
import {AppBarButton} from "../components/buttons/HomeButtons";
import MarketFooter from "./components/MarketFooter";
import {ApplicationCommonTopContentType, useApplicationCommon} from "../hooks/contexts/ApplicationCommonContext";
import {useTheme} from "@mui/material/styles";
import UsefulInformationButton, {UsefulInformationButtonVariant, UsefulInformationSectionActive} from "./home/components/UsefulInformationButton";
import {LayoutCommonProps} from "./LayoutCommonProps";

export enum LayoutUserNotLoggedSections {
    Home,
    AboutLuc,
    FAQLuc,
    ContactLuc,
    BlogLuc,
    GlossaryLuc,
    Market
}

export interface LayoutUserNotLoggedProps extends LayoutCommonProps {
    sectionActive?: LayoutUserNotLoggedSections,
    gridBackground?: boolean,
    hideFooter?: boolean
}

function LayoutUserNotLogged({ children, fullBanner, sectionActive, gridBackground, hideFooter, topContent = ApplicationCommonTopContentType.Normal }: LayoutUserNotLoggedProps) {
    const { getPaddingTopContent } = useApplicationCommon();

    const bannerTopContent = useMemo(() => (
        !!fullBanner ? getPaddingTopContent(topContent) : 0
    ), [fullBanner, topContent, getPaddingTopContent]);

    const finalTopContent = useMemo(() => (
        getPaddingTopContent(topContent, !!fullBanner)
    ), [fullBanner, topContent, getPaddingTopContent]);
        
    return (
        <Box className={gridBackground ? 'grid-background-body' : ''} 
             sx={{ position: 'relative' }}
        >
            {
                fullBanner &&
                <Box pt={bannerTopContent}>
                    {fullBanner}
                </Box>
            }
            
            <Container sx={{ minHeight: !hideFooter ? '69dvh' : '' }}>
                <AppBarBase showCreateUser
                            showLoginUser>
                    <AppBarBase.Left>
                        <LayoutUserNotLoggedLeftPanel sectionActive={sectionActive} />
                    </AppBarBase.Left>

                    <AppBarBase.Right>
                        <LayoutUserNotLoggedRightPanel />
                    </AppBarBase.Right>
                </AppBarBase>

                <Box pt={finalTopContent}>
                    {children}
                    <Outlet/>
                </Box>
            </Container>

            <ScrollTop />

            {!hideFooter && <MarketFooter/>}
        </Box>
    );
}

interface LayoutUserNotLoggedLeftPanelProps {
    sectionActive?: LayoutUserNotLoggedSections
}

function LayoutUserNotLoggedLeftPanel({sectionActive}: LayoutUserNotLoggedLeftPanelProps) {
    const { navigate } = useAppNavigation();
    
    const usefulInformationSectionActive = useMemo(() => {
        if (!sectionActive) return undefined;

        switch (sectionActive) {
            case LayoutUserNotLoggedSections.FAQLuc:
                return UsefulInformationSectionActive.FAQLuc;
            case LayoutUserNotLoggedSections.BlogLuc:
                return UsefulInformationSectionActive.BlogLuc;
            case LayoutUserNotLoggedSections.GlossaryLuc:
                return UsefulInformationSectionActive.GlossaryLuc;
                
            default:
                return undefined;
        }
    }, [sectionActive]);
    
    const goToAboutLuc = () =>
        startTransition(() => navigate(AppRoutesDefinitions.LucAboutPage));
    
    const goToContactLuc = () => 
        startTransition(() => navigate(AppRoutesDefinitions.LucContactPage));
    
    return (
        <React.Fragment>
            <AppBarButton onClick={goToAboutLuc} 
                          isActive={sectionActive === LayoutUserNotLoggedSections.AboutLuc}
            >
                Sobre LUC
            </AppBarButton>

            <AppBarButton onClick={goToContactLuc}
                          isActive={sectionActive === LayoutUserNotLoggedSections.ContactLuc}
            >
                Contacto
            </AppBarButton>

            <UsefulInformationButton variant={UsefulInformationButtonVariant.TextButton} 
                                     sectionActive={usefulInformationSectionActive}
            />
        </React.Fragment>
    )
}


function LayoutUserNotLoggedRightPanel() {
    const { navigate } = useAppNavigation();
    const theme = useTheme();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

    const titleButton = useMemo(() => (
        isMediumScreen ? "Tienda LUC" : "Explorar Tienda LUC"
    ), [isMediumScreen])
    
    const onNavigateMarketLanding = () => navigate(MarketRoute.MarketLanding);
    
    return (
        <React.Fragment>
            <Button variant={'outlined'} color={'secondary'} size={'small'}
                    onClick={onNavigateMarketLanding}
            >
                {titleButton}
            </Button>
        </React.Fragment>
    )
}

export default LayoutUserNotLogged;
