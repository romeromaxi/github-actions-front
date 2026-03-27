import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  SolicitationAptitudeFormViewDTO, SolicitationDerivationResultView,
  SolicitationDocumentationAnalysisInsert
} from 'types/solicitations/solicitationDocumentationAnalysisData';

export const HttpSolicitationDerivation = {
  getEndpoint: (solicitationId: number, url: string = ''): string =>
    `solicitudes/${solicitationId}/derivaciones${url}`,

  sendResponse: (
      solicitationId: number,
      fileToConfirm: SolicitationDocumentationAnalysisInsert,
  ): Promise<any> => {
    return HttpAxiosRequest.post(
        HttpSolicitationDerivation.getEndpoint(solicitationId),
        fileToConfirm,
    );
  },
  
  getSuitableForm: (
    solicitationId: number,
  ): Promise<SolicitationAptitudeFormViewDTO> => {
    return HttpAxiosRequest.get(
      HttpSolicitationDerivation.getEndpoint(
        solicitationId,
        '/formularios/aptos',
      ),
    );
  },

  getNotSuitableForm: (
    solicitationId: number,
  ): Promise<SolicitationAptitudeFormViewDTO> => {
    return HttpAxiosRequest.get(
      HttpSolicitationDerivation.getEndpoint(
        solicitationId,
        '/formularios/no-aptos',
      ),
    );
  },
  
  getDerivationResults: (
      solicitationId: number
  ) : Promise<SolicitationDerivationResultView> => {
    return HttpAxiosRequest.get(
        HttpSolicitationDerivation.getEndpoint(
            solicitationId,
            '/resultados'
        )
    )
  }
};
