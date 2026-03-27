import React, {useCallback, useEffect, useState} from "react";
import {Card, CardContent, CardHeader, Stack, Typography} from "@mui/material";
import {
    Timeline, TimelineConnector, TimelineContent,
    timelineContentClasses,
    TimelineDot,
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator
} from "@mui/lab";
import {
    SolicitationEventView,
    SolicitationEventViewFields
} from "../../../../types/solicitations/solicitationEventData";
import {HttpSolicitationEvent} from "../../../../http/solicitations/httpSolicitationEvent";
import {RefreshIconButton} from "../../../buttons/Buttons";
import TimelineSkeleton
    from "../../../../pages/offerer/components/OffererSolicitation/OffererSolicitationEvent/TimelineSkeleton";
import {eventColors} from "./OffererSolicitationEventTimeline";
import {dateFormatter} from "../../../../util/formatters/dateFormatter";


interface CompanySolicitationEventTimelineProps {
    solicitationId: number
}


const CompanySolicitationEventTimeline = ({solicitationId} : CompanySolicitationEventTimelineProps) => {
    const [eventList, setEventList] = useState<SolicitationEventView[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const loadEventList = useCallback(() => {
        setLoading(true);
        HttpSolicitationEvent.getEventList(solicitationId).then((responseList) => {
            setEventList(responseList);
            setLoading(false);
        });
    }, [solicitationId]);

    useEffect(() => {
        loadEventList();
    }, [loadEventList]);

    return (
        <Card>
            <CardHeader
                title={'Historial'}
                subheader={'Últimas actividades'}
                action={<RefreshIconButton onClick={loadEventList} sx={{ mt: 1 }} />}
            ></CardHeader>
            <CardContent sx={{ p: 0 }}>
                {loading ? (
                    <TimelineSkeleton />
                ) : (
                    <Stack direction={'row'} justifyContent={'flex-start'}>
                        <Timeline
                            position={'left'}
                            sx={{
                                [`& .${timelineContentClasses.root}`]: {
                                    flex: 0.2,
                                },
                            }}
                        >
                            {eventList.map((event, index) => {
                                return (
                                    <TimelineItem key={index}>
                                        <TimelineOppositeContent sx={{ pr: 0, mt: 0.3 }}>
                                            <Typography variant={'subtitle1'}>
                                                {event[SolicitationEventViewFields.EventTypeCompanyDesc]}
                                            </Typography>
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <TimelineDot
                                                variant={'outlined'}
                                                sx={{
                                                    borderColor:
                                                        eventColors[
                                                            event[SolicitationEventViewFields.EventTypeCode]
                                                            ],
                                                    borderWidth: 2.5,
                                                }}
                                            />
                                            {index + 1 < eventList.length && (
                                                <TimelineConnector sx={{ mb: -1, mt: -1 }} />
                                            )}
                                        </TimelineSeparator>
                                        <TimelineContent sx={{ pl: 0, mt: 0.3 }}>
                                            <Stack direction={'column'}>
                                                <Typography variant={'subtitle2'}>
                                                    {dateFormatter.toShortDate(
                                                        event[SolicitationEventViewFields.Date],
                                                    )}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color: '#A1A5B7',
                                                        fontSize: '0.75rem',
                                                        overflowWrap: 'anywhere',
                                                    }}
                                                >
                                                    {event[SolicitationEventViewFields.UserDesc]}
                                                </Typography>
                                            </Stack>
                                        </TimelineContent>
                                    </TimelineItem>
                                );
                            })}
                        </Timeline>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}


export default CompanySolicitationEventTimeline