import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Alert,
  Typography,
  Stack,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { AddButton } from 'components/buttons/Buttons';
import {
  DocumentFolderDetailFields,
  DocumentFolderSummary,
  DocumentFolderFields,
  DocumentFolderViewDTO,
} from 'types/files/filesFoldersData';
import { Document, DocumentFields } from 'types/files/filesData';
import DrawerNewFolder from 'components/files/DrawerNewFolder';
import { HttpFilesCompanySearch } from 'http/files/httpFilesCompanySearch';
import { EntityWithIdFields } from 'types/baseEntities';
import { HttpFilesFolders } from 'http/files/httpFilesFolders';
import CompanyLibraryFoldersTable from './CompanyLibraryFoldersTable';
import CompanyLibraryFoldersTree from './CompanyLibraryFoldersTree';
import CompanyLibraryFoldersBreadcrumbs from './CompanyLibraryFoldersBreadcrumbs';
import { grey } from '@mui/material/colors';

interface CompanyLibraryFoldersProps {
  companyId: number;
}

export interface FileWithFolderData {
  type: 'folder' | 'file';
  id: number;
  name: string;
  parentId?: number;
  descSeccion: string;
  descArchivoTipo: string;
  descDatoRelacionado: string;
  tieneCarpetasRelacionadas?: boolean;
  cantidadCarpetasRelacionadas?: number;
  numberDocs?: number;
  uploadDate?: Date;
  title: string;
  size?: number;
}

export const CompanyLibraryFoldersContext = React.createContext({
  currentFolderId: undefined as number | undefined,
  currentFoldersIds: [] as number[],
  setCurrentFolder: (folderId: number | undefined) => {},
  setCurrentFoldersIds: (currentFoldersIds: number[] | undefined) => {},
  filesWithFolders: undefined as FileWithFolderData[] | undefined,
  reloadData: () => {},
});

const CompanyLibraryFolders = ({ companyId }: CompanyLibraryFoldersProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>('');
  const [filesWithFolders, setFilesWithFolders] =
    useState<FileWithFolderData[]>();
  const [foldersHierarchy, setFoldersHierarchy] =
    useState<DocumentFolderViewDTO[]>();
  const [currentFolderId, setCurrentFolderId] = useState<number>();
  const [currentFoldersIds, setCurrentFoldersIds] = useState<number[]>([]);

  const searchDocuments = () => {
    setFilesWithFolders(undefined);

    HttpFilesCompanySearch.searchAllWithFolders(
      companyId,
      currentFolderId,
    ).then((r) => {
      const foldersData: FileWithFolderData[] = r[
        DocumentFolderDetailFields.FoldersList
      ].map((folder) => mapFolderToCommonType(folder, currentFolderId));

      const filesData: FileWithFolderData[] = r[
        DocumentFolderDetailFields.DocumentsList
      ].map(mapDocumentToCommonType);

      setFolderName(r[DocumentFolderDetailFields.FolderName]);
      const data: FileWithFolderData[] = [...foldersData, ...filesData];

      setFilesWithFolders(data);
    });
  };

  const setFoldersIds = (folderIds: number[] | undefined) => {
    let lastValue: number | undefined;
    if (folderIds && !!folderIds.length)
      lastValue = folderIds[folderIds.length - 1];

    setCurrentFolderId(lastValue);
    setCurrentFoldersIds(folderIds || []);
  };

  const setLastCurrentFolderId = (id: number | undefined) => {
    setCurrentFolderId(id);
    if (!!id) setCurrentFoldersIds((s) => [...s, id]);
    else setCurrentFoldersIds([]);
  };

  const searchFoldersHierarchy = () => {
    setFoldersHierarchy(undefined);
    HttpFilesFolders.getFoldersByCompanyId(companyId).then(setFoldersHierarchy);
  };

  const searchAll = () => {
    searchDocuments();
    searchFoldersHierarchy();
  };

  useEffect(() => {
    searchFoldersHierarchy();
  }, []);

  useEffect(() => {
    searchDocuments();
  }, [currentFolderId]);

  const setCurrentFolder = (folderId: number | undefined) =>
    setCurrentFolderId(folderId);

  return (
    <Card>
      <CardHeader
        title={'Mis Carpetas'}
        action={
          <AddButton
            onClick={() => {
              setOpen(true);
            }}
          >
            Nueva carpeta
          </AddButton>
        }
      />
      <CardContent>
        <CompanyLibraryFoldersContext.Provider
          value={{
            currentFolderId: currentFolderId,
            setCurrentFolder: setLastCurrentFolderId,
            filesWithFolders: filesWithFolders,
            reloadData: searchAll,
            currentFoldersIds: currentFoldersIds,
            setCurrentFoldersIds: setFoldersIds,
          }}
        >
          <Grid container spacing={3}>
            <Grid container spacing={3} item xs={12} alignItems={'center'}>
              <Grid item xs={3}>
                <Stack>
                  <Typography fontSize={16} fontWeight={600}>
                    Carpetas creadas
                  </Typography>
                  <Typography fontSize={11} color={grey[600]} fontWeight={500}>
                    Hacé click en cada una para navegar
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={9}>
                <Alert severity={'info'}>
                  Para cargar un nuevo archivo debe dirigirse al repositorio de
                  su empresa
                </Alert>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <CompanyLibraryFoldersTree foldersHierarchy={foldersHierarchy} />
            </Grid>

            <Grid item xs={9}>
              <CompanyLibraryFoldersBreadcrumbs
                foldersHierarchy={foldersHierarchy}
              />

              <CompanyLibraryFoldersTable
                companyId={companyId}
              />
            </Grid>
          </Grid>
        </CompanyLibraryFoldersContext.Provider>
      </CardContent>

      <DrawerNewFolder
        open={open}
        onClose={() => {
          setOpen(false);
        }}
        afterSubmit={searchAll}
        companyId={companyId}
        parentId={currentFolderId}
        folderName={folderName}
      />
    </Card>
  );
};

export const mapFolderToCommonType = (
  folder: DocumentFolderSummary,
  parentFolderId?: number,
): FileWithFolderData => {
  return {
    type: 'folder',
    id: folder[EntityWithIdFields.Id],
    parentId: parentFolderId,
    name: folder[DocumentFolderFields.FolderName],
    numberDocs: folder[DocumentFolderFields.DocumentsQuantity],
  } as FileWithFolderData;
};

export const mapDocumentToCommonType = (
  document: Document,
): FileWithFolderData => {
  return {
    type: 'file',
    id: document[EntityWithIdFields.Id],
    title: document[DocumentFields.TitleDocument],
    name: document[DocumentFields.FileDesc],
    numberDocs: document[DocumentFields.NumberFiles],
    uploadDate: document[DocumentFields.BeginDate],
    descSeccion: document[DocumentFields.FileSectionDesc],
    descArchivoTipo: document[DocumentFields.FileTypeDesc],
    descDatoRelacionado: document[DocumentFields.RelatedInformationDesc] !== '' ? document[DocumentFields.RelatedInformationDesc] : '-',
    tieneCarpetasRelacionadas: document[DocumentFields.HasRelatedFolders],
    cantidadCarpetasRelacionadas: document[DocumentFields.RelatedFoldersQty],
    size: document[DocumentFields.FileSize]
  } as FileWithFolderData;
};

export default CompanyLibraryFolders;
