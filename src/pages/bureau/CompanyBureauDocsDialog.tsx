import BaseDialogTitle from '../../components/dialog/BaseDialogTitle';
import { Dialog, DialogContent } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FileDocumentListSectionBureau } from '../../components/files/FileDocumentListSection';
import { HttpFilesCompanyBureau } from '../../http';
import { Document, FileBase } from '../../types/files/filesData';
import { LoaderBlockUI } from '../../components/loader';

interface CompanyBureauDocsDialogProps {
  open: boolean;
  companyId: number;
  onClose: () => void;
  nosisQueryId: number;
}

const CompanyBureauDocsDialog = ({
  open,
  companyId,
  onClose,
  nosisQueryId,
}: CompanyBureauDocsDialogProps) => {
  const [fileList, setFileList] = useState<Document[]>();
  const [loading, setLoading] = useState<boolean>(false);

  const loadFiles = () => {
    setLoading(true);
    HttpFilesCompanyBureau.getFileList(companyId, nosisQueryId)
      .then((r) => {
        setFileList(r);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onSaveFile = (fileCompany: FileBase, file: File) => {
    return HttpFilesCompanyBureau.insert(
      companyId,
      nosisQueryId,
      fileCompany,
      file,
    );
  };

  useEffect(() => {
    if (open && nosisQueryId) loadFiles();
  }, [open, nosisQueryId]);

  return (
    <Dialog open={open} maxWidth={'sm'} fullWidth onClose={onClose}>
      {loading ? (
        <LoaderBlockUI />
      ) : (
        <>
          <BaseDialogTitle
            onClose={onClose}
            title={'Archivos de bases públicas'}
          />
          <DialogContent>
            <FileDocumentListSectionBureau
              filesDocument={fileList}
              onSaveFile={onSaveFile}
              onReload={loadFiles}
              download
              delete
              preview
            />
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default CompanyBureauDocsDialog;
