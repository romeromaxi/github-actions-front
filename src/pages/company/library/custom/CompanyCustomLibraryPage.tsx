import {Button, Card, CardContent, CardHeader, Link, Stack} from "@mui/material";
import {WrapperIcons} from "components/icons/Icons";
import {FolderPlus, MagnifyingGlass} from "@phosphor-icons/react";
import {AddButton} from "components/buttons/Buttons";
import React, {useCallback, useEffect, useState} from "react";
import {HttpFilesCompanySearch, HttpFilesFolders} from "http/index";
import {LibraryFilterAll, LibraryFilterAllFields} from "types/files/filesData";
import {DocumentFolderDetailFields, DocumentFolderViewDTO} from "types/files/filesFoldersData";
import {
    CompanyLibraryFoldersContext,
    FileWithFolderData,
    mapDocumentToCommonType,
    mapFolderToCommonType
} from "../folders/CompanyLibraryFolders";
import CompanyLibraryFoldersBreadcrumbs from "../folders/CompanyLibraryFoldersBreadcrumbs";
import DrawerNewFolder from "components/files/DrawerNewFolder";
import CompanyCustomLibraryFoldersTable from "./CompanyCustomLibraryFoldersTable";
import DialogRelateFilesToCurrentFolder from "./components/DialogRelateFilesToCurrentFolder";
import CompanyLibraryTitle from "../components/CompanyLibraryTitle";
import {ROOT_FOLDER_NAME} from "types/general/generalEnums";
import RelatedFoldersViewDrawer from "../../../../components/files/RelatedFoldersViewDrawer";
import { TypographyBase } from "components/misc/TypographyBase";


interface CompanyCustomLibraryPageProps {
    companyId: number
}

const defaultFilterState: LibraryFilterAll = {
    [LibraryFilterAllFields.SectionCode]: undefined,
    [LibraryFilterAllFields.FileTypeCode]: undefined,
    [LibraryFilterAllFields.RelatedId]: undefined,
    [LibraryFilterAllFields.DocumentFolderId]: undefined,
};
    
