import React from 'react';
import {
  DebtHistoryDetail,
  DebtHistoryDetailFields,
} from 'types/nosis/nosisData';
import { sum } from 'util/helpers';
import LineChart from 'components/charts/LineChart';
import { dateFormatter } from 'util/formatters/dateFormatter';
import { numberFormatter } from 'util/formatters/numberFormatter';
import {Box, Stack} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";

interface DebtAmountTotalsLineChartProps {
  debtHistoryDetailList?: DebtHistoryDetail[];
}

function DebtAmountTotalsLineChart({ debtHistoryDetailList}: DebtAmountTotalsLineChartProps) {
    return (
        <Stack spacing={1.5}>
            <Box sx={{ width: 1, height: '320px' }}>
                <LineChart title={''} 
                           data={Object.values(
                               sum(debtHistoryDetailList?.reverse(), DebtHistoryDetailFields.Period, DebtHistoryDetailFields.Amount,),
                           )} 
                           labels={Object.keys(
                               sum(debtHistoryDetailList?.reverse(), DebtHistoryDetailFields.Period, DebtHistoryDetailFields.Amount,),)
                               .map((p) => dateFormatter.toFormat(p, 'YYYY/MM')
                           )}
                           options={{
                               maintainAspectRatio: false, 
                               plugins: { legend: { display: false } }, 
                               scales: {
                                   y: {
                                       ticks: {
                                           padding: 0, 
                                           callback: (label) => 
                                               numberFormatter.toStringWithAmount(
                                                   parseInt(label.toString()), '$', 0,),
                                       },
                                   },
                               },
                           }}
                />
            </Box>    
        
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Box width={'0.9375rem'} 
                     height={'0.9375rem'} 
                     borderRadius={'34px'} 
                     sx={{ boxShadow: `0 0 0 3px #0D94BE` }}
                />
                
                <TypographyBase variant={'body3'} color={'text.lighter'}>
                    Monto total informado
                </TypographyBase>
            </Stack>
        </Stack>
    );
}

export default DebtAmountTotalsLineChart;
