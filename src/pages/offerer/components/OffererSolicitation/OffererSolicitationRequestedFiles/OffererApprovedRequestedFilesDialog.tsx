import { Alert, Dialog, DialogContent, Stack } from '@mui/material';
import BaseDialogTitle from '../../../../../components/dialog/BaseDialogTitle';
import { DownloadButton } from '../../../../../components/buttons/Buttons';
import { HttpFilesSolicitation } from '../../../../../http';
import useAxios from '../../../../../hooks/useAxios';
import { useEffect, useState } from 'react';
import { Document } from '../../../../../types/files/filesData';
import { Skeleton } from '@mui/lab';
import FileDocumentDetail from '../../../../../components/files/FileDocumentDetail';

interface OffererApprovedRequestedFilesDialogProps {
  open: boolean;
  onClose: () => void;
  solicitationId: number;
}

const OffererApprovedRequestedFilesDialog = ({
  open,
  onClose,
  solicitationId,
}: OffererApprovedRequestedFilesDialogProps) => {
  const { fetchAndDownloadFile } = useAxios();
  const [approvedFiles, setApprovedFiles] = useState<Document[]>();

  const onDownloadFiles = () =>
    fetchAndDownloadFile(() =>
      HttpFilesSolicitation.downloadApprovedFiles(solicitationId),
    );

  useEffect(() => {
    open &&
      HttpFilesSolicitation.getApprovedFileList(solicitationId).then((r) =>
        setApprovedFiles(r),
      );
  }, [solicitationId, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth>
      <BaseDialogTitle
        onClose={onClose}
        title={'Documentos validados'}
        action={
          <DownloadButton onClick={onDownloadFiles}>
            Descargar todos
          </DownloadButton>
        }
      />
      <DialogContent>
        <Stack spacing={1}>
          {approvedFiles ? (
            approvedFiles.length !== 0 ? (
              approvedFiles.map((doc) => (
                <FileDocumentDetail document={doc} preview download share />
              ))
            ) : (
              <Alert severity="info">
                No hay documentos aprobados por el momento
              </Alert>
            )
          ) : (
            Array.from({ length: 4 }).map(() => <Skeleton width={'100%'} />)
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default OffererApprovedRequestedFilesDialog;
