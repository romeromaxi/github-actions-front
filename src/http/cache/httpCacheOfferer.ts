import {
  EntityWithIdAndDescription, EntityWithIdAndDescriptionAndDetail,
  EntityWithIdAndDescriptionFields,
} from '../../types/baseEntities';
import { HttpAxiosRequest } from '../httpAxiosBase';

export const HttpCacheOfferer = {
  getEndpoint: (url: string): string => `cache/oferente${url}`,

  getOffererTypes: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(HttpCacheOfferer.getEndpoint('/tipos'));
  },

  getRolesTypes: (): Promise<EntityWithIdAndDescriptionAndDetail[]> => {
    return HttpAxiosRequest.get(
      HttpCacheOfferer.getEndpoint('/usuario/relaciones'),
    );
  },

  getResponsibles: (offererId: number): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
        HttpCacheOfferer.getEndpoint(`/usuario/${offererId}/responsables`),
    );
  },

  getWorkTeams: (offererId: number): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
        HttpCacheOfferer.getEndpoint(`/usuario/${offererId}/equipos-trabajo`),
    );
  },

  getRelationshipTypesCorporates: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCacheOfferer.getEndpoint('/persona/societarias'),
    );
  },
};
