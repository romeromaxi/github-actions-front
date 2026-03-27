import { HttpAxiosRequest } from '../httpAxiosBase';

import { UserInvitationFromCompany } from 'types/invitations/invitationData';
import {CompanyUserInvitation} from "../../types/user/userInvitation";
import {UserResponseInvitation} from "../../types/user";
import {BaseResponse} from "../../types/baseEntities";

export const HttpInvitations = {
  getEndpoint: (url: string = ''): string => `usuarios/invitaciones${url}`,

  getPendingInvitationsFromCompanies: (): Promise<
    UserInvitationFromCompany[]
  > => {
    return HttpAxiosRequest.get(HttpInvitations.getEndpoint('/empresas'));
  },

  getSentInvitations: (): Promise<UserInvitationFromCompany[]> => {
    return HttpAxiosRequest.get(
      HttpInvitations.getEndpoint('/empresas/enviadas'),
    );
  },

  getPendingInvitationsAsResponsible: (): Promise<UserInvitationFromCompany[]> => {
    return HttpAxiosRequest.get(
        HttpInvitations.getEndpoint('/empresas/responsable'),
    );
  },

  acceptInvitationCompany: (invitationId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpInvitations.getEndpoint(`/empresas/${invitationId}`),
      { codModulo: 1, codOrigen: 1 },
    );
  },
  
  rejectInvitation: (userInvitationId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
        HttpInvitations.getEndpoint(`/empresas/${userInvitationId}/rechazar`),
        { codModulo: 1, codOrigen: 1 },
    );
  },
  
  insertQueryInvitation: (identifier: string) : Promise<UserResponseInvitation>  => {
    return HttpAxiosRequest.post(
        HttpInvitations.getEndpoint(),
        {
          guid: identifier,
          codModulo: 1,
          codOrigen: 1
        }
    )
  },
  
  getInvitationByGuid: (identifier: string) : Promise<CompanyUserInvitation> => {
    return HttpAxiosRequest.get(
        HttpInvitations.getEndpoint(`/${identifier}`)
    )
  }
};
