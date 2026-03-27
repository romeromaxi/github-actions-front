import React, { useEffect, useState } from 'react';
import { Document, FileBase } from 'types/files/filesData';
import { HttpFilesCompanyDeclarationAssets } from 'http/index';
import { Sections } from '../../../../types/general/generalEnums';
import SupportingFilesCollapsablesBySectionCard from '../../../../components/files/SupportingFilesCollapsablesBySectionCard';

interface CompanyDeclarationOfAssetsDocumentListProps {
  declarationId: number;
  companyId: number;
  onReloadTable: () => void;
}

function CompanyDeclarationOfAssetsDocumentList({
  declarationId,
  companyId, onReloadTable
}: CompanyDeclarationOfAssetsDocumentListProps) {
  const [files, setFiles] = useState<Document[]>();

  const onSaveFile = (fileCompany: FileBase, file: File): Promise<any> => {
    return HttpFilesCompanyDeclarationAssets.insert(
      companyId,
      declarationId,
      fileCompany,
      file,
    );
  };

  const loadFiles = () => {
    setFiles(undefined);

    HttpFilesCompanyDeclarationAssets.getFilesByCompanyAndDeclarationAssets(
      companyId,
      declarationId,
    ).then(setFiles);
  };

  useEffect(() => loadFiles(), []);

  return (
    <SupportingFilesCollapsablesBySectionCard
      files={files}
      section={Sections.DeclarationOfAssets}
      onSaveFile={onSaveFile}
      onReload={() => {
        loadFiles()
        onReloadTable()
      }}
      canDelete
      download
      share
      relateToFolder
    />
  );
}

export default CompanyDeclarationOfAssetsDocumentList;
