import React, {useContext, useEffect, useState} from 'react';
import { Document } from 'types/files/filesData';
import { HttpFilesCompanyDeclarationAssets } from 'http/index';
import { Stack, Typography } from '@mui/material';
import FileDocumentDetail from 'components/files/FileDocumentDetail';
import { EntityWithIdFields } from 'types/baseEntities';
import {LayoutHomeContext} from "../../../../layouts/home/LayoutHome";

interface DeclarationOfAssetsDocumentListProps {
  declarationOfAssetsId: number;
  reloadTable: () => void;
  reloadKey?: number;
}

function DeclarationOfAssetsDocumentList({declarationOfAssetsId, reloadTable, reloadKey}: DeclarationOfAssetsDocumentListProps) {
  const { companyId } = useContext(LayoutHomeContext)
  const [filesDeclaration, setFilesDeclaration] = useState<Document[]>();

  const loadFiles = () => {
    HttpFilesCompanyDeclarationAssets.getFilesByCompanyAndDeclarationAssets(
      companyId,
      declarationOfAssetsId,
    ).then(setFilesDeclaration);
  };

  useEffect(() => {
    loadFiles();
  }, [declarationOfAssetsId, reloadKey]);

  return (
    <Stack spacing={1}>
      {filesDeclaration && filesDeclaration.length > 0 ? (
        filesDeclaration.map((file) => (
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

export default DeclarationOfAssetsDocumentList;
