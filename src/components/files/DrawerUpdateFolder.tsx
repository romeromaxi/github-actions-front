import {Button, Stack} from '@mui/material';
import {ControlledTextFieldFilled} from 'components/forms';
import {DocumentFolderFields, DocumentFolderUpdate,} from 'types/files/filesFoldersData';
import {useForm} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {HttpFilesFolders} from 'http/files/httpFilesFolders';
import {RequiredSchema} from 'util/validation/validationSchemas';
import React, {useEffect} from 'react';
import DrawerBase from "components/misc/DrawerBase";
import {TypographyBase} from "components/misc/TypographyBase";
import {EntityWithIdFields} from "types/baseEntities";
import { useAction } from 'hooks/useAction';

interface DrawerUpdateFolderProps {
  open: boolean;
  folder: DocumentFolderUpdate,
  onClose: () => void;
  afterSubmit: () => void;
}

const DrawerUpdateFolder = ({
  open, folder, onClose, afterSubmit,
}: DrawerUpdateFolderProps) => {
  const { showLoader, hideLoader } = useAction();
  const folderId = folder[EntityWithIdFields.Id];
  
  const folderInsertSchema = yup.object().shape({
    [DocumentFolderFields.FolderName]: RequiredSchema,
  });

  const { control, handleSubmit, reset } = useForm<DocumentFolderUpdate>({
    resolver: yupResolver(folderInsertSchema),
    defaultValues: folder
  });

  useEffect(() => {
    if (!open)
      reset({ [DocumentFolderFields.FolderName]: '' });
  }, [open]);
  
  const onSubmit = (data: DocumentFolderUpdate) => {
    showLoader();
    
    HttpFilesFolders.updateFolder(folderId, data)
      .then(afterSubmit)
      .finally(hideLoader);
  };

  const actionButton = (
      <Button size={'medium'} variant={'contained'} onClick={handleSubmit(onSubmit)}>
        Confirmar
      </Button>
  );
  
  return (
    <DrawerBase show={open} 
                onCloseDrawer={onClose}
                title={`¿Querés cambiar el nombre de la carpeta "${folder[DocumentFolderFields.FolderName]}"`}
                action={actionButton}
    >
        <Stack spacing={1.5}>
          <TypographyBase component={'span'} variant={'subtitle2'}>
            Escribí el nuevo nombre de la carpeta
          </TypographyBase>
          
          <ControlledTextFieldFilled
              control={control}
              name={DocumentFolderFields.FolderName}
              fullWidth
              label={'Nombre de la carpeta'}
          />
        </Stack>
    </DrawerBase>
  );
};

export default DrawerUpdateFolder;
