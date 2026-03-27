import {
  Document,
  DocumentFields,
  FileBlobResponse,
} from 'types/files/filesData';
import FileSelectedDetailStyles from '../files/FileSelectedDetail.styles';
import React, { Key, useState } from 'react';
import { Box, Chip, Grid, Stack, Tooltip, Typography } from '@mui/material';
import { fileFormatter } from 'util/formatters/fileFormatter';
import {
  CloseIconButton,
  SearchIconButton,
  ShareIconButton,
} from '../buttons/Buttons';
import { HttpFileDocument, HttpFilesSolicitation } from 'http/index';
import { EntityWithIdFields } from 'types/baseEntities';
import useAxios from 'hooks/useAxios';
import { useAction } from 'hooks/useAction';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DialogPreviewFile from '../files/DialogPreviewFile';
import { LoaderBlockUI } from '../loader';
import RelateFileWithFolderDialog from '../files/RelateFileWithFolderDialog';
import CompanySolicitationDialogRelateFileDocument from '../../pages/company/solicitations/CompanySolicitationDialogRelateFileDocument';
import {
  SolicitationFlags,
  SolicitationFlagsFields,
} from '../../types/solicitations/solicitationData';
import { DialogAlertLUC } from '../dialog/DialogAlertLUC';
import { grey } from '@mui/material/colors';

interface SolicitationRequiredFileDocumentDetailProps {
  doc: Document;
  triggerRight: boolean;
  presented: boolean;
  fileId: number;
  solicitationId: number;
  key?: Key | null;
  onReload?: () => void;
  offerer: boolean;
  offererId?: number;
  companyId?: number;
  commercial?: boolean;
  flags?: SolicitationFlags;
}

const SolicitationRequiredFileDocumentDetail = (
  props: SolicitationRequiredFileDocumentDetailProps,
) => {
  const classes = FileSelectedDetailStyles();
  const [checkValue, setCheckValue] = useState<boolean>(
    props.doc[DocumentFields.Approved] ?? false,
  );
  const { fetchData } = useAxios();
  const { snackbarSuccess } = useAction();
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [fileBlob, setFileBlob] = useState<FileBlobResponse>();
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [sharePyme, setShowSharePyme] = useState<boolean>(false);
  const [openAccessDenied, setOpenAccessDenied] = useState<boolean>(false);

  const showValidateOptions =
    props.offerer && props.commercial && props.triggerRight;

  const triggerApprove = () => {
    if (checkValue) {
      fetchData(
        () =>
          HttpFilesSolicitation.removeValidateFile(
            props.solicitationId,
            props.doc[EntityWithIdFields.Id],
          ),
        true,
      ).then(() => {
        setCheckValue(false);
        snackbarSuccess('Se invalidó el documento');
      });
    } else {
      fetchData(
        () =>
          HttpFilesSolicitation.validateFile(
            props.solicitationId,
            props.doc[EntityWithIdFields.Id],
          ),
        true,
      ).then(() => {
        setCheckValue(true);
        snackbarSuccess('Se validó el documento');
      });
    }
  };
  const onRemove = () => {
    fetchData(
      () =>
        HttpFilesSolicitation.removeRequiredFile(
          props.solicitationId,
          props.fileId,
          props.doc[EntityWithIdFields.Id],
        ),
      true,
    ).then(() => props.onReload && props.onReload());
  };

  const onPreview = () => {
    setShowLoader(true);
    HttpFileDocument.download(props.doc[EntityWithIdFields.Id]).then((blob) => {
      setFileBlob(blob);
      setOpenPreview(true);
      setShowLoader(false);
    });
  };

  const onClosePreview = () => {
    setOpenPreview(false);
    setFileBlob(undefined);
  };

  const onShowSharePyme = () => {
    if (props.flags) {
      if (props.flags[SolicitationFlagsFields.HasFullAccess])
        setShowSharePyme(true);
      else setOpenAccessDenied(true);
    }
  };

  return (
    <Box className={classes.root} key={props.key}>
      <Grid container alignItems={'center'} spacing={2}>
        <Grid item md={8.25}>
          <Stack spacing={2} direction={'row'} alignItems={'center'}>
            {fileFormatter.getIconByFileName(
              props.doc[DocumentFields.FileDesc],
              { fontSize: 'large' },
            )}
            <Typography fontWeight={500} sx={{ overflowWrap: 'anywhere' }}>
              {props.doc[DocumentFields.FileDesc]}
            </Typography>
          </Stack>
        </Grid>
        <Grid item md={showValidateOptions ? 1.25 : 3.75}>
          <Stack
            spacing={2}
            direction={'row'}
            alignItems={'center'}
            justifyContent={'flex-end'}
          >
            <SearchIconButton
              onClick={onPreview}
              tooltipTitle={'Previsualizar archivo'}
            />
            {props.offererId && showValidateOptions && (
              <ShareIconButton
                color={'secondary'}
                onClick={() => {
                  setShowShare(true);
                }}
                tooltipTitle={'Relacionar a Carpeta'}
              />
            )}
            {props.triggerRight && !props.offerer && (
              <ShareIconButton
                color={'secondary'}
                onClick={onShowSharePyme}
                tooltipTitle={'Relacionar a Seccion'}
              />
            )}
            {props.triggerRight && !props.offerer && !props.presented && (
              <CloseIconButton
                onClick={onRemove}
                tooltipTitle={'Presione para quitar este documento del pedido'}
              />
            )}
          </Stack>
        </Grid>
        {showValidateOptions && (
          <Grid item md={2.5}>
            <Tooltip
              title={
                checkValue
                  ? 'Hacé click para invalidar este archivo'
                  : 'Hacé click para validar este archivo'
              }
            >
              <Chip
                label={checkValue ? 'Validado' : 'Sin validar'}
                onClick={triggerApprove}
                color={checkValue ? 'primary' : 'default'}
                variant={checkValue ? 'filled' : 'outlined'}
                icon={
                  checkValue ? (
                    <CheckIcon fontSize={'small'} />
                  ) : (
                    <CloseIcon fontSize={'small'} />
                  )
                }
                size={'small'}
              />
            </Tooltip>
          </Grid>
        )}
      </Grid>
      {fileBlob && (
        <DialogPreviewFile
          open={openPreview}
          onClose={onClosePreview}
          fileBlob={fileBlob}
        />
      )}
      <RelateFileWithFolderDialog
        fileId={props.doc[EntityWithIdFields.Id]}
        fileName={props.doc[DocumentFields.FileDesc]}
        fileDesc={props.doc[DocumentFields.DescriptionDocument]}
        open={showShare}
        onClose={() => {
          setShowShare(false);
        }}
        offererId={props.offererId}
        completeForm
      />
      <CompanySolicitationDialogRelateFileDocument
        open={sharePyme}
        onClose={() => {
          setShowSharePyme(false);
        }}
        companyId={props.companyId}
        documentId={props.doc[EntityWithIdFields.Id]}
      />
      {showLoader && <LoaderBlockUI />}
      <DialogAlertLUC
        open={openAccessDenied}
        title={'No se puede realizar esta acción'}
        onClose={() => setOpenAccessDenied(false)}
      >
        <Typography fontSize={13} color={grey[600]} textAlign={'center'}>
          Para poder realizar esta acción es necesario que tu Cuenta MiPyME esté
          verificada.
        </Typography>
      </DialogAlertLUC>
    </Box>
  );
};

export default SolicitationRequiredFileDocumentDetail;
