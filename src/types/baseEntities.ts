export enum EntityWithIdFields {
  Id = 'id',
}

export interface EntityWithId<TId> {
  [EntityWithIdFields.Id]: TId;
}

export enum EntityWithIdAndDescriptionAndDetailFields {
  Id = 'id',
  Description = 'descripcion',
  Detalle = 'detalle',
}

export interface EntityWithIdAndDescriptionAndDetail extends EntityWithId<number>{
  [EntityWithIdAndDescriptionAndDetailFields.Description]: string;
  [EntityWithIdAndDescriptionAndDetailFields.Detalle]: string;
}

export enum EntityWithIdAndDescriptionFields {
  Id = 'id',
  Description = 'descripcion',
}

export interface EntityWithIdAndDescription extends EntityWithId<number> {
  [EntityWithIdAndDescriptionFields.Description]: string;
}

export enum EntityWithIdAndDescriptionQuantityFields {
  Quantity = 'cantidad',
}
export interface EntityWithIdAndDescriptionQuantity
  extends EntityWithIdAndDescription {
  [EntityWithIdAndDescriptionQuantityFields.Quantity]: string;
}

export enum EntityPaginationFields {
  CantPages = 'cantPages',
  ActualPage = 'actualPage',
  CantRecords = 'cantRecords',
  PageSize = 'pageSize',
  OrderBy = 'orderBy',
}

export interface EntityPagination {
  [EntityPaginationFields.CantPages]: number;
  [EntityPaginationFields.ActualPage]: number;
  [EntityPaginationFields.CantRecords]: number;
  [EntityPaginationFields.PageSize]: number;
}

export interface EntityFilterPagination {
  [EntityPaginationFields.ActualPage]: number;
  [EntityPaginationFields.PageSize]: number;
  [EntityPaginationFields.OrderBy]?: string;
}

export enum EntityListWithPaginationFields {
  List = 'lista',
  Pagination = 'paginacion',
}

export interface EntityListWithPagination<T> {
  [EntityListWithPaginationFields.List]: T[];
  [EntityListWithPaginationFields.Pagination]: EntityPagination;
}

export enum BaseResponseFields {
  Data = 'data',
  HasError = 'tieneError',
  ErrorDescription = 'descripcionError',
}

export interface BaseResponse {
  [BaseResponseFields.HasError]: boolean;
  [BaseResponseFields.ErrorDescription]: string;
}

export interface BaseResponseWithData<T> {
  [BaseResponseFields.Data]: T;
  [BaseResponseFields.HasError]: boolean;
  [BaseResponseFields.ErrorDescription]: string;
}

export enum BaseRequestFields {
  ModuleCode = 'codModulo',
  OriginCode = 'codOrigen',
}

export interface BaseRequest {
  [BaseRequestFields.ModuleCode]: number;
  [BaseRequestFields.OriginCode]: number;
}

export interface EntityWithBooleanIdAndDescription {
  id?: number | boolean,
  descripcion: string
}

export enum ColorCustomTypeFields {
  Light = 'light',
  Dark = 'dark',
}

export interface ColorCustomType {
  [ColorCustomTypeFields.Light]: string,
  [ColorCustomTypeFields.Dark]: string
}