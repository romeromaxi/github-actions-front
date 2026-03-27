import React, { useCallback, useEffect, useState } from 'react';
import {
  SolicitationFlagsFields,
  SolicitationViewDTO,
  SolicitationViewDTOFields,
} from 'types/solicitations/solicitationData';
import { HttpFilesSolicitation } from 'http/files/httpFilesSolicitation';
import {BaseRequestFields, EntityWithIdFields} from 'types/baseEntities';
import {
  DocumentToFileLinkRequest,
  DocumentToFileRequestLinkFields,
  FileBase,
  SolicitationFileRequested
} from 'types/files/filesData';
import { useAction } from 'hooks/useAction';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Grid,
  Tooltip,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Sections } from 'types/general/generalEnums';
import { HttpCacheFiles } from 'http/cache/httpCacheFiles';
import { SendButton } from 'components/buttons/Buttons';
// @ts-ignore
import { DialogAlert } from 'components/dialog';
import { SafetyComponent } from 'components/security';
import {
  CompanySolicitationRequestedFilesSecObjects,
  SecurityComponents,
} from 'types/security';
import { useCompanySolicitation } from './CompanySolicitationContext';
import useAxios from 'hooks/useAxios';
import SolicitationRequiredFileGroupDetail from '../../../components/solicitations/SolicitationRequiredFileGroupDetail';
import { Alert } from '@mui/lab';
import SolicitationRequiredFileDetailHeader from '../../../components/solicitations/SolicitationRequiredFileDetailHeader';

interface CompanySolicitationRequestedFilesProps {
  solicitation: SolicitationViewDTO;
}

function CompanySolicitationRequestedFiles({
  solicitation,
}: CompanySolicitationRequestedFilesProps) {
  const { flags } = useCompanySolicitation();

  const [requiredFiles, setRequiredFiles] = useState<
    SolicitationFileRequested[]
  >([]);
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const { snackbarError, snackbarSuccess } = useAction();
  const { fetchData } = useAxios();

  const loadFiles = useCallback(() => {
    HttpFilesSolicitation.getOffererRequestedFiles(
      solicitation[EntityWithIdFields.Id],
    ).then((list) => {
      setRequiredFiles(list.reverse());
    });
  }, [solicitation]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const onSelectFile = (
    event: React.ChangeEvent<HTMLInputElement>,
    fileId: number,
  ) => {
    let newSelectedFiles: number[];
    if (event.target.checked) {
      newSelectedFiles = [...selectedRequests, fileId];
      setSelectedRequests(newSelectedFiles);
    } else {
      newSelectedFiles = [...selectedRequests].filter(
        (fileRequestId) => fileRequestId !== fileId,
      );
      setSelectedRequests(newSelectedFiles);
    }
  };

  const onSaveFile = (
    fileBase: FileBase,
    file: File,
    solicitationRequestId?: number,
  ) => {
    return solicitationRequestId
      ? HttpFilesSolicitation.insertRequiredFile(
          solicitation[EntityWithIdFields.Id],
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

  const onClickSend = () => {
    fetchData(
      () =>
        HttpFilesSolicitation.sendRequestListToOfferer(
          solicitation[EntityWithIdFields.Id],
          selectedRequests,
        ),
      true,
    )
      .then(() => {
        setSelectedRequests([]);
        snackbarSuccess('Documentación enviada correctamente');
      })
      .finally(() => loadFiles());
  };
  
  const handleSubmitFromLibrary = (docIdLst: number[], fileSolicitationRequestId?: number) => {
    if (solicitation[SolicitationViewDTOFields.CompanyId] && fileSolicitationRequestId && solicitation[EntityWithIdFields.Id]) {
      const fileRequest: DocumentToFileLinkRequest = {
        [DocumentToFileRequestLinkFields.SolicitationRequestId]: fileSolicitationRequestId,
        [DocumentToFileRequestLinkFields.DocumentIdList]: docIdLst,
        [BaseRequestFields.OriginCode]: 1,
        [BaseRequestFields.ModuleCode]: 1
      };

      fetchData(
          () =>
              HttpFilesSolicitation.linkWithExistent(solicitation[EntityWithIdFields.Id], fileRequest),
          true
      )
          .then(() => {
            snackbarSuccess('Se relacionaron los archivos correctamente');
          })
          .finally(() => {
            loadFiles()
          });
    }
  }

  return (
    <Card>
      <CardHeader title={'Documentación solicitada por el oferente'} />
      <CardContent>
        <Grid container alignItems={'center'} spacing={2}>
          {requiredFiles && requiredFiles.length !== 0 ? (
            <>
              <SolicitationRequiredFileDetailHeader
                offerer={false}
                solicitationId={solicitation[EntityWithIdFields.Id]}
              />
              {requiredFiles.map((file, idx) => (
                <SolicitationRequiredFileGroupDetail
                  file={file}
                  key={file[EntityWithIdFields.Id]}
                  onReload={loadFiles}
                  offerer={false}
                  onSelectFile={onSelectFile}
                  solicitationId={solicitation[EntityWithIdFields.Id]}
                  uploadDialog={{
                    section: Sections.Solicitations,
                    onLoadFileTypes: HttpCacheFiles.getTypes,
                    onCloseDialog: () => {},
                    onSubmitDialog: onSaveFile,
                    onSubmitFromLibrary: (docIdLst: number[]) => handleSubmitFromLibrary(docIdLst, file[EntityWithIdFields.Id]),
                    fileSolicitationRequestId: file[EntityWithIdFields.Id],
                    allowFromLibrary: true,
                    companyId:
                      solicitation[SolicitationViewDTOFields.CompanyId],
                    solicitationId: solicitation[EntityWithIdFields.Id],
                    onReload: loadFiles,
                  }}
                  last={idx === requiredFiles.length - 1}
                  companyId={solicitation[SolicitationViewDTOFields.CompanyId]}
                />
              ))}
            </>
          ) : (
            <Box sx={{ width: '100%' }}>
              <Alert severity="info">
                Al parecer no se han solicitado archivos a mostrar por la
                empresa
              </Alert>
            </Box>
          )}
        </Grid>
      </CardContent>
      <CardActions>
        {flags &&
          flags[
            SolicitationFlagsFields
              .SolicitationRequestedDocumentationSendAllowed
          ] && (
            <SafetyComponent
              componentName={
                SecurityComponents.CompanySolicitationRequestedFiles
              }
              objectName={
                CompanySolicitationRequestedFilesSecObjects.SolicitationCompanySendRequestedFileButton
              }
            >
              <Tooltip
                title={`${!selectedRequests.length ? 'Debe seleccionar al menos un archivo para enviar al oferente' : ''}`}
              >
                <div>
                  <SendButton
                    variant={'contained'}
                    color={'primary'}
                    startIcon={<UploadFileIcon />}
                    onClick={() => {
                      setOpen(true);
                    }}
                    disabled={!selectedRequests.length}
                    sx={{ marginTop: 1 }}
                  >
                    {`Enviar Documentación ${selectedRequests.length ? `(${selectedRequests.length})` : ''}`}
                  </SendButton>
                </div>
              </Tooltip>
            </SafetyComponent>
          )}
        <DialogAlert
          onClose={() => setOpen(false)}
          open={open}
          title={'¿Desea enviar la documentación?'}
          textContent={
            '' +
            'Verifique que la documentación seleccionada cumple con lo requerido.\n' +
            'Al confirmar se enviará la documentación seleccionada al oferente'
          }
          onConfirm={() => {
            onClickSend();
            setOpen(false);
          }}
        />
      </CardActions>
    </Card>
  );
}

export default CompanySolicitationRequestedFiles;
