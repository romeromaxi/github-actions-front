import React, { useEffect, useState } from 'react';
import { HttpFilesCompany } from '../../../../http';
import {
  Document,
  DocumentFields,
  FileBase,
} from '../../../../types/files/filesData';
import { Sections } from '../../../../types/general/generalEnums';
import { LoaderBlockUI } from '../../../../components/loader';
import { Grid, Stack, Typography } from '@mui/material';
import BoxNewEntity from '../../../../components/misc/BoxNewEntity';
import FileNewDialog from '../../../../components/files/NewFileDialog';
import { HttpCacheFiles } from '../../../../http/cache/httpCacheFiles';
import FileCard from '../../../../components/cards/FileCard';

interface MenuFillingsFilesProps {
  companyId: number;
}

const MenuFillingsFiles = ({ companyId }: MenuFillingsFilesProps) => {
  const [files, setFiles] = useState<Document[]>();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onOpenDialog = () => setOpenDialog(true);

  const onCloseDialog = () => setOpenDialog(false);

  const loadCompanyFiles = () => {
    setLoading(true);
    HttpFilesCompany.getFilesByIdCompany(companyId)
      .then((r) => {
        const presentationsFiles = r.filter(
          (x) => x[DocumentFields.FileSectionCode] === Sections.Presentations,
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

  const onSaveFile = (fileCompany: FileBase, file: File) => {
    return HttpFilesCompany.insert(companyId, fileCompany, file);
  };

  useEffect(() => {
    loadCompanyFiles();
  }, []);

  return (
    <Stack spacing={0.2}>
      <Typography variant="h3" fontWeight={600}>
        Mis Archivos
      </Typography>

      <Grid container sx={{ width: '100% !important' }} spacing={2}>
        <Grid item xs={12} container spacing={1}>
          {loading ? (
            <></>
          ) : (
            <>
              {files &&
                files.length !== 0 &&
                files.map((file) => (
                  <Grid item xs={6} md={3}>
                    <FileCard file={file} actionReload={onReload} />
                  </Grid>
                ))}

              <Grid item xs={6} md={3}>
                <BoxNewEntity
                  title={'Agregar archivo'}
                  subtitle={
                    'Hacé click sobre el botón para agregar un nuevo archivo'
                  }
                  onClickNew={onOpenDialog}
                  horizontal={false}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Grid>

      {openDialog && (
        <FileNewDialog
          section={Sections.Presentations}
          onLoadFileTypes={HttpCacheFiles.getTypes}
          onCloseDialog={onCloseDialog}
          onSubmitDialog={onSaveFile}
          onReload={onReload}
        />
      )}
    </Stack>
  );
};

export default MenuFillingsFiles;
