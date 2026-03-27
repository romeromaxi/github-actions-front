import { HttpAxiosRequest } from '../httpAxiosBase';

export const HttpMarketLineViewDetail = {
  getEndpoint: (url: string = ''): string => `market/lineas${url}`,

  recordLineDetailViewed: (uniLineId: string): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpMarketLineViewDetail.getEndpoint(`/${uniLineId}/detalle-visualizacion`),
      {},
    );
  },
};
