import {Button, Dialog, DialogActions, DialogContent, Grid} from "@mui/material";
import BaseDialogTitle from "../../components/dialog/BaseDialogTitle";
import {useForm} from "react-hook-form";
import {SharedDocumentationPost, SharedDocumentationPostFields} from "../../types/files/sharedDocumentation";
import useAxios from "../../hooks/useAxios";
import {useAction} from "../../hooks/useAction";
import {BaseRequestFields, EntityWithIdAndDescriptionFields} from "../../types/baseEntities";
import React, {useEffect} from "react";
import {ControlledAutocomplete} from "../../components/forms/ControlledAutocomplete";
import {ControlledTextFieldFilled} from "../../components/forms";
import FileFromLibrary from "../../components/files/FileFromLibrary";
import {TypographyBase} from "../../components/misc/TypographyBase";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {
    REQUIRED_FIELD_MESSAGE
} from "../../util/validation/validationSchemas";
import * as yup from 'yup';
import { HttpSharedFiles } from "http/files/httpSharedFiles";

interface SharedDocumentationRelateFilesDialogProps {
    open: boolean,
    onClose: () => void,
    companyId?: number,
    offererId?: number
}


const SharedDocumentationRelateFilesDialog = ({open, onClose, companyId, offererId} : SharedDocumentationRelateFilesDialogProps) => {
    const SharedDocumentationPostSchema = yup.object().shape({
        [SharedDocumentationPostFields.MailsToShare]: yup
            .array()
            .min(1, REQUIRED_FIELD_MESSAGE)
            .test(
                "all-valid-emails",
                "Al menos uno de los mails tiene formato inválido",
                (value) =>
                    Array.isArray(value) &&
                    value.every(
                        (item) => yup.string().email().isValidSync(item.descripcion)
                    )
            )
            .required(REQUIRED_FIELD_MESSAGE), 
    })
    const { control, reset, getValues, trigger } = useForm<SharedDocumentationPost>({
        resolver: yupResolver(SharedDocumentationPostSchema),
        mode: 'onChange'
    })
    const { fetchData } = useAxios()
    const { snackbarWarning, snackbarSuccess } = useAction()

    useEffect(() => {
        if (open) {
            reset({
                [SharedDocumentationPostFields.MailsToShare]: [],
                [SharedDocumentationPostFields.Observations]: '',
                [SharedDocumentationPostFields.ShareDocumentsIdLst]: []
            })
        }
    }, [open]);

    const loadMails = async () => []
    
    const onAddOption = (value: string, prevValues: any[]) => { }
            
    const onRelateFiles = (data: any) => {
        if (!data || !data.files.length) {
            snackbarWarning('Debés seleccionar al menos un documento para compartir');
            return;
        }
        
        trigger()
            .then((isValid) => {
                if (isValid) {
                    const formValues: SharedDocumentationPost = getValues();
                    const transformedMailLst: string[] = []

                    formValues[SharedDocumentationPostFields.MailsToShare].forEach(mail => {
                        if (!!mail) {
                            // @ts-ignore
                            transformedMailLst.push(mail[EntityWithIdAndDescriptionFields.Description])
                        }
                    })

                    const submitData: SharedDocumentationPost = {
                        [SharedDocumentationPostFields.ShareDocumentsIdLst]: data.files,
                        [SharedDocumentationPostFields.Observations]: formValues[SharedDocumentationPostFields.Observations],
                        [SharedDocumentationPostFields.MailsToShare]: transformedMailLst,
                        [BaseRequestFields.ModuleCode]: 1,
                        [BaseRequestFields.OriginCode]: 1
                    }

                    fetchData(
                        () => HttpSharedFiles.shareDocuments(submitData),
                        true
                    )
                        .then((r) => snackbarSuccess('El documento fue compartido con éxito'))
                        .finally(() => onClose())
                }
            });
    }
    
    return (
        <Dialog open={open}
                onClose={onClose}
                maxWidth='lg'
                fullWidth
        >
            <BaseDialogTitle onClose={onClose} title='Compartir documentos' />
            <DialogContent>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <TypographyBase variant='body2' fontWeight={500}>
                            Seleccioná todos los documentos que quieras compartir.
                            Navegá por las carpetas de la izquierda para encontrar tus documentos.
                        </TypographyBase>
                    </Grid>
                    
                    <Grid item xs={12} container spacing={1}>
                        <Grid item xs={12} md={6}>
                            <ControlledAutocomplete
                                label={'Correos a los cuales querés compartir la documentación'}
                                control={control}
                                optionField={SharedDocumentationPostFields.MailsToShare}
                                name={SharedDocumentationPostFields.MailsToShare}
                                loadOptions={loadMails}
                                onAddOption={onAddOption}
                                noOptionsText={"     "}
                                multiple
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <ControlledTextFieldFilled control={control}
                                                       label='Mensaje'
                                                       fullWidth
                                                       multiline
                                                       rows={3}
                                                       name={SharedDocumentationPostFields.Observations}
                            />
                        </Grid>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <FileFromLibrary handleLibrarySubmit={onRelateFiles}
                                         entityId={companyId || offererId}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button size='small' variant='contained' type='submit' form='file-from-library-form'>
                    Compartir
                </Button>
            </DialogActions>
        </Dialog>
    )
}


export default SharedDocumentationRelateFilesDialog