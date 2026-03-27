import {
  Document,
  DocumentToFileLinkRequestOfferer,
  FileBase,
} from '../../types/files/filesData';
import { HttpAxiosRequest } from '../httpAxiosBase';
import { getFormDataFileInsert } from '../../util/formatters/fileFormatter';
import { BaseResponse } from '../../types/baseEntities';

export const HttpFilesProductLine = {
  getEndpoint: (productLineId: number, url: string = ''): string =>
    `producto-lineas/${productLineId}/archivos${url}`,

  getFilesByIdProductLine: (productLineId: number): Promise<Document[]> => {
    return HttpAxiosRequest.get(
      HttpFilesProductLine.getEndpoint(productLineId),
    );
  },

  insert: (
    productLineId: number,
    fileProductLine: FileBase,
    file: File,
  ): Promise<number> => {
    const formData: FormData = getFormDataFileInsert(fileProductLine, file);

    return HttpAxiosRequest.post(
      HttpFilesProductLine.getEndpoint(productLineId),
      formData,
    );
  },

  linkWithExistent: (
    productLineId: number,
    request: DocumentToFileLinkRequestOfferer,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpFilesProductLine.getEndpoint(productLineId, '/existentes'),
      request,
    );
  },
};
