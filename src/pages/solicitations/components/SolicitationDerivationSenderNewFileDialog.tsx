import React, {Fragment, useEffect, useState} from "react";
import NewFileDialog from "../../../components/files/NewFileDialog";
import {
    DocumentFields, DocumentInsert,
    DocumentToFileLinkRequest,
    DocumentToFileRequestLinkFields,
    FileBase, FileBaseFields, FileBaseInsert, FileBaseInsertFields
} from "../../../types/files/filesData";
import {BaseRequestFields} from "../../../types/baseEntities";
import {HttpFileDocument, HttpFilesSolicitation} from "../../../http";
import useAxios from "../../../hooks/useAxios";
import {useAction} from "../../../hooks/useAction";
import {Sections} from "../../../types/general/generalEnums";
import {useUser} from "../../../hooks/contexts/UserContext";
import {Module} from "../../../types/form/login/login-enum";
import DrawerBase from "../../../components/misc/DrawerBase";
import ButtonFileNew from "../../../components/buttons/ButtonFileNew";
import {MonitorUpIcon} from "lucide-react";
import {GoogleDriveButton} from "../../../components/google-drive/GoogleDriveButton";
import {DropboxButton} from "../../../components/dropbox/DropboxButton";
import {DropzoneFieldCustomWrapper} from "../../../components/forms/DropzoneField";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import * as yup from "yup";
import {RequiredSchema} from "../../../util/validation/validationSchemas";
import {useSnackbarActions} from "../../../hooks/useSnackbarActions";
import {Box, Button, Dialog, DialogActions, DialogContent, Grid, Stack} from "@mui/material";
import BaseDialogTitle from "../../../components/dialog/BaseDialogTitle";
import FileFromLibrary from "../../../components/files/FileFromLibrary";
import {FileSelectedDetail} from "../../../components/files/FileSelectedDetail";
import {ControlledTextFieldFilled} from "../../../components/forms";
import {useLoaderActions} from "../../../hooks/useLoaderActions";
import {LucSvgIcon} from "../../../components/icons/LucSvgIcon";


interface SolicitationDerivationSenderNewFileDialogProps {
    open: boolean;
    onClose: () => void;
    onReload: () => void;
    solicitationId: number;
    offererId?: number;
    companyId?: number;
}


const SolicitationDerivationSenderNewFileDialog = (props: SolicitationDerivationSenderNewFileDialogProps) => {
    const { user } = useUser();
    const {fetchData} = useAxios()
    const {snackbarSuccess} = useAction()
    const onSubmit = (newFileBase: FileBase, file: File) => {
        return HttpFilesSolicitation.insert(props.solicitationId, newFileBase, file)
    };
    const onSubmitLibraryFiles = (data: number[]) => {
        const fileRequest: DocumentToFileLinkRequest = {
            [DocumentToFileRequestLinkFields.SolicitationRequestId]: null,
            [DocumentToFileRequestLinkFields.DocumentIdList]: data,
            [BaseRequestFields.OriginCode]: 1,
            [BaseRequestFields.ModuleCode]: 1,
        };

        fetchData(
            () =>
                HttpFilesSolicitation.linkFileExistent(props.solicitationId, fileRequest),
            true,
        )
            .then(() => {
                snackbarSuccess('Se relacionaron los archivos correctamente');
            })
            .finally(() => {
                props.onClose()
                props.onReload()
            });
    }
    
    return (
        <Fragment>
            {
                props.open &&
                <NewFileDialog onCloseDialog={props.onClose}
                               solicitationId={props.solicitationId}
                               offererId={user?.userType === Module.Offerer ? props.offererId : undefined}
                               companyId={user?.userType === Module.Company ? props.companyId : undefined}
                               onReload={props.onReload}
                               blockSection
                               onSubmitDialog={onSubmit}
                               allowFromLibrary
                               section={Sections.Solicitations}
                               onSubmitFromLibrary={onSubmitLibraryFiles}
                />
            }
            
        </Fragment>
    )
}

enum FileFormFields {
    Archivo = 'archivo',
}

interface FileFormData extends DocumentInsert {
    [FileFormFields.Archivo]?: File[];
}

