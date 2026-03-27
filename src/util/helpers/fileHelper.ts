import {
  FileBlobResponse,
  FileBlobResponseFields,
} from 'types/files/filesData';
import {
  DocumentFolderFields,
  DocumentFolderViewDTO,
  DocumentFolderViewDTOFields,
} from '../../types/files/filesFoldersData';
import {
  EntityWithIdAndDescriptionFields,
  EntityWithIdFields,
} from '../../types/baseEntities';
import {
  FoldersTreeItem,
  FoldersTreeItemFields,
} from '../../components/files/FoldersTreeView';
import {
  CompanySectionsWithFileType,
  CompanySectionsWithFileTypeFields,
} from '../../types/company/companyData';

export const downloadFileHelper = (
  downloadUrl: string,
  downloadName: string,
) => {
  const link = document.createElement('a');
  link.href = downloadUrl;

  link.setAttribute('download', downloadName);

  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const downloadFileBlobHelper = (blobResponse: FileBlobResponse) => {
  const downloadUrl = window.URL.createObjectURL(
    new Blob([blobResponse[FileBlobResponseFields.File]]),
  );
  downloadFileHelper(
    downloadUrl,
    blobResponse[FileBlobResponseFields.FileName],
  );
};

export const folderToTreeView = (
  folders: DocumentFolderViewDTO[],
): FoldersTreeItem[] => {
  return folders.map((item: DocumentFolderViewDTO) => {
    return {
      [FoldersTreeItemFields.Id]: item[EntityWithIdFields.Id],
      [FoldersTreeItemFields.Name]:
        item[DocumentFolderFields.FolderName],
      [FoldersTreeItemFields.Children]: item[
        DocumentFolderViewDTOFields.DaughtersFolders
      ]
        ? folderToTreeView(item[DocumentFolderViewDTOFields.DaughtersFolders])
        : [],
      [FoldersTreeItemFields.IsFolder]: true,
    } as FoldersTreeItem;
  });
};

export const sectionsToTreeView = (
  sections: CompanySectionsWithFileType[],
): FoldersTreeItem[] => {
  return sections.map((item: CompanySectionsWithFileType) => {
    return {
      [FoldersTreeItemFields.Id]: item[EntityWithIdFields.Id],
      [FoldersTreeItemFields.Name]:
        item[CompanySectionsWithFileTypeFields.Description],
      [FoldersTreeItemFields.Children]: item[
        CompanySectionsWithFileTypeFields.FileTypes
      ]
        ? item[CompanySectionsWithFileTypeFields.FileTypes].map((type) => {
            return {
              [FoldersTreeItemFields.Id]: type[EntityWithIdFields.Id],
              [FoldersTreeItemFields.Name]:
                type[EntityWithIdAndDescriptionFields.Description],
              [FoldersTreeItemFields.Children]: [],
              [FoldersTreeItemFields.IsFolder]: true,
            } as FoldersTreeItem;
          })
        : [],
      [FoldersTreeItemFields.IsFolder]: true,
    } as FoldersTreeItem;
  });
};

export const sectionsToDocumentFolder = (
  sections: CompanySectionsWithFileType[],
): DocumentFolderViewDTO[] => {
  return sections.map((item: CompanySectionsWithFileType) => {
    return {
      [EntityWithIdFields.Id]: item[EntityWithIdFields.Id],
      [DocumentFolderFields.FolderName]:
        item[CompanySectionsWithFileTypeFields.Description],
      [DocumentFolderFields.DocumentsQuantity]: 0,
      [DocumentFolderViewDTOFields.IsPresent]: false,
      [DocumentFolderViewDTOFields.DaughtersFolders]: item[
        CompanySectionsWithFileTypeFields.FileTypes
      ]
        ? item[CompanySectionsWithFileTypeFields.FileTypes].map((type) => {
            return {
              [EntityWithIdFields.Id]: 9999 + type[EntityWithIdFields.Id],
              [DocumentFolderFields.FolderName]:
                type[EntityWithIdAndDescriptionFields.Description],
              [DocumentFolderFields.DocumentsQuantity]: 0,
              [DocumentFolderViewDTOFields.IsPresent]: false,
              [DocumentFolderViewDTOFields.DaughtersFolders]: [],
            } as DocumentFolderViewDTO;
          })
        : [],
    } as DocumentFolderViewDTO;
  });
};

export const downloadFileAsBlob = async (
  url: string,
  filename: string,
): Promise<File> => {
  const directUrl = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
  const response = await fetch(directUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type });
};
