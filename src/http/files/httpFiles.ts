import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  Document,
  DocumentDelete,
  DocumentInsert,
  DocumentUpdateViewDTO,
  FileBlobResponse,
  FileUpdateDTO,
} from 'types/files/filesData';

export const HttpFiles = {
  getEndpoint: (url: string): string => `archivos${url}`,

  download: (bigIdFile: number): Promise<FileBlobResponse> => {
    return HttpAxiosRequest.getBlob(
      HttpFiles.getEndpoint(`/descargar/${bigIdFile}`),
    );
  },

  delete: (bigIdFile: number): Promise<any> => {
    return HttpAxiosRequest.delete(HttpFiles.getEndpoint(`/${bigIdFile}`));
  },
};

export const HttpFileDocument = {
  getEndpoint: (url: string = ''): string => `documentos${url}`,

  getById: (documentId: number): Promise<DocumentUpdateViewDTO> => {
    return HttpAxiosRequest.get(HttpFileDocument.getEndpoint(`/${documentId}`));
  },

  getListByDocumentId: (documentId: number): Promise<Document[]> => {
    return HttpAxiosRequest.get(
      HttpFileDocument.getEndpoint(`/${documentId}/archivos`),
    );
  },

  insert: (document: DocumentInsert): Promise<number> => {
    return HttpAxiosRequest.post(HttpFileDocument.getEndpoint(), {
      ...document,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  update: (document: FileUpdateDTO, documentId: number): Promise<number> => {
    return HttpAxiosRequest.put(
      HttpFileDocument.getEndpoint(`/${documentId}`),
      {
        ...document,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  delete: (documentId: number, deleteBody?: DocumentDelete): Promise<any> => {
    return HttpAxiosRequest.deleteWithBody(
      HttpFileDocument.getEndpoint(`/${documentId}`),
      deleteBody ?? {},
    );
  },

  download: (bigIdFile: number): Promise<FileBlobResponse> => {
    return HttpAxiosRequest.getBlob(
      HttpFileDocument.getEndpoint(`/descargar/${bigIdFile}`),
    );
  },
};
