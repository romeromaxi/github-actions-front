import React from 'react';
// @ts-ignore
import slide1 from '../../../../assets/img/bankLogos/logo_1.png';
// @ts-ignore
import slide2 from '../../../../assets/img/bankLogos/logo_2.png';
// @ts-ignore
import slide3 from '../../../../assets/img/bankLogos/logo_3.png';
// @ts-ignore
import slide4 from '../../../../assets/img/bankLogos/logo_4.png';
// @ts-ignore
import slide5 from '../../../../assets/img/bankLogos/logo_5.png';
// @ts-ignore
import slide6 from '../../../../assets/img/bankLogos/logo_6.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';

function BankLogoSlider() {
  return (
    <Swiper
      slidesPerView={8}
      spaceBetween={5}
      slidesPerGroup={1}
      loop={true}
      loopFillGroupWithBlank={false}
      autoplay={{
        delay: 2000,
        // disableOnInteraction: false,
      }}
      modules={[Autoplay]}
      className="mySwiper"
    >
      {[slide1, slide2, slide3, slide4, slide5, slide6].map((slide) => (
        <SwiperSlide>
          <img alt={'logo'} src={slide} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default BankLogoSlider;
