import React from 'react';
import { Grid } from '@mui/material';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper";
import NavigableBannerWithText from "components/cards/NavigableBannerWithText";
// @ts-ignore
import casfogLogo from "assets/img/market/home/03BusquedaAsistidaCASFOG.png";
// @ts-ignore
import lucBusquedaAsistida from "assets/img/market/home/01bannerBusquedaAsistidaLUC.png";
import { AppConfigFields } from '../../../../../types/appConfigEntities';

const BannerCarouselSection = ({ lucRedirect, casfogRedirect }) => {
  return (
    <Grid item xs={12} mb={3}>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: window.APP_CONFIG[AppConfigFields.BannerDelay],
          disableOnInteraction: false
        }}
        loop
      >
        <SwiperSlide data-cy={'market-landing-navigable-banner'}>
          <NavigableBannerWithText 
            section={'BÚSQUEDA ASISTIDA LUC'}
            mainTitle={'LUC te ayuda a encontrar, elegir y gestionar el financiamiento que más se ajuste a lo que vos necesitás'}
            img={lucBusquedaAsistida}
            goto={lucRedirect}
          />
        </SwiperSlide>
        <SwiperSlide>
          <NavigableBannerWithText 
            section={'BÚSQUEDA ASISTIDA DE AVALES'}
            mainTitle={'La Cámara Argentina de Sociedades y Fondos de Garantías te ayuda a elegir y gestionar los avales más adecuados a tu necesidad'}
            img={casfogLogo}
            goto={casfogRedirect}
          />
        </SwiperSlide>
      </Swiper>
    </Grid>
  );
};

export default BannerCarouselSection;