import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  CompanyFlowView,
  CompanyFlowTotals,
  CompanyFlowInsert
} from 'types/company/companyFlowData';
import { BaseResponse } from '../../types/baseEntities';
import {FlowInsertRequest, FlowSemesterDelete, FlowSemesterView} from "../../types/general/generalFinanceData";
import {FileBlobResponse} from "../../types/files/filesData";

export const HttpCompanyFlow = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}/movimientos${url}`,

  getList: (companyId: number): Promise<CompanyFlowView[]> => {
    return HttpAxiosRequest.get(HttpCompanyFlow.getEndpoint(companyId));
  },

  getSemesterList: (companyId: number): Promise<FlowSemesterView[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyFlow.getEndpoint(companyId, '/semestres'),
    );
  },

  insertSemester: (companyId: number): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpCompanyFlow.getEndpoint(companyId, '/semestres'),
      {},
    );
  },

  deleteSemester: (
    companyId: number,
    semesterDeleteData: FlowSemesterDelete,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.deleteWithBody(
      HttpCompanyFlow.getEndpoint(companyId, '/semestres'),
      { ...semesterDeleteData, codModulo: 1, codOrigen: 1 },
    );
  },

  insertList: (
    companyId: number,
    request: FlowInsertRequest,
  ): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpCompanyFlow.getEndpoint(companyId, '/lista'),
      { ...request, codModulo: 1, codOrigen: 1 },
    );
  },

  getTotalsByCompanyId: (companyId: number): Promise<CompanyFlowTotals> => {
    return HttpAxiosRequest.get(
      HttpCompanyFlow.getEndpoint(companyId, '/totales'),
    );
  },

  getHistoricList: (companyId: number): Promise<CompanyFlowView[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyFlow.getEndpoint(companyId, '/historicos'),
    );
  },

  insertNewList: (
    companyId: number,
    request: CompanyFlowInsert,
  ): Promise<any> => {
    return HttpAxiosRequest.post(HttpCompanyFlow.getEndpoint(companyId), {
      ...request,
      codOrigen: 1,
      codModulo: 1,
    });
  },

  removeHistoricFlow: (companyId: number, flowId: number): Promise<any> => {
    return HttpAxiosRequest.delete(
      HttpCompanyFlow.getEndpoint(companyId, `/${flowId}`),
    );
  },

  exportToExcel: (companyId: number): Promise<FileBlobResponse> =>
      HttpAxiosRequest.getBlob(
          HttpCompanyFlow.getEndpoint(companyId, `/exportar/excel`),
      ),

  exportLastToExcel: (companyId: number): Promise<FileBlobResponse> =>
      HttpAxiosRequest.getBlob(
          HttpCompanyFlow.getEndpoint(companyId, `/exportar/ultimos/excel`),
      ),
};
