import React, {useState} from "react";
import {Box, Button, Card, CardContent, CardHeader, Collapse, Stack} from "@mui/material";
import {Timeline, timelineContentClasses} from "@mui/lab";
import TimelineSkeleton from "../../components/OffererSolicitation/OffererSolicitationEvent/TimelineSkeleton";
import OffererSolicitationHistoryTimelineItem from "./OffererSolicitationHistoryTimelineItem";
import {TypographyBase} from "components/misc/TypographyBase";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";

const ITEMS_TO_SHOW = 5;
function OffererSolicitationHistoryTimeline() {
    const { eventList, loadingEvents } = useSolicitation();
    const [showAll, setShowAll] = useState(false);
    const itemToShow = eventList ? Math.min(ITEMS_TO_SHOW, eventList.length) : ITEMS_TO_SHOW;
    const hasMore = eventList && eventList.length > ITEMS_TO_SHOW;
    
    return (
        <Card>
            <CardHeader title={'Historial de la solicitud'}/>

            <CardContent>
                {loadingEvents ? (
                    <TimelineSkeleton/>
                ) : (
                    eventList && eventList.length !== 0 ?
                        <Stack direction={'row'} justifyContent={'flex-start'}>
                            <Timeline
                                position={'left'}
                                sx={{
                                    [`& .${timelineContentClasses.root}`]: {
                                        flex: 0,
                                        p: '0px !important',
                                        m: '0px !important',
                                    },
                                    p: '0px !important',
                                    m: '0px !important',
                                }}
                            >

                                {
                                    eventList.slice(0, ITEMS_TO_SHOW).map((event, index) => (
                                        <OffererSolicitationHistoryTimelineItem event={event}
                                                                                showConnector={(showAll && hasMore) || index < itemToShow - 1}
                                        />
                                    ))
                                }

                                <Collapse in={showAll}>
                                    {eventList.slice(ITEMS_TO_SHOW).map((event, index) => (
                                        <OffererSolicitationHistoryTimelineItem event={event}
                                                                                showConnector={index < eventList.length - itemToShow - 1}
                                        />
                                    ))}
                                </Collapse>
                            </Timeline>
                        </Stack>
                        :
                        <Box sx={{width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', paddingY: '12px !important'}}>
                            <TypographyBase variant={'body4'} color={'text.lighter'} textAlign='center'>
                                No hay eventos registrados para esta solicitud
                            </TypographyBase>
                        </Box>
                )}
                {hasMore && (
                    <Stack>
                        <Button
                            variant="text"
                            fullWidth
                            onClick={() => setShowAll(prev => !prev)}
                        >
                            {showAll ? 'Ver menos' : 'Cargar más'}
                        </Button>
                    </Stack>
                )}
            </CardContent>
        </Card>
    )
}

export default OffererSolicitationHistoryTimeline;