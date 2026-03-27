import {Box, Button, Card, CardContent, Grid, Stack} from "@mui/material";
import {TypographyBase} from "../../../../components/misc/TypographyBase";
import ProductLineCard from "../../../markets/lines/components/ProductLineCard";
import {useEffect, useState} from "react";
import {ProductLineView} from "../../../../types/lines/productLineData";
import ProductLineCardLoading from "../../../markets/lines/components/ProductLineCardLoading";
import {HttpProductLine} from "../../../../http";
import {AppRoutesDefinitions, useAppNavigation} from "../../../../hooks/navigation";


interface CompanySuggestedLinesSectionProps {
    companyId: number;
}

const CompanySuggestedLinesSection = ({companyId} : CompanySuggestedLinesSectionProps) => {
    const { navigate } = useAppNavigation();
    const [lines, setLines] = useState<ProductLineView[]>();

    const onNavigateMarketLanding = () => navigate(AppRoutesDefinitions.MarketLanding);
    
    useEffect(() => {
        HttpProductLine.recommendedByCompany(companyId)
            .then(setLines)
    }, [companyId]);
    
    if (lines && lines.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardContent>
                <Stack spacing={3}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <TypographyBase variant="h5" fontWeight={600}>
                            Productos recomendados
                        </TypographyBase>
                        <Button variant="text" size="small" onClick={onNavigateMarketLanding}>
                            Ir a la Tienda LUC
                        </Button>
                    </Stack>
                    <Box sx={{ margin: '-12px' }}>
                        <Grid container spacing={3}>
                            {lines ?
                                lines.map(((p, i) => (
                                <Grid item xs={12} sm={6} key={`company_suggestedLine_${i}`}>
                                    <ProductLineCard productLine={p}
                                                     onReload={() => { }}
                                                     fromLanding
                                                     addBorder
                                    />
                                </Grid>
                            )))
                            :
                                Array.from({length: 4}).map((p, i) => (
                                    <Grid item xs={12} sm={6} key={`company_suggestedLineLoading_${i}`}>
                                        <ProductLineCardLoading />
                                    </Grid>
                                ))
                            }
                        </Grid>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    )
}


export default CompanySuggestedLinesSection