import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  OffererRoleFields,
  OffererRoleInvitationPost,
  OffererRoleInvitationPostFields,
  RoleInvitation,
} from 'types/offerer/rolesData';
import { BaseResponse } from 'types/baseEntities';

export const HttpOffererRolesInvitation = {
  getEndpoint: (offererId: number, url: string = ''): string =>
    `oferente/${offererId}/invitaciones${url}`,

  getPendingInvitations: (offererId: number): Promise<RoleInvitation[]> => {
    return HttpAxiosRequest.get(
      HttpOffererRolesInvitation.getEndpoint(offererId),
    );
  },

  sendInvitation: (
    offererId: number,
    roleInvitationPost: OffererRoleInvitationPost,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpOffererRolesInvitation.getEndpoint(offererId),
      {
        ...roleInvitationPost,
        [OffererRoleFields.GroupIds]:
          roleInvitationPost[OffererRoleInvitationPostFields.GroupIds]
            .length !== 0
            ? roleInvitationPost[OffererRoleInvitationPostFields.GroupIds]
            : [],
        codModulo: 1,
      },
    );
  },
};
