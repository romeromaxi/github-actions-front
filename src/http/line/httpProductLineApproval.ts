import { HttpAxiosRequest } from '../httpAxiosBase';
import { BaseResponse } from '../../types/baseEntities';
import {
  ProductLineApprovalUpdate,
  ProductLineApprovalView,
} from 'types/lines/productLineApprovalData';

export const HttpProductLineApproval = {
  getEndpoint: (productLineId: number, url: string = ''): string =>
    `producto-lineas/${productLineId}/aprobaciones${url}`,

  getActualByProductLineId: (
    productLineId: number,
  ): Promise<ProductLineApprovalView> =>
    HttpAxiosRequest.get(HttpProductLineApproval.getEndpoint(productLineId)),

  getHistoricListByProductLineId: (
    productLineId: number,
  ): Promise<ProductLineApprovalView[]> =>
    HttpAxiosRequest.get(
      HttpProductLineApproval.getEndpoint(productLineId, '/historia'),
    ),

  setApprovalResponse: (
    productLineId: number,
    productLineApprovalUpdate: ProductLineApprovalUpdate,
  ): Promise<BaseResponse> =>
    HttpAxiosRequest.post(
      HttpProductLineApproval.getEndpoint(productLineId),
      productLineApprovalUpdate,
    ),
};
