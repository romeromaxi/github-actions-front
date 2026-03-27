import { BaseRequest, EntityWithIdAndDescription } from '../baseEntities';

export enum MarketCategoryDTOFields {
  Link = 'link',
  ParentId = 'idPadre',
  Order = 'orden',
  DisplayDisabled = 'mostrarDeshabilitado',
  Active = 'activo'
}

export interface MarketCategoryDTO extends EntityWithIdAndDescription {
  [MarketCategoryDTOFields.Link]: string;
  [MarketCategoryDTOFields.ParentId]: number;
  [MarketCategoryDTOFields.Order]: number;
  [MarketCategoryDTOFields.DisplayDisabled]: boolean;
  [MarketCategoryDTOFields.Active]: boolean;
}

export interface MarketCategoryViewDTO extends MarketCategoryDTO {}

export interface MarketCategoryInsertDTO
  extends BaseRequest,
    MarketCategoryDTO {}
