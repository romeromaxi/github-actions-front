import React, {useContext, useEffect} from "react";
import {useFormContext} from "react-hook-form";
import {grey} from "@mui/material/colors";
import {Divider, Grid, Stack, Typography} from "@mui/material";
import {DropzoneField} from "components/forms/DropzoneField";
import {GoogleDriveButton} from "components/google-drive/GoogleDriveButton";
import {DropboxButton} from "components/dropbox/DropboxButton";
import {FileSelectedDetail} from "components/files/FileSelectedDetail";
import {
    FileFormFields,
    NewFileDocumentFormContext,
    NewFileDocumentFormContextType,
    NewFileDocumentFormPartProps
} from "components/files/NewFileDocumentForm";
import {FileBase, FileBaseFields, FileBaseInsert, FileBaseInsertFields} from "types/files/filesData";
import NewFileDocumentFormPartTitle from "./NewFileDocumentFormPartTitle";

function NewFileDocumentFormUploadPart({ step }: NewFileDocumentFormPartProps) {
    const methods = useFormContext();
    const { multiselect, files, setFiles } = useContext<NewFileDocumentFormContextType>(NewFileDocumentFormContext);
    const watchFile = methods.watch(FileFormFields.Archivo);

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
    
    const onReceiveFilesFromExternal = (newFiles: File[]) =>
        methods.setValue(FileFormFields.Archivo, newFiles);

    useEffect(() => {
        if (watchFile) {
            let newFiles = methods.getValues(FileFormFields.Archivo);
            if (!newFiles) return setFiles(undefined);

            const newFilesArray: File[] = Array.from(newFiles);

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
    
    return (
        <Grid container item xs={12} spacing={1}>
            <Grid item xs={12}>
                <NewFileDocumentFormPartTitle label={"Subí el archivo"}
                                              step={step}
                />
            </Grid>
            
            {!files ? (
                <Grid item xs={12}>
                    <Grid container spacing={3} alignItems={'center'}>
                        <Grid item xs={12} mb={1}>
                            <DropzoneField
                                setValue={methods.setValue}
                                name={FileFormFields.Archivo}
                                multiple={!!multiselect}
                                control={methods.control}
                            />
                        </Grid>
                        <Grid item xs={5.75}>
                            <Divider />
                        </Grid>
                        <Grid item xs={0.5}>
                            <Typography color={grey[500]}>O</Typography>
                        </Grid>
                        <Grid item xs={5.75}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12} mb={1}>
                            <Stack
                                direction={'row'}
                                alignItems={'center'}
                                justifyContent={'space-around'}
                            >
                                <GoogleDriveButton multiselect={multiselect}
                                                   uploadFiles={onReceiveFilesFromExternal}
                                />

                                <DropboxButton uploadFiles={onReceiveFilesFromExternal} />
                            </Stack>
                        </Grid>
                    </Grid>
                </Grid>
            ) : (
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
            )}
        </Grid>
    )
}

export default NewFileDocumentFormUploadPart;