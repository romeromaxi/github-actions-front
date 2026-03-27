import React from "react";
import {Card, CardContent, Skeleton, Stack} from "@mui/material";
import MarketTypography from "../components/MarketTypography";

function ProductLineFilterLoading() {
    return (
        <Card>
            <CardContent>
                <Stack spacing={2}>
                    <MarketTypography variant={'h5'}>
                        Filtros
                    </MarketTypography>

                    {[...Array(10)].map((_, index) => (
                        <Skeleton
                            key={`filter-skeleton-${index}`}
                            variant="rectangular"
                            height={10}
                            sx={{ borderRadius: '8px' }}
                        />
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}

export default ProductLineFilterLoading;