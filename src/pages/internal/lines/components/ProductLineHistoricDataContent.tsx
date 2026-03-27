import {ProductLineChosenHistoryFields, ProductLineChosenHistoryView} from "../../../../types/lines/productLineData";
import {
    Timeline,
    TimelineConnector,
    TimelineContent,
    timelineContentClasses,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator
} from "@mui/lab";
import {Alert, Stack, Typography} from "@mui/material";
import {dateFormatter} from "../../../../util/formatters/dateFormatter";
import TimelineSkeleton
    from "../../../offerer/components/OffererSolicitation/OffererSolicitationEvent/TimelineSkeleton";
import React from "react";
import {ITableColumn, TableColumnType, TableList} from "../../../../components/table";


interface ProductLineHistoricDataContentProps {
    history?: ProductLineChosenHistoryView[]
}


const ProductLineHistoricDataContent = ({history}: ProductLineHistoricDataContentProps) => {
    
    
    return (
        history ?
            history.length !== 0 ?
                <Timeline
                    position={'left'}
                    sx={{
                        [`& .${timelineContentClasses.root}`]: {
                            flex: 0.2,
                        },
                    }}
                >
                    {history.map((event, index) => {
                        return (
                            <TimelineItem key={index} sx={{ minHeight: 'auto' }}>
                                <TimelineOppositeContent sx={{ pr: 0, mt: 0.3 }}>
                                    <Stack>
                                        <Typography
                                            sx={{
                                                color: '#A1A5B7',
                                                overflowWrap: 'anywhere',
                                                fontSize: '0.7rem'
                                            }}
                                        >
                                            {event[ProductLineChosenHistoryFields.UserBusinessName]}
                                        </Typography>
                                        <Typography variant={'caption'}>
                                            {
                                                event[
                                                    ProductLineChosenHistoryFields.Observations
                                                    ]
                                            }
                                        </Typography>
                                    </Stack>
                                </TimelineOppositeContent>
                                <TimelineSeparator>
                                    <TimelineDot
                                        variant={'outlined'}
                                        color={'grey'}
                                        sx={{ borderWidth: 2.5 }}
                                    />
                                    {index + 1 < history.length && (
                                        <TimelineConnector sx={{ mb: -1, mt: -1 }} />
                                    )}
                                </TimelineSeparator>
                                <TimelineContent sx={{ pl: 0, mt: 0.3 }}>
                                    <Typography variant={'subtitle2'}>
                                        {dateFormatter.toShortDate(
                                            event[ProductLineChosenHistoryFields.Date],
                                        )}
                                    </Typography>
                                </TimelineContent>
                            </TimelineItem>
                        );
                    })}
                </Timeline>
                :
                <Alert severity='info'>Esta línea no cuenta con un historial.</Alert>
            :
            <TimelineSkeleton />
    )
}


export const ProductLineHistoricTable = ({history} : ProductLineHistoricDataContentProps)  => {
    const columns: ITableColumn[] = [
        {label: 'Fecha', value: ProductLineChosenHistoryFields.Date, type: TableColumnType.Date, minPadding: true},
        {
            label: 'Detalle', value: ProductLineChosenHistoryFields.Observations,
            textAlign: 'left', minPadding: true,
            onRenderCell: (e: ProductLineChosenHistory) => (
                <Stack>
                    <Typography variant={'subtitle2'} fontWeight={300} color={'text.lighter'}>
                        {e[ProductLineChosenHistoryFields.UserBusinessName]}
                    </Typography>
                    <Typography fontWeight={400}>
                        {e[ProductLineChosenHistoryFields.Observations]}
                    </Typography>
                </Stack>
            )
        },
        //{label: 'Usuario', value: ProductLineChosenHistoryFields.UserBusinessName, minPadding: true}
    ]
    
    return (
        <TableList entityList={history}
                   columns={columns}
                   isLoading={!history}
                   error={false}
        />
    )
}


export default ProductLineHistoricDataContent