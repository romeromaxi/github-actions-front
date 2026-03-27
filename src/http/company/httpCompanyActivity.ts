import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  CompanyActivityInsert,
  CompanyActivityView,
  CompanyAfipActivityView,
} from 'types/company/companyActivityData';
import { FileBlobResponse } from 'types/files/filesData';

export const HttpCompanyActivity = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}/resenias${url}`,

  getByCompanyId: (companyId: number): Promise<CompanyActivityView> => {
    return HttpAxiosRequest.get(HttpCompanyActivity.getEndpoint(companyId));
  },

  updateActivity: (
    companyId: number,
    activityId: number,
    companyActivity: CompanyActivityInsert,
  ): Promise<void> => {
    return HttpAxiosRequest.put(
      HttpCompanyActivity.getEndpoint(companyId, `/${activityId}`),
      { ...companyActivity, codOrigen: 1, codModulo: 1 },
    );
  },

  exportToExcel: (companyId: number): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpCompanyActivity.getEndpoint(companyId, `/exportar/excel`),
    ),

  exportToCsv: (companyId: number): Promise<FileBlobResponse> =>
    HttpAxiosRequest.getBlob(
      HttpCompanyActivity.getEndpoint(companyId, `/exportar/csv`),
    ),
};

export const HttpCompanyAfipActivity = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}/afip-actividades${url}`,

  getByCompanyId: (companyId: number): Promise<CompanyAfipActivityView[]> => {
    return HttpAxiosRequest.get(HttpCompanyAfipActivity.getEndpoint(companyId));
  },

  updateAfipActivity: (
    companyId: number,
    afipActivityId: number,
  ): Promise<void> => {
    return HttpAxiosRequest.put(
      HttpCompanyAfipActivity.getEndpoint(companyId, `/${afipActivityId}`),
      { codOrigen: 1, codModulo: 1 },
    );
  },
};
