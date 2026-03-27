
import {Document, DocumentFields} from "../../types/files/filesData";
import {Button, Dialog, DialogActions, DialogContent, Stack} from "@mui/material";
import BaseDialogTitle from "../../components/dialog/BaseDialogTitle";
import {useForm} from "react-hook-form";
import {SharedDocumentationPost, SharedDocumentationPostFields} from "../../types/files/sharedDocumentation";
import {ControlledTextFieldFilled} from "../../components/forms";
import {ControlledAutocomplete} from "../../components/forms/ControlledAutocomplete";
import {BaseRequestFields, EntityWithIdAndDescriptionFields} from "../../types/baseEntities";
import useAxios from "../../hooks/useAxios";
import {HttpSharedFiles} from "../../http/files/httpSharedFiles";
import {useAction} from "../../hooks/useAction";
import {useEffect} from "react";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {REQUIRED_FIELD_MESSAGE} from "util/validation/validationSchemas";
import * as yup from 'yup';

interface SharedDocumentationRelateDialogProps {
    open: boolean,
    onClose: () => void,
    document: Document
}


const SharedDocumentationRelateDialog = ({open, onClose, document} : SharedDocumentationRelateDialogProps) => {
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
    const { control, handleSubmit, reset } = useForm<SharedDocumentationPost>({
        resolver: yupResolver(SharedDocumentationPostSchema),
        mode: 'onChange'
    });
    const { fetchData } = useAxios()
    const { snackbarSuccess } = useAction()
    const onSubmit = (data: SharedDocumentationPost)=> {
        const transformedMailLst: string[] = []
        
        data[SharedDocumentationPostFields.MailsToShare].forEach(mail => {
            if (!!mail) {
                // @ts-ignore
                transformedMailLst.push(mail[EntityWithIdAndDescriptionFields.Description])
            }
        })
        
        const submitData: SharedDocumentationPost = {
            ...data,
            [SharedDocumentationPostFields.ShareDocumentsIdLst]: [document[EntityWithIdAndDescriptionFields.Id]],
            [SharedDocumentationPostFields.MailsToShare]: transformedMailLst,
            [BaseRequestFields.ModuleCode]: 1,
            [BaseRequestFields.OriginCode]: 1
        }
        
        fetchData(
            () => HttpSharedFiles.shareDocuments(submitData),
            true
        )
            .then((r) => {
                if (!r.tieneError) snackbarSuccess('El documento fue compartido con éxito')
            })
            .finally(() => onClose())
    }

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
    
    return (
        <Dialog open={open}
                onClose={onClose}
                maxWidth='sm'
                fullWidth
        >
            <BaseDialogTitle onClose={onClose} title={`Compartir ${document[DocumentFields.FileDesc]}`} />
            <DialogContent>
                <Stack spacing={2}>
                    <ControlledAutocomplete
                        label={'Ingresá los correos a los cuales querés compartir el documento'}
                        control={control}
                        optionField={SharedDocumentationPostFields.MailsToShare}
                        name={SharedDocumentationPostFields.MailsToShare}
                        loadOptions={loadMails}
                        onAddOption={onAddOption}
                        noOptionsText={"     "}
                        multiple
                    />
                    <ControlledTextFieldFilled control={control}
                                               label='Mensaje'
                                               fullWidth
                                               multiline
                                               rows={3}
                                               name={SharedDocumentationPostFields.Observations}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button size='small' variant='contained' onClick={handleSubmit(onSubmit)} id={"company-library-share-dialog-btn"}>
                    Compartir
                </Button>
            </DialogActions>
        </Dialog>
    )
}


export default SharedDocumentationRelateDialog