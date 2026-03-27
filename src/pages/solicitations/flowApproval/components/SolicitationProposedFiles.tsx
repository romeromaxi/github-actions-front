import React, {useState} from "react";
import {Button, Stack, Typography} from "@mui/material";
import {FileArrowUp} from "@phosphor-icons/react";
import {FileDocumentListSectionSolicitations} from "components/files/FileDocumentListSection";
import {Document, FileBase} from "types/files/filesData";
import FileNewDialog from "components/files/NewFileDialog";
import {Sections} from "types/general/generalEnums";
import {HttpCacheFiles} from "http/cache/httpCacheFiles";

interface SolicitationProposedFilesProps {
    filesSolicitation?: Document[],
    hasPermissions: boolean,
    onRealodFiles: () => void,
    onSaveFile: (fileBase: FileBase, file: File) => Promise<any>
}

function SolicitationProposedFiles({ filesSolicitation, hasPermissions, onRealodFiles, onSaveFile }: SolicitationProposedFilesProps) {
    const [openFileDialog, setOpenFileDialog] = useState<boolean>(false);
    
    const showFileDialog = () => setOpenFileDialog(true);
    
    const closeFileDialog = () => setOpenFileDialog(false);
    
    return (
        <Stack spacing={1}>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                <Typography variant={'body2'} fontWeight={500}>
                    Archivos adjuntos
                </Typography>

                {
                    hasPermissions &&
                    <Button variant={'outlined'}
                            size={'small'}
                            startIcon={<FileArrowUp />}
                            onClick={showFileDialog}
                    >
                        Subir archivo
                    </Button>
                }
            </Stack>

            <FileDocumentListSectionSolicitations
                filesDocument={filesSolicitation}
                delete={hasPermissions}
                download
                onReload={onRealodFiles}
                preview
            />

            {
                openFileDialog && 
                    <FileNewDialog section={Sections.Solicitations} 
                                   onLoadFileTypes={HttpCacheFiles.getTypes} 
                                   onCloseDialog={closeFileDialog} 
                                   onSubmitDialog={onSaveFile}
                    />
            }
        </Stack>
    )
}

export default SolicitationProposedFiles;