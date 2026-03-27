import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {MailView, MailViewFields} from "types/general/generalMailData";
import {Alert, AlertTitle, Dialog, DialogActions, DialogContent, Grid, Stack} from "@mui/material";
import BaseDialogTitle from "components/dialog/BaseDialogTitle";
import {AsyncSelect, ControlledCheckBox, ControlledTextFieldFilled} from "components/forms";
import {BaseResponseFields, EntityWithIdAndDescriptionFields, EntityWithIdFields} from "types/baseEntities";
import {HttpMailTemplate} from "http/configuration/httpMailTemplate";
import {Skeleton} from "@mui/lab";
import {SaveButton, SendButton} from "components/buttons/Buttons";
import useAxios from "hooks/useAxios";
import {useAction} from "hooks/useAction";
import EditorHtmlNew from "components/forms/EditorHtmlNew";
import MailSendTestDialog from "./MailSendTestDialog";
import {editorHtmlFormatter} from "util/formatters/editorHtmlFormatter";
import {HttpCacheConfiguration} from "../../../http/cache/httpCacheConfiguration";

interface MailUpdateDialogProps {
    mail: MailView,
    open: boolean,
    onClose: () => void,
    onReload: () => void
}


enum MailUpdateFormFields {
    Description = 'descripcion',
    Subject = 'subject',
    Body = 'body',
    GeneratesMail = 'generaMail',
    GeneratesNotification = 'generaNotificacion',
    Order = 'orden',
    Title = 'title',
    ContentStyles = 'styles',
    ClassificationCode = 'codMailPlantillaClasificacion'
}
interface MailUpdateForm {
    [MailUpdateFormFields.Description]: string;
    [MailUpdateFormFields.Subject]: string;
    [MailUpdateFormFields.Body]: string;
    [MailUpdateFormFields.GeneratesMail]: boolean;
    [MailUpdateFormFields.GeneratesNotification]: boolean;
    [MailUpdateFormFields.Order]?: number;
    [MailUpdateFormFields.Title]: string;
    [MailUpdateFormFields.ContentStyles]: string;
    [MailUpdateFormFields.ClassificationCode]: number;
}

