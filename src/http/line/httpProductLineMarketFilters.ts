import { HttpAxiosRequest } from 'http/httpAxiosBase';
import { ProductLineFilterOption } from 'types/lines/productLineData';
import { EntityWithIdAndDescriptionQuantity } from 'types/baseEntities';
import { LineProductField } from '../../types/lines/productLineAttibutesData';

export const HttpProductLineMarketFilters = {
  getEndpoint: (url: string = ''): string => `producto-lineas/filtros${url}`,

  getOfferers: (
    filter: ProductLineFilterOption,
  ): Promise<EntityWithIdAndDescriptionQuantity[]> =>
    HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpProductLineMarketFilters.getEndpoint(`/oferentes`),
      filter,
    ),

  getCurrencies: (
    filter: ProductLineFilterOption,
  ): Promise<EntityWithIdAndDescriptionQuantity[]> =>
    HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpProductLineMarketFilters.getEndpoint('/monedas'),
      filter,
    ),

  getRatesTypes: (
    filter: ProductLineFilterOption,
  ): Promise<EntityWithIdAndDescriptionQuantity[]> =>
    HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpProductLineMarketFilters.getEndpoint('/tasa-tipos'),
      filter,
    ),

  getAmortizationTypes: (
    filter: ProductLineFilterOption,
  ): Promise<EntityWithIdAndDescriptionQuantity[]> =>
    HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpProductLineMarketFilters.getEndpoint('/amortizacion-tipos'),
      filter,
    ),

  getAfipSectors: (
    filter: ProductLineFilterOption,
  ): Promise<EntityWithIdAndDescriptionQuantity[]> =>
    HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpProductLineMarketFilters.getEndpoint('/afip-sectores'),
      filter,
    ),

  getProvinces: (
    filter: ProductLineFilterOption,
  ): Promise<EntityWithIdAndDescriptionQuantity[]> =>
    HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpProductLineMarketFilters.getEndpoint('/provincias'),
      filter,
    ),

  getAfipSection: (
    filter: ProductLineFilterOption,
  ): Promise<EntityWithIdAndDescriptionQuantity[]> =>
    HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpProductLineMarketFilters.getEndpoint('/afip-tramos'),
      filter,
    ),

  getAfipTaxConditions: (
    filter: ProductLineFilterOption,
  ): Promise<EntityWithIdAndDescriptionQuantity[]> =>
    HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpProductLineMarketFilters.getEndpoint('/afip-condiciones'),
      filter,
    ),

  getCheckIssuer: (
    filter: ProductLineFilterOption,
  ): Promise<EntityWithIdAndDescriptionQuantity[]> =>
    HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpProductLineMarketFilters.getEndpoint('/cheques/emisores'),
      filter,
    ),

  getCheckTypes: (
    filter: ProductLineFilterOption,
  ): Promise<EntityWithIdAndDescriptionQuantity[]> =>
    HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpProductLineMarketFilters.getEndpoint('/cheques/tipos'),
      filter,
    ),

  getProductLinesFields: (
    filter: ProductLineFilterOption,
  ): Promise<LineProductField[]> =>
    HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpProductLineMarketFilters.getEndpoint('/campos'),
      filter,
    ),

  getSgrs: (
      filter: ProductLineFilterOption,
  ): Promise<EntityWithIdAndDescriptionQuantity[]> =>
      HttpAxiosRequest.getWithQueryParamsSerializer(
          HttpProductLineMarketFilters.getEndpoint('/entidades-financieras/sgrs'),
          filter,
      ),

  getAlycs: (
      filter: ProductLineFilterOption,
  ): Promise<EntityWithIdAndDescriptionQuantity[]> =>
      HttpAxiosRequest.getWithQueryParamsSerializer(
          HttpProductLineMarketFilters.getEndpoint('/entidades-financieras/alycs'),
          filter,
      ),

  getBanks: (
      filter: ProductLineFilterOption,
  ): Promise<EntityWithIdAndDescriptionQuantity[]> =>
      HttpAxiosRequest.getWithQueryParamsSerializer(
          HttpProductLineMarketFilters.getEndpoint('/entidades-financieras/bancarias'),
          filter,
      ),
};
