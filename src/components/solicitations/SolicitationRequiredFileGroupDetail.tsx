import {
  SolicitationFileRequested,
  SolicitationFileRequestedFields,
} from '../../types/files/filesData';
import React, { useState } from 'react';
import FileNewDialog, { FileNewDialogProps } from '../files/NewFileDialog';
import {
  Checkbox,
  Chip,
  Grid,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { dateFormatter } from '../../util/formatters/dateFormatter';
import { stringFormatter } from '../../util/formatters/stringFormatter';
import {
  DeleteIconButton,
  DownloadIconButton,
  SearchDocumentIconButton,
  SearchIconButton,
  UploadIconButton,
} from '../buttons/Buttons';
import { EntityWithIdFields } from '../../types/baseEntities';
import { HttpFilesSolicitation } from '../../http/files/httpFilesSolicitation';
import useAxios from '../../hooks/useAxios';
import { HttpFileDocument } from '../../http';
import SolicitationRequiredFileDialogDetail from './SolicitationRequiredFileDialogDetail';
import { DialogAlert } from '../dialog';
import { useAction } from '../../hooks/useAction';

interface SolicitationRequiredFileGroupDetailProps {
  file: SolicitationFileRequested;
  onReload: () => void;
  offerer: boolean;
  offererId?: number;
  solicitationId: number;
  commercial?: boolean;
  onSelectFile?: (
    event: React.ChangeEvent<HTMLInputElement>,
    fileId: number,
  ) => void;
  uploadDialog?: FileNewDialogProps;
  companyId?: number;
  last: boolean;
}

const SolicitationRequiredFileGroupDetail = (
  props: SolicitationRequiredFileGroupDetailProps,
) => {
  const [open, setOpen] = useState<boolean>(false);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [triggerRight, setTriggerRight] = useState<boolean>(false);
  const { fetchAndDownloadFile, fetchData } = useAxios();
  const { snackbarSuccess } = useAction();
  const [openDelete, setOpenDelete] = useState<boolean>(false);

  const onDownloadPymeFile = () =>
    fetchAndDownloadFile(() =>
      HttpFilesSolicitation.downloadRequiredFiles(
        props.solicitationId,
        props.file[EntityWithIdFields.Id],
      ),
    ).then(() => {
      if (props.offerer)
        HttpFilesSolicitation.readResponseRequired(
          props.solicitationId,
          props.file[EntityWithIdFields.Id],
        );
    });

  const onDownloadOffererFile = () =>
    fetchAndDownloadFile(() =>
      HttpFileDocument.download(
        props.file[SolicitationFileRequestedFields.DocumentId],
      ),
    );

  const onDelete = () => {
    fetchData(
      () =>
        HttpFilesSolicitation.inactivateRequestedFiles(
          props.solicitationId,
          props.file[EntityWithIdFields.Id],
        ),
      true,
    ).then(() => {
      snackbarSuccess('El pedido de documentación se eliminó correctamente');
      props.onReload();
    });
  };

  return (
    <>
      <Grid
        item
        xs={12}
        md={props.offerer ? 6.8 : 5.9}
        container
        alignItems={'center'}
      >
        <Grid item md={2}>
          <Typography>
            {dateFormatter.toShortDate(
              props.file[SolicitationFileRequestedFields.BeginDate],
            )}
          </Typography>
        </Grid>
        <Grid item md={4}>
          <Tooltip title={props.file[SolicitationFileRequestedFields.Title]}>
            <Typography>
              {`#${props.file[EntityWithIdFields.Id]} ${stringFormatter.cutIfHaveMoreThan(props.file[SolicitationFileRequestedFields.Title], 30)}`}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item md={3}>
          <Tooltip
            title={props.file[SolicitationFileRequestedFields.Observations]}
          >
            <Typography>
              {stringFormatter.cutIfHaveMoreThan(
                props.file[SolicitationFileRequestedFields.Observations],
                20,
              )}
            </Typography>
          </Tooltip>
        </Grid>
        <Grid item md={1.5} textAlign={'center'}>
          {props.file[SolicitationFileRequestedFields.DocumentId] !== 0 && (
            <DownloadIconButton
              onClick={onDownloadOffererFile}
              tooltipTitle={'Descargar Formulario'}
            />
          )}
        </Grid>
        <Grid item md={0.75} textAlign={'center'}>
          <SearchIconButton
            tooltipTitle={'Ver Detalle del Pedido'}
            onClick={() => {
              setOpenDetail(true);
              setTriggerRight(false);
            }}
          />
        </Grid>
        <Grid item md={0.75} textAlign={'center'}>
          {props.file[SolicitationFileRequestedFields.DeleteAllowed] && (
            <DeleteIconButton
              tooltipTitle={'Eliminar Pedido'}
              onClick={() => {
                setOpenDelete(true);
              }}
            />
          )}
        </Grid>
      </Grid>
      <Grid item md={0.2}></Grid>
      <Grid
        item
        xs={12}
        md={props.offerer ? 5 : 5.9}
        container
        alignItems={'center'}
      >
        <Grid item md={2.25}>
          <Typography>
            {dateFormatter.toShortDate(
              props.file[SolicitationFileRequestedFields.SentDate],
            )}
          </Typography>
        </Grid>
        <Grid item md={1.75}>
          <Typography textAlign={'center'}>
            {props.file[SolicitationFileRequestedFields.DocumentsQuantity] ||
              '-'}
          </Typography>
        </Grid>
        <Grid item md={1.75} justifyContent={'center'} textAlign={'center'}>
          {props.offerer &&
          !props.file[SolicitationFileRequestedFields.Sent] ? (
            <Typography>-</Typography>
          ) : (
            <SearchDocumentIconButton
              tooltipTitle={'Ver Documentación'}
              onClick={() => {
                setOpenDetail(true);
                setTriggerRight(true);
              }}
            />
          )}
        </Grid>
        <Grid item md={2.5}>
          <Stack
            direction={'row'}
            spacing={1}
            alignItems={'center'}
            justifyContent={props.offerer ? 'center' : ''}
          >
            {props.file[SolicitationFileRequestedFields.DocumentsQuantity] >
            0 ? (
              <DownloadIconButton
                tooltipTitle={'Descargar Documentación'}
                onClick={onDownloadPymeFile}
              />
            ) : (
              <DownloadIconButton sx={{ visibility: 'hidden' }} />
            )}
            {!props.offerer &&
              !props.file[SolicitationFileRequestedFields.Sent] && (
                <UploadIconButton
                  tooltipTitle={'Agregar Documento'}
                  onClick={() => {
                    setOpen(true);
                  }}
                />
              )}
            {!props.offerer &&
              !props.file[SolicitationFileRequestedFields.Sent] &&
              props.onSelectFile && (
                <Checkbox
                  value={props.file[EntityWithIdFields.Id]}
                  onChange={(e) =>
                    props.onSelectFile &&
                    props.onSelectFile(e, props.file[EntityWithIdFields.Id])
                  }
                  disabled={
                    !props.file[
                      SolicitationFileRequestedFields.DocumentsQuantity
                    ] ||
                    props.file[
                      SolicitationFileRequestedFields.DocumentsQuantity
                    ] === 0
                  }
                />
              )}
          </Stack>
        </Grid>
        <Grid item md={3.75}>
          {!props.offerer &&
            !props.file[SolicitationFileRequestedFields.Sent] &&
            props.file[SolicitationFileRequestedFields.DocumentsQuantity] !==
              0 &&
            props.file[SolicitationFileRequestedFields.DocumentsQuantity] && (
              <Chip
                variant={'outlined'}
                color={'info'}
                size={'small'}
                label={'Pendiente de envío'}
              />
            )}
          {!props.offerer &&
            props.file[SolicitationFileRequestedFields.Sent] && (
              <Chip
                variant={'outlined'}
                color={'success'}
                size={'small'}
                label={'Presentados'}
              />
            )}
          {!props.offerer &&
            (props.file[SolicitationFileRequestedFields.DocumentsQuantity] ===
              0 ||
              !props.file[SolicitationFileRequestedFields.DocumentsQuantity]) &&
            !props.file[SolicitationFileRequestedFields.Sent] && (
              <Chip
                variant={'outlined'}
                color={'warning'}
                size={'small'}
                label={'Subir documentación'}
              />
            )}
        </Grid>
      </Grid>
      {props.uploadDialog && open && (
        <FileNewDialog
          {...props.uploadDialog}
          onCloseDialog={() => {
            setOpen(false);
          }}
        />
      )}
      <SolicitationRequiredFileDialogDetail
        file={props.file}
        open={openDetail}
        onClose={() => {
          setOpenDetail(false);
          setTriggerRight(false);
        }}
        solicitationId={props.solicitationId}
        tableRight={triggerRight}
        offerer={props.offerer}
        offererId={props.offererId}
        uploadDialog={props.uploadDialog}
        onReload={props.onReload}
        commercial={props.commercial}
        companyId={props.companyId}
      />
      {openDelete && (
        <DialogAlert
          onClose={() => {
            setOpenDelete(false);
          }}
          open={openDelete}
          title="Eliminar pedido de documentación"
          textContent="¿Estás seguro que deseás eliminar el pedido de documentación?"
          onConfirm={onDelete}
        />
      )}
    </>
  );
};

export default SolicitationRequiredFileGroupDetail;
