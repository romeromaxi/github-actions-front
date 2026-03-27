import React, {useCallback} from "react";
import {Button, Card, CardContent, CardHeader, Skeleton, Stack} from "@mui/material";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {SolicitationEventView} from "types/solicitations/solicitationEventData";
import OffererSolicitationHistoryTimelineItem from './OffererSolicitationHistoryTimelineItem';
import {Timeline, timelineContentClasses} from "@mui/lab";
import {useAppNavigation} from "hooks/navigation";
import {OffererRoute} from "routes/offerer/routeAppOffererData";
import {EntityWithIdFields} from "types/baseEntities";

function OffererSolicitationLastEventCard() {
    const { solicitation, betweenOfferers, eventList, loadingEvents } = useSolicitation();
    const { navigate } = useAppNavigation()
    
    const lastEvent: SolicitationEventView | undefined = eventList && eventList.length > 0 ? eventList[0] : undefined;

    const handleNavigateToHistory = useCallback(() => {
        if (solicitation)
            navigate(
                OffererRoute.OffererSolicitationDetailInternalTracking,
                { solicitationId: solicitation[EntityWithIdFields.Id] as number },
                undefined,
                { replace: true }
            );
    }, [solicitation]);

    if (loadingEvents) {
        return (
            <Card>
                <CardHeader title={'Último cambio en la solicitud'} />
                <CardContent>
                    <Stack spacing={2}>
                        <Skeleton variant="text" width="80%" />
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="50%" />
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    if (!lastEvent || betweenOfferers) {
        return null;
    }

    return (
        <Card>
            <CardHeader title={'Último cambio en la solicitud'} action={<Button
                variant="text"
                size="small"
                onClick={handleNavigateToHistory}
            >
                Ir al historial
            </Button>}/>
            <CardContent>
                <Stack spacing={2}>
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
                        <OffererSolicitationHistoryTimelineItem event={lastEvent} showConnector={false} />
                    </Timeline>
                </Stack>
            </CardContent>
        </Card>
    );
}

export default OffererSolicitationLastEventCard;
