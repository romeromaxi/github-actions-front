import {Alert, Card, CardContent, Grid} from "@mui/material";
import React, {useContext} from "react";
import {LufeInformationContext} from "hooks/contexts/LufeInformationContext";
import {LufeDetailFields} from "types/lufe/lufeData";
import OffererLufeFinanceIndicatorCollapsable
    from "./components/financeIndicator/OffererLufeFinanceIndicatorCollapsable";
import OffererLufeFinanceIndicatorsLoader from "./components/financeIndicator/OffererLufeFinanceIndicatorsLoader";
import {LufeFinanceIndicator, LufeFinanceIndicatorFields} from "types/lufe/lufeFinanceIndicators";

const sortByPeriod = (a: LufeFinanceIndicator, b: LufeFinanceIndicator) => {
    const aPeriod = a[LufeFinanceIndicatorFields.Period] ?? "";
    const bPeriod = b[LufeFinanceIndicatorFields.Period] ?? "";
    
    return aPeriod < bPeriod ? 1 : -1;
}

const OffererLufeFinanceIndicators = () => {
    const { loading, error, lufeData } = useContext(LufeInformationContext)
    
    return (
        <Card>
            <CardContent>
                <Grid container spacing={2}>
                    {loading ?
                        <OffererLufeFinanceIndicatorsLoader />
                        :
                        error ? <Alert severity='error'>No se pudieron cargar los indicadores financieros</Alert>
                            :
                            lufeData && lufeData[LufeDetailFields.FinanceIndicatorsModelRequest] &&
                            lufeData?.[LufeDetailFields.FinanceIndicatorsModelRequest]?.sort(sortByPeriod)
                                .map((indicator, k) =>
                                    <Grid item xs={12} key={`lufe_financeIndicator_${k}`}>
                                        <OffererLufeFinanceIndicatorCollapsable indicator={indicator} />
                                    </Grid>
                                )
                    }
                </Grid>
            </CardContent>
        </Card>
    )
}


export default OffererLufeFinanceIndicators