const MailUpdateDialog = ({mail, open, onClose, onReload} : MailUpdateDialogProps) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [bodyHtml, setBodyHtml] = useState<string>('')
    const [openSendMail, setOpenSendMail] = useState<boolean>(false);
    const [hasAssociatedEvent, setHasAssociatedEvent] = useState<boolean>(false);
    const [mailData, setMailData] = useState<MailView>(mail)
    const methods = useForm<MailUpdateForm>()
    
    const {snackbarSuccess} = useAction()
    const {fetchData} = useAxios()
    
    useEffect(() => {
        setLoading(true)
        HttpMailTemplate.getById(mail[EntityWithIdAndDescriptionFields.Id]).then((r) => {
            setBodyHtml(r[MailViewFields.Body] ?? '');
            setHasAssociatedEvent(r[MailViewFields.HasAssociatedEvent]);

            const { title, styles } = editorHtmlFormatter.getTitleAndStylesHtmlDoc(r[MailViewFields.Body])
                        
            methods.reset({
                [MailUpdateFormFields.Description]: r[EntityWithIdAndDescriptionFields.Description],
                [MailUpdateFormFields.Subject]: r[MailViewFields.Subject],
                [MailUpdateFormFields.Body]: r[MailViewFields.Body],
                [MailViewFields.GeneratesMail]: r[MailUpdateFormFields.GeneratesMail],
                [MailViewFields.GeneratesNotification]: r[MailUpdateFormFields.GeneratesNotification],                 
                [MailViewFields.Order]: r[MailUpdateFormFields.Order],                 
                [MailUpdateFormFields.Title]: title,
                [MailUpdateFormFields.ContentStyles]: styles,
                [MailViewFields.ClassificationCode]: r[MailViewFields.ClassificationCode]
            })

            setLoading(false)
        })
    }, [mail]);
    
    
    const onSubmit = (data : MailUpdateForm) => {
        const fullHtml: string = 
            editorHtmlFormatter.getFullDocTypeHtmlMail(
                data[MailUpdateFormFields.Title], data[MailUpdateFormFields.ContentStyles], data[MailUpdateFormFields.Body]
            );
        
        const mailUpdated: MailView = {
            [EntityWithIdFields.Id]: mail[EntityWithIdFields.Id],
            [EntityWithIdAndDescriptionFields.Description]: data[MailUpdateFormFields.Description],
            [MailViewFields.Subject]: data[MailUpdateFormFields.Subject],
            [MailViewFields.Body]: fullHtml, 
            [MailViewFields.HasAssociatedEvent]: false, 
            [MailViewFields.GeneratesMail]: data[MailUpdateFormFields.GeneratesMail], 
            [MailViewFields.GeneratesNotification]: data[MailUpdateFormFields.GeneratesNotification], 
            [MailViewFields.Order]: data[MailUpdateFormFields.Order],
            [MailViewFields.ClassificationCode]: data[MailUpdateFormFields.ClassificationCode]
        }
        
        fetchData(
            () => HttpMailTemplate.update(mailUpdated),
            true
        ).then((r) => {
            if (!r[BaseResponseFields.HasError]) {
                snackbarSuccess(`La plantilla de mail #${mail[EntityWithIdAndDescriptionFields.Id]} fue actualizada correctamente`)
                onClose()
                onReload()
            }
        })
    }
    
    const watchSubject = methods.watch(MailUpdateFormFields.Subject);
    const watchBody = methods.watch(MailUpdateFormFields.Body);
    const watchTitle = methods.watch(MailUpdateFormFields.Title);
    const watchStyles = methods.watch(MailUpdateFormFields.ContentStyles);
    
    const onOpenSendMail = () => {
        const mailUpdatedData: MailView = {
            ...mailData,
            [MailViewFields.Subject]: watchSubject,
            [MailViewFields.Body]: editorHtmlFormatter.getFullDocTypeHtmlMail(watchTitle, watchStyles, watchBody)
        }
        setMailData(mailUpdatedData)
        setOpenSendMail(true)    
    }
    
    return (
        <Dialog open={open}
                onClose={onClose}
                maxWidth={'lg'}
                fullWidth
        >
            <BaseDialogTitle onClose={onClose} title={`Editar plantilla de mail #${mail[EntityWithIdAndDescriptionFields.Id]}`} />
            <DialogContent>
                <Stack spacing={2}>
                    <Alert severity='info' role={'disclaimer'}>
                        <AlertTitle>
                            ¡Atención!
                        </AlertTitle>
                        Es recomendable que no modifiques los tags para garantizar el funcionamiento de la plantilla. Si tenés alguna consulta o aún así querés cambiarlos, contactá el equipo de desarrollo.
                    </Alert>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <ControlledTextFieldFilled control={methods.control}
                                                       name={MailUpdateFormFields.Subject}
                                                       fullWidth
                                                       label={'Asunto'}
                                                       loadPending={loading}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <ControlledTextFieldFilled control={methods.control}
                                                       name={MailUpdateFormFields.Description}
                                                       fullWidth
                                                       label={'Nombre de la plantilla'}
                                                       loadPending={loading}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <AsyncSelect loadOptions={HttpCacheConfiguration.getMailTemplateClassifications}
                                         control={methods.control}
                                         name={MailUpdateFormFields.ClassificationCode}
                                         fullWidth
                                         label={'Clasificación'}
                            />
                                                       
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <ControlledTextFieldFilled control={methods.control}
                                                       name={MailUpdateFormFields.Order}
                                                       fullWidth
                                                       label={'Orden'}
                                                       loadPending={loading}
                                                       type="number"
                            />
                        </Grid>
                        {
                            !loading ?
                                hasAssociatedEvent ?
                                    <React.Fragment>
                                        <Grid item xs={12} md={4}>
                                            <ControlledCheckBox label={'Genera Mail'}
                                                                name={MailUpdateFormFields.GeneratesMail}
                                                                control={methods.control}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <ControlledCheckBox label={'Genera Notificación'}
                                                                name={MailUpdateFormFields.GeneratesNotification}
                                                                control={methods.control}
                                            />
                                        </Grid>
                                    </React.Fragment>
                                    :
                                    <Grid item xs={12}>
                                        <Alert color={'warning'} severity={'info'}>
                                            La configuración de esta plantilla no permite modificar si genera correo o notificación. 
                                            Cualquier consulta contactá al equipo de desarrollo 
                                        </Alert>
                                    </Grid>
                                :
                                null
                        }
                    </Grid>
                    {
                        loading ? <Skeleton width={1} height={500} />
                            :
                            <EditorHtmlNew name={MailUpdateFormFields.Body}
                                           initialValue={bodyHtml}
                                           setValue={methods.setValue}
                                           height={900}
                                           contentStyles={watchStyles}
                            />
                    }
                </Stack>
            </DialogContent>
            <DialogActions>
                <Stack direction={'row'} justifyContent={'space-between'} width={1}>
                    <SendButton size={'small'} variant={'text'} color={'primary'} onClick={onOpenSendMail}>
                        Enviar prueba por mail
                    </SendButton>
                    <SaveButton size={'small'} onClick={methods.handleSubmit(onSubmit)}>
                        Guardar
                    </SaveButton>
                </Stack>
            </DialogActions>
            <MailSendTestDialog open={openSendMail}
                                onClose={() => setOpenSendMail(false)}
                                body={mailData[MailViewFields.Body] ?? ''}
                                subject={mailData[MailViewFields.Subject]}
                                description={mailData[EntityWithIdAndDescriptionFields.Description]}
            />
        </Dialog>
    )
}


export default MailUpdateDialog