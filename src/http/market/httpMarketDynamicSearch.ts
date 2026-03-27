import {
  MarketIntermadiateDynamicSearch
} from '../../types/market/marketIntermediateData';
import { HttpAxiosRequest } from '../httpAxiosBase';

export const HttpMarketDynamicSearch = {
  getEndpoint: (url: string = ''): string =>
    `/market/busquedas-dinamicas${url}`,

  getByGuid: (guid: string): Promise<MarketIntermadiateDynamicSearch> => {
    return HttpAxiosRequest.get(
      HttpMarketDynamicSearch.getEndpoint(`/${guid}`),
    );
  }
};
