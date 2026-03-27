import { HttpAxiosRequest } from 'http/httpAxiosBase';
import {
    GetIntermediateDestinyDTOFields,
    GetIntermediateNeedDTOFields,
    GetIntermediateInstrumentDTOFields,
    GetIntermediateInstrumentTypeDTOFields,
    GetIntermediateServiceDTOFields, IntermediateDataView,
    IntermediateInstrumentView,
    IntermediateProductSearchFields,
    IntermediateProductTotalsView,
    IntermediateProductView, IntermediateDataNeedView,
} from 'types/market/marketIntermediateData';
import { EntityWithIdAndDescription } from 'types/baseEntities';

export const HttpMarketIntermediate = {
  getEndpoint: (url: string = ''): string => `/market/intermedia${url}`,

  getIntermediateServices: (
    destinyCodeList?: number[],
    instrumentCodeList?: number[],
    needsCodeList?: number[],
  ): Promise<IntermediateDataView[]> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpMarketIntermediate.getEndpoint('/servicios'),
      {
        [GetIntermediateServiceDTOFields.DestinyCodeList]: destinyCodeList,
        [GetIntermediateServiceDTOFields.InstrumentCodeList]: instrumentCodeList,
        [GetIntermediateServiceDTOFields.NeedCodeList]: needsCodeList,
      },
    );
  },

  getIntermediateDestinies: (
    serviceCodeList?: number[],
    instrumentCodeList?: number[],
    needsCodeList?: number[],
  ): Promise<IntermediateDataView[]> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpMarketIntermediate.getEndpoint('/destinos'),
      {
        [GetIntermediateDestinyDTOFields.ServiceCodeList]: serviceCodeList,
        [GetIntermediateDestinyDTOFields.InstrumentCodeList]: instrumentCodeList,
        [GetIntermediateDestinyDTOFields.NeedCodeList]: needsCodeList,
      },
    );
  },

  getIntermediateNeeds: (
      destinyCodeList?: number[],
      serviceCodeList?: number[], 
      instrumentCodeList?: number[]
  ): Promise<IntermediateDataNeedView[]> => 
    HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpMarketIntermediate.getEndpoint('/necesidades'), 
      {
        [GetIntermediateNeedDTOFields.DestinyCodeList]: destinyCodeList,
        [GetIntermediateNeedDTOFields.ServiceCodeList]: serviceCodeList,
        [GetIntermediateNeedDTOFields.InstrumentCodeList]: instrumentCodeList,
      },
    ),

  getIntermediateInstrumentTypes: (
    destinyCodeList?: number[],
    serviceCodeList?: number[],
    needsCodeList?: number[],
  ): Promise<IntermediateDataView[]> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpMarketIntermediate.getEndpoint('/tipos-instrumento'),
      {
        [GetIntermediateInstrumentTypeDTOFields.DestinyCodeList]: destinyCodeList,
        [GetIntermediateInstrumentTypeDTOFields.ServiceCodeList]: serviceCodeList,
        [GetIntermediateInstrumentTypeDTOFields.NeedCodeList]: needsCodeList,
      },
    );
  },

  getIntermediateInstruments: (
    destinyCodeList?: number[],
    serviceCodeList?: number[],
    instrumentTypesCodeList?: number[],
  ): Promise<IntermediateInstrumentView[]> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpMarketIntermediate.getEndpoint('/instrumentos'),
      {
        [GetIntermediateInstrumentDTOFields.DestinyCodeList]: destinyCodeList,
        [GetIntermediateInstrumentDTOFields.ServiceCodeList]: serviceCodeList,
        [GetIntermediateInstrumentDTOFields.InstrumentTypeCodeList]:
          instrumentTypesCodeList,
      },
    );
  },

  getProducts: (
    destinyCodeList?: number[],
    serviceCodeList?: number[],
    instrumentTypeCode?: number[],
  ): Promise<IntermediateProductView[]> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpMarketIntermediate.getEndpoint('/productos'),
      {
        [IntermediateProductSearchFields.ProductDestinyCodeList]:
          destinyCodeList,
        [IntermediateProductSearchFields.ProductServiceCodeList]:
          serviceCodeList,
        [IntermediateProductSearchFields.ProductInstrumentTypeCodeList]:
          instrumentTypeCode,
      },
    );
  },

  getProductsWithDescription: (
    destinyCodeList?: number[],
    serviceCodeList?: number[],
    instrumentTypeCodeList?: number,
  ): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.getWithQueryParams(
      HttpMarketIntermediate.getEndpoint('/productos'),
      {
        [IntermediateProductSearchFields.ProductDestinyCodeList]:
          destinyCodeList,
        [IntermediateProductSearchFields.ProductServiceCodeList]:
          serviceCodeList,
        [IntermediateProductSearchFields.ProductInstrumentTypeCodeList]:
          instrumentTypeCodeList,
      },
    );
  },

  getTotals: (
    destinyCodeList?: number[],
    serviceCodeList?: number[],
    instrumentTypeCode?: number[],
  ): Promise<IntermediateProductTotalsView> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpMarketIntermediate.getEndpoint('/productos/totales'),
      {
        [IntermediateProductSearchFields.ProductDestinyCodeList]:
          destinyCodeList,
        [IntermediateProductSearchFields.ProductServiceCodeList]:
          serviceCodeList,
        [IntermediateProductSearchFields.ProductInstrumentTypeCodeList]:
          instrumentTypeCode,
      },
    );
  },
};
