import {AdHistoryView, AdHistoryViewFields} from "../../../types/ad/adData";
import TimelineSkeleton from "../../offerer/components/OffererSolicitation/OffererSolicitationEvent/TimelineSkeleton";
import {Alert, Stack, Typography} from "@mui/material";
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
import {dateFormatter} from "../../../util/formatters/dateFormatter";
import {SolicitationEventViewFields} from "../../../types/solicitations/solicitationEventData";
import React from "react";
import {ITableColumn, TableColumnType, TableList} from "../../../components/table";


interface AdHistoryDrawerContentProps {
    history?: AdHistoryView[]
}


const AdHistoryDrawerContent = ({history} : AdHistoryDrawerContentProps) => {
    
    return (
        !history ? (
        <TimelineSkeleton />
        ) : (
        history.length !== 0 ?
            <Stack direction={'row'} justifyContent={'flex-start'}>
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
                                                fontSize: '0.7rem',
                                                overflowWrap: 'anywhere',
                                            }}
                                        >
                                            {event[AdHistoryViewFields.UserBusinessName]}
                                        </Typography>
                                        <Typography variant={'caption'}>
                                            {
                                                event[AdHistoryViewFields.Observations]
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
                                            event[SolicitationEventViewFields.Date],
                                        )}
                                    </Typography>
                                </TimelineContent>
                            </TimelineItem>
                        );
                    })}
                </Timeline>
            </Stack>
            :
            <Alert>Esta publicidad no cuenta con historial</Alert>
    )
    )
}


export const AdHistoryDrawerTableList = ({history} : AdHistoryDrawerContentProps) => {
    const columns: ITableColumn[] = [
        {label: 'Fecha', type: TableColumnType.Date, value: AdHistoryViewFields.Date, minPadding: true},
        {label: 'Detalle', value: AdHistoryViewFields.Observations, minPadding: true},
        {label: 'Usuario', value: AdHistoryViewFields.UserBusinessName, minPadding: true},
    ]
    
    
    return (
        <TableList entityList={history}
                   columns={columns}
                   isLoading={!history}
                   error={false}
                   keepBorderRadius
        />
    )
}


export default AdHistoryDrawerContent