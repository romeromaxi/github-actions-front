import React, { useEffect, useState } from 'react';
import { Document, FileBase } from 'types/files/filesData';
import { HttpFilesCompanyCertifications } from 'http/index';
import { Sections } from '../../../../types/general/generalEnums';
import SupportingFilesCollapsablesBySectionCard from '../../../../components/files/SupportingFilesCollapsablesBySectionCard';

interface CompanyCertificationDocumentListProps {
  certificationId: number;
  companyId: number;
}

const CompanyCertificationDocumentList = ({
  certificationId,
  companyId,
}: CompanyCertificationDocumentListProps) => {
  const [files, setFiles] = useState<Document[]>();

  const onSaveFile = (fileCompany: FileBase, file: File): Promise<any> => {
    return HttpFilesCompanyCertifications.insert(
      companyId,
      certificationId,
      fileCompany,
      file,
    );
  };

  const loadFiles = () => {
    setFiles(undefined);

    HttpFilesCompanyCertifications.getFilesByCompanyAndCertification(
      companyId,
      certificationId,
    ).then(setFiles);
  };

  useEffect(() => loadFiles(), []);

  return (
    <SupportingFilesCollapsablesBySectionCard
      files={files}
      section={Sections.Certifications}
      onSaveFile={onSaveFile}
      onReload={loadFiles}
      canDelete
      download
    />
  );
};

export default CompanyCertificationDocumentList;
