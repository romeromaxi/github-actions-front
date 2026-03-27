import React from 'react';
import {Card, CardContent, CardHeader} from '@mui/material';
import { DebtHistoryDetail } from 'types/nosis/nosisData';
import DebtAmountTotalsLineChart from './DebtAmountTotalsLineChart';

interface LastTwelveMonthsReportCardProps {
    title: string,
    subtitle: React.ReactNode,
    debtHistoryDetailList?: DebtHistoryDetail[];
}

function LastTwelveMonthsReportCard({title, subtitle, debtHistoryDetailList}: LastTwelveMonthsReportCardProps) {
    return (
        <Card>
            <CardHeader title={title}
                        subheader={subtitle}
            />
            
            <CardContent>
                <DebtAmountTotalsLineChart debtHistoryDetailList={debtHistoryDetailList} />
            </CardContent>
        </Card>
    );
}

export default LastTwelveMonthsReportCard;
