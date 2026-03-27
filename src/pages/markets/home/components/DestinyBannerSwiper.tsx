import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import DestinyBanner, { DestinyBannerProps } from './DestinyBanner';
import {
  ProductDestinyTypes,
  ProductServiceTypes,
} from '../../../../types/product/productdestinyData';
// @ts-ignore
import avales from '../../../../assets/img/slides/avales.jpg';
// @ts-ignore
import apertura from '../../../../assets/img/slides/apertura.jpg';
// @ts-ignore
import capital from '../../../../assets/img/slides/capitaldetrabajo.jpg';
// @ts-ignore
import documentos from '../../../../assets/img/slides/documentos.jpg';
// @ts-ignore
import inversion from '../../../../assets/img/slides/inversion.jpg';
// @ts-ignore
import seguros from '../../../../assets/img/slides/seguros.jpg';

function DestinyBannerSwiper() {
  const bannerProps: DestinyBannerProps[] = [
    {
      src: capital,
      title: 'Capital de trabajo',
      to: `/market/landing?destiny=${ProductDestinyTypes.WorkingCapital}`,
    },
    {
      src: inversion,
      title: 'Inversión',
      to: `/market/landing?destiny=${ProductDestinyTypes.Investment}`,
    },
    {
      src: avales,
      title: 'Avales',
      to: `/market/landing?service=${ProductServiceTypes.Endorsements}`,
    },
    {
      src: seguros,
      title: 'Seguros',
      to: `/market/landing?destiny=${ProductDestinyTypes.Insurance}`,
    },
    {
      src: documentos,
      title: 'Descuento Documentos',
      to: `/market/landing?service=${ProductServiceTypes.DiscountDocuments}`,
    },
    {
      src: apertura,
      title: 'Apertura de cuentas',
      to: `/market/landing?destiny=${ProductDestinyTypes.AccountOpening}`,
    },
  ];
  return (
    <div>
      <Swiper
        spaceBetween={5}
        slidesPerView={5}
        loop={true}
        loopFillGroupWithBlank={false}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {bannerProps.map((props: DestinyBannerProps) => {
          return (
            <SwiperSlide key={props.to}>
              <DestinyBanner {...props} sx={{ height: '160px' }} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default DestinyBannerSwiper;
