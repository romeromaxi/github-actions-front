import { OffererDocumentationFoldersContext } from '../OffererDocumentation';
import React, { useContext, useState } from 'react';
import { FileWithFolderData } from '../../../company/library/folders/CompanyLibraryFolders';
import { HttpFileDocument } from '../../../../http';
import {
    DocumentFields,
    DocumentUpdateViewDTO,
    FileBlobResponse,
    FileBlobResponseFields,
} from '../../../../types/files/filesData';
import { HttpFilesFolders } from '../../../../http';
import { ITableColumn, TableList } from '../../../../components/table';
import {Button, Grid, Stack, Tooltip, Typography} from '@mui/material';
import { fileFormatter } from '../../../../util/formatters/fileFormatter';
import { dateFormatter } from '../../../../util/formatters/dateFormatter';
import {
    ButtonIconDropdown, MenuItemDropdown,
} from '../../../../components/buttons/Buttons';
import { DialogAlert } from '../../../../components/dialog';
import RelateFileWithFolderDialog from '../../../../components/files/RelateFileWithFolderDialog';
import {
    DocumentFolderFields, DocumentFolderUpdate,
} from '../../../../types/files/filesFoldersData';
import { LoaderBlockUI } from '../../../../components/loader';
import DialogPreviewFile from '../../../../components/files/DialogPreviewFile';
import {WrapperIcons} from "../../../../components/icons/Icons";
import {DownloadSimple, Pencil} from "phosphor-react";
import {FolderSimple, MagnifyingGlass, ShareFat, X} from "@phosphor-icons/react";
import FileNewDialog from "../../../../components/files/NewFileDialog";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import DrawerUpdateFolder from "../../../../components/files/DrawerUpdateFolder";
import SharedDocumentationRelateDialog from "../../../sharedDocumentation/SharedDocumentationRelateDialog";
import {TypographyBase} from "../../../../components/misc/TypographyBase";
import useSecurityObject from "../../../../hooks/useSecurityObject";
import {OffererButtonSecObjects, SecurityComponents} from "../../../../types/security";

interface OffererLibraryFoldersTableProps {
  folderName: string;
  offererId: number;
}

