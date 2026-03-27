import React, {useEffect, useState} from "react";
import {ProductLineView} from "types/lines/productLineData";
import ProductLineRenderer from "../lines/ProductLineRenderer";


interface MarketLandingProductLinesAdvertisingProps {
    loadLinesFn: () => Promise<ProductLineView[]>;
    hideViewAll?: boolean;
}

function MarketLandingProductLinesAdvertising({loadLinesFn, hideViewAll}: MarketLandingProductLinesAdvertisingProps) {
    const titleSelectedLines = hideViewAll ? undefined : 'Productos Destacados';

    const [selectedLines, setSelectedLines] = useState<ProductLineView[]>();

    useEffect(() => {
        const fetchProductLines = async () => {
            try {
                const lines = await loadLinesFn();
                setSelectedLines(lines);
            } catch (error) {
                console.error("Error loading product lines:", error);
            } 
        };
        
        fetchProductLines();
    }, []);
    
    return (
        <ProductLineRenderer title={titleSelectedLines}
                             lines={selectedLines}
                             id={"market-home-ads"}
                             showBlurredLogin
        />
    );
}

export default MarketLandingProductLinesAdvertising;
