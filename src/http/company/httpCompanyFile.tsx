import { HttpAxiosRequest } from 'http/httpAxiosBase';

import { CompanyViewDTO } from 'types/company/companyData';
import {
  CompanyAddressViewDTO,
  CompanyMailViewDTO,
  CompanyPhoneViewDTO,
} from '../../types/company/companyReferentialData';
import {
  CompanyDeclarationOfAssetsTotals,
  CompanyFinancialTotals,
  CompanyIncomeLastYearStatement,
  CompanyLastYearDeclarationOfAssets,
  CompanyPatrimonialStatement,
} from '../../types/company/companyFinanceInformationData';
import { CompanyFlowView } from '../../types/company/companyFlowData';
import {
  CompanyActivityView,
  CompanyAfipActivityView,
} from '../../types/company/companyActivityData';
import { SocietyPerson } from '../../types/company/companySocietyData';
import { FileBlobResponse } from '../../types/files/filesData';

export const HttpCompanyFile = {
  getEndpoint: (fileId: number, url: string = ''): string =>
    `legajos/${fileId}${url}`,

  getCompanyByFileId: (fileId: number): Promise<CompanyViewDTO> => {
    return HttpAxiosRequest.get(
      HttpCompanyFile.getEndpoint(fileId, '/empresas'),
    );
  },

  getCompanyAddressesByFileId: (
    fileId: number,
  ): Promise<CompanyAddressViewDTO[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyFile.getEndpoint(fileId, '/domicilios'),
    );
  },

  getCompanyActivityByFileId: (
    fileId: number,
  ): Promise<CompanyActivityView> => {
    return HttpAxiosRequest.get(
      HttpCompanyFile.getEndpoint(fileId, '/empresas/resenias'),
    );
  },

  getCompanyAfipActivitiesByFileId: (
    fileId: number,
  ): Promise<CompanyAfipActivityView[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyFile.getEndpoint(fileId, '/empresas/afip-actividades'),
    );
  },

  getRelationshipByFileId: (fileId: number): Promise<SocietyPerson[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyFile.getEndpoint(fileId, '/empresas/personas'),
    );
  },

  getCompanyFinanceLastTotalsByFileId: (
    fileId: number,
  ): Promise<CompanyFinancialTotals[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyFile.getEndpoint(fileId, `/ejercicios/totales`),
    );
  },

  getCompanyFinancePreviousTotalsByFileId: (
    fileId: number,
  ): Promise<CompanyFinancialTotals[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyFile.getEndpoint(fileId, `/ejercicios/totales/anterior`),
    );
  },

  getCompanyLastPatrimonialStateByFileId: (
    fileId: number,
  ): Promise<CompanyPatrimonialStatement> => {
    return HttpAxiosRequest.get(
      HttpCompanyFile.getEndpoint(fileId, '/estados-patrimoniales/ultimo'),
    );
  },

  getCompanyPreviousPatrimonialStateByFileId: (
    fileId: number,
  ): Promise<CompanyPatrimonialStatement> => {
    return HttpAxiosRequest.get(
      HttpCompanyFile.getEndpoint(fileId, '/estados-patrimoniales/anterior'),
    );
  },

  getCompanyLastIncomeStateByFileId: (
    companyId: number,
  ): Promise<CompanyIncomeLastYearStatement> => {
    return HttpAxiosRequest.get(
      HttpCompanyFile.getEndpoint(companyId, '/estados-resultados/ultimo'),
    );
  },

  getCompanyPreviousIncomeStateByFileId: (
    companyId: number,
  ): Promise<CompanyIncomeLastYearStatement> => {
    return HttpAxiosRequest.get(
      HttpCompanyFile.getEndpoint(companyId, '/estados-resultados/anterior'),
    );
  },

  getCompanyLastDeclarationOfAssetsTotalsByFileId: (
    fileId: number,
  ): Promise<CompanyDeclarationOfAssetsTotals[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyFile.getEndpoint(fileId, '/manifestaciones-bienes/totales'),
    );
  },

  getCompanyDeclarationOfAssetsByFileId: (
    fileId: number,
  ): Promise<CompanyLastYearDeclarationOfAssets> => {
    return HttpAxiosRequest.get(
      HttpCompanyFile.getEndpoint(fileId, `/manifestaciones-bienes`),
    );
  },

  getCompanyFlowsViewByFileId: (fileId: number): Promise<CompanyFlowView[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyFile.getEndpoint(fileId, '/movimientos'),
    );
  },

  getCompanyMailByFileId: (fileId: number): Promise<CompanyMailViewDTO> => {
    return HttpAxiosRequest.get(HttpCompanyFile.getEndpoint(fileId, '/mails'));
  },

  getCompanyPhoneNumberByFileId: (
    fileId: number,
  ): Promise<CompanyPhoneViewDTO> => {
    return HttpAxiosRequest.get(
      HttpCompanyFile.getEndpoint(fileId, '/telefonos'),
    );
  },
};

export const HttpExportCompanyFile = {
  getEndpoint: (fileId: number, url: string = ''): string =>
    `legajos/exportacion/${fileId}${url}`,
  getActualEndpoint: (companyId: number, url: string = ''): string =>
    `legajos/exportacion/empresas/${companyId}${url}`,

    getEndpointBySections: (fileId: number, url: string = ''): string =>
        `/legajos/exportacion/secciones/${fileId}/snapshot${url}`,
    getActualEndpointBySections: (companyId: number, fileType: number, url: string = ''): string =>
        `/legajos/exportacion/secciones/${companyId}/${fileType}${url}`,

  exportToExcelByFile: (fileId: number): Promise<FileBlobResponse> =>
      HttpAxiosRequest.getBlob(
          HttpExportCompanyFile.getEndpoint(fileId, `/excel`),
      ),

  exportPersonalInformationToExcelByFile: (
    fileId: number,
  ): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpExportCompanyFile.getEndpoint(fileId, `/datos-constitutivos/excel`),
    ),

  exportFinancialInformationToExcelByFile: (
    fileId: number,
  ): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpExportCompanyFile.getEndpoint(fileId, `/datos-financieros/excel`),
    ),

  exportShortFileToExcelByCompany: (
    companyId: number,
  ): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpExportCompanyFile.getActualEndpoint(companyId, `/abreviado/excel`),
    ),

  exportLongFileToExcelByCompany: (
    companyId: number,
  ): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpExportCompanyFile.getActualEndpoint(companyId, `/credito/excel`),
    ),

  exportPersonalInformationToExcelByCompany: (
    companyId: number,
  ): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpExportCompanyFile.getActualEndpoint(
        companyId,
        `/datos-constitutivos/excel`,
      ),
    ),

  exportFinancialInformationToExcelByCompany: (
    companyId: number,
  ): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpExportCompanyFile.getActualEndpoint(
        companyId,
        `/datos-financieros/excel`,
      ),
    ),
    
    exportCompanyFileSnapshotBySections: (fileId: number, codsSections: number[]): Promise<FileBlobResponse> =>
        HttpAxiosRequest.getBlobWithQueryParamsSerializer(
            HttpExportCompanyFile.getEndpointBySections(
                fileId,
                `/excel`,
            ),
            {
                "codsSecciones": codsSections
            }
        ),

    exportCompanyFileLiveBySections: (comanyId: number, fileType: number, codsSections: number[]): Promise<FileBlobResponse> =>
        HttpAxiosRequest.getBlobWithQueryParamsSerializer(
            HttpExportCompanyFile.getActualEndpointBySections(
                comanyId,
                fileType,
                `/excel`,
            ),
            {
                "codsSecciones": codsSections
            }
        ),
};
