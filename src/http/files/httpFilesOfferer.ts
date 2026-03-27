import { HttpAxiosRequest } from '../httpAxiosBase';
import { FileBase, FileOfferer } from 'types/files/filesData';
import { getFormDataFileInsert } from 'util/formatters/fileFormatter';
import {
  DocumentCopyBody,
  DocumentFolderDetail,
} from '../../types/files/filesFoldersData';
import { BaseResponse } from '../../types/baseEntities';

export const HttpFilesOfferer = {
  getEndpoint: (offererId: number, url: string = ''): string =>
    `oferentes/${offererId}/archivos${url}`,

  getFilesByIdOfferer: (offererId: number): Promise<FileOfferer[]> => {
    return HttpAxiosRequest.get(HttpFilesOfferer.getEndpoint(offererId));
  },

  insert: (
    offererId: number,
    fileOfferer: FileBase,
    file: File,
  ): Promise<number> => {
    let formData: FormData = getFormDataFileInsert(fileOfferer, file);

    return HttpAxiosRequest.post(
      HttpFilesOfferer.getEndpoint(offererId, ''),
      formData,
    );
  },

  searchFiles: (
    offererId: number,
    documentFolderId?: number,
  ): Promise<DocumentFolderDetail> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpFilesOfferer.getEndpoint(offererId, '/busqueda'),
      { idDocumentoCarpeta: documentFolderId },
    );
  },

  insertByDocumentId: (
    offererId: number,
    documentId: number,
    docBody: DocumentCopyBody,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpFilesOfferer.getEndpoint(offererId, `/${documentId}`),
      {
        ...docBody,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },
  
  insertSolicitationDoc: (
      offererId: number,
      documentId: number,
      solicitationId: number,
      docBody: DocumentCopyBody,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
        HttpFilesOfferer.getEndpoint(offererId, `/${documentId}/solicitudes/${solicitationId}`),
        {
          ...docBody,
          codModulo: 1,
          codOrigen: 1,
        },
    );
  },
};
