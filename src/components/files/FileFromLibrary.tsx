import React, {useEffect, useMemo, useState} from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import {
  Document,
} from 'types/files/filesData';
import { Alert, Grid, Stack } from '@mui/material';
import {EntityWithIdFields} from 'types/baseEntities';
import {
  DocumentLibraryDocumentFilter,
  DocumentLibraryDocumentFilterFields, DocumentLibraryFilter,
  DocumentLibraryFilterFields
} from 'types/files/filesFoldersData';
import FoldersTreeView, { FoldersTreeItem } from './FoldersTreeView';
import { folderToTreeView } from 'util/helpers';
import FileDocumentDetailSelectedSummary from './FileDocumentDetailSelectedSummary';
import SectionDivider from '../cards/SectionDivider';
import { Skeleton } from '@mui/lab';
import FileDocumentSelect from "./FileDocumentSelect";
import {HttpFilesLibrary} from "../../http/files/httpFilesLibrary";

interface FileFromLibraryProps {
  entityId?: number | null;
  solicitationId?: number | null;
  clientPortfolioGuid?: string | null;
  handleLibrarySubmit: (data: any) => void;
}

function FileFromLibrary({entityId = null, solicitationId = null, clientPortfolioGuid = null, handleLibrarySubmit}: FileFromLibraryProps) {
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<Document[]>([]);
  const [foldersHierarchy, setFoldersHierarchy] = useState<FoldersTreeItem[]>();
  const [currentFoldersIds, setCurrentFoldersIds] = useState<number[]>([]);
  const filtersLibraryBase: DocumentLibraryFilter = useMemo(() => {
    return {
      [DocumentLibraryFilterFields.EntityId]: entityId,
      [DocumentLibraryFilterFields.SolicitationId]: solicitationId,
      [DocumentLibraryFilterFields.ClientPortfolioGuid]: clientPortfolioGuid
    }
  }, [entityId, solicitationId, clientPortfolioGuid])
  
  const { control, handleSubmit } = useForm();
  const { replace } = useFieldArray({
    control,
    name: 'files',
  });

  const searchFoldersHierarchy = () => {
    setFoldersHierarchy(undefined);
    
    HttpFilesLibrary.getLibraryStructure(filtersLibraryBase)
        .then(groupFolders => setFoldersHierarchy(folderToTreeView(groupFolders)));
  };

  useEffect(() => {
    if (!foldersHierarchy) searchFoldersHierarchy();
  }, [foldersHierarchy]);

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    document: Document,
  ) => {
    let newSelectedFiles;
    let newSelectedDocs: Document[] = [];
    if (event.target.checked) {
      newSelectedFiles = [...selectedFiles, parseInt(event.target.value)];
      newSelectedDocs = [...selectedDocuments, document];
      setSelectedFiles(newSelectedFiles);
      setSelectedDocuments(newSelectedDocs);
    } else {
      newSelectedFiles = selectedFiles.filter(
        (id) => id !== parseInt(event.target.value),
      );
      newSelectedDocs = selectedDocuments.filter(
        (d) => d[EntityWithIdFields.Id] !== parseInt(event.target.value),
      );
      setSelectedFiles(newSelectedFiles);
      setSelectedDocuments(newSelectedDocs);
    }
    replace(newSelectedFiles);
  };

  const onSubmit = (data: any) => {
    handleLibrarySubmit(data)
  };

  const getDocumentsByFolder = async (folderId?: number): Promise<Document[]> => {
    const filters: DocumentLibraryDocumentFilter = {
      ...filtersLibraryBase,
      [DocumentLibraryDocumentFilterFields.HierarchyCods]: currentFoldersIds
    };
    
    return await HttpFilesLibrary.getDocumentsFromLibraryStructure(filters);
  };

  const renderDocument = (document: Document) => (
    <FileDocumentSelect
      key={`FileDocumentDetail_${document[EntityWithIdFields.Id]}`}
      document={document}
      onSelect={handleCheckboxChange}
      selected={selectedDocuments.findIndex((d) => d.id === document.id) >= 0}
      download
      preview
    />
  );

  const deleteSelectedDocument = (document: Document) => {
    const documentId = document[EntityWithIdFields.Id];
    let newSelectedFiles;
    let newSelectedDocs: Document[] = [];

    newSelectedFiles = selectedFiles.filter((id) => id !== documentId);
    newSelectedDocs = selectedDocuments.filter(
      (d) => d[EntityWithIdFields.Id] !== documentId,
    );
    setSelectedFiles(newSelectedFiles);
    setSelectedDocuments(newSelectedDocs);
    replace(newSelectedFiles);
  };

  return (
    <form id={'file-from-library-form'} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={7}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              {!!foldersHierarchy ? (
                <FoldersTreeView
                  items={foldersHierarchy}
                  currentFoldersIds={currentFoldersIds}
                  setCurrentFoldersIds={setCurrentFoldersIds}
                  searchFiles={getDocumentsByFolder}
                  renderDocument={renderDocument}
                />
              ) : (
                Array.from({ length: 3 }).map(() => (
                  <Skeleton key={Math.random().toString(36).substring(7)} />
                ))
              )}
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <SectionDivider title={'Documentos seleccionados'} />

          <Stack spacing={1} mt={1}>
            {!!selectedDocuments.length ? (
              selectedDocuments.map((d) => (
                <FileDocumentDetailSelectedSummary
                  document={d}
                  onDeleteDocument={() => deleteSelectedDocument(d)}
                  key={`FileDocumentDetailSelectedSummary_${d[EntityWithIdFields.Id]}`}
                  download
                />
              ))
            ) : (
              <Alert color={'info'} severity={'info'}>
                No seleccionaste ningún documento
              </Alert>
            )}
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}

export default FileFromLibrary;
