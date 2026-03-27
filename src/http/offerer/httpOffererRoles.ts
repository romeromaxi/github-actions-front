import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  OffererRole,
  OffererRoleFields,
  OffererRolePost,
} from 'types/offerer/rolesData';
import {BaseResponse, EntityWithIdAndDescription} from 'types/baseEntities';
import { OffererSummaryTotalsView } from '../../types/offerer/offererData';

export const HttpOffererRoles = {
  getEndpoint: (offererId: number, url: string = ''): string =>
    `oferentes/${offererId}/usuarios${url}`,

  getListByOffererId: (offererId: number): Promise<OffererRole[]> => {
    return HttpAxiosRequest.get(HttpOffererRoles.getEndpoint(offererId));
  },

  updateRole: (
    offererId: number,
    userId: number,
    form: OffererRolePost,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.put(
      HttpOffererRoles.getEndpoint(offererId, `/${userId}`),
      {
        [OffererRoleFields.GroupIds]:
          form[OffererRoleFields.GroupIds].length !== 0
            ? form[OffererRoleFields.GroupIds]
            : [],
        [OffererRoleFields.WorkTeamIds]:
          form[OffererRoleFields.WorkTeamIds].length !== 0
            ? form[OffererRoleFields.WorkTeamIds]
            : [],
        [OffererRoleFields.OriginId]: form[OffererRoleFields.OriginId],
        [OffererRoleFields.Sector]: form[OffererRoleFields.Sector],
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  setUserAsAfipResponsible: (offererId: number): Promise<void> => {
    return HttpAxiosRequest.post(
      HttpOffererRoles.getEndpoint(offererId, '/responsable'),
      {
        codModulo: 1,
      },
    );
  },

  delete: (offererId: number, userId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.deleteWithBody(
      HttpOffererRoles.getEndpoint(offererId, `/${userId}`),
      { codModulo: 1 },
    );
  },

  getSummaryTotals: (offererId: number): Promise<OffererSummaryTotalsView> => {
    return HttpAxiosRequest.get(
      HttpOffererRoles.getEndpoint(offererId, `/totales`),
    );
  },

  getRolesByLoggedUser: (offererId: number): Promise<string> =>
    HttpAxiosRequest.get(
      HttpOffererRoles.getEndpoint(offererId, '/relaciones'),
    ),
    
  getMailInvitations: (offererId: number) : Promise<EntityWithIdAndDescription[]> => {
      return HttpAxiosRequest.get(
          HttpOffererRoles.getEndpoint(offererId, '/invitados')
      )
  }
};
