import {Button, Dialog, DialogActions, DialogContent, Stack, Typography} from "@mui/material";
import BaseDialogTitle from "../../../../../components/dialog/BaseDialogTitle";
import FileFromLibrary from "../../../../../components/files/FileFromLibrary";
import React from "react";
import useAxios from "../../../../../hooks/useAxios";
import {HttpFilesFolders} from "../../../../../http";
import {useAction} from "../../../../../hooks/useAction";
import {
    DocumentFolderRelatedInsert,
    DocumentFolderRelatedInsertFields
} from "../../../../../types/files/filesFoldersData";


interface DialogRelateFilesToCurrentFolderProps {
    open: boolean,
    onClose: () => void,
    companyId: number
    currentFolderName: string,
    currentFolderId?: number,
    onReload: () => void
}


const DialogRelateFilesToCurrentFolder = ({open, onClose, companyId, currentFolderName, currentFolderId, onReload} : DialogRelateFilesToCurrentFolderProps) => {
    const {fetchAllData} = useAxios()
    const {snackbarSuccess} = useAction()
    
    const onRelateFiles = (data: any) => {
        if (currentFolderId) {
            const submitFiles = data.files?.map((id: number) => {
                const docData: DocumentFolderRelatedInsert = {[DocumentFolderRelatedInsertFields.DocumentId]: id}
                return HttpFilesFolders.insertRelatedFolder(currentFolderId, docData)
            })
            fetchAllData(
                submitFiles,
                true
            ).then(() => {
                snackbarSuccess(`Los archivos seleccionados fueron relacionados a la carpeta ${currentFolderName}`);
                onReload && onReload();
                onClose();
            });
        }
    }
    
    
    return (
        <Dialog open={open}
                onClose={onClose}
                maxWidth='lg'
                fullWidth
        >
            <BaseDialogTitle onClose={onClose} 
                             title={`¿Qué documentos deseas vincular con la carpeta "${currentFolderName}"?`} 
            />
            <DialogContent>
                <Stack spacing={4}>
                    <Typography variant='body2' fontWeight={500}>
                        Seleccioná todos los documentos que quieras vincular a esta carpeta. 
                        Navegá por las carpetas de la izquierda para encontrar tus documentos.
                    </Typography>
                    <FileFromLibrary handleLibrarySubmit={onRelateFiles}
                                     entityId={companyId}
                    />
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button variant={'contained'}
                        type='submit' form='file-from-library-form'
                        id={"company-folder-relate-files-btn"}
                >
                    {`Vincular a "${currentFolderName}"`}
                </Button>
            </DialogActions>
        </Dialog>
    )
}


export default DialogRelateFilesToCurrentFolder 