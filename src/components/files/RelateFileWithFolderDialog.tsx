import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import BaseDialogTitle from '../dialog/BaseDialogTitle';
import {
  DocumentCopyBody,
  DocumentCopyBodyFields,
  DocumentFolderViewDTO,
  DocumentFolderViewDTOFields,
} from '../../types/files/filesFoldersData';
import * as yup from "yup";
import React, {useEffect, useMemo, useState} from 'react';
import { HttpFilesFolders } from '../../http/files/httpFilesFolders';
import RelatedFolderTreeViewNode from './RelatedFolderTreeViewNode';
import { ConfirmButton } from '../buttons/Buttons';
import {BaseResponseFields, EntityWithIdFields} from '../../types/baseEntities';
import { useAction } from '../../hooks/useAction';
import { LoaderBlockUI } from '../loader';
import { ControlledTextFieldFilled } from '../forms';
import { useForm } from 'react-hook-form';
import { HttpFilesOfferer } from '../../http';
import useAxios from '../../hooks/useAxios';
import {RequiredStringSchema} from "../../util/validation/validationSchemas";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {NavsTabHorizontal} from "../navs/NavsTab";

interface RelateFileWithFolderDialogProps {
  fileId: number;
  fileName?: string;
  fileDesc?: string;
  completeForm?: boolean;
  open: boolean;
  onClose: () => void;
  onReload?: () => void;
  companyId?: number;
  offererId?: number;
  solicitationId?: number;
}

enum RelateFileTabValue {
  ClientFolder = 0,
  CustomFolder = 1,
}

const RelateFileWithFolderDialog = ({
  fileId,
  fileName,
  fileDesc,
  completeForm = false,
  open,
  onClose,
  onReload,
  companyId,
  offererId, solicitationId
}: RelateFileWithFolderDialogProps) => {
  const [folders, setFolders] = useState<DocumentFolderViewDTO[]>();
  const [sharedFoldersId, setSharedFoldersId] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { snackbarSuccess } = useAction();
  const { fetchData } = useAxios();
  const [tabValue, setTabValue] = useState<number>(!!solicitationId ? RelateFileTabValue.ClientFolder : RelateFileTabValue.CustomFolder);
  const hasFoldersCreated = useMemo(() => !!folders && !!folders.length, [folders]);
  const tabOptions = useMemo(() => {
    const tabList= [];
    
    if (!!solicitationId)
      tabList.push({label: 'Guardar en carpeta del cliente', default: true, content: <></>})

    tabList.push({label: 'Guardar en carpeta personalizada', default: !solicitationId, content: <></>})

    return [{ tabList: tabList }]
  }, [solicitationId]);

  const documentCopySchema = yup.object().shape({
    [DocumentCopyBodyFields.Title]: RequiredStringSchema
  })
  
  const { control, handleSubmit } = useForm<DocumentCopyBody>({
    defaultValues: {
      [DocumentCopyBodyFields.Title]: fileName,
      [DocumentCopyBodyFields.Description]: fileDesc,
    },
    resolver: yupResolver(documentCopySchema)
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
      if (companyId) {
        HttpFilesFolders.getFoldersByFileId(companyId, fileId).then((r) => {
          setFolders(r);
          setLoading(false);
          const defaultList: number[] = getDefaultValues(r, []);
          setSharedFoldersId(defaultList);
        });
      }
      if (offererId) {
        HttpFilesFolders.getOffererFoldersByDocumentId(offererId, fileId).then(
          (r) => {
            setFolders(r);
            setLoading(false);
            const defaultList: number[] = getDefaultValues(r, []);
            setSharedFoldersId(defaultList);
          },
        );
      }
    }
  }, [open]);

  const handleClose = () => {
    setSharedFoldersId([]);
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

  const onSubmitDialog = () => {
    fetchData(
      () =>
        HttpFilesFolders.relateFileWithFolders(fileId, sharedFoldersId ?? []),
      true,
    ).then(() => {
      snackbarSuccess('El archivo se relacionó correctamente');
      onReload && onReload();
      handleClose();
    });
  };

  const onSubmitForm = (data: DocumentCopyBody) => {
    if (offererId) {
      if (tabValue === RelateFileTabValue.CustomFolder) {
        fetchData(
          () => HttpFilesOfferer.insertByDocumentId(offererId, fileId, data),
          true,
        ).then((res) =>
          fetchData(
            () =>
              HttpFilesFolders.relateFileWithFolders(res, sharedFoldersId ?? []),
            true,
          ).then(() => {
            snackbarSuccess('El archivo se relacionó correctamente');
            onReload && onReload();
            handleClose();
          }),
        );
      } else if (solicitationId) {
        fetchData(
            () => HttpFilesOfferer.insertSolicitationDoc(offererId, fileId, solicitationId, data),
            true,
        ).then((r) => {
          if (!r[BaseResponseFields.HasError]) {
            snackbarSuccess('El archivo se relacionó correctamente')
            onReload && onReload()
            handleClose()
          }
        })
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'md'} fullWidth>
      <BaseDialogTitle onClose={handleClose}
                       title={`¿Querés vincular este documento con alguna/s de tus carpetas personalizadas?`} 
      />
      <DialogContent>
        <NavsTabHorizontal lstTabs={tabOptions}
                           fullWidth
                           onChange={(num) => {
                             setTabValue(num)
                           }}
        />
        <Stack spacing={3}>
          {
            tabValue === RelateFileTabValue.CustomFolder ?
              hasFoldersCreated ?
                <Alert severity={'info'} color={'info'}>
                  {`Seleccioná la/s carpeta/s con las que quieras vincular el documento `}
                  <Typography component={'span'} fontWeight={500} fontStyle={'italic'}>{`“${fileName}”`}</Typography>
                  {`. Para crear una nueva carpeta hacelo en carpetas personalizadas.`}
                </Alert>
                :
                <Alert severity={'info'} color={'info'}>
                  Para vincular el documento creá tus carpetas en carpetas personalizadas.
                </Alert>
                :
              <React.Fragment />
          }

          {offererId && completeForm && (
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
          )}
          <Stack>
            {
              folders && 
              tabValue === RelateFileTabValue.CustomFolder &&
              folders.length !== 0 &&
              folders.map((fol) => (
                <RelatedFolderTreeViewNode
                  folder={fol}
                  onSelect={onSelectFolder}
                />
              ))}
          </Stack>
        </Stack>
      </DialogContent>
      
      {
        hasFoldersCreated &&
          <DialogActions>
              <ConfirmButton
                color={'primary'}
                variant={'contained'}
                onClick={completeForm ? handleSubmit(onSubmitForm) : onSubmitDialog}
                id={"company-library-relate-dialog-save-btn"}
              >
                Confirmar
              </ConfirmButton>
          </DialogActions>
      }
      
      {loading && <LoaderBlockUI />}
    </Dialog>
  );
};

export default RelateFileWithFolderDialog;
