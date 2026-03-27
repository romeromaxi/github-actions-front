import { HttpAxiosRequest } from 'http/httpAxiosBase';
import { RequirementView } from 'types/general/generalRequirementData';
import { EntityWithIdAndDescription } from '../../types/baseEntities';

export const HttpCacheRequirement = {
  getEndpoint: (url: string = ''): string => `cache/requerimientos${url}`,

  getAllRequirement: (): Promise<RequirementView[]> => {
    return HttpAxiosRequest.get(HttpCacheRequirement.getEndpoint());
  },

  getRequirementsClassifications: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCacheRequirement.getEndpoint('/clasificaciones'),
    );
  },

  getPrequalificationRequirement: (): Promise<RequirementView[]> => {
    return HttpAxiosRequest.get(
      HttpCacheRequirement.getEndpoint('/precalificaciones'),
    );
  },
};
