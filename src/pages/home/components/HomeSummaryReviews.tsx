import {Box, Grid, Typography} from "@mui/material";
import React from "react";
// @ts-ignore
import marketHomeBanner4 from "../../../assets/img/market/home/new-home-04.png";
// @ts-ignore
import marketHomeBanner5 from "../../../assets/img/market/home/new-home-05.png";
// @ts-ignore
import marketHomeBanner6 from "../../../assets/img/market/home/new-home-06.png";

const HomeSummaryReviews = () => {
    
    return (
        <Grid container spacing={2} id="reviews-home">
            <Grid item xs={12}>
                <Typography variant='h2' fontWeight={500} textAlign='center' mb={2}>
                    Testimonios de usuarios LUC
                </Typography>
            </Grid>
            <Grid item xs={12} md={3.5} textAlign={'center'}>
                <Box width={{ xs: '60%', md: '100%' }} 
                     height={'100%'}
                     component="img"
                     src={marketHomeBanner4}
                     alt="review-home1"
                />
            </Grid>
            <Grid item xs={0} md={0.75}></Grid>
            <Grid item xs={12} md={3.5} textAlign={'center'}>
                <Box width={{ xs: '60%', md: '100%' }}
                     height={'100%'}
                     component="img"
                     src={marketHomeBanner5}
                     alt="review-home2"
                />
            </Grid>
            <Grid item xs={0} md={0.75}></Grid>
            <Grid item xs={12} md={3.5} textAlign={'center'}>
                <Box width={{ xs: '60%', md: '100%' }}
                     height={'100%'}
                     component="img"
                     src={marketHomeBanner6}
                     alt="review-home3"
                />
            </Grid>
        </Grid>
    )
}


export default HomeSummaryReviews