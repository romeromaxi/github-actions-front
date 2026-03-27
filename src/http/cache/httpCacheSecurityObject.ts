import { HttpAxiosRequest } from '../httpAxiosBase';
import {DictionarySecurityObject, SecurityObjectDetail, SecurityObjectGroupedDetail} from 'types/security';
import {
  BaseRequestFields,
  BaseResponse,
  EntityWithIdAndDescription,
} from '../../types/baseEntities';

export const HttpCacheSecurityObject = {
  getEndpoint: (url: string = ''): string => `cache/objetos/seguridad${url}`,

  getByUser: (): Promise<DictionarySecurityObject> =>
    HttpAxiosRequest.get(HttpCacheSecurityObject.getEndpoint()),

  getByUserAndCompany: (companyId: number): Promise<DictionarySecurityObject> =>
    HttpAxiosRequest.get(
      HttpCacheSecurityObject.getEndpoint(`/empresas/${companyId}`),
    ),

  getObjectsByIdProfile: (
    idProfile: number,
  ): Promise<SecurityObjectDetail[]> => {
    return HttpAxiosRequest.get(
      HttpCacheSecurityObject.getEndpoint(`/${idProfile}`),
    );
  },

  getProfiles: (): Promise<EntityWithIdAndDescription[]> =>
    HttpAxiosRequest.get(HttpCacheSecurityObject.getEndpoint('/perfiles')),
    
  getGroupedObjects: (idProfile: number) : Promise<SecurityObjectGroupedDetail[]> => {
      return HttpAxiosRequest.get(
          HttpCacheSecurityObject.getEndpoint(`/${idProfile}/agrupados`)
      )
  },
    
  updateProfilePermissions: (
    idProfile: number,
    idsSecurityObjects: number[],
  ): Promise<BaseResponse> =>
    HttpAxiosRequest.post(
      HttpCacheSecurityObject.getEndpoint(`/${idProfile}`),
      {
        idsObjetoSeguridad: idsSecurityObjects,
        [BaseRequestFields.ModuleCode]: 1,
        [BaseRequestFields.OriginCode]: 1,
      },
    ),
};
