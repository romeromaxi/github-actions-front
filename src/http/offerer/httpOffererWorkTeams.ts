import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  BaseResponse,
  EntityWithIdAndDescription,
} from '../../types/baseEntities';
import {
  OffererWorkTeamForm,
  OffererWorkTeamRelationship,
  OffererWorkTeamView,
} from '../../types/offerer/offererSolicitationData';

export const HttpOffererWorkTeams = {
  getEndpoint: (offererId: number, url: string): string =>
    `oferente/${offererId}/equipo-trabajo${url}`,

  getListByOffererId: (offererId: number): Promise<OffererWorkTeamView[]> => {
    return HttpAxiosRequest.get(
      HttpOffererWorkTeams.getEndpoint(offererId, ''),
    );
  },

  getListSummaryByOffererId: (
    offererId: number,
  ): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpOffererWorkTeams.getEndpoint(offererId, '/resumen'),
    );
  },

  getUserRelationshipsByWorkTeamId: (
    offererId: number,
    offererWorkTeamId: number,
  ): Promise<OffererWorkTeamRelationship[]> => {
    return HttpAxiosRequest.get(
      HttpOffererWorkTeams.getEndpoint(
        offererId,
        `/${offererWorkTeamId}/usuarios`,
      ),
    );
  },

  getProductLinesByWorkTeamId: (
    offererId: number,
    offererWorkTeamId: number,
  ): Promise<OffererWorkTeamRelationship[]> => {
    return HttpAxiosRequest.get(
      HttpOffererWorkTeams.getEndpoint(
        offererId,
        `/${offererWorkTeamId}/producto-lineas`,
      ),
    );
  },

  update: (
    offererId: number,
    offererWorkTeamId: number,
    offererWorkTeamForm: OffererWorkTeamForm,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.put(
      HttpOffererWorkTeams.getEndpoint(offererId, `/${offererWorkTeamId}`),
      offererWorkTeamForm,
    );
  },

  insert: (
    offererId: number,
    offererWorkTeamForm: OffererWorkTeamForm,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpOffererWorkTeams.getEndpoint(offererId, ''),
      offererWorkTeamForm,
    );
  },

  deleteWorkTeam: (
    offererId: number,
    offererWorkTeamId: number,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.delete(
      HttpOffererWorkTeams.getEndpoint(offererId, `/${offererWorkTeamId}`),
    );
  },

  getListByLoggedUser: (offererId: number): Promise<OffererWorkTeamView[]> => {
    return HttpAxiosRequest.get(
      HttpOffererWorkTeams.getEndpoint(offererId, `/usuarios`),
    );
  },
};