const CompanyCustomLibraryPage = ({companyId} : CompanyCustomLibraryPageProps) => {
    const [shouldSearch, setShouldSearch] = useState<boolean>(false);
    const [foldersHierarchy, setFoldersHierarchy] =
        useState<DocumentFolderViewDTO[]>();
    const [filesWithFolders, setFilesWithFolders] =
        useState<FileWithFolderData[]>();
    const [currentFoldersIds, setCurrentFoldersIds] = useState<number[]>([]);
    const [currentFolderId, setCurrentFolderId] = useState<number>();
    const [openRelate, setOpenRelate] = useState<boolean>(false)
    const [folderName, setFolderName] = useState<string>('');
    const [openNewFolder, setOpenNewFolder] = useState<boolean>(false);
    const [openView, setOpenView] = useState<boolean>(false);


    const searchDocuments = useCallback(
        (folderId?: number, searchWithParamId?: boolean) => {
            setFilesWithFolders(undefined);

            const searchFilter: LibraryFilterAll = {
                ...defaultFilterState,
                [LibraryFilterAllFields.DocumentFolderId]: searchWithParamId ? folderId : currentFolderId,
            };

            HttpFilesCompanySearch.searchAllWithFolders(companyId, searchFilter).then((r) => {
                const foldersData: FileWithFolderData[] = r[DocumentFolderDetailFields.FoldersList].map(
                    (folder) => mapFolderToCommonType(folder, folderId)
                );

                const filesData: FileWithFolderData[] =
                    !!searchFilter[LibraryFilterAllFields.DocumentFolderId] ?
                    r[DocumentFolderDetailFields.DocumentsList].map(mapDocumentToCommonType) : [];
                
                let rootFolders: FileWithFolderData[] = [];
                if (foldersHierarchy && ((!folderId && searchWithParamId) || (!currentFolderId && !searchWithParamId))) {
                    rootFolders = foldersHierarchy.map((folder) => mapFolderToCommonType(folder, undefined));
                }

                setFolderName(r[DocumentFolderDetailFields.FolderName]);

                const data: FileWithFolderData[] = [ ...filesData, ...rootFolders, ...foldersData];

                setFilesWithFolders(data);
            });
        },
        [foldersHierarchy]
    );

    const setFoldersIds = (folderIds: number[] | undefined) => {
        let lastValue: number | undefined;
        if (folderIds && !!folderIds.length)
            lastValue = folderIds[folderIds.length - 1];

        setCurrentFolderId(lastValue);
        searchDocuments(lastValue, true);
        setCurrentFoldersIds(folderIds || []);
    };

    const setLastCurrentFolderId = (id: number | undefined) => {
        setCurrentFolderId(id);
        searchDocuments(id, true);
        if (!!id) setCurrentFoldersIds((s) => [...s, id]);
        else setCurrentFoldersIds([]);
    };

    useEffect(() => {
        if (shouldSearch) {
            searchDocuments(currentFolderId, false);
        }
    }, [searchDocuments, shouldSearch]);

    const loadAll = () => {
        setFoldersHierarchy(undefined);
        HttpFilesFolders.getFoldersByCompanyId(companyId).then((folders) => {
            setFoldersHierarchy(folders);
            setShouldSearch(true);
        });
    };

    useEffect(() => {
        loadAll();
    }, []);
    
    const relateFiles = () => setOpenRelate(true)

    const handleViewRelated = () => setOpenView(true)
    
    return (
        <Stack spacing={2}>
            <CompanyLibraryTitle companyId={companyId}
                                 onReload={loadAll} />
  
            <Stack spacing={2}>
                <CompanyLibraryFoldersContext.Provider
                    value={{
                        currentFolderId: currentFolderId,
                        setCurrentFolder: setLastCurrentFolderId,
                        filesWithFolders: filesWithFolders,
                        reloadData: loadAll,
                        currentFoldersIds: currentFoldersIds,
                        setCurrentFoldersIds: setFoldersIds,
                    }}
                >
                    <Stack spacing={1}>
                        <Card>
                            <CardHeader title='Carpetas Personalizadas'
                                        subheader={
                                            <Stack direction='row' alignItems='center' spacing={0.5}>
                                                <WrapperIcons Icon={MagnifyingGlass} size='xs' color={'success'}/>
                                                <TypographyBase variant={'caption'}
                                                                color={'success.main'}
                                                                component={Link}
                                                                onClick={handleViewRelated}
                                                                id={'company-folders-view-all-btn'}
                                                >
                                                    Ver todas mis carpetas
                                                </TypographyBase>
                                            </Stack>
                                        }
                                        action={
                                        <Stack spacing={2} direction='row' alignItems='center'>
                                            {
                                                !!currentFolderId &&
                                                    <Button startIcon={<WrapperIcons Icon={FolderPlus} size={'sm'} />}
                                                            size='small'
                                                            onClick={relateFiles}
                                                            variant='outlined'
                                                            id={'company-folders-link-docs-btn'}
                                                    >
                                                        Vincular documentos
                                                    </Button>
                                            }
                                            <AddButton size='small' onClick={() => {
                                                setOpenNewFolder(true);
                                            }}
                                                       id={'company-folders-new-btn'}
                                            >
                                                Nueva carpeta
                                            </AddButton>
                                        </Stack>
                                        }
                            />
                            <CardContent>
                                    <Stack spacing={1}>
                                        <CompanyLibraryFoldersBreadcrumbs
                                            foldersHierarchy={foldersHierarchy}
                                        />
                                        <CompanyCustomLibraryFoldersTable folderName={folderName} companyId={companyId}/>
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
                    afterSubmit={loadAll}
                    companyId={companyId}
                    parentId={currentFolderId}
                    folderName={!!currentFolderId ? folderName : ROOT_FOLDER_NAME}
                />
                
                <DialogRelateFilesToCurrentFolder open={openRelate}
                                                  onClose={() => setOpenRelate(false)}
                                                  onReload={loadAll}
                                                  companyId={companyId}
                                                  currentFolderId={currentFolderId}
                                                  currentFolderName={folderName}
                />
                <RelatedFoldersViewDrawer companyId={companyId}
                                          onClose={() => setOpenView(false)}
                                          open={openView}
                />
            </Stack>
        </Stack>
    )
}


export default CompanyCustomLibraryPage