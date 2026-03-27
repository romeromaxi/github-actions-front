import { EntityWithIdAndDescription } from 'types/baseEntities';
import React, { useCallback, useEffect, useState } from 'react';
import {
  LibraryFilterAll,
  LibraryFilterAllFields,
} from 'types/files/filesData';
import {
  HttpCompany,
  HttpFilesCompanySearch,
} from 'http/index';
import {
  Box,
  Button,
  Card,
  CardContent, CardHeader, Grid,
  Stack,
} from '@mui/material';
import {CleanFilterButton, SearchButton} from 'components/buttons/Buttons';
import {
  CompanySectionsWithFileType, CompanySectionsWithFileTypeFields,
} from 'types/company/companyData';
import {
  DocumentFolderDetailFields,
} from '../../../types/files/filesFoldersData';
import {
  CompanyLibraryFoldersContext,
  FileWithFolderData,
  mapDocumentToCommonType,
  mapFolderToCommonType,
} from './folders/CompanyLibraryFolders';
import CompanyLibraryFoldersTable from './folders/CompanyLibraryFoldersTable';
import { useForm } from 'react-hook-form';
import DrawerNewFolder from "../../../components/files/DrawerNewFolder";
import { ControlledTextFieldFilled } from 'components/forms';
import CompanyLibraryTitle from './components/CompanyLibraryTitle';

interface CompanyLibraryAllProps {
    companyId: number;
}

const defaultFilterState: LibraryFilterAll = {
  [LibraryFilterAllFields.Title]: '',
  [LibraryFilterAllFields.SectionCode]: undefined,
  [LibraryFilterAllFields.FileTypeCode]: undefined,
  [LibraryFilterAllFields.RelatedId]: undefined,
  [LibraryFilterAllFields.DocumentFolderId]: undefined
};

