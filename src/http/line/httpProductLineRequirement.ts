import { HttpAxiosRequest } from '../httpAxiosBase';
import { ProductLineRequirementView } from 'types/lines/productLineData';

export const HttpProductLineRequirement = {
  getEndpoint: (productLineId: number, url: string = ''): string =>
    `producto-lineas/${productLineId}/requerimientos${url}`,

  getByProductLine: (
    productLineId: number,
  ): Promise<ProductLineRequirementView[]> => {
    return HttpAxiosRequest.get(
      HttpProductLineRequirement.getEndpoint(productLineId),
    );
  },
};