export function SolicitationDerivationSenderNewFileDrawer(props: SolicitationDerivationSenderNewFileDialogProps) {
    const { fetchData } = useAxios();
    const { showLoader, hideLoader } = useLoaderActions();
    const {addSnackbarError, addSnackbarSuccess} = useSnackbarActions()
    const [openLibrary, setOpenLibrary] = useState<boolean>(false)
    const [files, setFiles] = useState<FileBaseInsert[]>();

    let fileFormSchema = yup.object().shape({
        [DocumentFields.TitleDocument]: RequiredSchema,
        [FileFormFields.Archivo]: yup
            .mixed()
            .test('required', 'Campo obligatorio', (file) => {
                return !!file;
            })
            .test('fileSize', 'El tamaño máximo permitido: 20MB', (file) => {
                const size =
                    file?.reduce?.(
                        (accumulator: number, currFile: File) =>
                            accumulator + currFile.size,
                        0,
                    ) || 0;

                if (file && size > 20000000) addSnackbarError('El archivo es demasiado grande. El mismo no puede superar los 20MB')

                return file && size <= 20000000;
            })
    });
    const methods = useForm<FileFormData>({
        resolver: yupResolver(fileFormSchema),
        defaultValues: {
            [DocumentFields.FileSectionCode]: Sections.Solicitations
        },
    });
    const { control, watch, handleSubmit } = methods;
    const watchFile = watch(FileFormFields.Archivo);

    const remove = (fileToRemove: FileBase) => {
        let newFiles: FileBaseInsert[] | undefined = files?.filter(
            (x) => x !== fileToRemove,
        );

        if (newFiles?.length) setFiles(newFiles);
        else {
            methods.setValue(FileFormFields.Archivo, undefined);
            setFiles(undefined);
        }
    };
    
    useEffect(() => {
        if (watchFile) {
            let newFiles = methods.getValues(FileFormFields.Archivo);
            if (!newFiles) return setFiles(undefined);

            const newFilesArray = Array.from(newFiles);

            let listFilesBase: FileBaseInsert[] = newFilesArray.map((f) => {
                return {
                    [FileBaseFields.FileDesc]: f.name,
                    [FileBaseFields.BeginDate]: new Date(),
                    [FileBaseFields.FileSize]: f.size,
                    [FileBaseInsertFields.File]: f,
                } as FileBaseInsert;
            });
            setFiles(listFilesBase);
        }
    }, [watchFile, methods.getValues]);

    const onDocumentUpload = (
        newFileBase: FileBase,
        file: File,
    ) => {
        return HttpFilesSolicitation.insert(props.solicitationId, newFileBase, file)
    };
    
    const onSubmit = (data: FileFormData) => {
        if (
            data[FileFormFields.Archivo] !== null &&
            onDocumentUpload
        ) {
            showLoader();

            HttpFileDocument.insert(data).then((documentId) => {
                const submitFiles =
                    files?.map((file) =>
                        onDocumentUpload(
                            { ...file, [FileBaseFields.DocumentId]: documentId } as FileBase,
                            file[FileBaseInsertFields.File],
                        ),
                    ) ?? [];

                Promise.all(submitFiles).then(() => {
                    hideLoader();
                    props.onClose();
                    props.onReload();
                });
            });
        }
    };
    
    const onSubmitLibraryFiles = (data: any) => {
        const fileRequest: DocumentToFileLinkRequest = {
            [DocumentToFileRequestLinkFields.SolicitationRequestId]: null,
            [DocumentToFileRequestLinkFields.DocumentIdList]: data.files,
            [BaseRequestFields.OriginCode]: 1,
            [BaseRequestFields.ModuleCode]: 1,
        };

        fetchData(
            () =>
                HttpFilesSolicitation.linkFileExistent(props.solicitationId, fileRequest),
            true,
        )
            .then(() => {
                addSnackbarSuccess('Se relacionaron los archivos correctamente');
            })
            .finally(() => {
                props.onClose()
                props.onReload()
            });
    }
    
    const onReceiveFilesFromExternal = (newFiles: File[]) =>
        methods.setValue(FileFormFields.Archivo, newFiles);
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} id={'file-upload-form'}>
            <DrawerBase show={props.open}
                        title={'Nuevo documento'}
                        onCloseDrawer={props.onClose}
                        action={
                            files ?
                                <Button variant={'contained'}
                                        type='submit' form='file-upload-form'
                                >
                                    Enviar
                                </Button>
                                :
                                undefined
                        }
            >
                <Stack spacing={2}>
                    {
                        !files &&
                            <React.Fragment>
                                <ButtonFileNew title={'Elegir desde LUC'}
                                               icon={LucSvgIcon}
                                               onClick={() => setOpenLibrary(true)}
                                />
                
                                <GoogleDriveButton uploadFiles={onReceiveFilesFromExternal}
                                                   multiselect
                                                   square
                                />
                
                                <DropboxButton uploadFiles={onReceiveFilesFromExternal}
                                               square
                                />
                
                                <DropzoneFieldCustomWrapper setValue={methods.setValue}
                                                            name={FileFormFields.Archivo}
                                                            control={methods.control}
                                                            multiple
                                >
                                    <ButtonFileNew title={'Desde el ordenador'}
                                                   icon={MonitorUpIcon}
                                                   onClick={() => {}}
                                    />
                                </DropzoneFieldCustomWrapper>
                            </React.Fragment>
                    }
    
                    {
                        files && (
                            <Box>
                                <ControlledTextFieldFilled label="Título"
                                                           name={DocumentFields.TitleDocument}
                                                           control={control}
                                                           fullWidth
                                />
                                
                                <Grid container spacing={1}>
                                    {files.length > 1
                                        ? files.map?.((file) => (
                                            <Grid item xs={12}>
                                                <FileSelectedDetail
                                                    file={file}
                                                    actions
                                                    onDelete={remove}
                                                />
                                            </Grid>
                                        ))
                                        : files.length === 1 && (
                                        <Grid item xs={12}>
                                            <FileSelectedDetail
                                                file={files[0]}
                                                actions
                                                onDelete={remove}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        )
                    }
                </Stack>
    
                <Dialog open={openLibrary} onClose={() => setOpenLibrary(false)} fullWidth maxWidth={'md'}>
                    <BaseDialogTitle onClose={() => setOpenLibrary(false)} title={'Elegir desde LUC'} />
                    <DialogContent>
                        <FileFromLibrary entityId={props.companyId || props.offererId}
                                         solicitationId={props.solicitationId}
                                         handleLibrarySubmit={onSubmitLibraryFiles}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button variant={'contained'}
                                type='submit' form='file-from-library-form'
                        >
                            Enviar
                        </Button>
                    </DialogActions>
                </Dialog>
            </DrawerBase>
        </form>
    )
}



export default SolicitationDerivationSenderNewFileDialog;