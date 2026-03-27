import { HttpAxiosRequest } from '../httpAxiosBase';
import {DocumentToFileLinkRequestOfferer, FileBase} from 'types/files/filesData';
import { getFormDataFileInsert } from 'util/formatters/fileFormatter';
import {Document} from "types/files/filesData";
import {BaseResponse} from "../../types/baseEntities";

export const HttpFilesClientPortfolio = {
  getEndpoint: (clientPortfolioGuid: string, url: string = ''): string =>
      `carpetas/${clientPortfolioGuid}/archivos${url}`,

  getFiles: (clientPortfolioGuid: string): Promise<Document[]> => {
    return HttpAxiosRequest.get(HttpFilesClientPortfolio.getEndpoint(clientPortfolioGuid));
  },
  
  insert: (clientPortfolioGuid: string, fileSolicitation: FileBase, file: File): Promise<number> => {
    const formData: FormData = getFormDataFileInsert(fileSolicitation, file);

    return HttpAxiosRequest.post(
        HttpFilesClientPortfolio.getEndpoint(clientPortfolioGuid),
        formData,
    );
  },
  
  linkWithExistent: (clientPortfolioGuid: string, documentsToLink: DocumentToFileLinkRequestOfferer): Promise<BaseResponse> =>
      HttpAxiosRequest.post(
          HttpFilesClientPortfolio.getEndpoint(clientPortfolioGuid, '/existentes'),
          documentsToLink,
      ),
}

export const HttpFilesClientPortfolioBalances = {
  getEndpoint: (clientPortfolioGuid: string, solicitationFinancialId: number, url: string = ''): string =>
      `carpetas/${clientPortfolioGuid}/ejercicios/${solicitationFinancialId}/archivos${url}`,

  insert: (
    clientPortfolioGuid: string,
    solicitationFinancialId: number,
    fileSolicitation: FileBase,
    file: File,
  ): Promise<number> => {
    const formData: FormData = getFormDataFileInsert(fileSolicitation, file);

    return HttpAxiosRequest.post(
        HttpFilesClientPortfolioBalances.getEndpoint(clientPortfolioGuid, solicitationFinancialId),
      formData,
    );
  },
}