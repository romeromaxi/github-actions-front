import { HttpAxiosRequest } from '../httpAxiosBase';
import { BaseResponse } from '../../types/baseEntities';
import {
  SolicitationApprovalUpdateDTO,
  SolicitationApprovalViewDTO,
} from '../../types/solicitations/solicitationApprovalData';

export const HttpSolicitationApproval = {
  getEndpoint: (solicitationId: number, url: string = ''): string =>
    `solicitudes/${solicitationId}/aprobaciones${url}`,

  getActualBySolicitationId: (
    solicitationId: number,
  ): Promise<SolicitationApprovalViewDTO> => {
    return HttpAxiosRequest.get(
      HttpSolicitationApproval.getEndpoint(solicitationId),
    );
  },

  setApprovalResponse: (
    solicitationId: number,
    solicitationApprovalUpdate: SolicitationApprovalUpdateDTO,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpSolicitationApproval.getEndpoint(solicitationId),
      solicitationApprovalUpdate,
    );
  },
};
