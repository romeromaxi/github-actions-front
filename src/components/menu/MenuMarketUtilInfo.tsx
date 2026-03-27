import React, {useMemo, useState} from "react";
import {Box, Menu, MenuItem, Stack, Typography, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import {WrapperIcons} from "../icons/Icons";
import {Info} from "@phosphor-icons/react";
import {AppBarButton} from "../buttons/HomeButtons";
import {useLocation} from "react-router-dom";
import MenuHomeStyles from "./MenuHome.styles";
import {AppRoutesDefinitions, useAppNavigation} from "../../hooks/navigation";

interface MenuMarketUtilInfoProps {
    mobileView?: boolean;
}

const MenuMarketUtilInfo = ({mobileView}: MenuMarketUtilInfoProps) => {
    const classes = MenuHomeStyles();
    const { navigate } = useAppNavigation();
    const location = useLocation();
    
    const [usefulInfo, setUsefulInfoRef] = useState<HTMLElement | null>(null);
    const openUsefulInfo = Boolean(usefulInfo);
    const theme = useTheme()
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'))

    const classNameButton = useMemo(() => {
        if (location.pathname.startsWith('/ayuda'))
            return classes.selectedAppBarButton;

        return undefined;
    }, [location]);
    
    const onOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => setUsefulInfoRef(event.currentTarget);

    const onCloseMenu = () => setUsefulInfoRef(null);

    const onClickAboutLuc = () => navigate(AppRoutesDefinitions.LucAboutPage);

    const onClickSoluctionsLuc = () => navigate(AppRoutesDefinitions.LucSolutionsForPymesPage);
    
    const onClickFAQ = () => navigate(AppRoutesDefinitions.LucFAQPage);
    
    const onClickInstructives = () => navigate(AppRoutesDefinitions.LucInstructivePage);
    
    return (
        <React.Fragment>
            {
                (isMediumScreen || mobileView) ?
                    <MenuItem onClick={onOpenMenu} color={'black !important'} disableRipple>
                        <Stack direction='row' alignItems='center'>
                            <WrapperIcons Icon={Info} />
                            <Typography sx={{paddingLeft: 1}}>Información Sobre LUC</Typography>
                        </Stack>
                    </MenuItem>
                    :
                    <AppBarButton className={classNameButton} onClick={onOpenMenu}>
                        Información Sobre LUC
                    </AppBarButton>
            }
            <Menu
                id="useful-info-menu"
                anchorEl={usefulInfo}
                open={openUsefulInfo}
                onClick={onCloseMenu}
                onClose={onCloseMenu}
            >
                <MenuItem onClick={onClickAboutLuc} disableRipple>
                    <Box>¿Qué es LUC?</Box>
                </MenuItem>
                <MenuItem onClick={onClickSoluctionsLuc} disableRipple>
                    <Box>Soluciones para tu Empresa</Box>
                </MenuItem>
                <MenuItem onClick={onClickFAQ} disableRipple>
                    <Box>Preguntas Frecuentes</Box>
                </MenuItem>
                <MenuItem onClick={onClickInstructives} disableRipple>
                    <Box>Instructivos</Box>
                </MenuItem>
            </Menu>
        </React.Fragment>
    )
}


export default MenuMarketUtilInfo