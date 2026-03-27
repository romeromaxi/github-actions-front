import {LufeFinanceIndicator, LufeFinanceIndicatorFields} from "../../../../../../../types/lufe/lufeFinanceIndicators";
import {Grid, Stack} from "@mui/material";
import {DataWithLabel} from "../../../../../../../components/misc/DataWithLabel";
import {numberFormatter} from "../../../../../../../util/formatters/numberFormatter";
import React from "react";


interface OffererLufeFinanceIndicatorDetailProps {
    indicator: LufeFinanceIndicator
}


const OffererLufeFinanceIndicatorDetail = ({indicator} : OffererLufeFinanceIndicatorDetailProps) => {
    
    return (
        <Grid container spacing={2} sx={{padding: '4px 8px'}}>
            <Grid item md={6}>
                <Stack spacing={2}>
                    <DataWithLabel label={'Rentabilidad'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.Rentability]) ?? '-'} rowDirection/>
                    <DataWithLabel label={'Evolución'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.VtaEvolution]) ?? '-'} rowDirection/>
                    <DataWithLabel label={'Rotación inventarios'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.InventoriesRotation]) ?? '-'} rowDirection/>
                    <DataWithLabel label={'Ctas a cobrar (plazo medio)'} data={numberFormatter.toStringWithDecimals(indicator[LufeFinanceIndicatorFields.MediumTermToCollect])} rowDirection pendantLabel={'-'}/>
                    <DataWithLabel label={'Solvencia'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.Solvency]) ?? '-'} rowDirection/>
                    <DataWithLabel label={'Compras de insumos'} data={numberFormatter.toStringWithAmount(indicator[LufeFinanceIndicatorFields.InputsTotalPurchases], '$') ?? '-'} rowDirection/>
                    <DataWithLabel label={'Util. bruta costos'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.GrossUtilityCosts]) ?? '-'} rowDirection/>
                    <DataWithLabel label={'Prod. bienes (exportación)'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.FixedAssetsExportationAffectedProductivity]) ?? '-'} rowDirection/>
                    <DataWithLabel label={'Endeudam. diferido'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.DeferredDebtness]) ?? '-'} rowDirection/>
                    <DataWithLabel label={'Retorno patrim. neto'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.NetPatrimonyReturn]) ?? '-'} rowDirection/>
                    <DataWithLabel label={'Ebit ventas'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.EbitVtas]) ?? '-'} rowDirection/>
                </Stack>
            </Grid>
            <Grid item md={6}>
                <Stack spacing={2}>
                    <DataWithLabel label={'Liquidez'}
                                   data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.Liquidity]) ?? '-'}
                                   rowDirection
                    />
                    <DataWithLabel label={'Capital de trabajo'} data={numberFormatter.toStringWithAmount(indicator[LufeFinanceIndicatorFields.WorkingCapital], '$') ?? '-'} rowDirection/>
                    <DataWithLabel label={'Endeudamiento'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.Debtness]) ?? '-'} rowDirection/>
                    <DataWithLabel label={'Inmov. bienes de uso'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.ImmobilizationFixedAssets]) ?? '-'} rowDirection/>
                    <DataWithLabel label={'Ctas a pagar (plazo medio)'} data={numberFormatter.toStringWithDecimals(indicator[LufeFinanceIndicatorFields.MediumTermToPay])} rowDirection pendantLabel={'-'}/>
                    <DataWithLabel label={'Retorno de activos'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.TotalActiveReturn]) ?? '-'} rowDirection/>
                    <DataWithLabel label={'Prom. ventas mensuales'} data={numberFormatter.toStringWithAmount(indicator[LufeFinanceIndicatorFields.AverageMonthlySales], '$') ?? '-'} rowDirection/>
                    <DataWithLabel label={'Incidencia bienes (costos)'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.AmortizationIncidenceFixedAssetsOnCosts]) ?? '-'} rowDirection/>
                    <DataWithLabel label={'Liquidez ácida'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.AcidLiquidity]) ?? '-'} rowDirection/>
                    <DataWithLabel label={'Util. neta patrim. neto'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.NetPatrimonyUtility]) ?? '-'} rowDirection/>
                    <DataWithLabel label={'Ebit'} data={numberFormatter.toStringWithAmount(indicator[LufeFinanceIndicatorFields.Ebit], '$') ?? '-'} rowDirection/>
                    <DataWithLabel label={'Ebitda ventas'} data={numberFormatter.toStringWithPercentage(indicator[LufeFinanceIndicatorFields.EbitdaVtas]) ?? '-'} rowDirection/>
                </Stack>
            </Grid>
        </Grid>
    )
}


export default OffererLufeFinanceIndicatorDetail