import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  SolicitationAptitudeFormViewDTO,
  SolicitationDocumentationAnalysisHistoricViewDTO,
  SolicitationDocumentationAnalysisInsert, SolicitationDocumentationAnalysisUpdateConsiderations,
  SolicitationDocumentationAnalysisViewDTO,
} from '../../types/solicitations/solicitationDocumentationAnalysisData';
import { SolicitationAnalysisResultViewDTO } from '../../types/solicitations/solicitationAnalysisData';
import {BaseResponse} from "../../types/baseEntities";

export const HttpSolicitationDocumentationAnalysis = {
  getEndpoint: (solicitationId: number, url: string = ''): string =>
    `solicitudes/${solicitationId}/documentacion/analisis${url}`,

  getActualBySolicitationId: (
    solicitationId: number,
  ): Promise<SolicitationDocumentationAnalysisViewDTO> => {
    return HttpAxiosRequest.get(
      HttpSolicitationDocumentationAnalysis.getEndpoint(solicitationId),
    );
  },

  updateConsiderations: (solicitationId: number, updateConsiderations: SolicitationDocumentationAnalysisUpdateConsiderations): Promise<BaseResponse> => 
      HttpAxiosRequest.put(
          HttpSolicitationDocumentationAnalysis.getEndpoint(solicitationId, `/consideraciones`),
          updateConsiderations
      ),
  
  sendToApproval: (
    solicitationId: number,
    fileToConfirm: SolicitationDocumentationAnalysisInsert,
  ): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpSolicitationDocumentationAnalysis.getEndpoint(solicitationId),
      fileToConfirm,
    );
  },

  getHistoricListBySolicitationId: (
    solicitationId: number,
  ): Promise<SolicitationDocumentationAnalysisHistoricViewDTO[]> => {
    return HttpAxiosRequest.get(
      HttpSolicitationDocumentationAnalysis.getEndpoint(
        solicitationId,
        '/historia',
      ),
    );
  },

  getResultBySolicitationId: (
    solicitationId: number,
  ): Promise<SolicitationAnalysisResultViewDTO> => {
    return HttpAxiosRequest.get(
      HttpSolicitationDocumentationAnalysis.getEndpoint(
        solicitationId,
        '/resultados',
      ),
    );
  },

  getSuitableForm: (
    solicitationId: number,
  ): Promise<SolicitationAptitudeFormViewDTO> => {
    return HttpAxiosRequest.get(
      HttpSolicitationDocumentationAnalysis.getEndpoint(
        solicitationId,
        '/formularios/aptos',
      ),
    );
  },

  getNotSuitableForm: (
    solicitationId: number,
  ): Promise<SolicitationAptitudeFormViewDTO> => {
    return HttpAxiosRequest.get(
      HttpSolicitationDocumentationAnalysis.getEndpoint(
        solicitationId,
        '/formularios/no-aptos',
      ),
    );
  },
};
