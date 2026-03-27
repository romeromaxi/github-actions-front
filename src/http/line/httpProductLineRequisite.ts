import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  ProductLineRequisiteDescriptionView,
  ProductLineRequisiteDetailView,
  ProductLineRequisiteView,
} from 'types/lines/productLineData';

export const HttpProductLineRequisite = {
  getEndpoint: (productLineId: number, url: string = ''): string =>
    `producto-lineas/${productLineId}/requisitos${url}`,

  getByProductLine: (
    productLineId: number,
  ): Promise<ProductLineRequisiteDetailView[]> => {
    return HttpAxiosRequest.get(
      HttpProductLineRequisite.getEndpoint(productLineId),
    );
  },

  getRequisiteDescriptionByProductLine: (
    productLineId: number,
  ): Promise<ProductLineRequisiteDescriptionView[]> => {
    return HttpAxiosRequest.get(
      HttpProductLineRequisite.getEndpoint(productLineId, `/descripciones`),
    );
  },
};
