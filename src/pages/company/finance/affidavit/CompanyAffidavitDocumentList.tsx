import React, { useEffect, useState } from 'react';
import { Document, FileBase } from 'types/files/filesData';
import {
  HttpFilesCompanyAffidavit,
  HttpFilesCompanyDeclarationAssets,
} from '../../../../http';
import { Sections } from '../../../../types/general/generalEnums';
import SupportingFilesCollapsablesBySectionCard from '../../../../components/files/SupportingFilesCollapsablesBySectionCard';

interface CompanyAffidavitDocumentListProps {
  affidavitId: number;
  companyId: number;
}

const CompanyAffidavitDocumentList = ({
  affidavitId,
  companyId,
}: CompanyAffidavitDocumentListProps) => {
  const [files, setFiles] = useState<Document[]>();

  const onSaveFile = (fileCompany: FileBase, file: File): Promise<any> => {
    return HttpFilesCompanyDeclarationAssets.insert(
      companyId,
      affidavitId,
      fileCompany,
      file,
    );
  };

  const loadFiles = () => {
    setFiles(undefined);

    HttpFilesCompanyAffidavit.getFilesByCompanyAndAffidavit(
      companyId,
      affidavitId,
    ).then(setFiles);
  };

  useEffect(() => loadFiles(), []);

  return (
    <SupportingFilesCollapsablesBySectionCard
      files={files}
      section={Sections.Affidavit}
      onSaveFile={onSaveFile}
      onReload={loadFiles}
      canDelete
      download
    />
  );
};

export default CompanyAffidavitDocumentList;
