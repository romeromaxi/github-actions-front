import { CompanySectionsWithFileType } from '../../types/company/companyData';
import { HttpAxiosRequest } from '../httpAxiosBase';
import { BaseResponse } from '../../types/baseEntities';
import { SectionFilesCompanyFilter } from '../../types/files/filesData';

export const HttpFilesSections = {
  getEndpoint: (url: string = ''): string => `documentos/secciones${url}`,

  getCompanyAvailables: (
    companyId: number,
  ): Promise<CompanySectionsWithFileType[]> => {
    return HttpAxiosRequest.get(
      HttpFilesSections.getEndpoint(`/empresas/${companyId}/disponibles`),
    );
  },

  linkDocToSections: (
    companyId: number,
    documentId: number,
    lstToLink: SectionFilesCompanyFilter[],
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpFilesSections.getEndpoint(
        `/empresas/${companyId}/${documentId}/relacionar`,
      ),
      lstToLink,
    );
  },
};
