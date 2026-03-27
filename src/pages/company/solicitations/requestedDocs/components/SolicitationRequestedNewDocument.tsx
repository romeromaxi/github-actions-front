import * as yup from "yup";
import {
    DocumentFields,
    DocumentInsert,
    DocumentToFileLinkRequest,
    DocumentToFileRequestLinkFields,
    FileBase,
    FileBaseFields,
    FileBaseInsert,
    FileBaseInsertFields
} from "types/files/filesData";
import {RequiredSchema} from "util/validation/validationSchemas";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import React, {useContext, useEffect, useState} from "react";
import {FileSubtype, FileSubtypeFields} from "types/files/filesDataCache";
import {HttpFileDocument, HttpFilesSolicitation} from "http/index";
import {
    BaseRequestFields,
    EntityWithIdAndDescriptionFields,
    EntityWithIdFields
} from "types/baseEntities";
import {HttpCacheFiles} from "http/cache/httpCacheFiles";
import {useAction} from "hooks/useAction";
import {Sections} from "types/general/generalEnums";
import {Button, Dialog, DialogActions, DialogContent, Grid, Stack} from "@mui/material";
import {ControlledTextFieldFilled} from "components/forms";
import {DropzoneFieldCustomWrapper} from "components/forms/DropzoneField";
import {FileSelectedDetail} from "components/files/FileSelectedDetail";
import {LoaderBlockUI} from "components/loader";
import ButtonFileNew from "components/buttons/ButtonFileNew";
import BaseDialogTitle from "components/dialog/BaseDialogTitle";
import FileFromLibrary from "components/files/FileFromLibrary";
import useAxios from "hooks/useAxios";
import {OffererContext} from "../../../../offerer/components/OffererContextProvider";
import {GoogleDriveButton} from "components/google-drive/GoogleDriveButton";
import {DropboxButton} from "components/dropbox/DropboxButton";
import { MonitorUpIcon } from "lucide-react";
import { LucSvgIcon } from "components/icons/LucSvgIcon";


interface SolicitationRequestedNewDocumentProps {
    onFinishSave: () => void,
    fileSolicitationRequestId?: number,
    solicitationId: number,
    companyId: number
}

enum FileFormFields {
    Archivo = 'archivo',
}