const CompanyLibraryAll = ({ companyId }: CompanyLibraryAllProps) => {
  const [shouldSearch, setShouldSearch] = useState<boolean>(false);
  const [sections, setSections] = useState<CompanySectionsWithFileType[]>();
  const [filesWithFolders, setFilesWithFolders] =
    useState<FileWithFolderData[]>();
  const [currentFoldersIds, setCurrentFoldersIds] = useState<number[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<number>();
  const [fileTypes, setFileTypes] = useState<EntityWithIdAndDescription[]>([]);
  const [folderName, setFolderName] = useState<string>('');
  const [openNewFolder, setOpenNewFolder] = useState<boolean>(false);
  const [relatedData, setRelatedData] = useState<EntityWithIdAndDescription[]>(
    [],
  );
  const [filter, setFilter] = useState<LibraryFilterAll>(defaultFilterState);
  const [viewReset, setViewReset] = useState<boolean>(false);

  const methods = useForm<LibraryFilterAll>({
    defaultValues: filter,
  });

  const searchDocuments = useCallback(
    (f: LibraryFilterAll, folderId?: number) => {
      setFilesWithFolders(undefined);

      const searchFilter: LibraryFilterAll = {
        [LibraryFilterAllFields.Title]: f[LibraryFilterAllFields.Title] ?? undefined,
        [LibraryFilterAllFields.SectionCode]:
          f[LibraryFilterAllFields.SectionCode] !== 0
            ? f[LibraryFilterAllFields.SectionCode]
            : undefined,
        [LibraryFilterAllFields.FileTypeCode]:
          f[LibraryFilterAllFields.FileTypeCode] !== 0
            ? f[LibraryFilterAllFields.FileTypeCode]
            : undefined,
        [LibraryFilterAllFields.RelatedId]:
          f[LibraryFilterAllFields.RelatedId] !== 0
            ? f[LibraryFilterAllFields.RelatedId]
            : undefined,
        [LibraryFilterAllFields.DocumentFolderId]: folderId
          ? folderId
          : currentFolderId,
      };

      HttpFilesCompanySearch.searchAllWithFolders(companyId, searchFilter).then(
        (r) => {
          const foldersData: FileWithFolderData[] = r[
            DocumentFolderDetailFields.FoldersList
          ].map((folder) =>
            mapFolderToCommonType(
              folder,
              folderId ? folderId : currentFolderId,
            ),
          );

          const filesData: FileWithFolderData[] = r[
            DocumentFolderDetailFields.DocumentsList
          ].map(mapDocumentToCommonType);

          setFolderName(r[DocumentFolderDetailFields.FolderName]);
          const data: FileWithFolderData[] = [...foldersData, ...filesData];

          setFilesWithFolders(data);
        },
      );
    },
    [filter],
  );

  const setFoldersIds = (folderIds: number[] | undefined) => {
    let lastValue: number | undefined;
    if (folderIds && !!folderIds.length)
      lastValue = folderIds[folderIds.length - 1];

    setCurrentFolderId(lastValue);
    searchDocuments(filter, lastValue);
    setCurrentFoldersIds(folderIds || []);
  };

  const setLastCurrentFolderId = (id: number | undefined) => {
    setCurrentFolderId(id);
    searchDocuments(filter, id);
    if (!!id) setCurrentFoldersIds((s) => [...s, id]);
    else setCurrentFoldersIds([]);
  };

  useEffect(() => {
    if (shouldSearch) {
      searchDocuments(filter, undefined);
    }
  }, [searchDocuments, shouldSearch]);

  const loadAll = () => {
      HttpCompany.getFileSections(companyId).then((sectionResponse) => {
      setSections(sectionResponse);
      setShouldSearch(true);
    });
  };

  useEffect(() => {
    loadAll();
  }, []);

  const watchSection = methods.watch(LibraryFilterAllFields.SectionCode)

  useEffect(() => {
    setRelatedData([])
    setFileTypes([])
    methods.setValue(LibraryFilterAllFields.FileTypeCode, undefined)
    methods.setValue(LibraryFilterAllFields.RelatedId, undefined)
    if (watchSection) {
      const sec = sections?.find((s) => s[CompanySectionsWithFileTypeFields.Id] == watchSection)
      setFileTypes(sec?.[CompanySectionsWithFileTypeFields.FileTypes] ?? [])
      if (sec?.[CompanySectionsWithFileTypeFields.HasRelatedData]) {
        HttpCompany.getRelatedData(companyId, watchSection).then((r) => setRelatedData(r))
      }
    }
  }, [watchSection]);
  

  const handleReload = () => {
      searchDocuments(filter, currentFolderId);
  };

  const onSubmitFilter = (data: LibraryFilterAll) => {
    setFilter(data);
    setShouldSearch(true);
  };

  const handleReset = () => {
    setFilter(defaultFilterState);
    setViewReset(false);
    setCurrentFolderId(undefined);
    setCurrentFoldersIds([]);
    setRelatedData([]);
    setFileTypes([]);
    methods.setValue(LibraryFilterAllFields.Title, '');
    methods.setValue(LibraryFilterAllFields.SectionCode, undefined);
    methods.setValue(LibraryFilterAllFields.FileTypeCode, undefined);
    methods.setValue(LibraryFilterAllFields.RelatedId, undefined);
    searchDocuments(defaultFilterState, undefined);
  };
  
  const watchTitle = methods.watch(LibraryFilterAllFields.Title)
  const watchFileType = methods.watch(LibraryFilterAllFields.FileTypeCode)
  const watchRelated = methods.watch(LibraryFilterAllFields.RelatedId)
  
  return (
    <Stack spacing={2}>
        <CompanyLibraryTitle companyId={companyId}
                             onReload={handleReload} />
        <Stack spacing={2}>
            <CompanyLibraryFoldersContext.Provider
              value={{
                currentFolderId: currentFolderId,
                setCurrentFolder: setLastCurrentFolderId,
                filesWithFolders: filesWithFolders,
                reloadData: handleReload,
                currentFoldersIds: currentFoldersIds,
                setCurrentFoldersIds: setFoldersIds,
              }}
            >
                {(
                    (currentFolderId && currentFolderId !== 0) || viewReset) && (
                        <Box textAlign={'center'} mb={1}>
                            <Button color={'secondary'} 
                                    variant={'contained'} 
                                    onClick={handleReset} 
                                    size="small"
                                    id={'company-library-view-all-btn'}
                            >
                                Ver todos los archivos
                            </Button>
                        </Box>
                )}
                <Stack spacing={1}>
                  <Card>
                    <CardHeader title='Todos los documentos'
                                action={
                                  <Stack spacing={1} direction='row' alignItems='center'>
                                    {
                                        (!!watchSection || !!watchTitle || !!watchFileType || !!watchRelated) &&
                                        <CleanFilterButton onClick={handleReset}
                                                           size='small'
                                                           variant='text'
                                                           color='primary'
                                                           id={'company-library-cleanup-filters-btn'}
                                        >
                                          Limpiar filtros
                                        </CleanFilterButton>
                                    }
                                    <SearchButton
                                        onClick={methods.handleSubmit(onSubmitFilter)}
                                        size={'small'}
                                        id={'company-library-search-btn'}
                                    >
                                      Buscar
                                    </SearchButton>
                                  </Stack>
                                }
                    />
                    <CardContent>
                        <Stack spacing={1}>
                          <Grid container alignItems={'center'} justifyContent={'space-between'}>
                            <Grid item md={3}>
                              <ControlledTextFieldFilled control={methods.control}
                                                         name={LibraryFilterAllFields.Title}
                                                         fullWidth
                                                         label={'Titulo'}
                              />
                            </Grid>
                            <Grid item md={3}>
                              <ControlledTextFieldFilled
                                  control={methods.control}
                                  select
                                  options={sections}
                                  name={LibraryFilterAllFields.SectionCode}
                                  label={'Sección'}
                                  sx={{marginLeft: 2}}
                              />
                            </Grid>
                            <Grid item md={3}>
                              <ControlledTextFieldFilled
                                  control={methods.control}
                                  select
                                  options={fileTypes}
                                  name={LibraryFilterAllFields.FileTypeCode}
                                  label={'SubSección'}
                                  disabled={fileTypes.length == 0}
                                  sx={{marginLeft: 2}}
                              />
                            </Grid>
                            <Grid item md={3}>
                              {relatedData.length !== 0 && (
                                  <ControlledTextFieldFilled
                                      control={methods.control}
                                      select
                                      options={relatedData}
                                      name={LibraryFilterAllFields.RelatedId}
                                      label={'Datos Relacionados'}
                                      sx={{marginLeft: 2}}
                                  />
                              )}
                            </Grid>
                          </Grid>
                          <CompanyLibraryFoldersTable
                              companyId={companyId}
                          />
                        </Stack>
                    </CardContent>
                  </Card>
                </Stack>
            </CompanyLibraryFoldersContext.Provider>
  
            <DrawerNewFolder
              open={openNewFolder}
              onClose={() => {
                setOpenNewFolder(false);
              }}
              afterSubmit={handleReload}
              companyId={companyId}
              parentId={currentFolderId}
              folderName={folderName}
            />
        </Stack>
    </Stack>
  );
};

export default CompanyLibraryAll;
