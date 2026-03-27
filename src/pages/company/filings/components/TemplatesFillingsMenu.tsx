import { Alert, Grid, Stack, Typography } from '@mui/material';
import { BackButton } from '../../../../components/buttons/Buttons';
import React, { useEffect, useState } from 'react';
import { HttpFilesCompany } from '../../../../http';
import {
  Document,
  DocumentFields,
  FileBase,
} from '../../../../types/files/filesData';
import { Sections } from '../../../../types/general/generalEnums';
import FileNewDialog from '../../../../components/files/NewFileDialog';
import { HttpCacheFiles } from '../../../../http/cache/httpCacheFiles';
import { LoaderBlockUI } from '../../../../components/loader';
import BoxNewEntity from '../../../../components/misc/BoxNewEntity';
import FileDocumentDetail from '../../../../components/files/FileDocumentDetail';

interface TemplatesFillingsMenuProps {
  onBack: () => void;
  companyId: number;
}

const TemplatesFillingsMenu = ({
  onBack,
  companyId,
}: TemplatesFillingsMenuProps) => {
  const [files, setFiles] = useState<Document[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const loadCompanyFiles = () => {
    setLoading(true);
    HttpFilesCompany.getFilesByIdCompany(companyId)
      .then((r) => {
        const presentationsFiles = r.filter(
          (x) =>
            x[DocumentFields.FileSectionCode] ===
            Sections.PresentationsTemplates,
        );
        setFiles(presentationsFiles);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onReload = () => {
    loadCompanyFiles();
  };
  useEffect(() => {
    loadCompanyFiles();
  }, []);

  const onOpenDialog = () => setOpenDialog(true);

  const onCloseDialog = () => setOpenDialog(false);
  const onSaveFile = (fileCompany: FileBase, file: File) => {
    return HttpFilesCompany.insert(companyId, fileCompany, file);
  };

  return (
    <Stack spacing={1}>
      <Stack
        direction={'row'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <Typography variant="h3" fontWeight={600}>
          Tus Plantillas
        </Typography>
        <BackButton onClick={onBack} size={'small'}>
          Mis Presentaciones
        </BackButton>
      </Stack>

      {loading ? (
        <LoaderBlockUI />
      ) : (
        <Grid container spacing={2} sx={{ width: '100%' }}>
          {files && files.length !== 0 ? (
            files.map((file) => (
              <Grid item xs={12} md={6}>
                <FileDocumentDetail
                  document={file}
                  onReload={onReload}
                  download
                  delete
                  preview
                />
              </Grid>
            ))
          ) : (
            <></>
          )}
          <Grid item xs={12} md={6}>
            <BoxNewEntity
              title={'Agregar archivo'}
              subtitle={
                'Hacé click sobre el botón para agregar un nuevo archivo'
              }
              onClickNew={onOpenDialog}
              horizontal
            />
          </Grid>
        </Grid>
      )}

      {openDialog && (
        <FileNewDialog
          section={Sections.PresentationsTemplates}
          onLoadFileTypes={HttpCacheFiles.getTypes}
          onCloseDialog={onCloseDialog}
          onSubmitDialog={onSaveFile}
          onReload={onReload}
        />
      )}
    </Stack>
  );
};

export default TemplatesFillingsMenu;
