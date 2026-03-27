import React, {useContext, useEffect, useState} from 'react';
import { Document, FileBase } from 'types/files/filesData';
import { HttpFilesCompanyRelationship } from 'http/index';
import { Sections } from 'types/general/generalEnums';
import { Stack, Typography } from '@mui/material';
import FileDocumentDetail from 'components/files/FileDocumentDetail';
import { EntityWithIdFields } from 'types/baseEntities';
import {LayoutHomeContext} from "../../../../layouts/home/LayoutHome";

interface RelatedPersonDocumentListProps {
  companyPersonId: number;
  reloadTable: () => void
}

function RelatedPersonDocumentList({companyPersonId, reloadTable}: RelatedPersonDocumentListProps) {
  const { companyId } = useContext(LayoutHomeContext)
  const [filesPerson, setFilesPerson] = useState<Document[]>();

  const loadFiles = () => {
    HttpFilesCompanyRelationship.getFilesByCompanyAndPerson(
      companyId,
      companyPersonId,
    ).then(setFilesPerson);
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const onSaveFile = (fileBase: FileBase, file: File) => HttpFilesCompanyRelationship.insert(companyId, companyPersonId, fileBase, file);
  

  return (
    <Stack spacing={1}>
      {filesPerson && filesPerson.length > 0 ? (
        filesPerson.map((file) => (
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
  );
}

export default RelatedPersonDocumentList;
