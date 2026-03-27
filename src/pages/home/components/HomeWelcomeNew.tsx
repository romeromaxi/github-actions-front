import {Box, Button, Stack, Typography} from "@mui/material";
// @ts-ignore
import homeCalendar from "assets/img/luc/home-calendar.svg";
// @ts-ignore
import homeChart from "assets/img/luc/home-chart.svg";
// @ts-ignore
import homeDonut from "assets/img/luc/home-donut.svg";
// @ts-ignore
import homeBill from "assets/img/luc/home-bills.svg";
import {Fragment, useState} from "react";
import {useNavigate} from "react-router-dom";
import {LogInProcessParts} from "../../../types/form/login/login-enum";
import LogInDrawer from "../../user/LogInDrawer";
import {useUser} from "../../../hooks/contexts/UserContext";

interface HomeWelcomeNewProps {
    mobileView: boolean;
}

const ButtonIdSignUp: string = "btn-registrate-seccion-principal-home";

const HomeWelcomeNew = ({mobileView} : HomeWelcomeNewProps) => {
    const { isLoggedIn } = useUser();
    const navigate = useNavigate();
    const [drawerProcess, setDrawerProcess] = useState<LogInProcessParts | undefined>(undefined)
    
    const title = "El camino más simple para encontrar el financiamiento de tu PyME";
    const description = 
        "Las mejores propuestas de entidades financieras y de garantía en un solo lugar. " +
        "Compará opciones, avanzá con las que más te gusten y aplicá 100% online.";
    
    return (
        <Fragment>
            {
                mobileView ?
                    <Stack spacing={2} alignItems="center">
                        <Box
                            position="relative"
                            width="100%"
                            height="220px"
                            display="flex"
                            justifyContent="center"
                        >
                            <Box
                                component="img"
                                src={homeChart}
                                sx={{
                                    width: { xs: 130, sm: 140 },
                                    position: "absolute",
                                    right: "55%",
                                    top: "95px",
                                    zIndex: 20,
                                }}
                            />
                            <Box
                                component="img"
                                src={homeDonut}
                                sx={{
                                    width: { xs: 180, sm: 200 },
                                    position: "absolute",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    top: "0px",
                                    zIndex: 10,
                                }}
                            />
                            <Box
                                component="img"
                                src={homeBill}
                                sx={{
                                    width: { xs: 110, sm: 150 },
                                    position: "absolute",
                                    left: "53%",
                                    top: "85px",
                                    zIndex: 0,
                                }}
                            />
                        </Box>
                        <Typography variant="h1" textAlign="center">
                            {title}
                        </Typography>
                        <Typography variant={'body1'} textAlign="center" color="text.lighter">
                            {description}
                        </Typography>

                        <Stack spacing={1} width="100%" maxWidth="320px">
                            <Button variant="contained" size="small" fullWidth
                                    id={ButtonIdSignUp}
                                    onClick={() => navigate('/signup')}>
                                Crear usuario gratis
                            </Button>
                            <Button variant="outlined" color={'secondary'} size="small" onClick={() => navigate('/market/landing')} fullWidth id="explore-luc-landing-home-btn">
                                Explorar tienda LUC
                            </Button>
                        </Stack>
                    </Stack>
                    :
                    <Box
                        position="relative"
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        minHeight={500}
                        sx={{ overflow: "hidden" }}
                    >
                        <Stack spacing={3} alignItems="center" maxWidth="700px" textAlign="center" zIndex={10} px={2}>
                            <Typography variant="h1" fontWeight={600}>
                                {title}
                            </Typography>
                            <Typography variant={'body1'} color="text.lighter">
                                {description}
                            </Typography>
                            <Stack spacing={2} direction={{ xs: "column", sm: "row" }} pt={3}>
                                <Button variant="contained" size="medium"
                                        id={ButtonIdSignUp}
                                        onClick={() => navigate('/signup')}>
                                    Crear Usuario Gratis
                                </Button>
                                <Button variant="outlined" color={'secondary'} size="medium" onClick={() => navigate('/market/landing')} id="explore-luc-landing-home-btn">
                                    Explorar Tienda LUC
                                </Button>
                            </Stack>
                        </Stack>

                        <Box
                            component="img"
                            src={homeCalendar}
                            sx={{
                                width: { xs: 80, sm: 120, md: 200, lg: 220 },
                                position: "absolute",
                                top: 6,
                                left: 0
                            }}
                        />
                        <Box
                            component="img"
                            src={homeChart}
                            sx={{
                                width: { xs: 100, sm: 140, md: 220, lg: 230 },
                                position: "absolute",
                                bottom: 20,
                                left: 0
                            }}
                        />
                        <Box
                            component="img"
                            src={homeDonut}
                            sx={{
                                width: { xs: 100, sm: 160, md: 360, lg: 380 },
                                position: "absolute",
                                top: { xs: -10, md: -50, lg: -70 },
                                right: -10
                            }}
                        />
                        <Box
                            component="img"
                            src={homeBill}
                            sx={{
                                width: { xs: 90, sm: 130, md: 200, lg: 210 },
                                position: "absolute",
                                bottom: 0,
                                right: 10
                            }}
                        />
                    </Box>
            }
            {!isLoggedIn && !!drawerProcess && (
                <LogInDrawer
                    formPart={drawerProcess}
                    open
                    onClose={() => setDrawerProcess(undefined)}
                    allowsRegistration
                    fnAuthenticateUser={async (credentials) => {
                        const { HttpAuth } = await import('../../../http/index');
                        return HttpAuth.authenticateUser(credentials);
                    }}
                />
            )}
        </Fragment>
    )
}


export default HomeWelcomeNew;