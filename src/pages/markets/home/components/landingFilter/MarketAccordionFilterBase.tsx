import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import React from 'react';
import { Swiper } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import { SwiperProps } from 'swiper/react/swiper-react';
import MarketAccordionStyles from '../../../components/MarketAccordionStyles';

interface MarketAccordionFilterBaseProps {
  title: string;
  list: any[] | undefined;
  children: React.ReactElement | React.ReactElement[];
  swiperProps?: SwiperProps;
}

function MarketAccordionFilterBase(props: MarketAccordionFilterBaseProps) {
  const classes = MarketAccordionStyles();

  return (
    <Accordion className={classes.accordionExpanded}>
      <AccordionSummary
        sx={{ mt: 0.25, mb: 0.5 }}
        className={classes.accordionExpanded}
        expandIcon={<ExpandMore />}
      >
        <Typography variant={'h4'}>{props.title}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ pt: 0, mt: -1.5 }}>
        {/*<Grid container spacing={1}>*/}
        {/*
                    
                        <Swiper
                            style={{
                                maxHeight: '90px',
                                // @ts-ignore
                                "--swiper-pagination-bullet-inactive-opacity": "0.8",
                                "--swiper-pagination-bullet-size": "16px",
                                "--swiper-pagination-bullet-height": "16px",
                        }}
                            slidesPerView={4}
                            spaceBetween={5}
                            slidesPerGroup={4}
                            loop={false}
                            loopFillGroupWithBlank={false}
                            // pagination={{
                            //     clickable: true,
                            //
                            // }}
                            navigation={true}
                            modules={[Pagination, Navigation]}
                            className="mySwiper"
                            {
                                ...props?.swiperProps
                            }
                        >
                        </Swiper>
                     */}
        {props.children}

        {/*</Grid>*/}
      </AccordionDetails>
    </Accordion>
  );
}
/*        <Grid container spacing={1}>
            <Grid item xs={2} alignSelf={'center'}>
                <Typography variant={'h4'} className={classes.summaryTitle}>
                    {props.title}
                </Typography>
            </Grid>
            <Grid item xs={10} pr={5}>
                <Box width={'100%'} className={classes.root} pr={1} pt={1} pl={1}>
                    <Swiper
                        slidesPerView={props.list ? props.list.length > 6 ? 6 : props.list.length : 6}
                        spaceBetween={5}
                        slidesPerGroup={4}
                        loop={false}
                        loopFillGroupWithBlank={false}
                        pagination={{
                            clickable: true
                        }}
                        navigation={true}
                        modules={[Pagination, Navigation]}
                        className="mySwiper"
                    >
                        {props.children}
                    </Swiper>
                </Box>
            </Grid>
        </Grid>*/

export default MarketAccordionFilterBase;
