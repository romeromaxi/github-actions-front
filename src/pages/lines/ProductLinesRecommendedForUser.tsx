import {useUser} from "hooks/contexts/UserContext";
import ProductLineRenderer from "../markets/lines/ProductLineRenderer";
import React, {useEffect, useState} from "react";
import { Button, Grid } from "@mui/material";
import {useAppNavigation} from "hooks/navigation";
import {MarketRoute} from "routes/market/routeAppMarketData";
import {ProductLineView} from "types/lines/productLineData";
import {HttpProductLine} from "http/index";

function ProductLinesRecommendedForUser() {
    const { isLoggedIn } = useUser();
    const { navigate } = useAppNavigation();
    
    const [lines, setLines] = useState<ProductLineView[]>();

    const onNavigateMarketLanding = () => navigate(MarketRoute.MarketLanding);

    useEffect(() => {
        if (isLoggedIn) {
            HttpProductLine.recommendedByNavigationUser()
                .then(setLines)
        }
    }, [isLoggedIn]);
    
    if (!isLoggedIn || (!!lines && !lines.length))
        return <React.Fragment />
    
    return (
        <Grid item xs={12}>
            <ProductLineRenderer title={'Productos destacados'}
                                 lines={lines}
                                 actions={<Button variant={'text'} size={'large'} onClick={onNavigateMarketLanding}>Ir a la Tienda LUC</Button>}
                                 showOnlyFirstLine
                                 minPadding
            />
        </Grid>
    )
}

export default ProductLinesRecommendedForUser;