import {Card, CardContent, Grid, Stack} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  FileWithFolderData,
  mapDocumentToCommonType,
  mapFolderToCommonType,
} from '../../company/library/folders/CompanyLibraryFolders';
import {
  DocumentFolderDetailFields, DocumentFolderRelatedInsert, DocumentFolderRelatedInsertFields,
  DocumentFolderViewDTO,
} from '../../../types/files/filesFoldersData';
import { HttpFilesFolders } from '../../../http/files/httpFilesFolders';
import {AddButton, ShareButton} from '../../../components/buttons/Buttons';
import DrawerNewFolder from '../../../components/files/DrawerNewFolder';
import { HttpFilesOfferer } from '../../../http';
import OffererLibraryFoldersTree from './components/OffererLibraryFoldersTree';
import OffererLibraryFoldersBreadcrumbs from './components/OffererLibraryFoldersBreadcrumbs';
import OffererLibraryFoldersTable from './components/OffererLibraryFoldersTable';
import {BaseIconWrapper} from "../../../components/icons/Icons";
import {Folders} from "phosphor-react";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import NewFileDialog from "../../../components/files/NewFileDialog";
import {Sections} from "../../../types/general/generalEnums";
import {HttpCacheFiles} from "../../../http/cache/httpCacheFiles";
import {FileBase, FileBaseFields} from "../../../types/files/filesData";
import SharedDocumentationRelateFilesDialog from "../../sharedDocumentation/SharedDocumentationRelateFilesDialog";
import {OffererButtonSecObjects, SecurityComponents} from "../../../types/security";
import {SafetyComponent} from "../../../components/security";

interface OffererDocumentationProps {
  offererId: number;
}

export const OffererDocumentationFoldersContext = React.createContext({
  currentFolderId: undefined as number | undefined,
  currentFoldersIds: [] as number[],
  setCurrentFolder: (folderId: number | undefined) => {},
  setCurrentFoldersIds: (currentFoldersIds: number[] | undefined) => {},
  filesWithFolders: undefined as FileWithFolderData[] | undefined,
  reloadData: () => {},
});

const OffererDocumentation = ({ offererId }: OffererDocumentationProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [folderName, setFolderName] = useState<string>('');
  const [filesWithFolders, setFilesWithFolders] =
    useState<FileWithFolderData[]>();
  const [openNew, setOpenNew] = useState<boolean>(false);
  const [foldersHierarchy, setFoldersHierarchy] =
    useState<DocumentFolderViewDTO[]>();
  const [currentFolderId, setCurrentFolderId] = useState<number>();
  const [currentFoldersIds, setCurrentFoldersIds] = useState<number[]>([]);
  const [openShareFiles, setOpenShareFiles] = useState<boolean>(false);

  const searchDocuments = () => {
    setFilesWithFolders(undefined);

    HttpFilesOfferer.searchFiles(offererId, currentFolderId).then((r) => {
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
    HttpFilesFolders.getOffererFolders(offererId).then(setFoldersHierarchy);
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

  const onCloseNew = () => setOpenNew(false);

  const onNewFile = (newFileBase: FileBase, file: File) => {
    return HttpFilesOfferer.insert(offererId, newFileBase, file).then(() => {
      if (currentFolderId && currentFolderId !== 0) {
        const submitData: DocumentFolderRelatedInsert = {
          [DocumentFolderRelatedInsertFields.DocumentId]:
              newFileBase[FileBaseFields.DocumentId],
        };

        HttpFilesFolders.insertRelatedFolder(currentFolderId, submitData).then(
            () => console.log('exito 2'),
        );
      }
    });
  };

  const handleOpenShare = () => setOpenShareFiles(true)
  
  const onCloseShare = () => setOpenShareFiles(false)
  
  return (
      <Stack spacing={2}>
        <Card>
          <CardContent>
            <Stack direction='row' alignItems='center' justifyContent='space-between'>
              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                <BaseIconWrapper Icon={Folders} size={'md'} bg={'#F7FAFC'}/>
                <Stack>
                  <TypographyBase variant={'h4'} fontWeight={500}>
                    Biblioteca de archivos
                  </TypographyBase>
                  <TypographyBase variant={'caption'} color={'text.lighter'} fontWeight={500}>
                    Gestioná toda la documentación en un solo lugar
                  </TypographyBase>
                </Stack>
              </Stack>
              <Stack direction='row' alignItems='center' spacing={2}>
                <SafetyComponent componentName={SecurityComponents.OffererDocumentation} objectName={OffererButtonSecObjects.OffererButtonLibraryShare}>
                  <ShareButton size='small' onClick={handleOpenShare} variant='outlined'>Compartir</ShareButton>
                </SafetyComponent>
                <SafetyComponent componentName={SecurityComponents.OffererDocumentation} objectName={OffererButtonSecObjects.OffererButtonLibraryNewDocument}>
                  <AddButton size='small' onClick={() => setOpenNew(true)}>Nuevo documento</AddButton>
                </SafetyComponent>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <OffererDocumentationFoldersContext.Provider
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
                <Grid item xs={3}>
                    <OffererLibraryFoldersTree foldersHierarchy={foldersHierarchy} />
                </Grid>
    
                <Grid item xs={9}>
                  <Stack spacing={1}>
                    <Stack direction='row' alignItems='center' justifyContent='space-between'>
                      <OffererLibraryFoldersBreadcrumbs
                        foldersHierarchy={foldersHierarchy}
                      />
                      <SafetyComponent componentName={SecurityComponents.OffererDocumentation} objectName={OffererButtonSecObjects.OffererButtonLibraryNewFolder}>
                        <AddButton size='small'
                                   onClick={() => setOpen(true)}
                        >
                          Nueva carpeta
                        </AddButton>
                      </SafetyComponent>
                    </Stack>
      
                    <OffererLibraryFoldersTable
                      folderName={folderName}
                      offererId={offererId}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </OffererDocumentationFoldersContext.Provider>
          </CardContent>
          {openNew && (
              <NewFileDialog
                  section={Sections.Offerer}
                  onCloseDialog={onCloseNew}
                  onLoadFileTypes={HttpCacheFiles.getTypes}
                  onSubmitDialog={onNewFile}
                  onReload={searchAll}
                  blockSection
              />
          )}
          <DrawerNewFolder
            open={open}
            onClose={() => {
              setOpen(false);
            }}
            afterSubmit={searchAll}
            offererId={offererId}
            parentId={currentFolderId}
            folderName={folderName}
          />
          <SharedDocumentationRelateFilesDialog offererId={offererId}
                                                onClose={onCloseShare}
                                                open={openShareFiles}
          />
        </Card>
      </Stack>
  );
};

export default OffererDocumentation;
