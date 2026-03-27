import { HttpAxiosRequest } from 'http/httpAxiosBase';
import {
  CompanyLineStatusViewDTO,
  ProductLineSummaryShoppingCart,
  ProductLineView,
} from 'types/lines/productLineData';
import {BaseRequestFields, BaseResponse, BaseResponseWithData} from '../../types/baseEntities';
import { CompanyTotalsShoppingCart } from 'types/market/marketData';

export const HttpMarketShoppingCart = {
  getEndpoint: (url: string = ''): string => `market/carrito${url}`,

  getCompanyTotalsByUser: (): Promise<CompanyTotalsShoppingCart[]> => {
    return HttpAxiosRequest.get(
      HttpMarketShoppingCart.getEndpoint(`/empresas`),
    );
  },

  getByCompanyId: (companyId: number): Promise<ProductLineView[]> => {
    return HttpAxiosRequest.get(
      HttpMarketShoppingCart.getEndpoint(`/empresas/${companyId}`),
    );
  },

  getAvailabilityList: (
    productLineId: number,
  ): Promise<CompanyLineStatusViewDTO[]> => {
    return HttpAxiosRequest.get(
      HttpMarketShoppingCart.getEndpoint(`/${productLineId}/empresas`),
    );
  },

  getSummary: (): Promise<ProductLineSummaryShoppingCart> => {
    return HttpAxiosRequest.get(HttpMarketShoppingCart.getEndpoint('/resumen'));
  },

  addLine: (
    productLineId: number,
    companyId?: number,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(HttpMarketShoppingCart.getEndpoint(), {
      idEmpresa: companyId,
      codProductoLinea: productLineId,
      codModulo: 1,
      codOrigen: 1,
    });
  },
  
  addLineToSeveralCompanies: (productLineId: number, companiesIds: number[]) : Promise<BaseResponseWithData<number[]>> => {
    return HttpAxiosRequest.post(
        HttpMarketShoppingCart.getEndpoint(`/${productLineId}`),
        {
          idsEmpresas: companiesIds,
          codOrigen: 1,
          codModulo: 1
        }
    )
  },

  removeLineUniqueCompany: (productLineId: number): Promise<any> => {
    return HttpAxiosRequest.deleteWithBody(
      HttpMarketShoppingCart.getEndpoint(`/${productLineId}`),
      {
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  removeLine: (productLineId: number, companyId: number): Promise<any> => {
    return HttpAxiosRequest.deleteWithBody(
      HttpMarketShoppingCart.getEndpoint(`/${productLineId}/${companyId}`),
      {
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },
  
  removeAll: (companyId: number) : Promise<BaseResponse> => 
      HttpAxiosRequest.deleteWithBody(
          HttpMarketShoppingCart.getEndpoint(`/${companyId}/todas`), {
            [BaseRequestFields.ModuleCode]: 1,
            [BaseRequestFields.OriginCode]: 1
          })
};
