import { EntityWithIdAndDescription } from '../../types/baseEntities';
import { HttpAxiosRequest } from '../httpAxiosBase';
import {ProductLineApprovalResultView} from '../../types/lines/productLineApprovalData';

export const HttpCacheProductLine = {
  getEndpoint: (url: string): string => `cache/producto-lineas${url}`,

  getStatesType: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(HttpCacheProductLine.getEndpoint('/estados'));
  },

  getApprovalResults: (): Promise<ProductLineApprovalResultView[]> =>
    HttpAxiosRequest.get(
      HttpCacheProductLine.getEndpoint('/aprobaciones/resultados'),
    ),
  
  getProductLinesByOfferer: (offererId: number): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCacheProductLine.getEndpoint(
          `/oferentes/${offererId}`
      )
    );
  }
};
