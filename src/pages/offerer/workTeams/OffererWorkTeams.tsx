import {Alert, Card, CardContent, Grid, Stack, Tooltip, Typography} from "@mui/material";
import React, {Fragment, useContext, useEffect, useState} from "react";
import {LoaderBlockUI} from "../../../components/loader";
import {OffererWorkTeamView, OffererWorkTeamViewFields} from "../../../types/offerer/offererSolicitationData";
import {useAction} from "../../../hooks/useAction";
import {HttpOffererWorkTeams} from "../../../http/offerer/httpOffererWorkTeams";
import {AppConfigFields, AppConfigPaletteColorFields, AppConfigPaletteFields} from "../../../types/appConfigEntities";
import OffererWorkTeamAvatar from "./OffererWorkTeamAvatar";
import {stringFormatter} from "../../../util/formatters/stringFormatter";
import {DataWithLabel} from "../../../components/misc/DataWithLabel";
import {EntityWithIdFields} from "../../../types/baseEntities";
import {OffererContext} from "../components/OffererContextProvider";


const OffererWorkTeams = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [groups, setGroups] = useState<OffererWorkTeamView[]>();
    const { snackbarError } = useAction();
    const offerer  = useContext(OffererContext)
    const offererId = offerer[EntityWithIdFields.Id]

    useEffect(() => {
        setLoading(true);

            HttpOffererWorkTeams.getListByLoggedUser(offererId)
            .then((groups) => {
                setGroups(groups);
            })
            .catch(() =>
                snackbarError(
                    'Ocurrió un error al cargar los equipos de trabajo',
                ),
            )
            .finally(() => setLoading(false));
    }, [offererId]);

    const drawGroup = (group: OffererWorkTeamView) => {
        return (
            <Fragment>
                <Grid
                    item
                    md={5.8}
                    sx={{ border: `2px dashed ${window.APP_CONFIG[AppConfigFields.Palette][AppConfigPaletteFields.Primary][AppConfigPaletteColorFields.Main]}`, borderRadius: '8px', p: 2 }}
                >
                    <Stack direction={'row'} alignItems={'center'} spacing={2}>
                        <OffererWorkTeamAvatar workTeam={group} />
                        <Stack>
                            <Tooltip title={group[OffererWorkTeamViewFields.Name]}>
                                <Typography
                                    fontSize={'1.5rem'}
                                    fontWeight={600}
                                    color={'primary.main'}
                                >
                                    {stringFormatter.cutIfHaveMoreThan(
                                        group[OffererWorkTeamViewFields.Name],
                                        25,
                                    )}
                                </Typography>
                            </Tooltip>
                            <DataWithLabel
                                label={'Integrantes'}
                                data={group[OffererWorkTeamViewFields.UsersQuantity]}
                                rowDirection
                                labelProps={{ fontSize: '15px' }}
                                dataProps={{ fontSize: '18px !important' }}
                            />
                        </Stack>
                    </Stack>
                </Grid>
                <Grid item md={0.1}></Grid>
            </Fragment>
        );
    };
    
    return (
    <Card>
        <CardContent>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12} container spacing={2}>
                    <Grid item xs={12}>
                        <Typography
                            variant="h4"
                            fontWeight={600}
                            lineHeight={1.2}
                            fontSize={'1.5rem'}
                        >
                            Mis Equipos de Trabajo
                        </Typography>
                    </Grid>
                    <Grid container spacing={2} item xs={12}>
                        {groups && groups.length !== 0 ? (
                            groups.map((g, idx) => drawGroup(g))
                        ) : (
                            <Alert severity={'info'}>
                                Aún no perteneces a ningún equipo de trabajo
                            </Alert>
                        )}
                    </Grid>
                </Grid>
                    {loading && <LoaderBlockUI />}
                </Grid>
        </CardContent>
    </Card>
    )
}


export default OffererWorkTeams