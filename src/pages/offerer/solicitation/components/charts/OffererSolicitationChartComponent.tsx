import {SolicitationTotalsView} from "../../../../../types/solicitations/solicitationData";
import {SolicitationWithoutDataChart} from "../../../../markets/solicitations/components/UserSolicitationsSummary";
import {Skeleton, Box, Stack} from "@mui/material";
import {PieChart} from "@mui/x-charts";
import {defaultPieColors, formatSolicitationTotalsToChartType} from "../../../../../util/formatters/chartFormatters";
import {TypographyBase} from "../../../../../components/misc/TypographyBase";
import {EntityWithIdAndDescriptionFields} from "../../../../../types/baseEntities";


interface OffererSolicitationChartComponentProps {
    textWithoutData: string,
    data?: SolicitationTotalsView[] 
}


const OffererSolicitationChartComponent = ({textWithoutData, data} : OffererSolicitationChartComponentProps) => {
    
    return (
        <Box sx={{width: '100% !important'}}>
            {
                data ?
                    data.length == 0 ?
                        <SolicitationWithoutDataChart description={textWithoutData}/>
                        :
                        <Stack direction={'row'} spacing={-2} sx={{width: '100%'}} alignItems={'center'}>
                            <Box sx={{width: '60%', display: 'flex', justifyContent:'center'}}>
                                <PieChart colors={defaultPieColors}
                                          height={210}
                                          width={310}
                                          series={[
                                              {data: formatSolicitationTotalsToChartType(data),
                                                  innerRadius: 45
                                              }
                                          ]}
                                          slotProps={{
                                              legend: {
                                                  hidden: true,
                                              },
                                          }}
                                />
                            </Box>
                            <Stack sx={{ justifyContent: 'center', width: '40%', overflow: 'hidden', height: '100%' }}>
                                {data.map((i, ix) => (
                                    <Stack key={`ix_${ix}_${i.id}`} direction={'row'} alignItems={'center'}>
                                        <Box
                                            sx={{
                                                width: 2,
                                                height: 20,
                                                backgroundColor: defaultPieColors[ix],
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
                    <Box sx={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                        <Skeleton variant={'circular'} sx={{height: 120, width: 120, textAlign: 'center'}} />
                    </Box>
            }
        </Box>
    )
}


export default OffererSolicitationChartComponent