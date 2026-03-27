import {Box, Grid, Link} from "@mui/material";
import {Briefcase, CompassRose, Share, UserPlus} from "@phosphor-icons/react";
import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import LogInDrawer from "../../user/LogInDrawer";
import {LogInProcessParts} from "../../../types/form/login/login-enum";
import HomeSummaryLucSection from "./HomeSummaryLucSection";


const HomeSummaryLuc = () => {
    const navigate = useNavigate()
    const [openSignup, setOpenSignup] = useState<boolean>(false)
    const onOpenSignup = () => setOpenSignup(true)
    const onCloseSignup = () => setOpenSignup(false)
    
    const onNavigateToMarket = () => navigate('/market/landing')
    
    return (
        <Grid container spacing={2} alignItems='stretch' id="summary-videos-home">
            <Grid item xs={12} md={3}>
                <HomeSummaryLucSection title={'Navegar por la tienda es simple'}
                                       Icon={CompassRose}
                                       sourceVideo={"/videos/Navegar por la tienda.mp4"}
                                       content={
                                           <Box component="span">
                                               <Link underline='none' onClick={onNavigateToMarket} sx={{ display: 'inline' }}>Dirigite a la tienda</Link>
                                               {`, buscá con los filtros o pedí asistencia para tu búsqueda`}
                                           </Box>
                                       }
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <HomeSummaryLucSection title={'Crear tu usuario es rápido'}
                                       Icon={UserPlus}
                                       sourceVideo={"/videos/Cómo crear un usuario.mp4"}
                                       content={
                                           <Box component="span">
                                               <Link underline='none' onClick={onOpenSignup} sx={{ display: 'inline' }}>Registrá tu usuario</Link>
                                               {` en dos pasos ingresando tu CUIT, tú número de teléfono y tu email`}
                                           </Box>
                                       }
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <HomeSummaryLucSection title={'Enviar solicitudes es sencillo'}
                                       Icon={Share}
                                       sourceVideo={"/videos/Enviar solicitudes.mp4"}
                                       content={
                                           <Box component="span">
                                               Enviá soliciudes para recibir propuestas, completando unos pocos datos de tu empresa una única vez
                                           </Box>
                                       }
                />
            </Grid>
            <Grid item xs={12} md={3}>
                <HomeSummaryLucSection title={'Utilizar la suite de herramientas mejora tus posibilidades'}
                                       Icon={Briefcase}
                                       sourceVideo={"/videos/Suite de Herramientas.mp4"}
                                       content={
                                           <Box component="span">
                                               Gestioná solicitudes, datos y documentos de manera ordenada y segura en un entorno de uso exclusivo
                                           </Box>
                                       }
                />
            </Grid>
            
            {
                openSignup &&
                <LogInDrawer
                    formPart={LogInProcessParts.Signup}
                    title={'Registro'}
                    open={openSignup}
                    onClose={onCloseSignup}
                />
            }
        </Grid>
    )
}



export default HomeSummaryLuc