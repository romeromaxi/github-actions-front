import {Outlet, useNavigate} from "react-router-dom";
import {AppBar, Box, Container, Stack, useMediaQuery, useTheme} from "@mui/material";
import React, {ReactNode, useEffect, useState} from "react";
import MenuHomeStyles from "../components/menu/MenuHome.styles";
import {useAction} from "../hooks/useAction"
import ScrollBottom from "./home/ScrollBottom";
import FailRedirectMarketDialog from "../pages/markets/home/components/FailRedirectMarketDialog";
import {
    AppConfig,
    AppConfigAppBarFields,
    AppConfigFields,
    AppConfigLogosFields,
    AppConfigSizeFields
} from "types/appConfigEntities";
import MenuHomeMarketButtons from "../components/menu/components/MenuHomeMarketButtons";
import BurgerMenu from "../components/menu/components/BurgerMenu";


interface LayoutContainerNotLoggedProps {
    children?: ReactNode
} 

const LayoutContainerNotLogged = (props: LayoutContainerNotLoggedProps) => {
    const appConfig : AppConfig = window.APP_CONFIG;
    const navigate = useNavigate();
    const classes = MenuHomeStyles();
    const [failRedirect, setFailRedirect] = useState<boolean>(false);
    
    const { setFnLoadAvatar } = useAction();

    const theme = useTheme();
    const isMediumScreenSize = useMediaQuery(theme.breakpoints.down("md"));
    
    useEffect(() => {
        setFnLoadAvatar(undefined);
    }, []);
    
    return (
        <Stack>
            <AppBar
                position={'sticky'}
                className={classes.appBar}
                sx={{ backgroundColor: 'white' }}
            >
                <Stack
                    direction={'row'}
                    gap={1}
                    justifyContent={'space-around'}
                    sx={{
                        width: '100%',
                        px: isMediumScreenSize ? 4 : 0,
                    }}
                    alignItems={'center'}
                >
                    <Box
                        component={'img'}
                        sx={{
                            height: appConfig[AppConfigFields.AppBar][AppConfigAppBarFields.Logo][AppConfigSizeFields.Height],
                            width: appConfig[AppConfigFields.AppBar][AppConfigAppBarFields.Logo][AppConfigSizeFields.Width],
                            '&:hover': { cursor: 'pointer' },
                        }}
                        alt={'LOGO'}
                        src={appConfig[AppConfigFields.Logos][AppConfigLogosFields.Full]}
                        onClick={() => navigate('/')}
                    />

                    <>
                        {isMediumScreenSize ? (
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    flexGrow: 1,
                                    backgroundColor: 'transparent',
                                }}
                            >
                                <BurgerMenu
                                    dataItems={[]}
                                    renderedItems={<MenuHomeMarketButtons asItems /> }
                                />
                            </Box>
                        ) : (
                            <MenuHomeMarketButtons />
                        )}
                    </>
                    <div></div>
                </Stack>
            </AppBar>

            <Container>
                {props.children}

                <Outlet/>
            </Container>
            <ScrollBottom/>
            <FailRedirectMarketDialog
                open={failRedirect}
                onClose={() => setFailRedirect(false)}
            />
        </Stack>
    );
}


export default LayoutContainerNotLogged