import {
  Document,
  FileBase,
  SolicitationFileRequested,
  SolicitationFileRequestedFields,
} from '../../types/files/filesData';
import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import BaseDialogTitle from '../dialog/BaseDialogTitle';
import { EntityWithIdFields } from '../../types/baseEntities';
import { DownloadButton, SendButton } from '../buttons/Buttons';
import { DataWithLabel } from '../misc/DataWithLabel';
import React, { useEffect, useState } from 'react';
import { HttpFileDocument } from '../../http';
import { Alert } from '@mui/lab';
import SolicitationRequiredFileDocumentDetail from './SolicitationRequiredFileDocumentDetail';
import useAxios from '../../hooks/useAxios';
import { HttpFilesSolicitation } from '../../http/files/httpFilesSolicitation';
import FileNewDialog, { FileNewDialogProps } from '../files/NewFileDialog';
import { useAction } from '../../hooks/useAction';
import { Sections } from '../../types/general/generalEnums';
import { HttpCacheFiles } from '../../http/cache/httpCacheFiles';
import { FileDocumentDetailLoading } from '../files/FileDocumentDetail';
import { DialogAlert } from '../dialog';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import BoxNewEntity from '../misc/BoxNewEntity';
import { useCompanySolicitation } from '../../pages/company/solicitations/CompanySolicitationContext';
import { SolicitationFlagsFields } from '../../types/solicitations/solicitationData';

interface SolicitationRequiredFileDialogDetailProps {
  file: SolicitationFileRequested;
  solicitationId: number;
  open: boolean;
  onClose: () => void;
  tableRight: boolean;
  offerer: boolean;
  offererId?: number;
  companyId?: number;
  uploadDialog?: FileNewDialogProps;
  onReload?: () => void;
  commercial?: boolean;
}

