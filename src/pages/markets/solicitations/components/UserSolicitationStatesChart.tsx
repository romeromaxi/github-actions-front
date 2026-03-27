import {Box, Stack} from "@mui/material";
import {Skeleton} from "@mui/lab";
import {PieChart} from "@mui/x-charts";
import {formatSolicitationStatesToChartType} from "../../../../util/formatters/chartFormatters";
import {SolicitationWithoutDataChart} from "./UserSolicitationsSummary";
import {useEffect, useState} from "react";
import {SolicitationTotalsView, SolicitationTotalsViewFields} from "../../../../types/solicitations/solicitationData";
import {HttpSolicitationTotals} from "../../../../http/solicitations/httpSolicitationTotals";



const UserSolicitationStatesChart = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [stateChartData, setStateChartData] = useState<SolicitationTotalsView[]>()

    useEffect(() => {
        setLoading(true)
        HttpSolicitationTotals.getStateTotals()
            .then((r) =>
                setStateChartData(r.sort((a, b) => a[SolicitationTotalsViewFields.SolicitationsQuantity] < b[SolicitationTotalsViewFields.SolicitationsQuantity] ? 1 : -1)))
            .finally(() => setLoading(false))
    }, []);
    
    return (
        <Stack spacing={3}>
            {
                loading ?
                    <Box sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                        <Skeleton variant={'circular'} sx={{height: 120, width: 120, textAlign: 'center'}} />
                    </Box>
                    :
                    stateChartData && stateChartData.length !== 0 ?
                        <Box sx={{width: '100%', display: 'flex', justifyContent:'center'}}>
                            <PieChart
                                height={200}
                                width={400}
                                series={[
                                    {
                                        data: formatSolicitationStatesToChartType(stateChartData),
                                        innerRadius: 45,
                                        outerRadius: 80,
                                        valueFormatter: (item) => `${item.value}`,
                                        arcLabelMinAngle: 45,
                                    }
                                ]}
                                slotProps={{
                                    legend: {
                                        direction: "column",
                                        position: {
                                            vertical: 'middle',
                                            horizontal: 'right',
                                        },
                                        itemMarkWidth: 2,
                                        itemMarkHeight: 12,
                                        markGap: 4,
                                        itemGap: 6,
                                        labelStyle: {
                                            fontSize: 11,
                                        },
                                        padding: 10,
                                    },
                                }}
                                colors={formatSolicitationStatesToChartType(stateChartData).map(item => item.color)}
                                margin={{ top: 40, bottom: 40, left: 40, right: 120 }}
                            />
                        </Box>
                        :
                        <SolicitationWithoutDataChart description={'Acá podrás visualizar como se distribuyen las solicitudes en los distintos estados'}/>
            }
        </Stack>
    )
}


export default UserSolicitationStatesChart