import { HttpAxiosRequest } from 'http/httpAxiosBase';
import {
  FilterProductLineSearch,
  LineQuaFilterSearch,
  ProductLineGondolaView,
  ProductLineHighlightedSection,
  ProductLineInternalSelected,
  ProductLineInternalSelectedLineForm, ProductLineRequisiteValidation,
  ProductLineRequisiteValidationRequest,
  ProductLineStatusHistoryView,
  ProductLineUserRecommended,
  ProductLineView,
  ProductLineViewDetail,
  ProductLineViewSummaryWithPublicationData,
  ProductLineViewWithRequirement,
} from 'types/lines/productLineData';
import {
  BaseResponse,
  EntityListWithPagination,
  EntityWithIdAndDescription,
} from 'types/baseEntities';
import { SolicitationProductLineInsert } from '../../types/solicitations/solicitationData';
import { LineProductField } from 'types/lines/productLineAttibutesData';

export const HttpProductLine = {
  getEndpoint: (url: string = ''): string => `producto-lineas${url}`,

  search: (
    filter: FilterProductLineSearch,
  ): Promise<EntityListWithPagination<ProductLineView>> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpProductLine.getEndpoint(),
      filter,
    );
  },

  searchInternal: (
    filter: LineQuaFilterSearch,
  ): Promise<EntityListWithPagination<ProductLineViewSummaryWithPublicationData>> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpProductLine.getEndpoint('/internos'),
      { ...filter },
    );
  },

  getByProductLineId: (productLineId: number): Promise<ProductLineViewDetail> => {
    return HttpAxiosRequest.get(
      HttpProductLine.getEndpoint(`/${productLineId}`),
    );
  },

  getByUniqueProductLineId: (uniProductLineId: string): Promise<ProductLineViewDetail> => {
    return HttpAxiosRequest.get(
        HttpProductLine.getEndpoint(`/${uniProductLineId}/detalle`),
    );
  },

  prequalify: (
    companyId: number,
    solicitationProductLine: SolicitationProductLineInsert[],
  ): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpProductLine.getEndpoint(`/precalificaciones/${companyId}`),
      {
        listaSolicitudProductoLineaInsertar: solicitationProductLine,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  getWithRequirementsByIdsProductLine: (
    idsProductLines?: number[],
  ): Promise<ProductLineViewWithRequirement[]> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpProductLine.getEndpoint('/precalificaciones/requerimientos'),
      {
        idsProductoLinea: idsProductLines,
      },
    );
  },

  approvePublication: (productLineId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpProductLine.getEndpoint(`/${productLineId}/aprobar-publicacion`),
      {},
    );
  },

  disablePublication: (productLineId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpProductLine.getEndpoint(`/${productLineId}/desactivar-publicacion`),
      {},
    );
  },

  getProducts: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(HttpProductLine.getEndpoint('/productos'));
  },

  getOfferers: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(HttpProductLine.getEndpoint('/oferentes'));
  },

  getListByGuid: (
    guid: string,
    filter: FilterProductLineSearch,
  ): Promise<ProductLineView[]> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpProductLine.getEndpoint(`/busqueda/${guid}`),
      filter,
    );
  },

  getActualProductLineId: (productLineId: number): Promise<BaseResponse> =>
    HttpAxiosRequest.get(
      HttpProductLine.getEndpoint(`/${productLineId}/actualizado`),
    ),

  getStatusHistory: (
    productLineId: number,
  ): Promise<ProductLineStatusHistoryView[]> =>
    HttpAxiosRequest.get(
      HttpProductLine.getEndpoint(`/${productLineId}/historia`),
    ),

  getFieldsByProductTemplateCode: (
    productTemplateCode: number,
  ): Promise<LineProductField[]> =>
    HttpAxiosRequest.get(
      HttpProductLine.getEndpoint(`/${productTemplateCode}/campos`),
    ),

  getHighlightedProductLines: () : Promise<ProductLineHighlightedSection[]> =>
      HttpAxiosRequest.get(
          HttpProductLine.getEndpoint(`/destacados`)
      ),

  getRelatedByProductLineId: (productLineId: number) : Promise<ProductLineView[]> =>
      HttpAxiosRequest.get(
          HttpProductLine.getEndpoint(`/${productLineId}/relacionados`)
      ),

  getPotentialRelatedOffererByProductLineId: (productLineId: number) : Promise<EntityWithIdAndDescription[]> =>
    HttpAxiosRequest.get(
      HttpProductLine.getEndpoint(`/${productLineId}/entidades-financieras`)
    ),
  
  getProductLineGondolas: (filter: FilterProductLineSearch): Promise<ProductLineGondolaView> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
        HttpProductLine.getEndpoint('/gondolas'),
        filter,
    );
  },
  
  getProductLineGondolasSearch: (guid: string, filter: FilterProductLineSearch): Promise<ProductLineGondolaView> => {
    return HttpAxiosRequest.getWithQueryParamsSerializer(
        HttpProductLine.getEndpoint(`/gondolas/${guid}/acotadas`),
        filter
    )
  },
  
  getBasicData: () : Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(
        HttpProductLine.getEndpoint('/datos-basicos')
    )
  },

  getAllSelectedProductLines: () : Promise<ProductLineInternalSelected[]> => {
    return HttpAxiosRequest.get(
        HttpProductLine.getEndpoint('/interno/elegidos')
    )
  },
  
  insertSelected: (data: ProductLineInternalSelectedLineForm) => {
    return HttpAxiosRequest.post(
        HttpProductLine.getEndpoint('/seleccionadas'),
        data
    )
  },

  recommendedByUser: () : Promise<ProductLineUserRecommended[]> => (
    HttpAxiosRequest.get(
      HttpProductLine.getEndpoint('/recomendados')
    )
  ),

  recommendedByCompany: (companyId: number) : Promise<ProductLineView[]> => (
      HttpAxiosRequest.get(
          HttpProductLine.getEndpoint(`/recomendados/${companyId}`)
      )
  ),

  recommendedByNavigationUser: () : Promise<ProductLineView[]> => (
    HttpAxiosRequest.get(
      HttpProductLine.getEndpoint('/recomendados/navegacion')
    )
  ),

  validateRestrictions: (data: ProductLineRequisiteValidationRequest) : Promise<ProductLineRequisiteValidation[]> => {
    return HttpAxiosRequest.post(
        HttpProductLine.getEndpoint(`/validar-restricciones`),
        data
    );
  }
};
