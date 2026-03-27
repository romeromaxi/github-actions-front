import {useTheme} from "@mui/material/styles";
import React, {Fragment, useMemo} from "react";
import {useUser} from "../../../hooks/contexts/UserContext";
import MenuMarketAssistedSearch from "../MenuMarketAssistedSearch";
import MenuMarketCategories from "../MenuMarketCategories";
import {AppRoutesDefinitions, useAppNavigation} from "../../../hooks/navigation";
import {MarketRoute} from "../../../routes/market/routeAppMarketData";
import {Button, MenuItem, Stack, Typography, useMediaQuery} from "@mui/material";
import {useLocation} from "react-router-dom";

interface BurgerMenuOptionsProps {
    inMarket?: boolean,
    children?: React.ReactNode,
    onCloseMenu: () => void
}

function BurgerMenuOptions({ inMarket, children, onCloseMenu }: BurgerMenuOptionsProps) {
    const location = useLocation();
    const theme = useTheme();
    const { isLoggedIn } = useUser();
    const { navigate } = useAppNavigation();
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const isMediumLargeScreen = useMediaQuery(theme.breakpoints.down(1440));

    const currentPath = useMemo(() => location.pathname || "", [location]);

    const sectionAboutLucActive = useMemo(() => currentPath === (window?.URL_ABOUT_LUC || "null"), [currentPath]);

    const sectionFAQActive = useMemo(() => currentPath === (window?.URL_FAQ_LUC|| "null"), [currentPath]);

    const sectionContactActive = useMemo(() => currentPath === (window?.URL_CONTACT_LUC|| "null"), [currentPath]);
    
    const goToMarketLanding = () => {
        navigate(MarketRoute.MarketLanding);
        onCloseMenu();
    }
    
    const goToAboutLuc = () => {
        navigate(AppRoutesDefinitions.LucAboutPage);
        onCloseMenu();
    }

    const goToFAQLuc = () => {
        navigate(AppRoutesDefinitions.LucFAQPage);
        onCloseMenu();
    }

    const goToContactLuc = () => {
        navigate(AppRoutesDefinitions.LucContactPage);
        onCloseMenu();
    }
    
    const stylesMenuItem = {
        '&:hover': {
            backgroundColor: 'transparent !important',
            color: `${theme.palette.primary.main} !important`
        },
    }
    
    const MenuInMarket = (
        <Fragment>
            <MenuMarketAssistedSearch mobileView />
            <MenuMarketCategories title={"Búsqueda por Productos"}
                                  onNavigate={(_) => {}}
                                  onAfterClick={onCloseMenu}
                                  mobileView
            />
        </Fragment>
    )
    
    return (
        <React.Fragment>
            {
                ((isLoggedIn && isMediumScreen) || (!isLoggedIn && isMediumLargeScreen)) &&
                    <React.Fragment>
                        {
                            (isLoggedIn && inMarket) &&
                                MenuInMarket
                        }
                        
                        <MenuItem onClick={goToAboutLuc}
                                  sx={{ ...stylesMenuItem, color: sectionAboutLucActive ? `${theme.palette.primary.main} !important`: '' }}
                        >
                            <Stack direction='row' alignItems='center' justifyContent={'center'} width={1}>
                                <Typography variant={'subtitle2'} fontWeight={500} sx={{paddingLeft: 1}}>
                                    Sobre LUC
                                </Typography>
                            </Stack>
                        </MenuItem>
                        <MenuItem onClick={goToFAQLuc}
                                  sx={{ ...stylesMenuItem, color: sectionFAQActive ? `${theme.palette.primary.main} !important`: '' }}
                        >
                            <Stack direction='row' alignItems='center' justifyContent={'center'} width={1}>
                                <Typography variant={'subtitle2'} fontWeight={500} sx={{paddingLeft: 1}}>
                                    Preguntas Frecuentes
                                </Typography>
                            </Stack>
                        </MenuItem>
                        <MenuItem onClick={goToContactLuc}
                                  sx={{ ...stylesMenuItem, color: sectionContactActive ? `${theme.palette.primary.main} !important`: '' }}
                        >
                            <Stack direction='row' alignItems='center' justifyContent={'center'} width={1}>
                                <Typography variant={'subtitle2'} fontWeight={500} sx={{paddingLeft: 1}}>
                                    Contacto
                                </Typography>
                            </Stack>
                        </MenuItem>

                        {
                            ((!isLoggedIn && isMediumScreen) || (isLoggedIn && isMediumScreen && !inMarket)) &&
                                <Button variant={'outlined'} color={'secondary'} size={'small'}
                                        onClick={goToMarketLanding}
                                        fullWidth
                                >
                                    Explorar Tienda LUC
                                </Button>
                        }
                    </React.Fragment>
            }

            {
                children && children
            }
        </React.Fragment>
    )
}

export default BurgerMenuOptions;