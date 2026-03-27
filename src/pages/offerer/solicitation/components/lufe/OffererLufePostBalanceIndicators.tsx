import {ITableColumn, TableColumnType, TableList} from "../../../../../components/table";
import {
    LufePostBalanceIndicator,
    LufePostBalanceIndicatorFields
} from "../../../../../types/lufe/lufePostBalanceIndicators";
import {useContext, useMemo} from "react";
import {LufeInformationContext} from "../../../../../hooks/contexts/LufeInformationContext";
import {LufeDetailFields} from "../../../../../types/lufe/lufeData";
import {Card, CardContent, Stack, Typography} from "@mui/material";
import {dateFormatter} from "../../../../../util/formatters/dateFormatter";
import {Line} from "react-chartjs-2";
import {options} from "../../../../company/flow/CompanyFlowChart";


const OffererLufePostBalanceIndicators = () => {
    const { loading, error, lufeData } = useContext(LufeInformationContext);
    const indicatorsOldestToNewest = useMemo(() => {
        if (!!lufeData && lufeData?.[LufeDetailFields.PostBalanceIndicatorsModelRequest]) {
            return [...(lufeData[LufeDetailFields.PostBalanceIndicatorsModelRequest] || [])].reverse();
        }
        
        return undefined;
    }, [lufeData])
    
    const cols : ITableColumn[] = [
        {label: 'Periodo', value: LufePostBalanceIndicatorFields.Period,
            onRenderCell: (i) => <Typography>{dateFormatter.toYearMonth(i[LufePostBalanceIndicatorFields.Period])}</Typography>},
        {label: 'Compras', value: LufePostBalanceIndicatorFields.Purchases, type: TableColumnType.Currency},
        {label: 'Ventas', value: LufePostBalanceIndicatorFields.Sales, type: TableColumnType.Currency}
    ]

    const getDates = () => {
        const dates: string[] = [];
        if (indicatorsOldestToNewest) {
            indicatorsOldestToNewest.map((item) => {
                dates.push(dateFormatter.toMonthNameWithYear(item?.[LufePostBalanceIndicatorFields.Period], true).toString())
            })
        }
        return dates
    }
    
    const getSales = () => {
        const sales: number[] = [];
        if (indicatorsOldestToNewest) {
            indicatorsOldestToNewest.map((item) => {
                sales.push(item?.[LufePostBalanceIndicatorFields.Sales])
            })
        }
        
        return sales
    }
    
    const getPurchases = () => {
        const purchases: number[] = [];
        if (indicatorsOldestToNewest) {
            indicatorsOldestToNewest.map((item) => {
                purchases.push(item?.[LufePostBalanceIndicatorFields.Purchases])
            })
        }

        return purchases
    }
    
    const data = {
        labels: getDates(),
        datasets: [
            {
                label: 'Ventas',
                data: getSales(),
                backgroundColor: ['rgb(0, 128, 255)'],
                borderColor: ['rgb(0, 128, 255)'],
                borderWidth: 1,
            },
            {
                label: 'Compras',
                data: getPurchases(),
                backgroundColor: ['rgb(255, 51, 51)'],
                borderColor: ['rgb(255, 51, 51)'],
                borderWidth: 1,
            },
        ],
    };
    
    return (
        <Stack spacing={1}>
            <TableList<LufePostBalanceIndicator> entityList={lufeData?.[LufeDetailFields.PostBalanceIndicatorsModelRequest]}
                                                 columns={cols}
                                                 isLoading={loading}
                                                 error={error}
                                                 keepBorderRadius
            />
            <Card>
                <CardContent>
                    <Line options={options} data={data} />
                </CardContent>
            </Card>
        </Stack>
    )
}


export default OffererLufePostBalanceIndicators