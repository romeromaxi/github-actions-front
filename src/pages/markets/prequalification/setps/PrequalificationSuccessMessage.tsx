import React, { useMemo } from "react";
import {useNavigate} from "react-router-dom";
import {marketSolicitationStorage} from "util/sessionStorage/marketSolicitationStorage";
import {Box, Button, Grid, Stack} from "@mui/material";
import { TypographyBase } from "components/misc/TypographyBase";

interface PrequalificationSuccessMessageProps {
    solicitationLength: number,
    success?: boolean
}

function PrequalificationSuccessMessage({ solicitationLength, success }: PrequalificationSuccessMessageProps) {
    const navigate = useNavigate();

    const resources = useMemo(() => {
        const isSingular = (solicitationLength === 1);
        
        if (success) 
            return {
                img: '/images/assets/send-solicitation-success.svg',
                title: isSingular ? "¡Tu solicitud fue enviada con éxito!" : "¡Tus solicitudes fueron enviadas con éxito!",
                subtitle: "Tendrás novedades a la brevedad",
                button: "Ir a Mis Solicitudes"
            }
        
        return {
            img: '/images/assets/send-solicitation-failure.svg',
            title: isSingular ? "Hubo un error al enviar tu solicitud" : "Hubo un error al enviar al menos una de tus solicitudes",
            subtitle: "Intentalo nuevamente en unos instantes",
            button: "Volver a Mis Solicitudes"
        }
    }, [success, solicitationLength])
    
    const goToSolicitations = () => {
        navigate(`/market/solicitudes`, { replace: true });
        marketSolicitationStorage.clearSolicitation();
    };

    return (
        <Grid container item xs={12} justifyContent="center"
              minHeight={'70dvh'}
              alignContent={'center'}
        >
            <Stack spacing={3} alignItems={'center'}
                   alignContent={'center'}
            >
                <Box component={"img"} 
                     src={resources.img} 
                     sx={{ height: '186px', width: '186px' }}
                />
                
                <Stack spacing={1.5} alignItems={'center'}>
                    <TypographyBase variant={'h4'} textAlign={'center'}>
                        {resources.title}
                    </TypographyBase>
                    <TypographyBase variant={'body2'} textAlign={'center'}>
                        {resources.subtitle}
                    </TypographyBase>
                </Stack>
                
                <Button variant={'contained'} color={'primary'} size={'medium'}
                        onClick={goToSolicitations}
                >
                    {resources.button}
                </Button>
            </Stack>
        </Grid>
    );
}

export default PrequalificationSuccessMessage;