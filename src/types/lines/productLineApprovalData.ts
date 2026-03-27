import {
  BaseRequest,
  EntityWithId,
  EntityWithIdAndDescription,
} from '../baseEntities';

export enum ProductLineApprovalFields {
  ProductLineId = 'idProductoLinea',
  Justification = 'justificacion',
  ApprovalResultDate = 'fechaAprobacionResultado',
  ProductLineApprovalResultCode = 'codProductoLineaAprobacionResultado',
  ProductLineApprovalResultDesc = 'descProductoLineaAprobacionResultado',
}

export interface ProductLineApprovalView extends EntityWithId<number> {
  [ProductLineApprovalFields.ProductLineId]: number;
  [ProductLineApprovalFields.Justification]: string;
  [ProductLineApprovalFields.ApprovalResultDate]?: Date;
  [ProductLineApprovalFields.ProductLineApprovalResultCode]: number;
  [ProductLineApprovalFields.ProductLineApprovalResultDesc]: string;
}

export interface ProductLineApprovalUpdate extends BaseRequest {
  [ProductLineApprovalFields.Justification]: string;
  [ProductLineApprovalFields.ProductLineApprovalResultCode]: number;
}

export enum ProductLineApprovalResultViewFields {
  Detail = 'detalle',
}

export interface ProductLineApprovalResultView
  extends EntityWithIdAndDescription {
  [ProductLineApprovalResultViewFields.Detail]: string;
}


export enum ProductLineBaseViewDTOFields {
  OffererId = 'idOferente',
  Description = 'descripcion',
  LongDescription = 'descripcionLarga',
  ProductLineStateCode = 'codProductoLineaEstado',
  Active = 'activo',
  Id = 'id',
}

export interface ProductLineBaseViewDTO {
    [ProductLineBaseViewDTOFields.OffererId]: number;
    [ProductLineBaseViewDTOFields.Description]: string;
    [ProductLineBaseViewDTOFields.LongDescription]: string;
    [ProductLineBaseViewDTOFields.ProductLineStateCode]: number;
    [ProductLineBaseViewDTOFields.Active]: boolean;
    [ProductLineBaseViewDTOFields.Id]: number;
}