interface FileFormData extends DocumentInsert {
    [FileFormFields.Archivo]?: File[];
}
const SolicitationRequestedNewDocument = ({onFinishSave, fileSolicitationRequestId, solicitationId, companyId} : SolicitationRequestedNewDocumentProps) => {
    const {snackbarError, snackbarSuccess} = useAction()
    const {fetchData} = useAxios()
    const offerer = useContext(OffererContext)
    const [openLibrary, setOpenLibrary] = useState<boolean>(false)

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

                    if (file && size > 20000000) snackbarError('El archivo es demasiado grande. El mismo no puede superar los 20MB')

                    return file && size <= 20000000;
                })
    });
    const methods = useForm<FileFormData>({
        resolver: yupResolver(fileFormSchema),
        defaultValues: {
            [DocumentFields.FileSectionCode]: Sections.Solicitations
        },
    });
    const { control, watch, setValue, getValues, reset, handleSubmit } = methods;
    const watchFile = watch(FileFormFields.Archivo);
    const watchTypeCode = watch(DocumentFields.FileTypeCode);
    const [isLoading, setLoading] = useState<boolean>(false);
    const [files, setFiles] = useState<FileBaseInsert[]>();
    const [fileSubtypes, setFileSubtypes] = useState<FileSubtype[]>();
    const [fileSubtypesFiltered, setFileSubtypesFiltered] =
        useState<FileSubtype[]>();
    

    useEffect(() => {
        HttpCacheFiles.getSubtypes().then((value) => {
            setFileSubtypes(value);
        });
    }, []);

    useEffect(() => {
        if (watchTypeCode)
            setFileSubtypesFiltered(
                fileSubtypes?.filter(
                    (x) => x[FileSubtypeFields.FileTypeCode] === watchTypeCode,
                ),
            );
        else setFileSubtypesFiltered([]);
        reset({ ...getValues() });
    }, [watchTypeCode, fileSubtypes]);

    useEffect(() => {
        if (!!fileSubtypesFiltered && fileSubtypesFiltered.length === 1)
            setValue(
                DocumentFields.FileSubtypeCode,
                fileSubtypesFiltered[0][EntityWithIdAndDescriptionFields.Id],
            );
    }, [fileSubtypesFiltered]);

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

    const onDocumentUpload = (
        fileBase: FileBase,
        file: File,
        solicitationRequestId?: number,
    ) => {
        return solicitationRequestId
            ? HttpFilesSolicitation.insertRequiredFile(
                solicitationId,
                fileBase,
                file,
                solicitationRequestId,
            )
                .then(() => {
                    snackbarSuccess('El documento se guardó correctamente');
                })
                .catch(() => snackbarError('Ocurrió un error al guardar el archivo'))
            : Promise.reject(() =>
                snackbarError(
                    'Ocurrió un error al guardar el archivo. No se encontro el pedido',
                ),
            );
    };

    const onSubmit = (data: FileFormData) => {
        if (
            data[FileFormFields.Archivo] !== null &&
            onDocumentUpload
        ) {
            setLoading(true);

            HttpFileDocument.insert(data).then((documentId) => {
                const submitFiles =
                    files?.map((file) =>
                        onDocumentUpload(
                            { ...file, [FileBaseFields.DocumentId]: documentId } as FileBase,
                            file[FileBaseInsertFields.File],
                            fileSolicitationRequestId,
                        ),
                    ) ?? [];

                Promise.all(submitFiles).then(() => {
                    setLoading(false);
                    onFinishSave();
                });
            });
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
    
    
    const onSubmitLibraryFiles = (data: any) => {
        if (fileSolicitationRequestId && solicitationId) {
            const fileRequest: DocumentToFileLinkRequest = {
                [DocumentToFileRequestLinkFields.SolicitationRequestId]: fileSolicitationRequestId,
                [DocumentToFileRequestLinkFields.DocumentIdList]: data.files,
                [BaseRequestFields.OriginCode]: 1,
                [BaseRequestFields.ModuleCode]: 1,
            };

            fetchData(
                () =>
                    HttpFilesSolicitation.linkWithExistent(solicitationId, fileRequest),
                true,
            )
                .then(() => {
                    snackbarSuccess('Se relacionaron los archivos correctamente');
                })
                .finally(() => {
                    setOpenLibrary(false)
                    onFinishSave()
                });
        }
    }

    const onReceiveFilesFromExternal = (newFiles: File[]) =>
        methods.setValue(FileFormFields.Archivo, newFiles);
    
    return (
        <form onSubmit={handleSubmit(onSubmit)} id={'file-upload-form'}>
            <Stack spacing={4} mb={!openLibrary ? 5 : 0}>
                {
                    !files && (
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
                    )
                }

                {
                    files && (
                        <ControlledTextFieldFilled label="Título"
                                                   name={DocumentFields.TitleDocument}
                                                   control={control}
                                                   fullWidth
                        />
                    )
                }

                {
                    files && (
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
                    )
                }
                
            </Stack>
            {isLoading && <LoaderBlockUI />}
            {
                !openLibrary &&
                <Button variant={'contained'}
                        sx={{position: 'absolute', bottom: 8, width: '92%'}}
                        type='submit' form='file-upload-form'
                >
                    Adjuntar documento al pedido
                </Button>
            }
            <Dialog open={openLibrary} onClose={() => setOpenLibrary(false)} fullWidth maxWidth={'md'}>
                <BaseDialogTitle onClose={() => setOpenLibrary(false)} title={'Elegir desde LUC'} />
                <DialogContent>
                    <FileFromLibrary entityId={companyId || offerer[EntityWithIdFields.Id]}
                                     solicitationId={solicitationId}
                                     handleLibrarySubmit={onSubmitLibraryFiles}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant={'contained'}
                            type='submit' form='file-from-library-form'
                    >
                        Elegir
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    )
}

export default SolicitationRequestedNewDocument