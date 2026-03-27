import {Box, Stack} from "@mui/material";
import {Skeleton} from "@mui/lab";
import {PieChart} from "@mui/x-charts";
import {formatSolicitationServiceToChartType} from "../../../../util/formatters/chartFormatters";
import {SolicitationWithoutDataChart} from "./UserSolicitationsSummary";
import {useEffect, useState} from "react";
import {SolicitationTotalsView} from "../../../../types/solicitations/solicitationData";
import {HttpSolicitationTotals} from "../../../../http/solicitations/httpSolicitationTotals";


const UserSolicitationServicesChart = () => {
    const [serviceChartData, setServiceChartData] = useState<SolicitationTotalsView[]>()
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setLoading(true)
        HttpSolicitationTotals.getServiceTotals()
            .then((r) => setServiceChartData(r))
            .finally(() => setLoading(false))
    }, []);
    
    return (
        <Stack spacing={3}>
            {
                loading ?
                    <Box sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                        <Skeleton variant={'circular'} sx={{height: 120, width: 120}}/>
                    </Box>
                    :
                    serviceChartData && serviceChartData.length !== 0 ?
                        <Box sx={{width: '100%', display: 'flex', justifyContent:'center'}}>
                            <PieChart height={167}
                                      series={[
                                          {data: formatSolicitationServiceToChartType(serviceChartData),
                                              innerRadius: 45
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
                                              itemMarkHeight: 15,
                                              markGap: 5,
                                              itemGap: 10,
                                              labelStyle: {
                                                  fontSize: 11,
                                              }
                                          },

                                      }}
                            />
                        </Box>
                        :
                        <SolicitationWithoutDataChart description={'Acá podrás visualizar como se distribuyen las solicitudes en los distintos servicios'}/>
            }
        </Stack>
    )
}


export default UserSolicitationServicesChart