import React from 'react';
import {Box, Grid, useMediaQuery, useTheme} from '@mui/material';
import ProductLineCardLoading from "../../../lines/components/ProductLineCardLoading";
import ProductLineFilterLoading from "../../../lines/ProductLineFilterLoading";


const MarketFakeGondola: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box pb={4}>
            <Grid container spacing={4}>
                {!isMobile && (
                    <Grid item lg={3} md={5} xs={12}>
                        <ProductLineFilterLoading />
                    </Grid>
                )}
                <Grid
                    item
                    lg={9}
                    md={7}
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}
                >
                    <Grid container spacing={2}>
                        {[...Array(9)].map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={`product-skeleton-${index}`}>
                                <ProductLineCardLoading />
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default MarketFakeGondola;

