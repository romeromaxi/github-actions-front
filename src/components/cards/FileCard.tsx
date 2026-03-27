import {Box, Card, CardContent, Stack, Tooltip, Typography} from '@mui/material';
import {
  Document,
  DocumentFields,
  FileBlobResponse,
  FileBlobResponseFields,
} from '../../types/files/filesData';
import { fileFormatter } from '../../util/formatters/fileFormatter';
import { grey } from '@mui/material/colors';
import { dateFormatter } from '../../util/formatters/dateFormatter';
import {
  DeleteIconButton,
  DownloadIconButton,
  SearchIconButton,
} from '../buttons/Buttons';
import { HttpFileDocument } from '../../http';
import { EntityWithIdFields } from '../../types/baseEntities';
import React, { useState } from 'react';
import DialogPreviewFile from '../files/DialogPreviewFile';
import { LoaderBlockUI } from '../loader';
import {DialogAlert} from "../dialog";
import {useAction} from "../../hooks/useAction";
import {stringFormatter} from "../../util/formatters/stringFormatter";

interface FileCardProps {
  file: Document;
  actionReload?: () => void;
}

const FileCard = ({ file, actionReload }: FileCardProps) => {
  const [fileBlob, setFileBlob] = useState<FileBlobResponse>();
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false)
  const [fileToDelete, setFileToDelete] = useState<number>()
  const {snackbarSuccess} = useAction()
  const [title, setTitle] = useState<string>()
  
  const onPreview = (file: Document) => {
    setShowLoader(true);
    HttpFileDocument.download(file.id).then((blob) => {
      setFileBlob(blob);
      setOpenPreview(true);
      setShowLoader(false);
      setTitle(file[DocumentFields.TitleDocument])
    });
  };

  const onClosePreview = () => {
    setOpenPreview(false);
    setFileBlob(undefined);
  };
  const onDeleteDocument = () => {
    if (fileToDelete) {
      HttpFileDocument.delete(fileToDelete).then(() => {
        actionReload && actionReload();
        snackbarSuccess('El archivo se eliminó correctamente')
      });
    }
  };
  
  const handleCloseDelete = () => {
    setFileToDelete(undefined)
    setOpenDelete(false)
    setTitle(undefined)
  }
  
  const onOpenDelete = (file: Document) => {
    setFileToDelete(file[EntityWithIdFields.Id])
    setOpenDelete(true)
    setTitle(file[DocumentFields.TitleDocument])
  }

  const onDownload = (file: Document) => {
    HttpFileDocument.download(file[EntityWithIdFields.Id]).then(
      (blobResponse: FileBlobResponse) => {
        const downloadUrl = window.URL.createObjectURL(
          new Blob([blobResponse[FileBlobResponseFields.File]]),
        );

        const link = document.createElement('a');
        link.href = downloadUrl;

        let downloadName: string =
          file[DocumentFields.NumberFiles] > 1
            ? `${file[DocumentFields.TitleDocument]}.zip`
            : file[DocumentFields.FileDesc];

        link.setAttribute('download', downloadName);

        document.body.appendChild(link);
        link.click();
        link.remove();
      },
    );
  };

  return (
      <Box display="flex" height="100%">
        <Card style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <CardContent style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Stack spacing={2} textAlign={'center'}>
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <Box>
                  {file[DocumentFields.NumberFiles] > 1
                      ? fileFormatter.getIconFolder({ fontSize: 'large' })
                      : fileFormatter.getIconByFileName(
                          file[DocumentFields.FileDesc],
                          { fontSize: 'large' },
                      )}
                </Box>
                <Typography variant={'body2'} fontWeight={600} fontSize={16}>
                  {stringFormatter.cutIfHaveMoreThan(file[DocumentFields.TitleDocument], 58)}
                </Typography>
              </Stack>
            </Stack>
            <Box mt={2}>
              <Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
              >
                <Stack direction={'row'} spacing={0.5} alignItems={'center'}>
                  <Typography fontSize={13} fontWeight={600} color={grey[600]}>
                    {dateFormatter.toShortDate(file[DocumentFields.BeginDate])}
                  </Typography>
                  <Typography
                      fontSize={13}
                      fontWeight={600}
                      color={grey[600]}
                  >{`-  ${Math.floor(file[DocumentFields.FileSize] / 1000)} Kb`}</Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <DownloadIconButton
                      onClick={() => {
                        onDownload(file);
                      }}
                      tooltipTitle={'Descargar'}
                  />
                  <SearchIconButton
                      onClick={() => {
                        onPreview(file);
                      }}
                      tooltipTitle={'Previsualizar'}
                  />
                  <DeleteIconButton
                      onClick={() => {
                        onOpenDelete(file);
                      }}
                      tooltipTitle={'Eliminar'}
                  />
                </Stack>
              </Stack>
            </Box>
          </CardContent>

          {fileBlob && (
              <DialogPreviewFile
                  open={openPreview}
                  onClose={onClosePreview}
                  fileBlob={fileBlob}
                  title={`${title}`}
              />
          )}
          {openDelete && (
              <DialogAlert
                  onClose={handleCloseDelete}
                  open={openDelete}
                  title={`Eliminar archivo`}
                  textContent={`¿Estás seguro que deseas eliminar el archivo "${title}"?`}
                  onConfirm={onDeleteDocument}
              />
          )}
          {showLoader && <LoaderBlockUI />}
        </Card>
      </Box>
  );
};

export default FileCard;
