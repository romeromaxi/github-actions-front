import {Box, Dialog, DialogActions, DialogContent, Grid, Link, Stack, Typography} from "@mui/material";
import BaseDialogTitle from "../../components/dialog/BaseDialogTitle";
import React, {Fragment, useState} from "react";
import {grey} from "@mui/material/colors";
import {ConfirmButton} from "../../components/buttons/Buttons";
import {useForm} from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {HttpSolicitationAccess} from "../../http/solicitations/httpSolicitationAccess";
import {useAction} from "../../hooks/useAction";
import ControlledPin from "../../components/forms/ControlledPin";
import useAxios from "../../hooks/useAxios";
import {AppConfigFields, AppConfigLogosFields} from "types/appConfigEntities";
import {ControlledReCaptcha} from "../../components/forms/ControlledReCaptcha";
import {RequiredPinSchema} from "../../util/validation/validationSchemas";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

interface SharedSolicitationGuidDialogProps {
    open: boolean,
    guid: string,
    onConfirm: () => void
}

enum SharedSolicitationGuidDialogFormFields {
    PIN = 'pin',
    Captcha = 'captcha'
}

export interface SharedSolicitationGuidDialogForm {
    [SharedSolicitationGuidDialogFormFields.PIN]: string,
    [SharedSolicitationGuidDialogFormFields.Captcha]: string
}

const SharedSolicitationGuidDialog = ({open, guid, onConfirm} : SharedSolicitationGuidDialogProps) => {
    const [reset, resetCaptcha] = useState<boolean>(false);
    const navigate = useNavigate()
    const {snackbarSuccess, snackbarWarning} = useAction()
    const {fetchData} = useAxios()
    
    const sharedSolicitationSchema = yup.object().shape({
        [SharedSolicitationGuidDialogFormFields.PIN]: RequiredPinSchema,
    })
    
    const {control, handleSubmit, watch, setValue} = useForm<SharedSolicitationGuidDialogForm>({
        resolver: yupResolver(sharedSolicitationSchema)
    })
    
    const onSubmit = (d: SharedSolicitationGuidDialogForm) => {
        fetchData(
            () => HttpSolicitationAccess.validateAccessPin(guid, d),
            true
        ).then(() => {
            snackbarSuccess('El PIN se validó correctamente. Ya podés ver la solicitud compartida')
            localStorage.setItem(guid, 'ok')
            onConfirm()
        })
            .catch(() => {
                setValue(SharedSolicitationGuidDialogFormFields.Captcha, '');
                resetCaptcha(true);
            })
    }
    const onCloseDialog = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/', { replace: true });
        }
    }
    
    const watchCaptcha = watch(SharedSolicitationGuidDialogFormFields.Captcha)
    
    
    const refreshPin = () => {
        if (watchCaptcha) {
            fetchData(
                () => HttpSolicitationAccess.generateAccessPin(guid, watchCaptcha),
                true
            )
            .then((r) => {
                if (!r.tieneError) snackbarSuccess('El PIN se reenvió a tu casilla de correo')
            })
                .catch(() => {
                    setValue(SharedSolicitationGuidDialogFormFields.Captcha, '');
                    resetCaptcha(true);
                })
                .finally(() => resetCaptcha(true))
        }
        else {
            snackbarWarning('Captcha inválido')
            resetCaptcha(true)
        }
    }
    
    
    return (
        <Dialog open={open}
                onClose={onCloseDialog}
                maxWidth={'sm'}
                fullWidth
        >
            <BaseDialogTitle onClose={onCloseDialog} title={'Verificar identidad'} />
            <DialogContent>
                <Grid container spacing={4} pt={3}>
                    <Grid item xs={12}>
                        <Stack>
                            <Box
                                component={'img'}
                                sx={{
                                    height: 65,
                                    width: 130,
                                    m: '0 auto !important',
                                }}
                                src={window.APP_CONFIG[AppConfigFields.Logos][AppConfigLogosFields.Full]}
                            />
                        </Stack>
                    </Grid>
                    <Fragment>
                        <Grid item xs={12} textAlign={'center'}>
                            <Typography>
                                Para continuar, ingresá el PIN que te enviamos por mail.
                            </Typography>
                        </Grid>
                        <Grid item md={12} sx={{ textAlign: '-webkit-center' }}>
                            <Stack direction='row' alignItems='center' spacing={1} width={'fit-content'}>
                                <ControlledPin control={control} name={SharedSolicitationGuidDialogFormFields.PIN} />
                            </Stack>
                        </Grid>
                    </Fragment>
                    <Grid item container xs={12} justifyContent="center">
                        <ControlledReCaptcha
                            control={control}
                            reset={reset}
                            setReset={resetCaptcha}
                            name={SharedSolicitationGuidDialogFormFields.Captcha}
                        />
                        <Typography variant='caption' color='text.lighter' mt={2}>
                            Si no recibiste el código o ya está vencido, podés <Link onClick={refreshPin} sx={{fontWeight: 500, fontSize: 16}}>reenviarlo</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ width: '100% '}}>
                        <Stack direction={'row-reverse'} sx={{ width: '100% '}}>
                            <ConfirmButton size={'small'} onClick={handleSubmit(onSubmit)}>Confirmar</ConfirmButton>
                        </Stack>
            </DialogActions>
        </Dialog>
    )
}


export default SharedSolicitationGuidDialog