const SolicitationRequiredFileDialogDetail = ({
  file,
  solicitationId,
  open,
  onClose,
  tableRight,
  offerer,
  offererId,
  uploadDialog,
  onReload,
  commercial,
  companyId,
}: SolicitationRequiredFileDialogDetailProps) => {
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openSend, setOpenSend] = useState<boolean>(false);
  const [openNew, setOpenNew] = useState<boolean>(false);
  const { fetchAndDownloadFile, fetchData } = useAxios();
  const { snackbarError, snackbarSuccess } = useAction();
  const { flags } = useCompanySolicitation();

  const loadPymeDocs = () => {
    setLoading(true);
    HttpFilesSolicitation.getRelatedDocs(
      solicitationId,
      file[EntityWithIdFields.Id],
    )
      .then((r) => setDocs(r))
      .finally(() => setLoading(false));
  };

  const loadOffererDocs = () => {
    setLoading(true);
    HttpFileDocument.getListByDocumentId(
      file[SolicitationFileRequestedFields.DocumentId],
    )
      .then((r) => setDocs(r))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      if (tableRight) {
        loadPymeDocs();
      } else {
        loadOffererDocs();
      }
    }
  }, [tableRight, open]);

  const onDownloadAll = () =>
    tableRight
      ? fetchAndDownloadFile(() =>
          HttpFilesSolicitation.downloadRequiredFiles(
            solicitationId,
            file[EntityWithIdFields.Id],
          ),
        ).then(() => {
          if (offerer)
            HttpFilesSolicitation.readResponseRequired(
              solicitationId,
              file[EntityWithIdFields.Id],
            );
        })
      : fetchAndDownloadFile(() =>
          HttpFileDocument.download(
            file[SolicitationFileRequestedFields.DocumentId],
          ),
        );

  const onSaveFile = (
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
            loadPymeDocs();
            onReload && onReload();
          })
          .catch(() => snackbarError('Ocurrió un error al guardar el archivo'))
      : Promise.reject(() =>
          snackbarError(
            'Ocurrió un error al guardar el archivo. No se encontro el pedido',
          ),
        );
  };

  const uploadDialogProps: FileNewDialogProps = {
    ...uploadDialog,
    section: Sections.Solicitations,
    onCloseDialog: () => setOpenNew(false),
    onLoadFileTypes: HttpCacheFiles.getTypes,
    onSubmitDialog: onSaveFile,
  };

  const handleReload = () => {
    loadPymeDocs();
    onReload && onReload();
  };

  const onClickSend = () => {
    fetchData(
      () =>
        HttpFilesSolicitation.sendRequestListToOfferer(solicitationId, [
          file[EntityWithIdFields.Id],
        ]),
      true,
    )
      .then(() => {
        snackbarSuccess('Documentación enviada correctamente');
      })
      .finally(() => onReload && onReload());
  };

  const renderFromLibraryMessage = () => {
    if (flags) {
      if (!flags[SolicitationFlagsFields.HasFullAccess])
        return 'Para poder ver esta sección es necesario que tu Cuenta MiPyME esté verificada.';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth={'sm'} fullWidth>
      <BaseDialogTitle
        onClose={onClose}
        title={`Pedido #${file[EntityWithIdFields.Id]}`}
        action={
          <>
            {!offerer &&
              !file[SolicitationFileRequestedFields.Sent] &&
              file[SolicitationFileRequestedFields.DocumentsQuantity] !== 0 &&
              file[SolicitationFileRequestedFields.DocumentsQuantity] &&
              tableRight && (
                <Chip
                  variant={'outlined'}
                  color={'info'}
                  label={'Pendiente de envío'}
                />
              )}
            {!offerer &&
              file[SolicitationFileRequestedFields.Sent] &&
              tableRight && (
                <Chip
                  variant={'outlined'}
                  color={'success'}
                  label={'Presentados'}
                />
              )}
            {!offerer &&
              (file[SolicitationFileRequestedFields.DocumentsQuantity] === 0 ||
                !file[SolicitationFileRequestedFields.DocumentsQuantity]) &&
              !file[SolicitationFileRequestedFields.Sent] &&
              tableRight && (
                <Chip
                  variant={'outlined'}
                  color={'warning'}
                  label={'Subir documentación'}
                />
              )}
          </>
        }
      />
      <DialogContent>
        <Stack spacing={2}>
          <DataWithLabel
            label={'Titulo'}
            data={file[SolicitationFileRequestedFields.Title]}
            rowDirection
          />
          <DataWithLabel
            label={'Observaciones'}
            data={file[SolicitationFileRequestedFields.Observations]}
            rowDirection
            pendantLabel={'Sin observaciones'}
          />
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Typography fontWeight={500} fontSize={16} mt={1}>
              {tableRight ? 'Documentos' : 'Formulario'}
            </Typography>
            {docs.length !== 0 && (
              <DownloadButton onClick={onDownloadAll} size={'small'}>
                {'Descargar Todo'}
              </DownloadButton>
            )}
          </Stack>
          {loading ? (
            <Stack spacing={1}>
              <FileDocumentDetailLoading />
              <FileDocumentDetailLoading />
            </Stack>
          ) : (
            <Stack spacing={1}>
              {docs.length !== 0 ? (
                docs.map((doc) => (
                  <SolicitationRequiredFileDocumentDetail
                    doc={doc}
                    key={doc[EntityWithIdFields.Id]}
                    triggerRight={tableRight}
                    presented={file[SolicitationFileRequestedFields.Sent]}
                    solicitationId={solicitationId}
                    fileId={file[EntityWithIdFields.Id]}
                    onReload={handleReload}
                    offerer={offerer}
                    offererId={offererId}
                    commercial={commercial}
                    companyId={companyId}
                    flags={flags}
                  />
                ))
              ) : (
                <Alert severity={'info'}>
                  {tableRight
                    ? 'No se cargaron documentos para este pedido'
                    : 'No se adjuntó ningún formulario para este pedido'}
                </Alert>
              )}
              {!offerer &&
                tableRight &&
                !file[SolicitationFileRequestedFields.Sent] && (
                  <BoxNewEntity
                    onClickNew={() => {
                      setOpenNew(true);
                    }}
                    title={'Nuevo documento'}
                    subtitle={'Presione aquí para agregar un nuevo documento'}
                  />
                )}
            </Stack>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        {!offerer &&
        tableRight &&
        !file[SolicitationFileRequestedFields.Sent] ? (
          <SendButton
            variant={'contained'}
            color={'primary'}
            startIcon={<UploadFileIcon />}
            onClick={() => {
              setOpenSend(true);
            }}
            disabled={loading || docs.length === 0}
          >
            Enviar Documentación
          </SendButton>
        ) : (
          <></>
        )}
      </DialogActions>

      {uploadDialogProps && openNew && (
        <FileNewDialog
          {...uploadDialogProps}
          onCloseDialog={() => {
            setOpenNew(false);
          }}
          onReload={handleReload}
          fromLibraryMessage={renderFromLibraryMessage()}
        />
      )}
      {!offerer && (
        <DialogAlert
          onClose={() => setOpenSend(false)}
          open={openSend}
          title={'¿Desea enviar la documentación?'}
          textContent={
            '' +
            'Verifique que la documentación seleccionada cumple con lo requerido.\n' +
            'Al confirmar se enviará la documentación seleccionada al oferente'
          }
          onConfirm={() => {
            onClickSend();
            setOpenSend(false);
          }}
        />
      )}
    </Dialog>
  );
};

export default SolicitationRequiredFileDialogDetail;
