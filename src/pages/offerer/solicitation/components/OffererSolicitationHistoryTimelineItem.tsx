import React from "react";
import {
    SolicitationEventView,
    SolicitationEventViewFields
} from "types/solicitations/solicitationEventData";
import {
    TimelineItem,
    TimelineOppositeContent,
    TimelineSeparator,
    TimelineDot,
    TimelineConnector,
    TimelineContent
} from "@mui/lab";
import {eventColors} from "components/solicitations/rightPanel/components/OffererSolicitationEventTimeline";
import {dateFormatter} from "util/formatters/dateFormatter";
import {TypographyBase} from "components/misc/TypographyBase";
import {Stack} from "@mui/material";

interface OffererSolicitationHistoryTimelineItemProps {
    event: SolicitationEventView,
    showConnector?: boolean
}

const OffererSolicitationHistoryTimelineItem: React.FC<OffererSolicitationHistoryTimelineItemProps> = ({ event, showConnector = false }) => {
    return (
        <TimelineItem>
            <TimelineOppositeContent sx={{pr: 0}}>
                <TypographyBase variant={'body2'} fontWeight={600}>
                    {event[SolicitationEventViewFields.EventTypeOffererDesc]}
                </TypographyBase>
            </TimelineOppositeContent>
            <TimelineSeparator>
                <TimelineDot
                    variant={'filled'}
                    sx={{
                        backgroundColor:
                            eventColors[
                                event[SolicitationEventViewFields.EventTypeCode]
                                ] || '#D9D9D9',
                        borderColor:
                            eventColors[
                                event[SolicitationEventViewFields.EventTypeCode]
                                ] || '#D9D9D9',
                        borderWidth: 2.5,
                        boxShadow: 'none'
                    }}
                />
                {
                    showConnector && (
                        <TimelineConnector sx={{mb: -1, mt: -1, backgroundColor: '#D9D9D9'}} 
                                           color={'red'}/>
                    )
                }
            </TimelineSeparator>
            <TimelineContent sx={{mt: 0.3}}>
                <Stack direction={'column'} spacing={0.25} sx={{mr: '16px !important', mt: '6px !important'}}>
                    <TypographyBase variant={'body3'} fontWeight={600}>
                        {dateFormatter.toShortDate(
                            event[SolicitationEventViewFields.Date],
                        )}
                    </TypographyBase>
                    <TypographyBase variant={'body4'} color={'text.lighter'}
                                    sx={{
                                        overflowWrap: 'anywhere',
                                    }}
                    >
                        {event[SolicitationEventViewFields.UserDesc]}
                    </TypographyBase>
                </Stack>
            </TimelineContent>
        </TimelineItem>
    )
}

export default OffererSolicitationHistoryTimelineItem;

