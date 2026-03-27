import React, {useEffect, useMemo, useState} from "react";
import {Grid} from "@mui/material";
import MarketLandingProductLinesAdvertising from "../../MarketLandingProductLinesAdvertising";
import {HttpProductLineChosen} from "http/line/httpProductLineChosen";
import {ProductLineUserRecommended, ProductLineUserRecommendedFields} from "types/lines/productLineData";
import {useUser} from "hooks/contexts/UserContext";
import {HttpProductLine} from "http/line/httpProductLine";
import ProductLineRenderer from "../../../lines/ProductLineRenderer";
import FlyerAssistedSearchLuc from "components/flyers/FlyerAssistedSearchLuc";

function MarketLandingMainTabContent() {
    const { isLoggedIn } = useUser();
    
    const [userRecommendedLines, setUserRecommendedLines] = useState<ProductLineUserRecommended[]>();
    const showFirstLinesAdvertising = useMemo(() => (
        isLoggedIn && userRecommendedLines && !userRecommendedLines.length
    ), [isLoggedIn, userRecommendedLines]);
  
    useEffect(() => {
        if (isLoggedIn) {
            HttpProductLine.recommendedByUser()
                .then(setUserRecommendedLines)
        }
    }, [isLoggedIn]);
    
    return (
        <Grid container spacing={6}>
            {
                (!userRecommendedLines || !!userRecommendedLines.length) && isLoggedIn && (
                    <Grid item xs={12}>
                        <ProductLineRenderer title={userRecommendedLines?.[0][ProductLineUserRecommendedFields.Title]}
                                             lines={userRecommendedLines?.[0][ProductLineUserRecommendedFields.Lines]} 
                                             showOnlyFirstLine
                        />
                    </Grid>
                )
            }

            {
                showFirstLinesAdvertising && (
                    <Grid item xs={12}>
                        <MarketLandingProductLinesAdvertising loadLinesFn={HttpProductLineChosen.getSelectedProductLines}/>
                    </Grid>
                )
            }
            
            <Grid item xs={12}>
                <FlyerAssistedSearchLuc />
            </Grid>

            {
                !showFirstLinesAdvertising && (
                    <Grid item xs={12}>
                        <MarketLandingProductLinesAdvertising loadLinesFn={HttpProductLineChosen.getSelectedProductLines}/>
                    </Grid>
                )
            }

            {
                !!userRecommendedLines && userRecommendedLines.length > 1 && (
                    userRecommendedLines.filter((_, idx) => idx > 0)
                        .map((linesGroup, i) => (
                            <Grid item xs={12}>
                                <ProductLineRenderer title={linesGroup[ProductLineUserRecommendedFields.Title]}
                                                     lines={linesGroup[ProductLineUserRecommendedFields.Lines]}
                                                     showOnlyFirstLine
                                />
                            </Grid>
                        ))
                )
            }
        </Grid>
    )
}

export default MarketLandingMainTabContent;