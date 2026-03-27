import {Stack} from '@mui/material';
import {ControlledTextFieldFilled} from 'components/forms';
import {
  DocumentFolderInsert,
  DocumentFolderInsertFields,
} from 'types/files/filesFoldersData';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {AddButton} from 'components/buttons/Buttons';
import { HttpFilesFolders } from 'http/files/httpFilesFolders';
import { RequiredSchema } from 'util/validation/validationSchemas';
import { useEffect } from 'react';
import DrawerBase from "components/misc/DrawerBase";
import {TypographyBase} from "components/misc/TypographyBase";
import {ROOT_FOLDER_NAME} from "types/general/generalEnums";

interface DrawerNewFolderProps {
  open: boolean;
  onClose: () => void;
  afterSubmit: () => void;
  companyId?: number;
  offererId?: number;
  parentId?: number;
  folderName?: string;
}

const DrawerNewFolder = ({
  open,
  onClose,
  afterSubmit,
  companyId,
  offererId,
  parentId,
  folderName,
}: DrawerNewFolderProps) => {
  const folderInsertSchema = yup.object().shape({
    [DocumentFolderInsertFields.FolderName]: RequiredSchema,
  });

  const { control, handleSubmit, reset } = useForm<DocumentFolderInsert>({
    resolver: yupResolver(folderInsertSchema),
  });

  useEffect(() => {
    reset({ [DocumentFolderInsertFields.FolderName]: '' });
  }, [open]);
  
  const onSubmit = (data: DocumentFolderInsert) => {
    const completedData: DocumentFolderInsert = {
      ...data,
      [DocumentFolderInsertFields.CompanyId]: companyId,
      [DocumentFolderInsertFields.OffererId]: offererId,
      [DocumentFolderInsertFields.FatherFolderId]: parentId,
    };

    HttpFilesFolders.insertFolder(completedData)
      .then(() => {
        afterSubmit();
      })
      .finally(() => onClose());
  };

  return (
    <DrawerBase show={open} 
                onCloseDrawer={onClose}
                title={'¿Querés crear una nueva carpeta?'}
                action={<AddButton onClick={handleSubmit(onSubmit)} id={"company-folder-drawer-new-btn"}>Crear carpeta</AddButton>}
    >
        <Stack spacing={1.5}>
          <TypographyBase component={'span'} variant={'subtitle2'}>
            {`Esta carpeta se creará ${folderName !== '' ? `dentro de la carpeta ` : 'en la carpeta '}`}
            <TypographyBase component={'span'} fontWeight={'bold'} fontStyle={'italic'}>
              "{folderName ?? ROOT_FOLDER_NAME}"
            </TypographyBase>
          </TypographyBase>
          
          <ControlledTextFieldFilled
              control={control}
              name={DocumentFolderInsertFields.FolderName}
              fullWidth
              label={'Nombre de la carpeta'}
          />
        </Stack>
    </DrawerBase>
  );
};

export default DrawerNewFolder;
