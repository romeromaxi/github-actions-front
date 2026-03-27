import { HttpAxiosRequest } from '../httpAxiosBase';

import { BaseResponse, EntityListWithPagination } from 'types/baseEntities';
import {
  ProductLineOffererFilter,
  ProductLineTotalsView,
  ProductLineUpdate, ProductLineViewDetail, ProductLineViewSummaryWithPublicationData,
  RequestPublicationData,
} from 'types/lines/productLineData';

export const HttpOffererProductLine = {
  getEndpoint: (offererId: number, url: string = ''): string =>
    `oferente/${offererId}/producto-lineas${url}`,

  insertAndGetNewId: (
    offererId: number,
    productCode: number,
    lineName: string,
    lineDescription: string,
    offererWorkTeamsId: number | undefined = undefined,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpOffererProductLine.getEndpoint(offererId),
      {
        codProducto: productCode,
        descProductoLinea: lineName,
        descProductoLineaLarga: lineDescription,
        idOferenteEquipoTrabajo: offererWorkTeamsId,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  update: (
    offererId: number,
    productLineId: number,
    line: ProductLineUpdate,
  ): Promise<void> => {
    return HttpAxiosRequest.put(
      HttpOffererProductLine.getEndpoint(offererId, `/${productLineId}`),
      {
        ...line,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  getById: (offererId: number, productLineId: number): Promise<ProductLineViewDetail> => {
    return HttpAxiosRequest.get(
      HttpOffererProductLine.getEndpoint(offererId, `/${productLineId}`),
    );
  },

  getListByOffererId: (
    offererId: number,
    filter: ProductLineOffererFilter,
  ): Promise<EntityListWithPagination<ProductLineViewSummaryWithPublicationData>> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpOffererProductLine.getEndpoint(offererId),
      { ...filter },
    );
  },

  delete: (offererId: number, productLineId: number): Promise<void> => {
    return HttpAxiosRequest.post(
      HttpOffererProductLine.getEndpoint(
        offererId,
        `/${productLineId}/inactivar`,
      ),
      {},
    );
  },

  requestPublication: (
    offererId: number,
    productLineId: number,
    requestPublication: RequestPublicationData,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpOffererProductLine.getEndpoint(
        offererId,
        `/${productLineId}/solicitar-publicacion`,
      ),
      {
        ...requestPublication,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  unsubscribePublication: (
    offererId: number,
    productLineId: number,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpOffererProductLine.getEndpoint(
        offererId,
        `/${productLineId}/bajar-publicacion`,
      ),
      {},
    );
  },

  getTotalProductLinesByOfferer: (
    offererId: number,
  ): Promise<ProductLineTotalsView[]> =>
    HttpAxiosRequest.get(
      HttpOffererProductLine.getEndpoint(offererId, `/totales`),
    ),
};
