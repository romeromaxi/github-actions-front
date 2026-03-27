import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {Button, Card, CardActions, CardContent, Grid} from "@mui/material";
import {SolicitationViewDTO} from "types/solicitations/solicitationData";
import {
    SolicitationTrackingFields,
    SolicitationTrackingUpdateStatus
} from "types/solicitations/solicitationTrackingData";
import {RequiredSelectSchema, RequiredStringSchema} from "util/validation/validationSchemas";
import {
    HttpSolicitationTrackingInstrumentation
} from "http/solicitations/httpSolicitationTrackingInstrumentation";
import {EntityWithIdFields} from "types/baseEntities";
import {useAction} from "hooks/useAction";
import useAxios from "hooks/useAxios";
import {AsyncSelect, ControlledTextFieldFilled} from "components/forms";
import {Skeleton} from "@mui/lab";
import {HttpCacheSolicitation} from "http/index";
import {useSolicitation} from "../../../hooks/contexts/SolicitationsContext";

interface SolicitationTrackingInstrumentationOffererProps {
    solicitation: SolicitationViewDTO
}


function SolicitationTrackingInstrumentationOfferer({ solicitation }: SolicitationTrackingInstrumentationOffererProps) {
    const { isStageResponsible } = useSolicitation();
    const {fetchData} = useAxios();
    const {snackbarSuccess} = useAction();
    const [loading, setLoading] = useState<boolean>(true);
    
    const solicitationTrackingUpdateStatusSchema = yup.object().shape({
        [SolicitationTrackingFields.SolicitationTrackingStatusCode]: RequiredSelectSchema,
        [SolicitationTrackingFields.Observations]: RequiredStringSchema,
    });
    const { control, handleSubmit, reset } = useForm<SolicitationTrackingUpdateStatus>({
        resolver: yupResolver(solicitationTrackingUpdateStatusSchema)
    });
    
    const onHandleSubmitUpdateStatus = (data: SolicitationTrackingUpdateStatus) =>
        fetchData(
            () => HttpSolicitationTrackingInstrumentation.updateTrackingStatus(solicitation[EntityWithIdFields.Id], data),
            true
        )
            .then(() => {
                snackbarSuccess("Se actualizó el seguimiento exitosamente!");
            })

    useEffect(() => {
        setLoading(true);
        HttpSolicitationTrackingInstrumentation.getByIdSolicitation(solicitation[EntityWithIdFields.Id])
            .then(response => {
                reset(response);
                setLoading(false);
            })
    }, []);
    
    return (
        <Card>
            <CardContent>
                {
                    loading ?
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Skeleton />
                            </Grid>
                            <Grid item xs={12}>
                                <Skeleton />
                            </Grid>
                        </Grid>
                        :
                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <AsyncSelect label={'Estado'}
                                             control={control}
                                             loadOptions={HttpCacheSolicitation.getSolicitationTrackingGlobalStatuses}
                                             name={SolicitationTrackingFields.SolicitationTrackingStatusCode}
                                             disabled={!isStageResponsible}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <ControlledTextFieldFilled label={'Observaciones'}
                                                           control={control}
                                                           name={SolicitationTrackingFields.Observations}
                                                           multiline
                                                           minRows={3}
                                                           maxRows={8}
                                                           disabled={!isStageResponsible}
                                />
                            </Grid>
                        </Grid>
                }
            </CardContent>

            {
                isStageResponsible &&
                    <CardActions>
                        <Button variant={'contained'}
                                onClick={handleSubmit(onHandleSubmitUpdateStatus)}
                        >
                            Guardar
                        </Button>
                    </CardActions>
            }
        </Card>
    )
}

export default SolicitationTrackingInstrumentationOfferer;