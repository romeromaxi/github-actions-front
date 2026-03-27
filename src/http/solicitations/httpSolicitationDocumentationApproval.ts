import { HttpAxiosRequest } from '../httpAxiosBase';
import { BaseResponse } from '../../types/baseEntities';
import {
  SolicitationDocumentationApprovalUpdateDTO,
  SolicitationDocumentationApprovalViewDTO,
} from '../../types/solicitations/solicitationDocumentationApprovalData';

export const HttpSolicitationDocumentationApproval = {
  getEndpoint: (solicitationId: number, url: string = ''): string =>
    `solicitudes/${solicitationId}/documentacion/aprobaciones${url}`,

  getActualBySolicitationId: (
    solicitationId: number,
  ): Promise<SolicitationDocumentationApprovalViewDTO> => {
    return HttpAxiosRequest.get(
      HttpSolicitationDocumentationApproval.getEndpoint(solicitationId),
    );
  },

  setApprovalResponse: (
    solicitationId: number,
    solicitationApprovalUpdate: SolicitationDocumentationApprovalUpdateDTO,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpSolicitationDocumentationApproval.getEndpoint(solicitationId),
      solicitationApprovalUpdate,
    );
  },
};
