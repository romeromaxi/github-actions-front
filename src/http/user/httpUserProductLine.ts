import { HttpAxiosRequest } from '../httpAxiosBase';
import { ProductLineView } from 'types/lines/productLineData';

export const HttpUserProductLine = {
  getEndpoint: (url: string): string => `/usuarios/producto-lineas${url}`,

  getSuggestions: (): Promise<ProductLineView[]> =>
    HttpAxiosRequest.get(HttpUserProductLine.getEndpoint('/sugerencias')),

  getNewness: (): Promise<ProductLineView[]> =>
    HttpAxiosRequest.get(HttpUserProductLine.getEndpoint('/novedades')),
};
