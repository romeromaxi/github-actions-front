import {Box, Card, CardContent, Grid, Stack, Typography} from "@mui/material";
import {DiagonalArrowButton} from "../../../components/buttons/Buttons";
import React from "react";
// @ts-ignore
import marketHomeBanner2 from "../../../assets/img/market/home/new-home-02.png";
// @ts-ignore
import marketHomeBanner3 from "../../../assets/img/market/home/new-home-03.png";
import {useNavigate} from "react-router-dom";
import {TypographyBase} from "../../../components/misc/TypographyBase";

const HomeSummarySearchings = () => {
    const navigate = useNavigate()
    const onNavigateToMarket = () => navigate('/market/landing')
    
    return (
        <Grid container spacing={3} id="searchings-home">
            <Grid item xs={12}>
                <TypographyBase variant={'h2'} fontWeight={500} textAlign='center'
                                paddingX={{ xs: 0, md: 10 }}
                                sx={{ textWrap: 'balance' }}
                >
                    Distintas formas de acceder al financiamiento a medida de tus necesidades
                </TypographyBase>
            </Grid>
            <Grid item md={12}>
                <Card>
                    <CardContent>
                        <Stack spacing={3}>
                            <Grid container alignItems='center'>
                                <Grid item md={5.8} xs={12}>
                                    <Stack spacing={2} sx={{
                                        backgroundColor: '#F6F6F6 !important',
                                        borderRadius: '32px !important',
                                        padding: 4
                                    }}>
                                        <Box sx={{ border: '1px solid black', width: '100%', height: '100%'}}
                                             component="img"
                                             src={marketHomeBanner2}
                                             alt="banner-search-by-products-home"
                                        />
                                        <Typography variant='h4' fontWeight={500}>Búsqueda por productos</Typography>
                                        <Typography variant='h5'>
                                            Navegá la tienda utilizando los filtros de productos para encontrar las líneas que más se ajusten a las necesidades y características de tu empresa.
                                        </Typography>
                                    </Stack>
                                </Grid>
                                <Grid item md={0.4} xs={0}></Grid>
                                <Grid item md={5.8} xs={12}>
                                    <Stack spacing={2} sx={{
                                        backgroundColor: '#F6F6F6 !important',
                                        borderRadius: '32px !important',
                                        padding: 4
                                    }}>
                                        <Box sx={{ border: '1px solid black', width: '100%', height: '100%'}}
                                             component="img"
                                             src={marketHomeBanner3}
                                             alt="banner-assisted-search-home"
                                        />
                                        <Typography variant='h4' fontWeight={500}>Búsquedas asistidas</Typography>
                                        <Typography variant='h5'>
                                            Utilizá las búsquedas asistidas para que especialistas de LUC o entidades aliadas te ayuden a encontrar el producto más adecuado del mercado (esté o no en la tienda de LUC).
                                        </Typography>
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Stack alignItems='center'>
                                <DiagonalArrowButton size='small' onClick={onNavigateToMarket} variant='outlined' id="go-to-market-home">
                                    Ir a la tienda
                                </DiagonalArrowButton>
                            </Stack>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
}


export default HomeSummarySearchings