import {
  DocumentFolderInsert,
  DocumentFolderRelatedInsert, DocumentFolderUpdate,
  DocumentFolderViewDTO,
} from '../../types/files/filesFoldersData';
import { HttpAxiosRequest } from '../httpAxiosBase';
import {BaseRequestFields, BaseResponse} from '../../types/baseEntities';

export const HttpFilesFolders = {
  getEndpoint: (url: string = ''): string => `documentos/carpetas${url}`,

  insertFolder: (folderData: DocumentFolderInsert): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(HttpFilesFolders.getEndpoint(), {
      ...folderData,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  updateFolder: (folderId: number, folderData: DocumentFolderUpdate): Promise<BaseResponse> =>
      HttpAxiosRequest.put(
          HttpFilesFolders.getEndpoint(`/${folderId}`),
          {
            ...folderData,
            [BaseRequestFields.ModuleCode]: 1,
            [BaseRequestFields.OriginCode]: 1
          }),

  insertRelatedFolder: (
    folderId: number,
    folderRelated: DocumentFolderRelatedInsert,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(HttpFilesFolders.getEndpoint(`/${folderId}`), {
      ...folderRelated,
    });
  },

  relateFileWithFolders: (
    fileId: number,
    lstIds: number[],
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpFilesFolders.getEndpoint(`/${fileId}/relacionar-carpetas`),
      lstIds,
    );
  },

  getFoldersByCompanyId: (
    companyId: number,
  ): Promise<DocumentFolderViewDTO[]> => {
    return HttpAxiosRequest.get(
      HttpFilesFolders.getEndpoint(`/empresas/${companyId}/disponibles`),
    );
  },

  getFoldersByFileId: (
    companyId: number,
    fileId: number,
  ): Promise<DocumentFolderViewDTO[]> => {
    return HttpAxiosRequest.get(
      HttpFilesFolders.getEndpoint(
        `/empresas/${companyId}/disponibles/${fileId}`,
      ),
    );
  },

  deleteById: (folderId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.delete(
      HttpFilesFolders.getEndpoint(`/${folderId}`),
    );
  },

  deleteDocumentRelatedFolder: (
    folderId: number,
    documentId: number,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.delete(
      HttpFilesFolders.getEndpoint(`/${folderId}/${documentId}`),
    );
  },

  getOffererFolders: (offererId: number): Promise<DocumentFolderViewDTO[]> => {
    return HttpAxiosRequest.get(
      HttpFilesFolders.getEndpoint(`/oferentes/${offererId}/disponibles`),
    );
  },

  getOffererFoldersByDocumentId: (
    offererId: number,
    documentId: number,
  ): Promise<DocumentFolderViewDTO[]> => {
    return HttpAxiosRequest.get(
      HttpFilesFolders.getEndpoint(
        `/oferentes/${offererId}/disponibles/${documentId}`,
      ),
    );
  },
};
