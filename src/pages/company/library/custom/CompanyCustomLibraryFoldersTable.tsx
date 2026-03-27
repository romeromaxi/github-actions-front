import React, {Fragment, useContext, useState} from "react";
import {CompanyLibraryFoldersContext, FileWithFolderData} from "../folders/CompanyLibraryFolders";
import {WrapperIcons} from "../../../../components/icons/Icons";
import {DownloadSimple, Pencil} from "phosphor-react";
import {MagnifyingGlass, ShareFat, X} from "@phosphor-icons/react";
import {HttpFileDocument, HttpFilesFolders} from "../../../../http";
import {
    Document, DocumentFields,
    DocumentUpdateViewDTO,
    FileBlobResponse,
    FileBlobResponseFields
} from "../../../../types/files/filesData";
import {DialogAlert} from "../../../../components/dialog";
import RelateFileWithFolderDialog from "../../../../components/files/RelateFileWithFolderDialog";
import DialogPreviewFile from "../../../../components/files/DialogPreviewFile";
import FileNewDialog from "../../../../components/files/NewFileDialog";
import {LoaderBlockUI} from "../../../../components/loader";
import CompanyLibraryTable from "../components/CompanyLibraryTable";
import DrawerUpdateFolder from "../../../../components/files/DrawerUpdateFolder";
import {DocumentFolderFields, DocumentFolderUpdate} from "../../../../types/files/filesFoldersData";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import SharedDocumentationRelateDialog from "pages/sharedDocumentation/SharedDocumentationRelateDialog";

interface CompanyCustomLibraryFoldersTableProps {
    folderName: string,
    companyId: number
}

