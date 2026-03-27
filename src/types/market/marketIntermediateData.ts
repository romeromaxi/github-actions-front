import {EntityWithId, EntityWithIdAndDescription} from '../baseEntities';
import { DynamicSearchMarketViewFields } from './marketData';

export enum IntermediateDataViewFields {
  UrlImage = 'urlImage',
  AllowSelect = 'permiteSeleccion'
}

export interface IntermediateDataView extends EntityWithIdAndDescription {
  [IntermediateDataViewFields.UrlImage]: string,
  [IntermediateDataViewFields.AllowSelect]: boolean
}

export enum IntermediateDataNeedViewFields {
  DestinyCode = 'codProductoDestino',
  ServiceCode = 'codProductoServicio',
  InstrumentTypeCode = 'codProductoInstrumentoTipo',
}

export interface IntermediateDataNeedView extends IntermediateDataView {
  [IntermediateDataNeedViewFields.DestinyCode]: number,
  [IntermediateDataNeedViewFields.ServiceCode]: number,
  [IntermediateDataNeedViewFields.InstrumentTypeCode]: number,
}

export enum GetIntermediateServiceDTOFields {
  DestinyCodeList = 'lstCodsProductoDestino',
  InstrumentCodeList = 'lstCodsProductoInstrumentoTipo',
  NeedCodeList = 'lstCodsProductoNecesidad',
}

export enum GetIntermediateNeedDTOFields {
  DestinyCodeList = 'lstCodsProductoDestino',
  ServiceCodeList = 'lstCodsProductoServicio',
  InstrumentCodeList = 'lstCodsProductoInstrumentoTipo',
}


export enum GetIntermediateDestinyDTOFields {
  ServiceCodeList = 'lstCodsProductoServicio',
  InstrumentCodeList = 'lstCodsProductoInstrumentoTipo',
  NeedCodeList = 'lstCodsProductoNecesidad',
}

export enum GetIntermediateInstrumentTypeDTOFields {
  DestinyCodeList = 'lstCodsProductoDestino',
  ServiceCodeList = 'lstCodsProductoServicio',
  NeedCodeList = 'lstCodsProductoNecesidad',
}

export enum GetIntermediateInstrumentDTOFields {
  DestinyCodeList = 'lstCodsProductoDestino',
  ServiceCodeList = 'lstCodsProductoServicio',
  InstrumentTypeCodeList = 'lstCodsProductoInstrumentoTipo',
}

export enum IntermediateInstrumentFields {
  ProductInstrumentCode = 'codProductoInstrumento',
  ProductInstrumentDesc = 'descProductoInstrumento',
}

export interface IntermediateInstrumentView {
  [IntermediateInstrumentFields.ProductInstrumentCode]: number;
  [IntermediateInstrumentFields.ProductInstrumentDesc]: string;
}

export enum IntermediateProductSearchFields {
  ProductDestinyCodeList = 'lstCodsProductoDestino',
  ProductServiceCodeList = 'lstCodsProductoServicio',
  ProductInstrumentTypeCodeList = 'lstCodsProductoInstrumentoTipo',
}

export enum IntermediateProductFields {
  ProductDesc = 'descProducto',
  LineQuantity = 'cantidadLineas',
  OffererQuantity = 'cantidadOferentes',
}

export interface IntermediateProductView extends EntityWithId<number> {
  [IntermediateProductFields.ProductDesc]: string;
  [IntermediateProductFields.LineQuantity]: number;
  [IntermediateProductFields.OffererQuantity]: number;
}

export enum IntermediateProductTotalsViewFields {
  TotalProducts = 'cantidadProductos',
  TotalOfferers = 'cantidadOferentes',
  TotalLines = 'cantidadLineas',
}

export interface IntermediateProductTotalsView {
  [IntermediateProductTotalsViewFields.TotalProducts]: number;
  [IntermediateProductTotalsViewFields.TotalOfferers]: number;
  [IntermediateProductTotalsViewFields.TotalLines]: number;
}

export enum MarketIntermadiateDynamicSearchFields {
  GuiId = 'uniIdBusquedaDinamica',
  Title = 'tituloBusquedaDinamica',
  Detail = 'detalleBusquedaDinamica',
  ImageUrl = 'urlImagen',
  Order = 'ordenIntermedia',
  IsDestinyReduced = 'esDestinoGondolaAcotada',
  IsUniqueProductLine = 'esUnicoProductoLinea'
}

export interface MarketIntermadiateDynamicSearch {
  [MarketIntermadiateDynamicSearchFields.GuiId]: string;
  [MarketIntermadiateDynamicSearchFields.Title]: string;
  [MarketIntermadiateDynamicSearchFields.Detail]?: string;
  [MarketIntermadiateDynamicSearchFields.ImageUrl]?: string;
  [MarketIntermadiateDynamicSearchFields.Order]?: number;
  [MarketIntermadiateDynamicSearchFields.IsDestinyReduced]?: boolean;
  [MarketIntermadiateDynamicSearchFields.IsUniqueProductLine]: boolean;
  [DynamicSearchMarketViewFields.RequiresQuestions]: boolean;
}


export enum MarketIntermadiateDynamicSearchSummaryFields {
  Order = 'orden'
}
export interface MarketIntermadiateDynamicSearchSummary {
  [MarketIntermadiateDynamicSearchFields.GuiId]: string;
  [MarketIntermadiateDynamicSearchFields.Title]: string
  [MarketIntermadiateDynamicSearchFields.ImageUrl]?: string;
  [MarketIntermadiateDynamicSearchSummaryFields.Order]?: number;
}

export enum MarketIntermadiateAnswersFields {
  CompanyId = 'buscadorIdEmpresa',
  CompanyBusinessName = 'razonSocialEmpresa',
  ProductDestinyCode = 'buscadorCodProductoDestino',
  ProductDestinyDesc = 'productoDestinoDescripcion',
  BillingAmount = 'buscadorMontoFacturacion',
  CompanyCUIT = 'cuitEmpresa',
}

export interface MarketIntermediateAnswers {
  [MarketIntermadiateAnswersFields.CompanyId]?: number;
  [MarketIntermadiateAnswersFields.CompanyBusinessName]?: string;
  [MarketIntermadiateAnswersFields.ProductDestinyCode]?: number;
  [MarketIntermadiateAnswersFields.ProductDestinyDesc]?: string;
  [MarketIntermadiateAnswersFields.BillingAmount]?: number;
  [MarketIntermadiateAnswersFields.CompanyCUIT]?: string;
}

export interface MarketIntermediateAnswersFilter {
  [MarketIntermadiateAnswersFields.CompanyId]?: number;
  [MarketIntermadiateAnswersFields.ProductDestinyCode]?: number;
  [MarketIntermadiateAnswersFields.BillingAmount]?: number;
}
