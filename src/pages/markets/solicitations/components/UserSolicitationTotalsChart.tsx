import {useEffect, useState} from "react";
import {SolicitationTotalsView} from "../../../../types/solicitations/solicitationData";
import {HttpSolicitationTotals} from "../../../../http/solicitations/httpSolicitationTotals";
import {Box, Stack} from "@mui/material";
import {Skeleton} from "@mui/lab";
import {PieChart} from "@mui/x-charts";
import {formatSolicitationTotalsToChartType} from "../../../../util/formatters/chartFormatters";
import {TypographyBase} from "../../../../components/misc/TypographyBase";
import {EntityWithIdAndDescriptionFields} from "../../../../types/baseEntities";
import {SolicitationWithoutDataChart} from "./UserSolicitationsSummary";


const UserSolicitationTotalsChart = () => {
    const [totalChartData, setTotalChartData] = useState<SolicitationTotalsView[]>()
    const [loading, setLoading] = useState<boolean>(false)
    
    useEffect(() => {
        setLoading(true)
        HttpSolicitationTotals.getTotals()
            .then((r) => setTotalChartData(r))
            .finally(() => setLoading(false))
    }, []);

    const pieColors: string[] = [
        '#1f77b4',
        '#ff7f0e',
        '#2ca02c',
        '#d62728',
        '#9467bd',
        '#8c564b',
        '#e377c2',
        '#7f7f7f',
        '#bcbd22',
        '#17becf',
    ]
    
    return (
        <Stack spacing={3}>
            {
                loading ?
                    <Box sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                        <Skeleton variant={'circular'} sx={{height: 120, width: 120, textAlign: 'center'}} />
                    </Box>
                    :
                    totalChartData && totalChartData.length !== 0 ?
                        <Stack sx={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'space-between' }} direction={'row'}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    width: '40%',
                                    height: '100%',
                                }}
                            >
                                <PieChart
                                    height={210}
                                    width={310}
                                    colors={pieColors}
                                    series={[
                                        {
                                            data: formatSolicitationTotalsToChartType(totalChartData),
                                            innerRadius: 50,
                                        },
                                    ]}
                                    slotProps={{
                                        legend: {
                                            hidden: true,
                                        },
                                    }}
                                />
                            </Box>

                            <Stack sx={{ justifyContent: 'center', width: '60%', overflow: 'hidden', height: '100%' }}>
                                {totalChartData.map((i, ix) => (
                                    <Stack key={`ix_${ix}_${i.id}`} direction={'row'} alignItems={'center'}>
                                        <Box
                                            sx={{
                                                width: 2,
                                                height: 20,
                                                backgroundColor: pieColors[ix],
                                                marginRight: 1,
                                                borderRadius: '100%'
                                            }}
                                        />
                                        <TypographyBase variant={'caption'} tooltip maxLines={1}>
                                            {i[EntityWithIdAndDescriptionFields.Description]}
                                        </TypographyBase>
                                    </Stack>
                                ))}
                            </Stack>
                        </Stack>
                        :
                        <SolicitationWithoutDataChart description={'Acá podrás visualizar como se distribuyen las solicitudes en los bancos correspondientes a cada una'}/>
            }
        </Stack>
    )
}


export default UserSolicitationTotalsChart