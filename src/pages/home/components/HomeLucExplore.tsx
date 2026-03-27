import {Button, Grid, Stack, Typography} from "@mui/material";
import HomeLucExploreCard from "./HomeLucExploreCard";
import React from "react";
import {useNavigate} from "react-router-dom";
// @ts-ignore
import factoryIcon from "../../../assets/img/luc/home-factory.svg"
// @ts-ignore
import notepadIcon from "../../../assets/img/luc/home-notepad.svg"
// @ts-ignore
import handshakeIcon from "../../../assets/img/luc/home-handshake.svg"
// @ts-ignore
import creditCardIcon from "../../../assets/img/luc/home-credit-card.svg"
// @ts-ignore
import targetIcon from "../../../assets/img/luc/home-target.svg"
// @ts-ignore
import basketIcon from "../../../assets/img/luc/home-basket.svg"
import { Navigation, Pagination, Autoplay } from "swiper";
import {AppConfigFields} from "../../../types/appConfigEntities";
import {Swiper, SwiperSlide} from "swiper/react";
import {TypographyBase} from "../../../components/misc/TypographyBase";


interface HomeLucExploreProps {
    mobileView: boolean;
}

const cardsData = [
    {
        id: 'capital-trabajo',
        title: 'Préstamos Capital de Trabajo',
        iconSrc: factoryIcon,
        iconSx: { width: '160px' },
        gridSize: { xs: 12, lg: 7.5 }
    },
    {
        id: 'avales-garantias',
        title: 'Avales y garantías',
        iconSrc: notepadIcon,
        color: 'secondary' as const,
        iconSx: { width: '180px', top: -30, right: -50 },
        gridSize: { xs: 12, lg: 4.5 }
    },
    {
        id: 'prestamos-inversiones',
        title: 'Préstamos inversión',
        iconSrc: handshakeIcon,
        color: 'secondary' as const,
        iconSx: { width: '180px', top: -32, right: -45 },
        gridSize: { xs: 12, lg: 4.5 }
    },
    {
        id: 'descuento-cheques',
        title: 'Descuento Cheques y Facturas',
        iconSrc: creditCardIcon,
        iconSx: { width: '180px', top: -20, right: -50 },
        gridSize: { xs: 12, lg: 7.5 }
    },
    {
        id: 'soluciones-integrales',
        title: 'Soluciones integrales',
        iconSrc: targetIcon,
        iconSx: { width: '170px', right: -20 },
        gridSize: { xs: 12, lg: 7.5 }
    },
    {
        id: 'mas-productos',
        title: 'Cuentas Pyme',
        iconSrc: basketIcon,
        color: 'secondary' as const,
        iconSx: {
            width: '160px',
            top: -30,
            right: -50,
            transform: 'rotate(-20deg)'
        },
        gridSize: { xs: 12, lg: 4.5 }
    }
];
const HomeLucExplore = ({mobileView} : HomeLucExploreProps) => {
    const navigate = useNavigate();
    return (
        mobileView ?
            <Stack spacing={2}>
                <TypographyBase variant={'eyebrow1'} color={'primary'}>
                  TIENDA LUC
                </TypographyBase>
                <Typography variant={"h2"} fontWeight={600}>
                    Explorá todas las opciones de financiamiento en un solo lugar
                </Typography>
                <TypographyBase variant='body1' color={'text.lighter'}>
                  El Marketplace de LUC reúne las mejores líneas del mercado, listas para tu empresa.
                </TypographyBase>
                <Button variant="contained"
                        color={'primary'}
                        size="small"
                        onClick={() => navigate('/market/landing')}
                        id="explore-luc-landing-home-btn"
                        fullWidth
                >
                    Explorar Tienda LUC
                </Button>
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    centeredSlides={false}
                    autoplay={{
                        delay: window.APP_CONFIG[AppConfigFields.BannerDelay],
                        disableOnInteraction: false,
                    }}
                    loop
                    slidesPerView={1.5}
                    spaceBetween={16}
                    breakpoints={{
                        375: {
                            slidesPerView: 1.65,
                            spaceBetween: 16
                        },
                        414: {
                            slidesPerView: 1.8,
                            spaceBetween: 16
                        },
                        500: {
                            slidesPerView: 2.6,
                            spaceBetween: 20
                        }
                    }}
                >
                    {cardsData.map((card) => (
                        <SwiperSlide
                            key={card.id}
                            style={{ width: 'auto' }}
                        >
                            <HomeLucExploreCard
                                iconSrc={card.iconSrc}
                                onClick={() => console.log(card.id)}
                                color={card.color}
                                title={card.title}
                                iconSx={card.iconSx}
                                mobileView
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Stack>
        :
            <Grid container alignItems='center'>
                <Grid item xs={12} lg={6} container>
                    {cardsData.map((card) => (
                        <Grid
                            item
                            xs={card.gridSize.xs}
                            lg={card.gridSize.lg}
                            pr={2}
                            pt={2}
                            key={card.id}
                        >
                            <HomeLucExploreCard
                                iconSrc={card.iconSrc}
                                onClick={() => console.log(card.id)}
                                color={card.color}
                                title={card.title}
                                iconSx={card.iconSx}
                            />
                        </Grid>
                    ))}
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Stack spacing={2} pl={2}>
                        <TypographyBase variant={'eyebrow1'} color={'primary'}>
                          TIENDA LUC
                        </TypographyBase>
                        <Typography variant={"h2"} fontWeight={600}>
                            Explorá todas las opciones de financiamiento en un solo lugar
                        </Typography>
                        <TypographyBase variant='body1' color={'text.lighter'}>
                          El Marketplace de LUC reúne las mejores líneas del mercado, listas para tu empresa.
                        </TypographyBase>
                        <Button variant="contained"
                                color={'primary'}
                                size="medium"
                                onClick={() => navigate('/market/landing')}
                                id="explore-luc-landing-home-btn"
                                sx={{width: 1/3}}
                        >
                            Explorar Tienda LUC
                        </Button>
                    </Stack>
                </Grid>
            </Grid>
    )
}


export default HomeLucExplore;