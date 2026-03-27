import React from 'react';
// @ts-ignore
import slide1 from '../../../../assets/img/slide_home_1_vertical.jpg';
// @ts-ignore
import slide2 from '../../../../assets/img/slide_home_2_vertical.jpg';
// @ts-ignore
import slide3 from '../../../../assets/img/slide_home_3_vertical.jpg';
// @ts-ignore
import slide4 from '../../../../assets/img/slide_home_4_vertical.jpg';
import MarketCategorySlide from './MarketCategorySlide';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
const slideText = [
  {
    title: 'Préstamos para el Agro',
    subTitle: 'Texto descriptivo de linea o producto',
  },
  {
    title: 'Apertura de cuentas Pymes',
    subTitle: 'Texto descriptivo de linea o producto',
  },
  {
    title: 'Créditos para capital de trabajo',
    subTitle: 'Texto descriptivo de linea o producto',
  },
  {
    title: 'Cambio de cheques',
    subTitle: 'Texto descriptivo de linea o producto',
  },
];

function MarketCategorySlider() {
  return (
    <Swiper
      slidesPerView={3}
      spaceBetween={5}
      slidesPerGroup={1}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Pagination, Navigation]}
      className="mySwiper"
    >
      {[slide1, slide2, slide3, slide4].map((slide, index) => (
        <SwiperSlide>
          {({ isNext }) => (
            <MarketCategorySlide
              title={slideText[index].title}
              subTitle={slideText[index].subTitle}
              src={slide}
              isActive={isNext}
            />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default MarketCategorySlider;
