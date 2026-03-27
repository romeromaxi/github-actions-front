import React, {useEffect, useState} from "react";
import {Card, CardContent, CardHeader, Stack, Button, Collapse, Alert, Box} from "@mui/material";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import TimelineSkeleton from "../../components/OffererSolicitation/OffererSolicitationEvent/TimelineSkeleton";
import {
    Timeline,
    timelineContentClasses
} from "@mui/lab";
import {TypographyBase} from "components/misc/TypographyBase";

import {HttpSolicitationsNotes} from "../../../../http/solicitations/httpSolicitationsNotes";
import {SolicitationNote} from "../../../../types/solicitations/solicitationsNotesData";
import SolicitationNoteComponent from "pages/solicitations/notes/SolicitationNoteComponent";
import DataBorderBox from "../../../../components/misc/DataBorderBox";
import OffererSolicitationHistoryTimelineItem from '../components/OffererSolicitationHistoryTimelineItem';
import {EntityWithIdFields} from "../../../../types/baseEntities";

const ITEMS_TO_SHOW = 5;

function OffererSolicitationTabHistoryTimeline() {
    const [notes, setNotes] = useState<SolicitationNote[]>();
    const { solicitation, eventList, loadingEvents } = useSolicitation();
    const [showAll, setShowAll] = useState(false);
    const itemToShow = eventList ? Math.min(ITEMS_TO_SHOW, eventList.length) : ITEMS_TO_SHOW;
    const hasMore = eventList && eventList.length > ITEMS_TO_SHOW;

    
    const loadNotes = () => {
        if (solicitation) {
            HttpSolicitationsNotes.search(solicitation[EntityWithIdFields.Id])
                .then(setNotes)
        }
    }

    useEffect(() => {
        loadNotes();
    }, []);

    return (
        <Stack direction={"column"} spacing={3}>
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
            <Card>
                <CardHeader title={'Seguimiento interno'}/>
                <CardContent>
                    <Stack spacing={3}>
                        {
                            notes ?
                                notes.length !== 0 ?
                                    notes.map((note, idx) => (
                                        <SolicitationNoteComponent key={idx} note={note} />
                                    ))
                                    :
                                    <Alert severity="info">No hay notas para esta solicitud</Alert>
                                :
                                Array.from({length: 2}).map((_, idx) => (
                                    <DataBorderBox key={idx} title={''} loading />
                                ))
                        }
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    )
}

export default OffererSolicitationTabHistoryTimeline;
