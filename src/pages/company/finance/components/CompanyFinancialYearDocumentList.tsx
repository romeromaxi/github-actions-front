import React, {useContext, useEffect, useState} from 'react';
import { Document, FileBase } from 'types/files/filesData';
import { HttpFilesCompanyFinancialYear } from 'http/index';
import { Sections } from '../../../../types/general/generalEnums';
import SupportingFilesCollapsablesBySectionCard from '../../../../components/files/SupportingFilesCollapsablesBySectionCard';
import {LayoutHomeContext} from "../../../../layouts/home/LayoutHome";

interface CompanyFinancialYearDocumentListProps {
  financialYearId: number;
  onReloadTable?: () => void;
}

function CompanyFinancialYearDocumentList({
  financialYearId,
  onReloadTable
}: CompanyFinancialYearDocumentListProps) {
  const [files, setFiles] = useState<Document[]>();
  const { companyId } = useContext(LayoutHomeContext)
  const onSaveFile = (fileCompany: FileBase, file: File): Promise<any> => {
    return HttpFilesCompanyFinancialYear.insert(
      companyId,
      financialYearId,
      fileCompany,
      file,
    );
  };

  const loadFiles = () => {
    setFiles(undefined);

    HttpFilesCompanyFinancialYear.getFilesByCompanyAndFinancialYear(
      companyId,
      financialYearId,
    ).then(setFiles);
  };

  useEffect(() => loadFiles(), []);

  return (
    <SupportingFilesCollapsablesBySectionCard
      files={files}
      section={Sections.FinancialYear}
      onSaveFile={onSaveFile}
      onReload={() => {
        loadFiles()
        onReloadTable && onReloadTable()
      }}
      download
      share
      relateToFolder
      canDelete
    />
  );
}

export default CompanyFinancialYearDocumentList;
