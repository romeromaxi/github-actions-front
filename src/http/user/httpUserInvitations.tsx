import { CompanyUserInvitation } from '../../types/user/userInvitation';
import { HttpAxiosRequest } from '../httpAxiosBase';
import { BaseResponse } from '../../types/baseEntities';

export const HttpUserInvitations = {
  getEndpoint: (url: string = ''): string => `/usuarios/invitaciones${url}`,

  getCompanyInvitations: (): Promise<CompanyUserInvitation[]> => {
    return HttpAxiosRequest.get(HttpUserInvitations.getEndpoint('/empresas'));
  },

  acceptInvitation: (userInvitationId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpUserInvitations.getEndpoint(`/empresas/${userInvitationId}`),
      { codModulo: 1, codOrigen: 1 },
    );
  },

  rejectInvitation: (userInvitationId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpUserInvitations.getEndpoint(`/empresas/${userInvitationId}/rechazar`),
      { codModulo: 1, codOrigen: 1 },
    );
  },

  cancelInvitation: (userInvitationId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.deleteWithBody(
        HttpUserInvitations.getEndpoint(`/empresas/${userInvitationId}`),
        { codModulo: 1, codOrigen: 1 },
    );
  },

  rejectInvitationAsResponsible: (companyId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
        HttpUserInvitations.getEndpoint(`/empresas/responsable/${companyId}/rechazar`),
        { codModulo: 1, codOrigen: 1 },
    );
  },
};
