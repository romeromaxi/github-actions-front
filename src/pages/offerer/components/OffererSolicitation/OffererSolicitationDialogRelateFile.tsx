import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import {
  DocumentCopyBody,
  DocumentCopyBodyFields,
  DocumentFolderViewDTO,
  DocumentFolderViewDTOFields,
} from 'types/files/filesFoldersData';
import { useAction } from 'hooks/useAction';
import useAxios from 'hooks/useAxios';
import { useForm } from 'react-hook-form';
import { EntityWithIdFields } from 'types/baseEntities';
import { HttpFilesFolders, HttpSolicitation } from 'http/index';
import BaseDialogTitle from 'components/dialog/BaseDialogTitle';
import { ControlledTextFieldFilled } from 'components/forms';
import RelatedFolderTreeViewNode from 'components/files/RelatedFolderTreeViewNode';
import { ConfirmButton } from 'components/buttons/Buttons';
import { LoaderBlockUI } from 'components/loader';
import { yupResolver } from '@hookform/resolvers/yup';
import { RequiredSchema } from 'util/validation/validationSchemas';

interface OffererSolicitationDialogRelateFileProps {
  open: boolean;
  onClose: () => void;
  offererId: number;
  solicitationId: number;
}

const OffererSolicitationDialogRelateFile = ({
  open,
  onClose,
  offererId,
  solicitationId,
}: OffererSolicitationDialogRelateFileProps) => {
  const [folders, setFolders] = useState<DocumentFolderViewDTO[]>();
  const [sharedFoldersId, setSharedFoldersId] = useState<number[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { snackbarSuccess, snackbarError } = useAction();
  const { fetchData } = useAxios();

  const documentCopyBodySchema = yup
    .object()
    .shape({ [DocumentCopyBodyFields.Title]: RequiredSchema });
  const { control, handleSubmit, reset } = useForm<DocumentCopyBody>({
    resolver: yupResolver(documentCopyBodySchema),
  });
  const checkIfPresent = (fol: DocumentFolderViewDTO, lst: number[]) => {
    if (fol[DocumentFolderViewDTOFields.IsPresent]) {
      lst.push(fol[EntityWithIdFields.Id]);
    }
  };

  const getFolderValue = (fol: DocumentFolderViewDTO, lst: number[]) => {
    checkIfPresent(fol, lst);
    if (fol[DocumentFolderViewDTOFields.DaughtersFolders].length !== 0) {
      fol[DocumentFolderViewDTOFields.DaughtersFolders].map((childFol) => {
        getFolderValue(childFol, lst);
      });
    }
  };
  const getDefaultValues = (
    foldersEndpoint: DocumentFolderViewDTO[],
    lst: number[],
  ) => {
    foldersEndpoint.map((fol) => {
      getFolderValue(fol, lst);
    });

    return lst;
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      HttpFilesFolders.getOffererFoldersByDocumentId(offererId, 0).then((r) => {
        setFolders(r);
        setLoading(false);
        const defaultList: number[] = getDefaultValues(r, []);
        setSharedFoldersId(defaultList);
      });
    } else {
      reset();
    }
  }, [open]);

  const handleClose = () => {
    setSharedFoldersId([]);
    setFolders(undefined);
    onClose();
  };

  const onSelectFolder = (
    event: React.ChangeEvent<HTMLInputElement>,
    id?: number,
  ) => {
    if (id) {
      let newSelectedIds: number[];

      if (event.target.checked) {
        newSelectedIds = [...sharedFoldersId, id];
        setSharedFoldersId(newSelectedIds);
      } else {
        newSelectedIds = [...sharedFoldersId].filter(
          (folderId) => folderId !== id,
        );
        setSharedFoldersId(newSelectedIds);
      }
    }
  };

  const onSubmitForm = (data: DocumentCopyBody) => {
    fetchData(
      () =>
        HttpSolicitation.createOffererDocToLinkWithLibrary(
          offererId,
          solicitationId,
          data,
        ),
      true,
    ).then((res) =>
      fetchData(
        () =>
          HttpFilesFolders.relateFileWithFolders(res, sharedFoldersId ?? []),
        true,
      ).then(() => {
        snackbarSuccess('El archivo se relacionó correctamente');
        handleClose();
      }),
    );
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'md'} fullWidth>
      <BaseDialogTitle onClose={handleClose} title={`Agregar a Carpeta`} />
      <DialogContent>
        <Stack spacing={3}>
          <Typography
            fontSize={16}
            textAlign={'center'}
          >{`Seleccione la/s carpeta/s para guardar la solicitud`}</Typography>
          <Alert severity={'info'} color={'info'}>
            Si desea quitar el archivo de todas las carpetas, deseleccione todas
            las opciones
          </Alert>
          <Stack spacing={1}>
            <ControlledTextFieldFilled
              control={control}
              name={DocumentCopyBodyFields.Title}
              label="Título"
              fullWidth
            />
            <ControlledTextFieldFilled
              control={control}
              name={DocumentCopyBodyFields.Description}
              multiline
              rows={3}
              fullWidth
            />
          </Stack>
          <Stack>
            {folders &&
              folders.length !== 0 &&
              folders.map((fol) => (
                <RelatedFolderTreeViewNode
                  folder={fol}
                  onSelect={onSelectFolder}
                />
              ))}
            {error && (
              <Alert severity={'error'}>
                Debe seleccionar carpetas para relacionar el archivo
              </Alert>
            )}
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <ConfirmButton
          color={'primary'}
          variant={'contained'}
          onClick={handleSubmit(onSubmitForm)}
        >
          Confirmar
        </ConfirmButton>
      </DialogActions>
      {loading && <LoaderBlockUI />}
    </Dialog>
  );
};

export default OffererSolicitationDialogRelateFile;
