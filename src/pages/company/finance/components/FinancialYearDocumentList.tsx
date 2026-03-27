import React, {useContext, useEffect, useState} from 'react';
import { Document } from 'types/files/filesData';
import { HttpFilesCompanyFinancialYear } from 'http/index';
import { Stack, Typography } from '@mui/material';
import FileDocumentDetail from 'components/files/FileDocumentDetail';
import { EntityWithIdFields } from 'types/baseEntities';
import {LayoutHomeContext} from "../../../../layouts/home/LayoutHome";

interface FinancialYearDocumentListProps {
  financialYearId: number;
  reloadTable: () => void;
  reloadKey?: number;
}

function FinancialYearDocumentList({financialYearId, reloadTable, reloadKey}: FinancialYearDocumentListProps) {
  const { companyId } = useContext(LayoutHomeContext)
  const [filesFinancialYear, setFilesFinancialYear] = useState<Document[]>();

  const loadFiles = () => {
    HttpFilesCompanyFinancialYear.getFilesByCompanyAndFinancialYear(
      companyId,
      financialYearId,
    ).then(setFilesFinancialYear);
  };

  useEffect(() => {
    loadFiles();
  }, [financialYearId, reloadKey]);

  return (
    <Stack spacing={1}>
      {filesFinancialYear && filesFinancialYear.length > 0 ? (
        filesFinancialYear.map((file) => (
          <FileDocumentDetail
            key={file[EntityWithIdFields.Id]}
            document={file}
            onReload={() => {
              loadFiles();
              reloadTable();
            }}
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
  );
}

export default FinancialYearDocumentList;
