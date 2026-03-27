import { HttpAxiosRequest } from 'http/httpAxiosBase';

import { EntityWithIdAndDescription } from 'types/baseEntities';
import { Need, NeedInsert } from 'types/general/generalNeedData';
import { ProductLineRequisiteView } from 'types/lines/productLineData';
import {
  ProductDestiny,
  ProductDestinyInsert,
} from 'types/product/productdestinyData';
import {
  ProductServiceInsert,
  ProductService,
} from 'types/product/productserviceData';
import {
  Product,
  ProductAmortizationType,
  ProductPost,
  ProductRateType,
  ProductTemplate,
} from 'types/product/productData';
import {
  ProductInstrument,
  ProductInstrumentInsert,
} from 'types/product/productInstrumentData';
import {
  ProductClassification,
  ProductClassificationInsert,
} from 'types/product/productclassificationData';
import { ProductInstrumentType, ProductInstrumentTypeInsert } from '../../types/product/productInstrumentData';

export const HttpCacheProduct = {
  getEndpoint: (url: string = ''): string => `cache/producto${url}`,

  getList: (activesOnly: boolean): Promise<Product[]> => {
    return HttpAxiosRequest.getWithQueryParams(
      HttpCacheProduct.getEndpoint('/lista'),
      { soloActivos: activesOnly },
    );
  },

  getFilteredList: (
    serviceCode?: number,
    instrumentTypeCode?: number,
    instrumentCode?: number,
  ): Promise<Product[]> => {
    return HttpAxiosRequest.getWithQueryParams(
      HttpCacheProduct.getEndpoint('/listafiltrada'),
      {
        sinCodProductoServicio: serviceCode,
        intCodProductoInstrumentoTipo: instrumentTypeCode,
        intCodProductoInstrumento: instrumentCode,
      },
    );
  },

  getListByCompanyId: (companyId: number): Promise<Product[]> => {
    return HttpAxiosRequest.get(
      HttpCacheProduct.getEndpoint(`/empresas/${companyId}`),
    );
  },

  getListByOffererId: (offererId: number): Promise<Product[]> => {
    return HttpAxiosRequest.get(
      HttpCacheProduct.getEndpoint(`/oferentes/${offererId}`),
    );
  },

  insert: (product: ProductPost): Promise<number> => {
    return HttpAxiosRequest.post(HttpCacheProduct.getEndpoint(), {
      ...product,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  update: (productId: number, product: ProductPost): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpCacheProduct.getEndpoint(`/${productId}`),
      product,
    );
  },

  getClassification: (
    activesOnly: boolean,
  ): Promise<ProductClassification[]> => {
    return HttpAxiosRequest.getWithQueryParams(
      HttpCacheProduct.getEndpoint('/clasificacion'),
      { soloActivos: activesOnly },
    );
  },

  insertClassification: (
    productClassification: ProductClassificationInsert,
  ): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpCacheProduct.getEndpoint('/clasificacion'),
      productClassification,
    );
  },

  updateClassification: (
    productClassification: ProductClassificationInsert,
  ): Promise<any> => {
    return HttpAxiosRequest.put(
      HttpCacheProduct.getEndpoint('/clasificacion'),
      productClassification,
    );
  },

  getDestinies: (activesOnly: boolean = true): Promise<ProductDestiny[]> => {
    return HttpAxiosRequest.getWithQueryParams(
      HttpCacheProduct.getEndpoint('/destino'),
      { soloActivos: activesOnly },
    );
  },

  insertDestiny: (productDestiny: ProductDestinyInsert): Promise<any> => {
    return HttpAxiosRequest.post(HttpCacheProduct.getEndpoint('/destino'), {
      ...productDestiny,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  updateDestiny: (productDestiny: ProductDestinyInsert): Promise<any> => {
    return HttpAxiosRequest.put(HttpCacheProduct.getEndpoint('/destino'), {
      ...productDestiny,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  getServiceListByDestiny: (
    destinyId: number,
  ): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCacheProduct.getEndpoint(`/destino/${destinyId}/servicios`),
    );
  },

  getInstrumentListByDestiny: (
    destinyId: number,
  ): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCacheProduct.getEndpoint(`/destino/${destinyId}/instrumentos-tipos`),
    );
  },

  getServices: (activesOnly: boolean = true): Promise<ProductService[]> => {
    return HttpAxiosRequest.getWithQueryParams(
      HttpCacheProduct.getEndpoint('/servicio'),
      { soloActivos: activesOnly },
    );
  },

  getServicesByOffererId: (offererId: number): Promise<ProductService[]> => {
    return HttpAxiosRequest.get(
      HttpCacheProduct.getEndpoint(`/servicio/${offererId}`),
    );
  },

  insertService: (productService: ProductServiceInsert): Promise<any> => {
    return HttpAxiosRequest.post(HttpCacheProduct.getEndpoint('/servicio'), {
      ...productService,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  updateService: (productService: ProductServiceInsert): Promise<any> => {
    return HttpAxiosRequest.put(HttpCacheProduct.getEndpoint('/servicio'), {
      ...productService,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  getRatesTypes: (): Promise<ProductRateType[]> => {
    return HttpAxiosRequest.get(HttpCacheProduct.getEndpoint('/tasas-tipos'));
  },

  getAmortizationTypes: (): Promise<ProductAmortizationType[]> => {
    return HttpAxiosRequest.get(
      HttpCacheProduct.getEndpoint('/amortizaciones-tipos'),
    );
  },

  getSeniorityTypes: (): Promise<ProductTemplate[]> => {
    return HttpAxiosRequest.get(
      HttpCacheProduct.getEndpoint('/filtros/antiguedad'),
    );
  },

  getBillingTypes: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCacheProduct.getEndpoint('/filtros/facturacion'),
    );
  },

  getTemplates: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(HttpCacheProduct.getEndpoint('/plantillas'));
  },

  getInstrumentTypes: (activesOnly: boolean = true): Promise<ProductInstrumentType[]> => {
    return HttpAxiosRequest.getWithQueryParams(
      HttpCacheProduct.getEndpoint('/instrumentos/tipos'),
      { soloActivos: activesOnly }
    );
  },

  insertInstrumentType: (instrumentType: ProductInstrumentTypeInsert): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpCacheProduct.getEndpoint('/instrumentos/tipos'),
      instrumentType
    );
  },

  updateInstrumentType: (instrumentType: ProductInstrumentTypeInsert): Promise<any> => {
    return HttpAxiosRequest.put(
      HttpCacheProduct.getEndpoint('/instrumentos/tipos'),
      instrumentType
    );
  },

  /*getInstrumentTypesByProductService: (productServiceCode: number): Promise<EntityWithIdAndDescription[]> => {
        return HttpAxiosRequest.get(
            HttpCacheProduct.getEndpoint(`/instrumentos/${productServiceCode}/tipos`)
        );
    },*/

  getInstrumentsByType: (
    instrumentTypeCode: number,
  ): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
      HttpCacheProduct.getEndpoint(`/instrumentos/${instrumentTypeCode}`),
    );
  },

  getInstruments: (
    activesOnly: boolean = true,
    productServiceCode?: number,
  ): Promise<ProductInstrument[]> => {
    return HttpAxiosRequest.getWithQueryParams(
      HttpCacheProduct.getEndpoint('/instrumentos'),
      {
        soloActivos: activesOnly,
        sinCodProductoServicio: productServiceCode,
      },
    );
  },

  getActiveInstrumentsByProductService: (
    productServiceCode: number,
  ): Promise<ProductInstrument[]> => {
    return HttpCacheProduct.getInstruments(true, productServiceCode);
  },

  getInstrumentRelatedServiceCodesById: (
    productInstrumentId: number,
  ): Promise<number[]> => {
    return HttpAxiosRequest.get(
      HttpCacheProduct.getEndpoint(
        `/instrumentos/${productInstrumentId}/servicios`,
      ),
    );
  },

  insertInstrument: (
    productInstrument: ProductInstrumentInsert,
  ): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpCacheProduct.getEndpoint('/instrumentos'),
      {
        ...productInstrument,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  updateInstrument: (
    productInstrument: ProductInstrumentInsert,
  ): Promise<any> => {
    return HttpAxiosRequest.put(HttpCacheProduct.getEndpoint('/instrumentos'), {
      ...productInstrument,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  getNeeds: (activesOnly: boolean): Promise<Need[]> => {
    return HttpAxiosRequest.getWithQueryParams(
      HttpCacheProduct.getEndpoint('/necesidades'),
      { soloActivos: activesOnly },
    );
  },

  insertNeed: (productNeed: NeedInsert): Promise<any> => {
    return HttpAxiosRequest.post(HttpCacheProduct.getEndpoint('/necesidades'), {
      ...productNeed,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  updateNeed: (productNeed: NeedInsert): Promise<any> => {
    return HttpAxiosRequest.put(HttpCacheProduct.getEndpoint('/necesidades'), {
      ...productNeed,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  getRequisites: (): Promise<ProductLineRequisiteView[]> => {
    return HttpAxiosRequest.get(HttpCacheProduct.getEndpoint('/requisitos'));
  },
};
