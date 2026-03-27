import {Dialog, DialogActions, DialogContent, Grid, Stack, Typography} from "@mui/material";
import BaseDialogTitle from "../../components/dialog/BaseDialogTitle";
import React, {useState} from "react";
import {grey} from "@mui/material/colors";
import {CloseButton, ConfirmButton, RefreshIconButton} from "../../components/buttons/Buttons";
import { useForm } from "react-hook-form";
import {useNavigate} from "react-router-dom";
import {useAction} from "../../hooks/useAction";
import ControlledPin from "../../components/forms/ControlledPin";
import useAxios from "../../hooks/useAxios";
import {ControlledReCaptcha} from "../../components/forms/ControlledReCaptcha";
import {SharedDocumentationValidation, SharedDocumentationValidationFields} from "../../types/files/sharedDocumentation";
import {HttpSharedFiles} from "../../http/files/httpSharedFiles";


interface SharedDocumentationGuidDialogProps {
    open: boolean,
    guid: string,
    onConfirm: () => void
}

const SharedDocumentationGuidDialog = ({open, guid, onConfirm} : SharedDocumentationGuidDialogProps) => {
    const [showCodeForm, setShowCodeForm] = useState<boolean>(false)
    const [reset, resetCaptcha] = useState<boolean>(false);
    const navigate = useNavigate()
    const {snackbarSuccess, snackbarWarning} = useAction()
    const {fetchData} = useAxios()


    const {control, handleSubmit, watch, setValue} = useForm<SharedDocumentationValidation>()

    const onSubmit = (d: SharedDocumentationValidation) => {
        fetchData(
            () => HttpSharedFiles.validateByGuid(guid, d),
            true
        ).then(() => {
            snackbarSuccess('El PIN se validó correctamente. Ya podés ver la documentación compartida')
            onConfirm()
        })
            .catch(() => {
                setValue(SharedDocumentationValidationFields.Captcha, '');
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

    const watchCaptcha = watch(SharedDocumentationValidationFields.Captcha)
    const onContinue = () => {
        if (watchCaptcha)
            fetchData(
                () => HttpSharedFiles.generateByGuid(guid, watchCaptcha),
                true
            )
                .then(() => {
                    setShowCodeForm(true);
                    resetCaptcha(true);
                })
                .catch(() => {
                    setValue(SharedDocumentationValidationFields.Captcha, '');
                    resetCaptcha(true);
                })
        else snackbarWarning("Captcha inválido")
    }


    const refreshPin = () =>
        HttpSharedFiles.generateByGuid(guid, watchCaptcha).then(() => snackbarSuccess('El PIN se reenvió a tu casilla de correo'))

    return (
        <Dialog open={open}
                onClose={onCloseDialog}
                maxWidth={'sm'}
                fullWidth
        >
            <BaseDialogTitle onClose={onCloseDialog} title={showCodeForm ? 'Verificar identidad' : '¿Querés ver la documentación compartida?'} />
            <DialogContent>
                <Grid container spacing={4} pt={3}>
                    {
                        /*
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
                         */
                    }
                    {
                        showCodeForm &&
                            <>
                                <Grid item xs={12} textAlign={'center'}>
                                    <Typography fontSize={14} color={grey[600]}>
                                        Ingresá debajo el pin que enviamos a tu mail. Si no te llegá en el lapso de dos minutos, revisa el spam, solicita el reenvío de pin o contactanos
                                    </Typography>
                                </Grid>
                                <Grid item md={12} sx={{ textAlign: '-webkit-center' }}>
                                    <Stack direction='row' alignItems='center' spacing={1} width={'fit-content'}>
                                        <ControlledPin control={control} name={SharedDocumentationValidationFields.Pin} />
                                        <RefreshIconButton tooltipTitle={'Reenviar código'} sx={{ mt: 2 }} onClick={refreshPin}/>
                                    </Stack>
                                </Grid>
                            </>
                        /*
                            :
                            <Grid item md={12} textAlign={'center'}>
                                <Typography fontSize={14} color={grey[600]}>
                                    {`Recibiste esta invitación para acceder a documentación. ¿Querés continuar?`}
                                </Typography>
                            </Grid>
                         */
                    }
                    <Grid item container xs={12} justifyContent="center">
                        <ControlledReCaptcha
                            control={control}
                            reset={reset}
                            setReset={resetCaptcha}
                            name={SharedDocumentationValidationFields.Captcha}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ width: '100% '}}>
                {
                    showCodeForm ?
                        <Stack direction={'row-reverse'} sx={{ width: '100% '}}>
                            <ConfirmButton size={'small'} onClick={handleSubmit(onSubmit)}>Confirmar</ConfirmButton>
                        </Stack>
                        :
                        <Stack justifyContent={'space-between'} direction={'row'} alignItems={'center'} sx={{ width: '100% '}}>
                            <CloseButton size={'small'} onClick={onCloseDialog}>No</CloseButton>
                            <ConfirmButton size={'small'} onClick={onContinue}>Sí</ConfirmButton>
                        </Stack>
                }
            </DialogActions>
        </Dialog>
    )
}


export default SharedDocumentationGuidDialog