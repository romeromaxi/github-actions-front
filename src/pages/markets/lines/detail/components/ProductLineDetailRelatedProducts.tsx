import React, {useContext, useEffect, useState} from "react";
import {ProductLineDetailContext} from "../ProductLinePymeDetail";
import {Card, CardContent, CardHeader} from "@mui/material";
import {ProductLineView} from "types/lines/productLineData";
import {HttpProductLine} from "http/index";
import ProductLineCarousel from "../../components/ProductLineCarousel";

export default function ProductLineDetailRelatedProducts() {
    const { idProductLine } = useContext(ProductLineDetailContext);
    const [relatedLines, setRelatedLines] = useState<ProductLineView[]>();

    useEffect(() => {
        if (idProductLine) {
            HttpProductLine.getRelatedByProductLineId(idProductLine)
                .then(setRelatedLines)
        }
    }, [idProductLine]);
    
    return (
        <Card sx={{ paddingTop: '40px', paddingBottom: '40px' }}>
            <CardHeader title={"Otras opciones que podrían interesarte"}
                        sx={{ padding: 0, borderBottom: 'none' }}
            />

            <CardContent>
                <ProductLineCarousel
                    productLines={relatedLines}
                    addBorder={true}
                    breakpoints={{
                        "320": { slidesPerView: 1, spaceBetween: 10 },
                        "720": { slidesPerView: 2, spaceBetween: 15 },
                        "960": { slidesPerView: 2, spaceBetween: 20 },
                        "1440": { slidesPerView: 2, spaceBetween: 25 },
                    }}
                />
            </CardContent>
        </Card>
    )
}