import React, { useEffect, useState, useRef } from 'react';
import { CompanyViewDTO } from '../../../types/company/companyData';
import { Document, FileBase, DocumentFields } from '../../../types/files/filesData';
import { HttpFilesCompany } from '../../../http';
import { EntityWithIdFields } from '../../../types/baseEntities';
import CompanyActivityCard from '../activity/components/CompanyActivityCard';
import { Sections } from '../../../types/general/generalEnums';
import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import FileDocumentDetail from '../../../components/files/FileDocumentDetail';
import { TypographyBase } from 'components/misc/TypographyBase';
import { useNavigate } from 'react-router-dom';
import FileNewDialog from '../../../components/files/NewFileDialog';
import { PlusIcon } from 'lucide-react';

interface CompanyActivityTabProps {
  company: CompanyViewDTO;
  onReload?: () => void;
}

function CompanyActivityTab({ company, onReload }: CompanyActivityTabProps) {
  const [fileList, setFileList] = useState<Document[]>();
  const [openNewFileDialog, setOpenNewFileDialog] = useState<boolean>(false);
  const docsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const loadFiles = () => {
    setFileList(undefined);
    HttpFilesCompany.getFilesByIdCompany(company[EntityWithIdFields.Id]).then(
      setFileList,
    );
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const onSaveFile = (fileCompany: FileBase, file: File) => {
    return HttpFilesCompany.insert(
      company[EntityWithIdFields.Id],
      fileCompany,
      file,
    );
  };

  const goToDocs = () => {
    navigate(`/mis-empresas/${company[EntityWithIdFields.Id]}?tab=library`);
  };

  const handleScrollToDocs = () => {
    docsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenNewFileDialog = () => {
    setOpenNewFileDialog(true);
  };

  const handleCloseNewFileDialog = () => {
    setOpenNewFileDialog(false);
  };

  const activityFiles = fileList?.filter(
    (file) => file[DocumentFields.FileSectionCode] === Sections.Activity,
  );

  return (
    <Stack spacing={1.5}>
      <CompanyActivityCard
        company={company}
        onReload={onReload}
        onScrollToDocs={handleScrollToDocs}
      />

      <div ref={docsRef}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <TypographyBase variant="h6" fontWeight={600} mb={2}>
                  Documentos relacionados
                </TypographyBase>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<PlusIcon size={18} />}
                    onClick={handleOpenNewFileDialog}
                  >
                    Agregar documento
                  </Button>
                  <Button size="small" variant="text" onClick={goToDocs}>
                    Ir a Documentos
                  </Button>
                </Stack>
              </Stack>
              <Stack spacing={1}>
                {activityFiles && activityFiles.length > 0 ? (
                  activityFiles.map((file) => (
                    <FileDocumentDetail
                      key={file[EntityWithIdFields.Id]}
                      document={file}
                      onReload={loadFiles}
                      fileIconSize={'medium'}
                      download
                      delete
                      share
                      relateToFolder
                      preview
                      edit
                      dropdown
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    No hay documentos asociados
                  </Typography>
                )}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </div>

      {openNewFileDialog && (
        <FileNewDialog
          section={Sections.Activity}
          onCloseDialog={handleCloseNewFileDialog}
          onSubmitDialog={onSaveFile}
          onReload={loadFiles}
          blockSection={true}
        />
      )}
    </Stack>
  );
}

export default CompanyActivityTab;
