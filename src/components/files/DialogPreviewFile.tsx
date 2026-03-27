import {
    FileBlobResponse,
    FileBlobResponseFields,
} from '../../types/files/filesData';
import {Box, Dialog, DialogContent} from '@mui/material';
import BaseDialogTitle from '../dialog/BaseDialogTitle';
// @ts-ignore
import FileViewer from 'react-file-viewer';
import {Alert} from "@mui/lab";
import {DownloadButton} from "../buttons/Buttons";

interface DialogPreviewFileProps {
    open: boolean;
    onClose: () => void;
    fileBlob?: FileBlobResponse;
    filePath?: string;
    title?: string;
}

const DialogPreviewFile = ({
                               open,
                               onClose,
                               fileBlob,
                               filePath,
                               title
                           }: DialogPreviewFileProps) => {
    const fileName = filePath || fileBlob?.[FileBlobResponseFields.FileName] || '';
    const parts = fileName.split('.');
    const fileType = parts[parts.length - 1].toLowerCase();
    const fileUrl: string = filePath ? filePath : fileBlob ? window.URL.createObjectURL(
        new Blob([fileBlob[FileBlobResponseFields.File]], {
            type: fileType === 'pdf' ? "application/pdf" : "",
        }),
    ) : '';
    
    const onDownload = (blob: FileBlobResponse) => {
        const downloadUrl = window.URL.createObjectURL(
            new Blob([blob[FileBlobResponseFields.File]]),
        );

        const link = document.createElement('a');
        link.href = downloadUrl;

        let downloadName: string = blob[FileBlobResponseFields.FileName]

        link.setAttribute('download', downloadName);

        document.body.appendChild(link);
        link.click();
        link.remove();
        onClose();
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <BaseDialogTitle
                onClose={onClose}
                title={title ? title : `${fileName}`}
            />
            <DialogContent>
                {(fileType === 'doc' || fileType === 'xls' || fileType === 'pptx') ? (
                        <Alert severity='warning'
                               action={fileBlob ? <DownloadButton size='small' onClick={() => onDownload(fileBlob)}>Descargar
                                   archivo</DownloadButton> : <></>}
                               sx={{fontSize: '12px'}}
                        >
                            Por el momento no es posible mostrar archivos con esta extensión (paquete office 97-03),
                            descárguelo para visualizarlo
                        </Alert>
                    ) :
                    (fileType === 'zip') ? (
                            <Alert severity='warning'
                                   action={fileBlob ? <DownloadButton size='small' onClick={() => onDownload(fileBlob)}>Descargar
                                       archivo</DownloadButton> : <></>}
                                   sx={{fontSize: '12px'}}
                            >
                                No es posible mostrar el contenido de una carpeta comprimida, descárguelo para visualizarlo
                            </Alert>
                        )
                    :
                    fileType === 'pdf' ?
                        <Box sx={{width: '100%', maxHeight: '900px', overflow: 'auto'}}>
                            <iframe
                                src={fileUrl}
                                title={fileName}
                                width="100%"
                                height="900px"
                                style={{border: 'none'}}
                            />
                        </Box>
                        :
                        <FileViewer fileType={fileType} filePath={fileUrl}/>
                }
            </DialogContent>
        </Dialog>
    );
};

export default DialogPreviewFile;
