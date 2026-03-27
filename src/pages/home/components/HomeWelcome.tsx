import React, {ReactNode} from "react";
import {useTheme} from "@mui/system";
import {Box, Grid, Stack, Typography, useMediaQuery} from "@mui/material";
import {AddButton} from "components/buttons/Buttons";
import {AppRoutesDefinitions, useAppNavigation} from "hooks/navigation";

const HomeWelcome = () => {
    const { navigate } = useAppNavigation();
    
    const onClickAboutLuc = () => navigate(AppRoutesDefinitions.LucAboutPage);
    
    return (
        <Grid container spacing={2} alignItems='center' id="welcome-home">
            <Grid item xs={12} md={6}>
                <Stack spacing={3}>
                    <Typography variant={'h2'} fontWeight={500}>
                        Te damos la bienvenida a una nueva experiencia en el financiamiento de las MiPyMEs, simple, fácil y efectiva
                    </Typography>
                    <AddButton variant='outlined' sx={{width: '90px'}} onClick={onClickAboutLuc} id="about-luc-home-btn">
                        Sobre LUC
                    </AddButton>
                </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
                <HomeWelcomeImageAsComponent />
            </Grid>
        </Grid>
    )
}

interface CircleBoxProps {
    backgroundColor?: string,
    children: ReactNode
}
const CircleBox = ({ backgroundColor = 'white', children } : CircleBoxProps) => {
    return (
        <Box
            sx={{
                border: '1px solid #31673d',
                borderRadius: '50%',
                width: { xs: '110px', md: '136px' },
                height: { xs: '110px', md: '136px' },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor,
                padding: 2,
                m: '0px 8px !important',
                position: 'relative',
                zIndex: 1
            }}
        >
            <Typography
                fontWeight={500}
                textAlign='center'
                color={backgroundColor === '#31673d' ? 'white' : '#31673d'}
                sx={{
                    fontSize: { xs: '0.7rem', sm: '0.85rem', md: '0.92rem' },
                    lineHeight: 1.3
                }}
            >
                {children}
            </Typography>
        </Box>
    );
};

const HomeWelcomeImageAsComponent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isMobile) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    my: 3
                }}
            >
                <CircleBox backgroundColor='#31673d'>Para todo tipo de MiPyMEs</CircleBox>
                <CircleBox>Diferentes instrumentos de financiación</CircleBox>
                <CircleBox backgroundColor='#31673d'>Múltiples oferentes</CircleBox>
                <CircleBox>Única carga de datos y documentos para todas las gestiones</CircleBox>
                <CircleBox>Suite de herramientas para elegir mejor</CircleBox>
                <CircleBox backgroundColor='#31673d'>Usar LUC no tiene costo para las MiPyMEs</CircleBox>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
                maxWidth: '750px',
                mx: 'auto',
                height: { sm: '450px', md: '400px' },
                my: 0
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    position: 'absolute',
                    top: 0
                }}
            >
                <CircleBox backgroundColor='#31673d'>Para todo tipo de MiPyMEs</CircleBox>
                <CircleBox>Diferentes instrumentos de financiación</CircleBox>
                <CircleBox backgroundColor='#31673d'>Múltiples oferentes</CircleBox>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    width: '75%',
                    position: 'absolute',
                    top: '130px',
                    left: '12.5%'
                }}
            >
                <CircleBox>Única carga de datos y documentos para todas las gestiones</CircleBox>
                <CircleBox>Suite de herramientas para elegir mejor</CircleBox>
            </Box>

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    position: 'absolute',
                    top: '260px'
                }}
            >
                <CircleBox backgroundColor='#31673d'>Usar LUC no tiene costo para las MiPyMEs</CircleBox>
            </Box>
        </Box>
    );
};


export default HomeWelcome