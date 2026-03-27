import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Stack, Typography, useTheme, useMediaQuery } from "@mui/material";
import { WrapperIcons } from "../icons/Icons";
import { ChatCircleDots } from "@phosphor-icons/react";
import { AppConfigFields, AppConfigLogosFields } from "types/appConfigEntities";

interface BoxEmtynessDescriptionProps {
    title?: string;
    description?: string;
    srcImage?: string;
}

function BoxEmtynessDescription(props: BoxEmtynessDescriptionProps) {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const finalTitle: string = props.title ?? "Nada por acá todavía";
    const finalDescription: string = props.description ?? "Explorá los productos disponibles o contactate para que te ayudemos a encontrar la mejor opción para tu empresa";
    const image: string = props.srcImage ?? window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full];

    const handleViewProduct = () => navigate('/market/landing');

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: { xs: '48px 35px', sm: '32px 24px' },
                gap: { xs: '24px', sm: '32px' },
                backgroundColor: 'white',
                borderRadius: '32px',
                width: '100%',
                margin: 'auto',
            }}
        >
            <Box
                component="img"
                src={image}
                sx={{
                    width: '100%',
                    maxWidth: '450px',
                    height: 'auto',
                    borderRadius: '16px',
                }}
            />

            <Stack spacing={1} alignItems='center' width={1}>
                <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={500}>
                    {finalTitle}
                </Typography>
                <Typography
                    variant='subtitle2'
                    color='#818992'
                    sx={{ width: { xs: '100%', sm: '80%', md: '60%' } }}
                >
                    {finalDescription}
                </Typography>
            </Stack>

            <Stack
                spacing={2}
                alignItems='center'
                justifyContent='center'
                direction={isMobile ? 'column' : 'row'}
                width={1}
                maxWidth='500px'
            >
                <Button
                    variant='outlined'
                    color='primary'
                    startIcon={<WrapperIcons Icon={ChatCircleDots} size='md' />}
                    fullWidth={isMobile}
                >
                    Quiero que me asesoren
                </Button>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={handleViewProduct}
                    fullWidth={isMobile}
                >
                    Ver productos
                </Button>
            </Stack>
        </Box>
    );
}

export default BoxEmtynessDescription;
