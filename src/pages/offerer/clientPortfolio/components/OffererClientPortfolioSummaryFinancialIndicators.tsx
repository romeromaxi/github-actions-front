import React, {useEffect, useState} from "react";
import {Stack, Typography} from "@mui/material";
import {LufeFinanceIndicator, LufeFinanceIndicatorFields} from "../../../../types/lufe/lufeFinanceIndicators";
import {ITableColumn, TableList} from "../../../../components/table";
import {FinancialIndicators, FinancialIndicatorsFields} from "../../../../types/general/generalFinanceData";
import {TypographyBase} from "../../../../components/misc/TypographyBase";
import {numberFormatter} from "util/formatters/numberFormatter";
import {LastYearSource} from "../OffererClientPortfolioSummary";

interface OffererClientPortfolioSummaryFinancialIndicatorsProps {
    financialIndicators?: FinancialIndicators;
    lufeIndicator?: LufeFinanceIndicator;
    yearSrc?: LastYearSource;
}

interface SummaryFinancialIndicator {
    label: string,
    description: string,
    financialIndicator: any,
    lufeIndicator: any
}

function OffererClientPortfolioSummaryFinancialIndicators({financialIndicators, lufeIndicator, yearSrc}: OffererClientPortfolioSummaryFinancialIndicatorsProps) {
    const [indicatorsData, setIndicatorsData] = useState<SummaryFinancialIndicator[]>();
    
    const columns: ITableColumn[] = [
        { 
            label: '',
            textAlign: 'left',
            width: '60%',
            onRenderCell: (item: SummaryFinancialIndicator) => (
                <Stack overflow={'hidden'}>
                    <Typography>{item.label}</Typography>
                    {
                        !!item.description &&
                        <TypographyBase variant={'caption'} fontSize={10} fontWeight={400} color={'text.lighter'} maxLines={3} tooltip>
                            {item.description}
                        </TypographyBase>
                    }
                </Stack>
            )
        },
        {
            label: 'Estados Contables',
            value: 'financialIndicator',
            textAlign: 'right',
            textAlignHeader: 'right',
            helperTooltip: 'Indicadores del último estado contable cargado dentro de la plataforma',
        },
        {
            label: 'LUFE',
            value: 'lufeIndicator',
            textAlign: 'right',
            textAlignHeader: 'right',
            helperTooltip: 'Información de la última declaración jurada obtenida de LUFE',
            onRenderCell: (item: SummaryFinancialIndicator) => (
                <Typography>{item.lufeIndicator ?? '-'}</Typography>
            )
        }
    ];
    

    useEffect(() => {
        const auxIndicators = []

        auxIndicators.push({
            label: 'Rentabilidad',
            description: 'Participación del resultado final sobre ventas totales',
            financialIndicator: (yearSrc === LastYearSource.Both || yearSrc === LastYearSource.Own) ?
                numberFormatter.toStringWithPercentage(financialIndicators?.[FinancialIndicatorsFields.ProfitabilitySales]) ?? '-'
                :
                '-'
            ,
            lufeIndicator: (yearSrc === LastYearSource.Both || yearSrc === LastYearSource.Lufe) ?
                numberFormatter.toStringWithPercentage(lufeIndicator?.[LufeFinanceIndicatorFields.Rentability]) ?? '-'
                : '-'
        });

        auxIndicators.push({
            label: 'Liquidez',
            description: 'En qué medida superan los activos liquidables a corto plazo a los compromisos exigibles en mismo periodo (corriente: T < 1) Detecta posible problema de liquidez para afrontar compromisos en el corto plazo',
            financialIndicator: (yearSrc === LastYearSource.Both || yearSrc === LastYearSource.Own) ?
                numberFormatter.toStringWithPercentage(financialIndicators?.[FinancialIndicatorsFields.CurrentLiquidity]) ?? '-'
                : '-'
            ,
            lufeIndicator: (yearSrc === LastYearSource.Both || yearSrc === LastYearSource.Lufe) ?
                numberFormatter.toStringWithPercentage(lufeIndicator?.[LufeFinanceIndicatorFields.Liquidity]) ?? '-'
                : '-'
        });

        auxIndicators.push({
            label: 'Capital de trabajo',
            description: 'Valor monetario de la diferencia entre los activos más líquidos (activo corriente) y deudas con vencimiento más próximo (pasivo corriente)',
            financialIndicator: (yearSrc === LastYearSource.Both || yearSrc === LastYearSource.Own) ?
                numberFormatter.toStringWithAmount(financialIndicators?.[FinancialIndicatorsFields.WorkingCapital], '$') ?? '-'
                : '-'
            ,
            lufeIndicator: (yearSrc === LastYearSource.Both || yearSrc === LastYearSource.Lufe) ?
                numberFormatter.toStringWithAmount(lufeIndicator?.[LufeFinanceIndicatorFields.WorkingCapital], '$') ?? '-'
                : '-'
        });

        auxIndicators.push({
            label: 'Endeudamiento',
            description: 'Comparación entre deudas con terceros (pasivo total) y finaciación con recursos propios (patrimonio neto)',
            financialIndicator: (yearSrc === LastYearSource.Both || yearSrc === LastYearSource.Own) ?
                numberFormatter.toStringWithPercentage(financialIndicators?.[FinancialIndicatorsFields.Indebtedness]) ?? '-'
                : '-'
            ,
            lufeIndicator: (yearSrc === LastYearSource.Both || yearSrc === LastYearSource.Lufe) ?
                numberFormatter.toStringWithPercentage(lufeIndicator?.[LufeFinanceIndicatorFields.Debtness]) ?? '-'
                : '-'
        });

        auxIndicators.push({
            label: 'Prom. ventas mensuales',
            description: 'Este resultado indica cuál es el valor promedio de ventas mensuales. A su vez, siempre debe considerarse cada empresa según su sector y posibles variaciones estacionales',
            financialIndicator: (yearSrc === LastYearSource.Both || yearSrc === LastYearSource.Own) ?
                numberFormatter.toStringWithAmount(financialIndicators?.[FinancialIndicatorsFields.AverageMonthlySales], '$') ?? '-'
            : '-',
            lufeIndicator: (yearSrc === LastYearSource.Both || yearSrc === LastYearSource.Lufe) ?
                numberFormatter.toStringWithAmount(lufeIndicator?.[LufeFinanceIndicatorFields.AverageMonthlySales], '$') ?? '-'
                : '-'
        });

        setIndicatorsData(auxIndicators);
    }, [financialIndicators, lufeIndicator, yearSrc]);
    
    return (
        <TableList title={''}
                   entityList={indicatorsData}
                   columns={columns}
                   isLoading={!indicatorsData}
                   error={false}
        />
    )
}

export default OffererClientPortfolioSummaryFinancialIndicators;
