﻿import React from "react";
import { Alert, Box, useMediaQuery, useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import { EntityWithIdFields } from "types/baseEntities";
import ProductLineCard from "./ProductLineCard";
import CardLoading from "components/cards/CardLoading";
import { ProductLineView } from "types/lines/productLineData";

interface Breakpoints {
    [key: string]: {
        slidesPerView: number;
        spaceBetween: number;
    };
}

interface ProductLineCarouselProps {
    productLines?: ProductLineView[];
    maxSlides?: number;
    breakpoints?: Breakpoints;
    loop?: boolean;
    addBorder?: boolean;
}

const defaultBreakpoints: Breakpoints = {
    "320": { slidesPerView: 1, spaceBetween: 10 },
    "720": { slidesPerView: 2, spaceBetween: 15 },
    "960": { slidesPerView: 3, spaceBetween: 20 },
    "1440": { slidesPerView: 4, spaceBetween: 20 },
};

export default function ProductLineCarousel({ productLines, maxSlides, breakpoints = defaultBreakpoints, loop, addBorder }: ProductLineCarouselProps) {
    const theme = useTheme();
    const isMobileScreenSize = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box width={'100%'}>
            <Swiper
                centeredSlides={isMobileScreenSize}
                spaceBetween={20}
                loop={loop}
                loopFillGroupWithBlank={false}
                navigation={true}
                modules={[Pagination, Navigation]}
                pagination={isMobileScreenSize ? false : 
                 { 
                    clickable: true, 
                    renderBullet: (index, className) => {
                        if (index > 4) return ""; 
                        return `<span class="${className}"></span>`;
                    }
                }}
                
                style={{
                    padding: '2px 2px 12px 2px',
                }}
                breakpoints={breakpoints}
            >
                {productLines ?
                    productLines.length !== 0 ? productLines.map((line, idx) => (
                        <SwiperSlide key={`lineSlide_${line[EntityWithIdFields.Id]}_${idx}`} style={{ display: 'flex', justifyContent: 'center', alignItems: 'stretch', height: 'auto' }} data-cy={'product-line-carousel-swiper-slide'} id={`market-home-slide${idx}`}>
                            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'stretch' }}>
                                <ProductLineCard productLine={line}
                                                 onReload={() => { }}
                                                 fromLanding
                                                 addBorder={addBorder}
                                                 sx={{ width: '100%' }}
                                />
                            </Box>
                        </SwiperSlide>
                    ))
                        :
                        <Alert severity={'info'}>No tenemos líneas sugeridas por el momento...</Alert>
                    :
                    Array.from({ length: 4 }).map((d, k) => (
                        <SwiperSlide key={`idxLoadingProductLine_${k}`}>
                            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100%'}>
                                <CardLoading sx={{ height: '338px', width: '260px', textAlign: 'center' }} />
                            </Box>
                        </SwiperSlide>
                    ))}
            </Swiper>
        </Box>
    );
}