const OffererLibraryFoldersTable = ({
  folderName,
  offererId,
}: OffererLibraryFoldersTableProps) => {
  const { filesWithFolders, currentFolderId, setCurrentFolder, reloadData } =
    useContext(OffererDocumentationFoldersContext);
  const { hasReadPermission } = useSecurityObject();

  const [deleteFileId, setDeleteFileId] = useState<number>();
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [shareFileId, setShareFileId] = useState<number | undefined>(undefined);
  const [editFile, setEditFile] = useState<DocumentUpdateViewDTO>()
  const [share, setShare] = useState<boolean>(false);
  const [deleteFolderName, setDeleteFolderName] = useState<string>('');
  const [deleteFolderId, setDeleteFolderId] = useState<number>();
  const [documentToShare, setDocumentToShare] = useState<Document>();
  const [loading, setLoading] = useState<boolean>(false);
  const [fileBlob, setFileBlob] = useState<FileBlobResponse>();
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [folderToEdit, setFolderToEdit] = useState<DocumentFolderUpdate>()

  

  const onDownload = (file: FileWithFolderData) => {
    const isFolder: boolean = file.numberDocs ? file.numberDocs > 1 : false;

    setLoading(true);

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
        setLoading(false);
      },
    );
  };

  const onDelete = () => {
    if (deleteFileId) {
      currentFolderId
        ? HttpFilesFolders.deleteDocumentRelatedFolder(
            currentFolderId,
            deleteFileId,
          )
            .then(() => {
              reloadData();
            })
            .finally(() => setDeleteOpen(false))
        : HttpFileDocument.delete(deleteFileId)
            .then(() => reloadData())
            .finally(() => setDeleteOpen(false));
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

  const onPreview = (file: FileWithFolderData) => {
    setLoading(true);
    HttpFileDocument.download(file.id).then((blob) => {
      setFileBlob(blob);
      setOpenPreview(true);
      setLoading(false);
    });
  };

  const onClosePreview = () => {
    setOpenPreview(false);
    setFileBlob(undefined);
  };
  
  const onRelate = (obj: FileWithFolderData) => {
        setShareFileId(obj.id);
        setShare(true);
        setFileName(obj.title);
  }

  const onEdit = (id: number) => {
    setLoading(true)
    HttpFileDocument.getById(id).then((r) => {
        setEditFile(r)
        setLoading(false)
    })
  }
  
  const onClickDeleteFolder = (obj: FileWithFolderData) => {
      setDeleteFolderName(obj.name);
      setDeleteFolderId(obj.id);
      setOpenDelete(true);
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

    const onShare = (obj: FileWithFolderData) => {
        //@ts-ignore
        setDocumentToShare({
            [EntityWithIdFields.Id]: obj.id,
            [DocumentFields.FileDesc]: obj.name
        });
    }
    
    const getDropdownFileActions = (obj: FileWithFolderData) => {
      const items: MenuItemDropdown[] = []
      if (hasReadPermission(SecurityComponents.OffererDocumentation, OffererButtonSecObjects.OffererButtonLibraryDocumentEdit)) {
          items.push({label: 'Editar', icon: <WrapperIcons Icon={Pencil} size={'sm'}/>, onClick: () => onEdit(obj.id)})
      }
      if (hasReadPermission(SecurityComponents.OffererDocumentation, OffererButtonSecObjects.OffererButtonLibraryDocumentDownload)) {
          items.push({label: 'Descargar', icon: <WrapperIcons Icon={DownloadSimple} size={'sm'} />, onClick: () => onDownload(obj)})
      }
      if (hasReadPermission(SecurityComponents.OffererDocumentation, OffererButtonSecObjects.OffererButtonLibraryDocumentView)) {
          items.push({label: 'Ver', icon: <WrapperIcons Icon={MagnifyingGlass} size={'sm'} />, onClick: () => onPreview(obj)})
      }
      if (hasReadPermission(SecurityComponents.OffererDocumentation, OffererButtonSecObjects.OffererButtonLibraryShare)) {
          items.push({label: 'Compartir', icon: <WrapperIcons Icon={ShareFat} size={'sm'} />, onClick: () => onShare(obj)})
      }
      if (hasReadPermission(SecurityComponents.OffererDocumentation, OffererButtonSecObjects.OffererButtonLibraryDocumentDelete)) {
          items.push({label: 'Eliminar', icon: <WrapperIcons Icon={X} size={'sm'} />, onClick: () => onClickDeleteFile(obj.id)})
      }
      
      return items;
    }
    
    const getDropdownFolderActions = (obj: FileWithFolderData) => {
      const items: MenuItemDropdown[] = []
      if (hasReadPermission(SecurityComponents.OffererDocumentation, OffererButtonSecObjects.OffererButtonLibraryFolderEdit)) {
          items.push({label: 'Editar nombre', icon: <WrapperIcons Icon={Pencil} size={'sm'}/>, onClick: () => onEditFolder(obj.id, obj.name)})
      }
      if (hasReadPermission(SecurityComponents.OffererDocumentation, OffererButtonSecObjects.OffererButtonLibraryFolderDelete)) {
          items.push({label: 'Eliminar', icon: <WrapperIcons Icon={X} size={'sm'} />, onClick: () => onClickDeleteFolder(obj)})
      }
      
      return items;
    }

  const columns: ITableColumn[] = [
    {
      label: 'Nombre',
      textAlign: 'left', width: 80,
      onRenderCell: (obj: FileWithFolderData) => {
        const isFolder: boolean = obj.type === 'folder';
        const cursor: string = isFolder ? 'pointer' : '';

        return isFolder ? (
          <Grid
            container
            alignItems={'center'}
            spacing={2}
            onClick={() => setCurrentFolder(obj.id)}
            style={{ cursor: cursor, width: '300px !important' }}
          >
            <Grid item xs={3} md={1.5}>
              {fileFormatter.getIconFolderTableTheme({ fontSize: 'large' })}
            </Grid>
            <Grid item xs={9} md={10.5} textAlign={'left'}>
              <Typography>{obj.name}</Typography>
            </Grid>
          </Grid>
        ) : (
          <Grid container sx={{ width: '300px !important'}}>
            <Grid item xs={12} textAlign={'left'}>
              <Stack alignItems={'center'} spacing={2} direction={'row'}>
                {obj.numberDocs
                  ? obj.numberDocs > 1
                    ? fileFormatter.getIconFolder({ fontSize: 'large' })
                    : fileFormatter.getIconByFileName(obj.name, {
                        fontSize: 'large',
                      })
                  : fileFormatter.getIconByFileName(obj.name, {
                      fontSize: 'large',
                    })}
                <Stack overflow={'hidden'}>
                  <TypographyBase variant={'body2'} fontWeight={500} maxLines={2} tooltip>
                    {obj.title}
                  </TypographyBase>
                  <TypographyBase color="#ABAAAA" fontSize={11} fontWeight={600} maxLines={2} tooltip>
                    {obj.name}
                  </TypographyBase>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        );
      },
    },
    {
      label: 'Fecha Subida',
      onRenderCell: (obj: FileWithFolderData) => {
          if (obj.type === 'folder') return (<Typography></Typography>);
          return (
              <Typography>{dateFormatter.toShortDate(obj.uploadDate)}</Typography>
          )
      }
    },
    {
        label: 'Carpetas Personalizadas',
        onRenderCell: (obj: FileWithFolderData) => {
            if (obj.type === 'folder') return (<Typography></Typography>);
            return (
                <Stack>
                    <Tooltip title={'Click para ver y relacionar carpetas'}>
                        <Button onClick={() => onRelate(obj)}
                                size={'small'}
                                color={'primary'}
                                startIcon={<WrapperIcons Icon={FolderSimple} size={'sm'}/>}
                                sx={{margin: '0'}}
                        >
                            {obj.cantidadCarpetasRelacionadas ?? 0}
                        </Button>
                    </Tooltip>
                </Stack>
            )
        }
    },
    {
      label: 'Acciones',
      onRenderCell: (obj: FileWithFolderData) => (
          <React.Fragment>
            {obj.type === 'file' ?
                getDropdownFileActions(obj).length !== 0 ?
                      <ButtonIconDropdown size={'small'}
                                          label={''}
                                          items={getDropdownFileActions(obj)}
                      />
                    :
                    <></>
                :
                getDropdownFolderActions(obj).length !== 0 ?
                    <ButtonIconDropdown size={'small'}
                                        label={''}
                                        items={getDropdownFolderActions(obj)}
                    />
                    :
                    <></>
            }
          </React.Fragment>
      ),
    },
  ];

  return (
    <Stack spacing={1}>
      <TableList
        entityList={filesWithFolders}
        columns={columns}
        isLoading={!filesWithFolders}
        error={false}
      />
      <DialogAlert
        onClose={() => {
          setDeleteOpen(false);
          setDeleteFileId(undefined);
          setDeleteFolderName('');
        }}
        open={deleteOpen}
        onConfirm={onDelete}
        title={'Quitar archivo'}
        textContent={`¿Desea quitar el archivo de la carpeta ${folderName}?`}
      />
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
          offererId={offererId}
        />
      )}
      {fileBlob && (
        <DialogPreviewFile
          open={openPreview}
          onClose={onClosePreview}
          fileBlob={fileBlob}
        />
      )}
        {
            !!editFile &&
            <FileNewDialog onCloseDialog={() => setEditFile(undefined)}
                           offererId={offererId}
                           fileToEdit={editFile}
                           onReload={reloadData}
                           blockSection
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
      {loading && <LoaderBlockUI />}
    </Stack>
  );
};

export default OffererLibraryFoldersTable;
