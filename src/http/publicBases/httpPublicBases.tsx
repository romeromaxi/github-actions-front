import { HttpAxiosRequestPublicBases } from '../httpAxiosPublicBasesBase';
import {
  NosisDetailQuery,
  NosisQuery,
  NosisSummaryQuery,
} from '../../types/nosis/nosisData';
import {FileBlobResponse} from "../../types/files/filesData";
import {HttpAxiosRequest} from "../httpAxiosBase";

export const HttpPublicBases = {
  getEndpoint: (url: string = ''): string => `bases-publicas${url}`,

  getListByCompanyId: (companyId: number): Promise<NosisQuery[]> => {
    return HttpAxiosRequestPublicBases.get(
      HttpPublicBases.getEndpoint(`/empresas/${companyId}`),
    );
  },
  
  getListByCompanyFileId: (companyFileId: number): Promise<NosisQuery[]> =>
      HttpAxiosRequestPublicBases.get(
          HttpPublicBases.getEndpoint(`/legajos/${companyFileId}`),
      ),

  getSummaryListByCompanyId: (
    companyId: number,
  ): Promise<NosisSummaryQuery[]> => {
    return HttpAxiosRequestPublicBases.get(
      HttpPublicBases.getEndpoint(`/empresas/${companyId}/resumen`),
    );
  },

  getDetail: (queryId: number): Promise<NosisDetailQuery> => {
    return HttpAxiosRequestPublicBases.get(
      HttpPublicBases.getEndpoint(`/${queryId}`),
    );
  },
};


export const HttpPublicBasesExport = {
  getEndpoint: (nosisQueryId: number, url: string = ''): string => `bases-publicas/${nosisQueryId}/exportar${url}`,
  
  exportScoresToExcel: (nosisQueryId: number) : Promise<FileBlobResponse> =>
      HttpAxiosRequest.getBlob(
          HttpPublicBasesExport.getEndpoint(nosisQueryId, '/scoring/excel')
      ),
  
  exportDebtsToExcel: (nosisQueryId: number) : Promise<FileBlobResponse> => 
      HttpAxiosRequest.getBlob(
          HttpPublicBasesExport.getEndpoint(nosisQueryId, '/deudas/excel')
      ),
  
  exportChequesToExcel: (nosisQueryId: number) : Promise<FileBlobResponse> =>
      HttpAxiosRequest.getBlob(
          HttpPublicBasesExport.getEndpoint(nosisQueryId, '/cheques/excel')
      ),
  
  exportSummaryToExcel: (nosisQueryId: number) : Promise<FileBlobResponse> =>
      HttpAxiosRequest.getBlob(
          HttpPublicBasesExport.getEndpoint(nosisQueryId, '/resumen/excel')
      ),
  
  exportContributionsToExcel: (nosisQueryId: number) : Promise<FileBlobResponse> =>
      HttpAxiosRequest.getBlob(
          HttpPublicBasesExport.getEndpoint(nosisQueryId, '/aportes/excel')
      ),
}