import React, {useEffect, useState} from "react";
import {Button, Stack} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import {HttpSolicitation} from "http/index";
import {ProductLineView} from "types/lines/productLineData";
import ProductLineRenderer from "pages/markets/lines/ProductLineRenderer";
import {AppRoutesDefinitions, useAppNavigation} from "hooks/navigation";


interface CompanySolicitationRelatedLinesProps {
    solicitationId?: number;
}


const CompanySolicitationRelatedLines = ({ solicitationId }: CompanySolicitationRelatedLinesProps) => {
    const { navigate } = useAppNavigation();
    const [relatedLines, setRelatedLines] = useState<ProductLineView[]>();
    
    useEffect(() => {
        if (solicitationId) {
            HttpSolicitation.getRelatedProductLines(solicitationId).then(setRelatedLines);
        }
    }, [solicitationId]);
    
    if (relatedLines && relatedLines.length === 0) return null;
    
    return (
        <Stack spacing={4.5}>
            <Stack spacing={2}>
                <TypographyBase variant="h3">
                    Otras líneas similares
                </TypographyBase>
                <TypographyBase variant="body1" color="text.lighter">
                    Recordá que las solicitudes, las cuentas y lo que operes dentro de Luc no tiene ningún costo.
                </TypographyBase>
                <ProductLineRenderer lines={relatedLines} minPadding showOnlyFirstLine />
                <Button variant="text" onClick={() => navigate(AppRoutesDefinitions.MarketLanding)} fullWidth>
                    Ir a la Tienda LUC
                </Button>
            </Stack>
        </Stack>
    );
}


export default CompanySolicitationRelatedLines;