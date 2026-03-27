import { HttpAxiosRequest } from 'http/httpAxiosBase';

import {
  EntityWithIdAndDescription,
  EntityWithIdAndDescriptionFields,
} from 'types/baseEntities';
import { PersonClassification } from 'types/person/personDataCache';

export const HttpCachePerson = {
  getEndpoint: (url: string): string => `cache/persona${url}`,

  getTypes: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(HttpCachePerson.getEndpoint('/tipos'));
  },

  getGenderTypes: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(HttpCachePerson.getEndpoint('/generos'));
  },

  getDocumentTypes: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCachePerson.getEndpoint('/documento-tipos'),
    );
  },

  getAfipResponsiblityTypes: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCachePerson.getEndpoint('/afip/reponsable-tipos'),
    );
  },

  getPersonCompanyClassification: (): Promise<PersonClassification[]> => {
    return HttpAxiosRequest.get(
      HttpCachePerson.getEndpoint('/clasificacion/juridica'),
    );
  },

  getMaritalStatusTypes: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCachePerson.getEndpoint('/estados-civiles'),
    );
  },

  getStates: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCachePerson.getEndpoint('/validaciones/estados'),
    );
  },
};
