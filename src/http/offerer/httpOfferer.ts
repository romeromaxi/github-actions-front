import { HttpAxiosRequest } from '../httpAxiosBase';

import {
  Offerer,
  OffererFields,
  OffererQuaFilterSearch,
  OffererSummaryView,
  OffererViewDTO,
} from '../../types/offerer/offererData';
import {
  EntityListWithPagination,
  EntityWithIdAndDescription, EntityWithIdAndDescriptionFields, EntityWithIdFields,
} from '../../types/baseEntities';

export const HttpOfferer = {
  getEndpoint: (url: string): string => `oferentes${url}`,

  getOffererById: (id: number): Promise<Offerer> => {
    return HttpAxiosRequest.get(HttpOfferer.getEndpoint(`/${id}`));
  },

  getOffererByUser: (): Promise<OffererViewDTO> => {
    return HttpAxiosRequest.get(HttpOfferer.getEndpoint(''));
  },

  getOffererPaginatedList: (
    filter: OffererQuaFilterSearch,
  ): Promise<EntityListWithPagination<Offerer>> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpOfferer.getEndpoint('/busqueda'),
      { ...filter },
    );
  },

  getActiveOffererList: (): Promise<OffererSummaryView[]> => {
    return HttpAxiosRequest.get(HttpOfferer.getEndpoint('/activos/lista'));
  },

  getActiveOffererListForMulSel: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(HttpOfferer.getEndpoint('/activos/lista'))
        .then((offerers: OffererSummaryView[]) =>
            offerers.map(offerer => ({
              [EntityWithIdFields.Id]: offerer.id,
              [EntityWithIdAndDescriptionFields.Description]: offerer[OffererFields.BusinessName]
            }))
        );
  },

  updateWebsite: (offererId: number, website: string) => {
    return HttpAxiosRequest.put(HttpOfferer.getEndpoint(`/${offererId}/web`), {
      [OffererFields.Website]: website,
      codModulo: 1,
      codOrigen: 1,
    });
  },
};
