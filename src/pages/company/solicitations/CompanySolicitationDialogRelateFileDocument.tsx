import React, { useEffect, useState } from 'react';
import useAxios from 'hooks/useAxios';
import { useAction } from 'hooks/useAction';
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import { LoaderBlockUI } from 'components/loader';
import { ConfirmButton } from 'components/buttons/Buttons';
import BaseDialogTitle from 'components/dialog/BaseDialogTitle';
import { HttpFilesSections } from 'http/files/httpFilesSections';
import { CompanySectionsWithFileType } from 'types/company/companyData';
import {
  GeneralFilesCompanyFilterFields,
  SectionFilesCompanyFilter,
  SectionFilesCompanyFilterFields,
} from 'types/files/filesData';
import RelatedSectionTreeViewNode from 'components/files/RelatedSectionTreeViewNode';

interface CompanySolicitationDialogRelateFileDocumentProps {
  open: boolean;
  onClose: () => void;
  companyId?: number;
  documentId: number;
}

const isSameSectionFiles = (
  a: SectionFilesCompanyFilter,
  b: SectionFilesCompanyFilter,
) =>
  a[GeneralFilesCompanyFilterFields.SectionCode] ===
    b[GeneralFilesCompanyFilterFields.SectionCode] &&
  a[GeneralFilesCompanyFilterFields.FileTypeCode] ===
    b[GeneralFilesCompanyFilterFields.FileTypeCode] &&
  ((!a[SectionFilesCompanyFilterFields.RelatedId] &&
    !b[SectionFilesCompanyFilterFields.RelatedId]) ||
    a[SectionFilesCompanyFilterFields.RelatedId] ===
      b[SectionFilesCompanyFilterFields.RelatedId]);

const CompanySolicitationDialogRelateFileDocument = ({
  open,
  onClose,
  companyId,
  documentId,
}: CompanySolicitationDialogRelateFileDocumentProps) => {
  const [sections, setSections] = useState<CompanySectionsWithFileType[]>();
  const [sharedFoldersId, setSharedFoldersId] = useState<
    SectionFilesCompanyFilter[]
  >([]);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { snackbarSuccess, snackbarWarning } = useAction();
  const { fetchData } = useAxios();

  useEffect(() => {
    if (open && companyId) {
      setLoading(true);
      HttpFilesSections.getCompanyAvailables(companyId).then((r) => {
        setSections(r);
        setLoading(false);
      });
    }
  }, [open]);

  const handleClose = () => {
    setSharedFoldersId([]);
    onClose();
  };

  const onSelectFolder = (
    event: React.ChangeEvent<HTMLInputElement>,
    ids: SectionFilesCompanyFilter,
  ) => {
    if (ids) {
      let newSelectedIds: SectionFilesCompanyFilter[];

      if (event.target.checked) {
        newSelectedIds = [...sharedFoldersId, ids];
        setSharedFoldersId(newSelectedIds);
      } else {
        newSelectedIds = [...sharedFoldersId].filter(
          (folder) => !isSameSectionFiles(folder, ids),
        );

        setSharedFoldersId(newSelectedIds);
      }
    }
  };

  const onSubmit = () => {
    if (companyId && sharedFoldersId.length !== 0) {
      fetchData(
        () =>
          HttpFilesSections.linkDocToSections(
            companyId,
            documentId,
            sharedFoldersId,
          ),
        true,
      ).then(() => {
        snackbarSuccess('El archivo se relacionó correctamente');
        handleClose();
      });
    } else {
      snackbarWarning(
        'Debe seleccionar al menos una carpeta para relacionar el archivo',
      );
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth={'md'} fullWidth>
      <BaseDialogTitle onClose={handleClose} title={`Agregar a Sección`} />
      <DialogContent>
        <Stack spacing={3}>
          <Typography
            fontSize={16}
            textAlign={'center'}
          >{`Seleccione la/s seccion/es para relacionar el archivo`}</Typography>
          <Stack>
            {sections &&
              sections.length !== 0 &&
              sections.map((sec) => (
                <RelatedSectionTreeViewNode
                  section={sec}
                  onSelect={onSelectFolder}
                  selectedItems={sharedFoldersId}
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
          onClick={onSubmit}
        >
          Confirmar
        </ConfirmButton>
      </DialogActions>
      {loading && <LoaderBlockUI />}
    </Dialog>
  );
};

export default CompanySolicitationDialogRelateFileDocument;
