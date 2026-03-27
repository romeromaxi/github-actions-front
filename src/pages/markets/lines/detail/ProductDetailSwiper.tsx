import React, { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
// @ts-ignore
import capital from '../../../../assets/img/slides/capitaldetrabajo.jpg';
// @ts-ignore
import documentos from '../../../../assets/img/slides/documentos.jpg';
// @ts-ignore
import inversion from '../../../../assets/img/slides/inversion.jpg';
import ProductDetailSlide, {
  ProductDetailSlideProps,
} from './ProductDetailSlide';
import {
  ProductLineViewDetail,
  ProductLineDescriptionsFields,
  ProductLineFields,
} from '../../../../types/lines/productLineData';
import { CompanyFileType } from '../../../../types/company/companyEnums';

interface ProductDetailSwiperProps {
  line: ProductLineViewDetail;
}

function ProductDetailSwiper({ line }: ProductDetailSwiperProps) {
  const slides: ProductDetailSlideProps[] = [
    {
      imageUrl: capital,
      title: 'Envío de la solicitud',
      onHoverText: `<p>Lo primero que tenés que hacer es agregar esta línea a la selección. </p>Completá y confirmá tu legajo ${line[ProductLineFields.FileTypeCode] === CompanyFileType.Short ? 'abreviado' : 'de crédito'}`,
    },
    {
      imageUrl: documentos,
      title: 'Precalificación Digital',
      onHoverText:
        line[ProductLineFields.ProductLineDescriptions][
          ProductLineDescriptionsFields.PrequalificationDetail
        ],
    },
    {
      imageUrl: inversion,
      title: 'Instrumentación',
      onHoverText:
        line[ProductLineFields.ProductLineDescriptions][
          ProductLineDescriptionsFields.InstrumentationDetail
        ],
    },
  ];

  return (
    <Swiper
      slidesPerView={3}
      spaceBetween={5}
      slidesPerGroup={3}
      pagination={{
        clickable: true,
      }}
      // navigation={true}
      // modules={[Pagination, Navigation]}
      className="mySwiper"
    >
      {slides.map((slide, index) => (
        <SwiperSlide>
          <ProductDetailSlide {...slide} key={index} />
        </SwiperSlide>
      ))}
      {/*<SwiperSlide>*/}
      {/*    <Stack direction={'column'} gap={3}>*/}
      {/*        <Box*/}
      {/*            sx={{*/}
      {/*                height: '286px',*/}
      {/*                backgroundImage: `url(${capital})`,*/}
      {/*                width: 1,*/}
      {/*                backgroundPosition: 'center',*/}
      {/*                backgroundSize: 'cover',*/}
      {/*                backgroundRepeat: 'no-repeat',*/}
      {/*            }}*/}
      {/*        />*/}
      {/*        <div>*/}
      {/*            <Typography variant={'h6'} textAlign={'center'}>*/}
      {/*                Envío de la solicitud*/}
      {/*            </Typography>*/}

      {/*        </div>*/}

      {/*    </Stack>*/}
      {/*</SwiperSlide>*/}
      {/*<SwiperSlide>*/}
      {/*    <Stack direction={'column'} gap={3}>*/}
      {/*        <Box*/}
      {/*            sx={{*/}
      {/*                height: '286px',*/}
      {/*                backgroundImage: `url(${documentos})`,*/}
      {/*                width: 1,*/}
      {/*                backgroundPosition: 'center',*/}
      {/*                backgroundSize: 'cover',*/}
      {/*                backgroundRepeat: 'no-repeat',*/}
      {/*            }}*/}
      {/*        />*/}
      {/*        <div>*/}
      {/*            <Typography variant={'h6'} textAlign={'center'}>*/}
      {/*                Precalificación Digital*/}
      {/*            </Typography>*/}
      {/*        </div>*/}

      {/*    </Stack>*/}
      {/*</SwiperSlide>*/}
      {/*<SwiperSlide>*/}
      {/*    <Stack direction={'column'} gap={3}>*/}
      {/*        <Box*/}
      {/*            sx={{*/}
      {/*                height: '286px',*/}
      {/*                backgroundImage: `url(${inversion})`,*/}
      {/*                width: 1,*/}
      {/*                backgroundPosition: 'center',*/}
      {/*                backgroundSize: 'cover',*/}
      {/*                backgroundRepeat: 'no-repeat',*/}
      {/*            }}*/}
      {/*        />*/}
      {/*        <div>*/}
      {/*            <Typography variant={'h6'} textAlign={'center'}>*/}
      {/*                Instrumentación*/}
      {/*            </Typography>*/}

      {/*        </div>*/}

      {/*    </Stack>*/}
      {/*</SwiperSlide>*/}
    </Swiper>
  );
}

export default ProductDetailSwiper;
