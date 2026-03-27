import React, {useContext, useState} from 'react';
import {HttpFileDocument} from 'http/index';
import {
    Document,
    DocumentFields,
    DocumentUpdateViewDTO,
    FileBlobResponse,
    FileBlobResponseFields,
} from 'types/files/filesData';
import {CompanyLibraryFoldersContext, FileWithFolderData,} from './CompanyLibraryFolders';
import {DialogAlert} from 'components/dialog';
import RelateFileWithFolderDialog from 'components/files/RelateFileWithFolderDialog';
import DialogPreviewFile from 'components/files/DialogPreviewFile';
import {LoaderBlockUI} from 'components/loader';
import {WrapperIcons} from "../../../../components/icons/Icons";
import {MagnifyingGlass, ShareFat, X} from "@phosphor-icons/react";
import {DownloadSimple, Pencil} from "phosphor-react";
import FileNewDialog from "../../../../components/files/NewFileDialog";
import CompanyLibraryTable from "../components/CompanyLibraryTable";
import SharedDocumentationRelateDialog from 'pages/sharedDocumentation/SharedDocumentationRelateDialog';
import {EntityWithIdFields} from "../../../../types/baseEntities";

interface CompanyLibraryFoldersTableProps {
  companyId: number;
}

const CompanyLibraryFoldersTable = ({
  companyId,
}: CompanyLibraryFoldersTableProps) => {
  const { reloadData } =
    useContext(CompanyLibraryFoldersContext);

  const [deleteFileId, setDeleteFileId] = useState<number>();
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>('');
  const [shareFileId, setShareFileId] = useState<number | undefined>(undefined);
  const [share, setShare] = useState<boolean>(false);
  const [fileBlob, setFileBlob] = useState<FileBlobResponse>();
  const [openPreview, setOpenPreview] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [editFile, setEditFile] = useState<DocumentUpdateViewDTO>();
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

  const onDelete = () => {
      deleteFileId && HttpFileDocument.delete(deleteFileId).then(reloadData).finally(() => setDeleteOpen(false));
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
  
  const getDropdownItems = (obj: FileWithFolderData) => {
      return [
          {label: 'Editar', icon: <WrapperIcons Icon={Pencil} size={'sm'}/>, onClick: () => onEdit(obj.id)},
          {label: 'Descargar', icon: <WrapperIcons Icon={DownloadSimple} size={'sm'} />, onClick: () => onDownload(obj)},
          {label: 'Ver', icon: <WrapperIcons Icon={MagnifyingGlass} size={'sm'} />, onClick: () => onPreview(obj)},
          {label: 'Compartir', icon: <WrapperIcons Icon={ShareFat} size={'sm'} />, onClick: () => onShare(obj)},
          {label: 'Eliminar', icon: <WrapperIcons Icon={X} size={'sm'} />, onClick: () => onClickDeleteFile(obj.id)}
      ]
  }
  

  return (
    <React.Fragment>
        <CompanyLibraryTable getDropdownItems={getDropdownItems}
                             onRelateToFolder={onRelateToFolder}
                             variant={"standard"}
        />

      <DialogAlert
        severity={'error'}
        onClose={() => {
          setDeleteOpen(false);
          setDeleteFileId(undefined);
        }}
        open={deleteOpen}
        onConfirm={onDelete}
        title={'Eliminar archivo'}
        textContent={`¿Estás seguro que querés eliminar el archivo?`}
        textConfirm={'Sí, eliminar'}
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
      {
          !!editFile &&
          <FileNewDialog onCloseDialog={() => setEditFile(undefined)}
                         companyId={companyId}
                         fileToEdit={editFile}
                         onReload={reloadData}
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
    </React.Fragment>
  );
};

export default CompanyLibraryFoldersTable;
