import {Box, Button, Grid, Stack, Typography, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import React, {Fragment, useState} from "react";
// @ts-ignore
import homeAboutLuc from "assets/img/luc/home-about-luc.png"
import {
    AppConfigAlliedOfferer,
    AppConfigAlliedOffererFields,
    AppConfigAlliedOfferersFields,
    AppConfigFields
} from "../../types/appConfigEntities";
import {LogInProcessParts} from "../../types/form/login/login-enum";
import LogInDrawer from "../user/LogInDrawer";
import {useUser} from "../../hooks/contexts/UserContext";
import HomeAboutLucMainSection from "./components/HomeAboutLucMainSection";
import HomeCreateUserInvitationFlyer from "./components/HomeCreateUserInvitationFlyer";
import {useNavigate} from "react-router-dom";

const OffererAllyItem = ({ name, urlImage }: { name: string, urlImage: string }) => (
    <Box component="img"
         src={urlImage}
         alt={`${name} logo`}
         sx={{ filter: 'brightness(0) invert(0.8)', height: '50px', maxWidth: '240px' }}
    />
);

const ButtonIdSignUp: string = "btn-registrate-seccion-principal-sobre-luc";

const AboutLucPage = () => {
    const { isLoggedIn } = useUser();
    const [drawerProcess, setDrawerProcess] = useState<LogInProcessParts | undefined>(undefined)
    const theme = useTheme();
    const showAlliedOfferers: boolean = !!window.APP_CONFIG[AppConfigFields.AlliedOfferers]?.[AppConfigAlliedOfferersFields.Show];
    const alliedOfferers: AppConfigAlliedOfferer[] = window.APP_CONFIG[AppConfigFields.AlliedOfferers]?.[AppConfigAlliedOfferersFields.List];
    const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down(420));
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    
    const mobileView = isSmallScreen || isExtraSmallScreen || isMediumScreen;
    
    const title = "Una plataforma pensada para simplificar el acceso de las PyMEs al crédito";
    
    const description = "En LUC reunimos en un mismo espacio digital múltiples alternativas de financiamiento para tu negocio. Nuestro objetivo es agilizar los trámites, acercar las propuestas y que con un solo legajo puedas acceder a múltiples propuestas.";
    
    return (
        <Fragment>
            {
            mobileView ?
                <Stack spacing={5.75}>
                    <Box component="img"
                         src={homeAboutLuc}
                         alignSelf={'center'}
                         sx={{ width: "clamp(350px, 85%, 500px)" }}
                    />
                    <Stack spacing={2}>
                        <Typography fontSize={'1.85rem'} fontWeight={600}>
                            {title}
                        </Typography>
                        <Typography color="text.lighter">
                            {description}
                        </Typography>
                        <Button variant="contained" id={ButtonIdSignUp} fullWidth onClick={() => navigate('/signup')}>
                            Crear Usuario Gratis
                        </Button>
                    </Stack>
                    <HomeAboutLucMainSection mobileView={mobileView} />
                    
                    <HomeCreateUserInvitationFlyer mobileView />
                </Stack>
                :
                <Stack spacing={5.75} pb={2}>
                    <Grid container spacing={2} alignItems="center" pb={2}>
                        <Grid item xs={6}>
                            <Stack spacing={2}>
                                <Typography color={'primary'} fontFamily={'Geist'} fontWeight={500}>
                                    CONOCENOS
                                </Typography>
                                <Typography variant="h2" fontWeight={600}>
                                    {title}
                                </Typography>
                                <Typography textAlign="left"
                                            color="text.lighter"
                                >
                                    {description}
                                </Typography>
                                <Button variant="contained" id={ButtonIdSignUp} onClick={() => navigate('/signup')}>
                                    Crear Usuario Gratis
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={6} textAlign={'center'}>
                            <Box component="img"
                                 src={homeAboutLuc}
                                 sx={{ width: "clamp(400px, 85%, 600px)" }}
                            />
                        </Grid>
                    </Grid>

                    {
                        showAlliedOfferers &&
                            <Stack direction={{ xs: 'column', sm: 'row' }}
                                   gap={{ xs: 3, md: 4, lg: 6 }}
                                   alignItems="center"
                                   justifyContent="center"
                                   flexWrap="wrap"
                            >
                                {
                                    alliedOfferers.map(o => (
                                        <OffererAllyItem name={o[AppConfigAlliedOffererFields.Name]}
                                                         urlImage={o[AppConfigAlliedOffererFields.UrlImage]}
                                        />
                                    ))
                                }
                            </Stack>
                    }
                    
                    <HomeAboutLucMainSection />

                    <HomeCreateUserInvitationFlyer mobileView={false} />
                </Stack>
            }
            {!isLoggedIn && !!drawerProcess && (
                <LogInDrawer
                    formPart={drawerProcess}
                    open
                    onClose={() => setDrawerProcess(undefined)}
                    allowsRegistration
                    fnAuthenticateUser={async (credentials) => {
                        const { HttpAuth } = await import('../../http/index');
                        return HttpAuth.authenticateUser(credentials);
                    }}
                />
            )}
        </Fragment>
    )
}


export default AboutLucPage;