import {Alert, Card, CardContent, Divider, Grid, Stack} from "@mui/material";
import {SolicitationViewDTO} from "types/solicitations/solicitationData";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {SolicitationTrackingFields, SolicitationTrackingView} from "types/solicitations/solicitationTrackingData";
import {EntityWithIdAndDescription, EntityWithIdFields} from "types/baseEntities";
import {HttpCacheSolicitation} from "http/index";
import {HttpSolicitationTracking} from "http/solicitations/httpSolicitationTracking";
import SolicitationTrackingTableOfferer from "./SolicitationTrackingTableOfferer";
import {TypographyBase} from "components/misc/TypographyBase";


interface SolicitationTrackingOffererProps {
    solicitation: SolicitationViewDTO
}

function SolicitationTrackingOfferer({ solicitation }: SolicitationTrackingOffererProps) {
    const [dataTrackings, setDataTrackings] = useState<SolicitationTrackingView[]>();
    const [automaticTrackings, setAutomaticTrackings] = useState<SolicitationTrackingView[]>();
    const [trackingsStatus, setTrackingsStatus] = useState<EntityWithIdAndDescription[]>();
    const hasTracked = useMemo(() => (
        (!!dataTrackings && !!dataTrackings.length) || (!!automaticTrackings && !!automaticTrackings.length)
    ), [dataTrackings, automaticTrackings]);

    const loadTrackingStatus = useCallback(() => 
        trackingsStatus ? Promise.resolve(trackingsStatus) : undefined, [trackingsStatus])

    const loadSolicitationTrackings = () => {
        setDataTrackings(undefined);
        HttpSolicitationTracking.getByIdSolicitation(solicitation[EntityWithIdFields.Id])
            .then(trackings => {
                setDataTrackings(trackings.filter(x => !x[SolicitationTrackingFields.IsTrackedByPlatform]))
                setAutomaticTrackings(trackings.filter(x => x[SolicitationTrackingFields.IsTrackedByPlatform]))
            })
    }
    
    useEffect(() => {
        loadSolicitationTrackings();
    }, []);

    useEffect(() => {
        if (!trackingsStatus)
            HttpCacheSolicitation.getSolicitationTrackingStatuses().then(setTrackingsStatus)
    }, []);
        
    return (
        <Card>
            <CardContent>
                {
                    (!hasTracked) ?
                        <Alert severity={"info"} color={"info"}>
                            Cuando recibas respuestas de las entidades con las que compartiste la solicitud,
                            se reflejarán en esta pantalla y podrás hacer el seguimiento de las mismas
                        </Alert>
                        :
                        <Grid container spacing={4}>
                            {
                                (!automaticTrackings || !!automaticTrackings.length) &&
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <Stack>
                                                <TypographyBase fontWeight={500}>
                                                    Seguimiento automático (derivadas dentro de Luc)
                                                </TypographyBase>
                                                <Divider />
                                            </Stack>
        
                                            <SolicitationTrackingTableOfferer solicitationId={solicitation[EntityWithIdFields.Id]}
                                                                              dataTrackings={automaticTrackings}
                                                                              loadTrackingStatus={loadTrackingStatus}
                                                                              onReload={loadSolicitationTrackings}
                                            />
                                        </Stack>
                                    </Grid>
                            }

                            {
                                (!dataTrackings || !!dataTrackings.length) &&
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <Stack>
                                                <TypographyBase fontWeight={500}>
                                                    Seguimiento manual (derivadas por mail)
                                                </TypographyBase>
                                                <Divider />
                                            </Stack>
        
                                            <SolicitationTrackingTableOfferer solicitationId={solicitation[EntityWithIdFields.Id]}
                                                                              dataTrackings={dataTrackings}
                                                                              loadTrackingStatus={loadTrackingStatus}
                                                                              onReload={loadSolicitationTrackings}
                                                                              allowEdit
                                            />
                                        </Stack>
                                    </Grid>
                            }
                        </Grid>
                }
            </CardContent>
        </Card>
    )
}

export default SolicitationTrackingOfferer;