const CompanyCustomLibraryFoldersTable = ({folderName, companyId} : CompanyCustomLibraryFoldersTableProps) => {
    const { currentFolderId, reloadData } = useContext(CompanyLibraryFoldersContext);
    const [deleteFileId, setDeleteFileId] = useState<number>();
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [fileName, setFileName] = useState<string>('');
    const [shareFileId, setShareFileId] = useState<number | undefined>(undefined);
    const [share, setShare] = useState<boolean>(false);
    const [fileBlob, setFileBlob] = useState<FileBlobResponse>();
    const [openPreview, setOpenPreview] = useState<boolean>(false);
    const [showLoader, setShowLoader] = useState<boolean>(false);
    const [deleteFolderId, setDeleteFolderId] = useState<number>();
    const [deleteFolderName, setDeleteFolderName] = useState<string>('');
    const [editFile, setEditFile] = useState<DocumentUpdateViewDTO>();
    const [folderToEdit, setFolderToEdit] = useState<DocumentFolderUpdate>();
    const [documentToShare, setDocumentToShare] = useState<Document>();

    const onPreview = (file: FileWithFolderData) => {
        setShowLoader(true);
        HttpFileDocument.download(file.id).then((blob) => {
            setFileBlob(blob);
            setOpenPreview(true);
            setShowLoader(false);
        });
    };

    const onClosePreview = () => {
        setOpenPreview(false);
        setFileBlob(undefined);
    };

    const onDownload = (file: FileWithFolderData) => {
        const isFolder: boolean = file.numberDocs ? file.numberDocs > 1 : false;

        HttpFileDocument.download(file.id).then(
            (blobResponse: FileBlobResponse) => {
                const downloadUrl = window.URL.createObjectURL(
                    new Blob([blobResponse[FileBlobResponseFields.File]]),
                );

                const link = document.createElement('a');
                link.href = downloadUrl;

                let downloadName: string = isFolder ? `${file.name}.zip` : file.name;

                link.setAttribute('download', downloadName);

                document.body.appendChild(link);
                link.click();
                link.remove();
            },
        );
    };

    const onDelete = (deleteAll: boolean) => {
      if (deleteFileId) {
            if (!deleteAll && currentFolderId) {
                HttpFilesFolders.deleteDocumentRelatedFolder(
                    currentFolderId,
                    deleteFileId,
                )
                    .then(() => {
                        reloadData();
                    })
                    .finally(() => setDeleteOpen(false));
            } else {
                HttpFileDocument.delete(deleteFileId).then(reloadData).finally(() => setDeleteOpen(false));
            }
        }
    };

    const onDeleteFolder = () => {
        deleteFolderId &&
        HttpFilesFolders.deleteById(deleteFolderId)
            .then(() => {
                reloadData();
            })
            .finally(() => setOpenDelete(false));
    };

    const onClickDeleteFile = (fileId: number) => {
        setDeleteFileId(fileId);
        setDeleteOpen(true);
    };
    
    const onRelateToFolder = (obj: FileWithFolderData) => {
        setShareFileId(obj.id);
        setShare(true);
        setFileName(obj.title);
    }

    const onShare = (obj: FileWithFolderData) => {
        //@ts-ignore
        setDocumentToShare({
            [EntityWithIdFields.Id]: obj.id,
            [DocumentFields.FileDesc]: obj.name
        });
    }

    const onEdit = (id: number) => {
        setShowLoader(true)
        HttpFileDocument.getById(id).then((r) => {
            setEditFile(r)
            setShowLoader(false)
        })
    }
    
    const onEditFolder = (folderId: number, folderName: string) => 
        setFolderToEdit({
            [EntityWithIdFields.Id]: folderId,
            [DocumentFolderFields.FolderName]: folderName
        });
    
    const closeEditFolderDialog = () => setFolderToEdit(undefined);
    
    const onSubmitEditFolder = () => {
        setFolderToEdit(undefined);
        reloadData();
    }
    
    const getDropdownItems = (obj: FileWithFolderData) => {
        if (obj.type === 'file') {
            return [
                {label: 'Editar', icon: <WrapperIcons Icon={Pencil} size={'sm'}/>, onClick: () => onEdit(obj.id)},
                {label: 'Descargar', icon: <WrapperIcons Icon={DownloadSimple} size={'sm'} />, onClick: () => onDownload(obj)},
                {label: 'Ver', icon: <WrapperIcons Icon={MagnifyingGlass} size={'sm'} />, onClick: () => onPreview(obj)},
                {label: 'Compartir', icon: <WrapperIcons Icon={ShareFat} size={'sm'} />, onClick: () => onShare(obj)},
                {label: 'Eliminar', icon: <WrapperIcons Icon={X} size={'sm'} />, onClick: () => onClickDeleteFile(obj.id)}
            ]    
        } else {
            return [
                {
                    label: 'Editar nombre', 
                    icon: <WrapperIcons Icon={Pencil} size={'sm'}/>, 
                    onClick: () => onEditFolder(obj.id, obj.name)
                },
                {label: 'Eliminar', icon: <WrapperIcons Icon={X} size={'sm'} />, onClick: () => {
                        setDeleteFolderName(obj.name);
                        setDeleteFolderId(obj.id);
                        setOpenDelete(true);
                }}
            ]
        }
        
    }

    return (
        <Fragment>
            <CompanyLibraryTable variant="folder" 
                                 getDropdownItems={getDropdownItems}
                                 onRelateToFolder={onRelateToFolder}
            />
            {
                currentFolderId ?
                  <DialogAlert open={deleteOpen}
                               severity={'error'}
                               title={'Eliminar archivo'}
                               textContent={`¿Estás seguro que querés eliminar el archivo de la carpeta ${folderName}?`}
                               onClose={() => {
                                 setDeleteOpen(false);
                                 setDeleteFileId(undefined);
                               }}
                               onConfirm={onDelete}
                               textConfirm={"Sí, eliminar"}
                               showConfirm
                               textCheckConfirm={'Eliminar definitivamente este archivo'}
                  >
                    Si querés eliminarlo definitivamente, seleccioná la casilla
                  </DialogAlert>
                  :
                  <DialogAlert open={deleteOpen}
                               severity={'error'}
                               title={'Eliminar archivo'}
                               textContent={`¿Estás seguro que querés eliminar el archivo?`}
                               onClose={() => {
                                 setDeleteOpen(false);
                                 setDeleteFileId(undefined);
                               }}
                               onConfirm={() => onDelete(true)}
                  />
            }
            {shareFileId && (
                <RelateFileWithFolderDialog
                    fileId={shareFileId}
                    fileName={fileName}
                    open={share}
                    onClose={() => {
                        setShareFileId(undefined);
                        setShare(false);
                    }}
                    onReload={reloadData}
                    companyId={companyId}
                />
            )}

            {fileBlob && (
                <DialogPreviewFile
                    open={openPreview}
                    onClose={onClosePreview}
                    fileBlob={fileBlob}
                />
            )}
            <DialogAlert
                onClose={() => {
                    setOpenDelete(false);
                    setDeleteFileId(undefined);
                }}
                open={openDelete}
                title={'Eliminar carpeta'}
                textContent={`¿Desea eliminar la carpeta ${deleteFolderName}?`}
                onConfirm={onDeleteFolder}
            />
            {
                !!editFile &&
                <FileNewDialog onCloseDialog={() => setEditFile(undefined)}
                               companyId={companyId}
                               fileToEdit={editFile}
                               onReload={reloadData}
                />
            }

            {
                !!folderToEdit &&
                    <DrawerUpdateFolder open 
                                        folder={folderToEdit}
                                        onClose={closeEditFolderDialog}
                                        afterSubmit={onSubmitEditFolder}
                    />
            }
            
              {
                  documentToShare &&
                  <SharedDocumentationRelateDialog open={!!documentToShare}
                                                   onClose={() => setDocumentToShare(undefined)}
                                                   document={documentToShare}
                  />
              }
            {showLoader && <LoaderBlockUI />}
        </Fragment>
    );
};

export default CompanyCustomLibraryFoldersTable;
