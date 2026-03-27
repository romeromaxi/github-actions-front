import { HttpAxiosRequest } from 'http/httpAxiosBase';
import { ProductLineView } from 'types/lines/productLineData';
import { BaseResponse } from 'types/baseEntities';

export const HttpMarketWishList = {
  getEndpoint: (url: string = ''): string => `market/favoritos${url}`,

  getUserInfo: (): Promise<ProductLineView[]> => {
    return HttpAxiosRequest.get(HttpMarketWishList.getEndpoint());
  },

  addLine: (productLineId: number): Promise<any> => {
    return HttpAxiosRequest.post(HttpMarketWishList.getEndpoint(), {
      codProductoLinea: productLineId,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  removeLine: (productLineId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.deleteWithBody(HttpMarketWishList.getEndpoint(), {
      codProductoLinea: productLineId,
      codModulo: 1,
      codOrigen: 1,
    });
  },
};
