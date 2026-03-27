import React from 'react';
import { ProductLineView } from '../../../../types/lines/productLineData';
import { Box, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Virtual } from 'swiper';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import ProductLineCard from './ProductLineCard';
import { CompanyViewDTO } from '../../../../types/company/companyData';

interface ProductSliderProps {
  title?: string;
  companies: CompanyViewDTO[];
  lineList: ProductLineView[];
}

function ProductSlider({ title, companies, lineList }: ProductSliderProps) {
  return (
    <Box sx={{ width: 99 / 100, height: 1, boxShadow: 2, p: 1, m: 1 }}>
      <Swiper
        // style={{height:'30vh'}}
        slidesPerView={4}
        spaceBetween={30}
        slidesPerGroup={1}
        loop={true}
        loopFillGroupWithBlank={false}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation, Virtual]}
        // className="mySwiper"
      >
        {/*<span slot="container-start"><Typography variant={'h5'}>{title}</Typography></span>*/}
        {lineList?.map((line, index) => (
          <SwiperSlide
            // style={{width: '25%'}}
            key={JSON.stringify(line)}
            virtualIndex={index}
          >
            <ProductLineCard productLine={line} />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}

export default ProductSlider;
