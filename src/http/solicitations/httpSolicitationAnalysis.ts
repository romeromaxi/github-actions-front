import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  SolicitationAnalysisHistoricViewDTO,
  SolicitationAnalysisInsert,
  SolicitationAnalysisResultViewDTO,
  SolicitationAnalysisViewDTO,
} from '../../types/solicitations/solicitationAnalysisData';
import { FileSubtype } from '../../types/files/filesDataCache';
import {
  SolicitationAptitudeFormViewDTO,
  SolicitationDocumentationAnalysisUpdateConsiderations
} from '../../types/solicitations/solicitationDocumentationAnalysisData';
import {BaseResponse} from "../../types/baseEntities";

export const HttpSolicitationAnalysis = {
  getEndpoint: (solicitationId: number, url: string = ''): string =>
    `solicitudes/${solicitationId}/analisis${url}`,

  getActualBySolicitationId: (
    solicitationId: number,
  ): Promise<SolicitationAnalysisViewDTO> => {
    return HttpAxiosRequest.get(
      HttpSolicitationAnalysis.getEndpoint(solicitationId),
    );
  },

  updateConsiderations: (solicitationId: number, updateConsiderations: SolicitationDocumentationAnalysisUpdateConsiderations): Promise<BaseResponse> =>
      HttpAxiosRequest.put(
          HttpSolicitationAnalysis.getEndpoint(solicitationId, `/consideraciones`),
          updateConsiderations
      ),

  sendToApproval: (
    solicitationId: number,
    fileToConfirm: SolicitationAnalysisInsert,
  ): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpSolicitationAnalysis.getEndpoint(solicitationId),
      fileToConfirm,
    );
  },

  getRequestedFiles: (
    solicitationId: number,
    analysisId: number,
  ): Promise<FileSubtype[]> => {
    return HttpAxiosRequest.get(
      HttpSolicitationAnalysis.getEndpoint(
        solicitationId,
        `/${analysisId}/archivos-solicitados`,
      ),
    );
  },

  getHistoricListBySolicitationId: (
    solicitationId: number,
  ): Promise<SolicitationAnalysisHistoricViewDTO[]> => {
    return HttpAxiosRequest.get(
      HttpSolicitationAnalysis.getEndpoint(solicitationId, '/historia'),
    );
  },

  getSuitableForm: (
    solicitationId: number,
  ): Promise<SolicitationAptitudeFormViewDTO> => {
    return HttpAxiosRequest.get(
      HttpSolicitationAnalysis.getEndpoint(
        solicitationId,
        '/formularios/aptos',
      ),
    );
  },

  getNotSuitableForm: (
    solicitationId: number,
  ): Promise<SolicitationAptitudeFormViewDTO> => {
    return HttpAxiosRequest.get(
      HttpSolicitationAnalysis.getEndpoint(
        solicitationId,
        '/formularios/no-aptos',
      ),
    );
  },

  getResultBySolicitationId: (
    solicitationId: number,
  ): Promise<SolicitationAnalysisResultViewDTO> => {
    return HttpAxiosRequest.get(
      HttpSolicitationAnalysis.getEndpoint(solicitationId, '/resultados'),
    );
  },
};
