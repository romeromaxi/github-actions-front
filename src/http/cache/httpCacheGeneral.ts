import { HttpAxiosRequest } from '../httpAxiosBase';
import { BaseResponse, EntityWithIdAndDescription } from 'types/baseEntities';
import {
  MarketCategoryInsertDTO,
  MarketCategoryViewDTO,
} from '../../types/market/marketCategoryData';
import { Country } from '../../types/general/generalAddressData';
import {ProductLineTemplate} from "../../types/productLineTemplate/ProductLineTemplateData";

export const HttpCacheGeneral = {
  getEndpoint: (url: string): string => `cache/general${url}`,

  getRangeTerritories: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCacheGeneral.getEndpoint('/ambitos-territoriales'),
    );
  },

  getAfipSection: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(HttpCacheGeneral.getEndpoint('/afip-tramos'));
  },

  getAfipTaxConditions: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCacheGeneral.getEndpoint('/afip-condiciones'),
    );
  },

  getAfipSectors: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(HttpCacheGeneral.getEndpoint('/afip-sectores'));
  },

  getCurrencies: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(HttpCacheGeneral.getEndpoint('/monedas'));
  },

  getMarketCategories: (): Promise<MarketCategoryViewDTO[]> => {
    return HttpAxiosRequest.get(
      HttpCacheGeneral.getEndpoint('/menucategorias'),
    );
  },

  insertMarketCategory: (
    category: MarketCategoryInsertDTO,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCacheGeneral.getEndpoint('/menucategorias'),
      { ...category },
    );
  },

  updateMarketCategory: (
    category: MarketCategoryInsertDTO,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.put(
      HttpCacheGeneral.getEndpoint('/menucategorias'),
      { ...category },
    );
  },

  getCountries: (): Promise<Country[]> => {
    return HttpAxiosRequest.get(HttpCacheGeneral.getEndpoint('/paises'));
  },

  getCheckIssuer: (): Promise<EntityWithIdAndDescription[]> =>
    HttpAxiosRequest.get(HttpCacheGeneral.getEndpoint('/cheques/emisores')),

  getCheckTypes: (): Promise<EntityWithIdAndDescription[]> =>
    HttpAxiosRequest.get(HttpCacheGeneral.getEndpoint('/cheques/tipos')),

  getAssetsTypes: (): Promise<EntityWithIdAndDescription[]> =>
    HttpAxiosRequest.get(HttpCacheGeneral.getEndpoint('/bienes/tipos')),
  
  getProductLineFields: () : Promise<ProductLineTemplate[]> =>
      HttpAxiosRequest.get(HttpCacheGeneral.getEndpoint('/plantillas-configuracion'))
};
