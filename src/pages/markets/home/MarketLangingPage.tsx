import {Button, Grid, Stack, useMediaQuery, useTheme} from "@mui/material";
import React from "react";
import {MessagesSquareIcon} from "lucide-react";
import BannersFaq from "./components/landingFilter/BannersFaq";
import {useNavigate} from "react-router-dom";
import MarketLandingMainTabs from "./components/MarketLandingMainTabs";
import {TypographyBase} from "components/misc/TypographyBase";

function MarketLangingPage() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));

    const handleNavigateAssistedSearch = () => {
        navigate('/market/luc?redirect=ac08111f742d99c360628ede782615800ab2b5e0ef3fbd90ed919c0b919447a9b60e27623ee78fcc7021a47e7144df4ec044368bbd4452bb8e80e90600778c72e1721c923214746df1a57d1c1577c2db');
    }

    return (
        <Grid container spacing={4.5}>
            <Grid item xs={12}>
                <Stack spacing={6} sx={{ width: '100% !important', margin: '0 auto' }}>
                    <Stack
                        direction={isMobileScreenSize ? "column" : "row"}
                        alignItems={isMobileScreenSize ? "flex-start" : "center"}
                        justifyContent="space-between"
                        spacing={isMobileScreenSize ? 2 : 0}
                    >
                        <Stack spacing={1}>
                            <TypographyBase variant={'h2'} color="#232926" 
                                            textAlign={isMobileScreenSize ? 'center' : 'left'}>
                                La forma más simple de financiar tu PyME
                            </TypographyBase>
                            <TypographyBase variant={'body1'}>
                                Encontrá el financiamiento que tu PyME necesita y comenzá nuevas solicitudes en un solo lugar.
                            </TypographyBase>
                        </Stack>
                        <Button variant="contained"
                                color="primary"
                                startIcon={<MessagesSquareIcon />}
                                onClick={handleNavigateAssistedSearch}
                                fullWidth={isMobileScreenSize}
                        >
                            Búsqueda Asistida LUC
                        </Button>
                    </Stack>

                    <BannersFaq />
                </Stack>
            </Grid>
            
            <Grid item xs={12}>
                <MarketLandingMainTabs />
            </Grid>
        </Grid>
    )
}

export default MarketLangingPage;