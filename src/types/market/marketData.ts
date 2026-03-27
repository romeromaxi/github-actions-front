import {EntityWithId} from '../baseEntities';
import {PersonTypes} from "../person/personEnums";

export enum CompanyTotalsShoppingCartFields {
  BusinessName = 'razonSocial',
  CUIT = 'cuit',
  HasPermissions = 'tienePermiso',
  PersonTypeCode = 'codPersonaTipo',
  NumberLinesInShoppingCart = 'cantidadEnCarrito',
}

export interface CompanyTotalsShoppingCart extends EntityWithId<number> {
  [CompanyTotalsShoppingCartFields.BusinessName]: string;
  [CompanyTotalsShoppingCartFields.CUIT]: string;
  [CompanyTotalsShoppingCartFields.HasPermissions]: boolean;
  [CompanyTotalsShoppingCartFields.NumberLinesInShoppingCart]: number;
  [CompanyTotalsShoppingCartFields.PersonTypeCode]?: PersonTypes;
}

export enum DynamicSearchMarketViewFields {
  UniqueIdentifier = 'uniIdBusquedaDinamica',
  ImageURL = 'urlImagen',
  Order = 'ordenIntermedia',
  IsBoundedSearchDestination = 'esDestinoGondolaAcotada',
  RequiresQuestions = 'requierePreguntas',
}

export interface DynamicSearchMarketView {
  [DynamicSearchMarketViewFields.UniqueIdentifier]: string;
  [DynamicSearchMarketViewFields.ImageURL]: string;
  [DynamicSearchMarketViewFields.Order]?: number;
  [DynamicSearchMarketViewFields.IsBoundedSearchDestination]: boolean;
  [DynamicSearchMarketViewFields.RequiresQuestions]: boolean;
}


export enum MarketNavigableBannerFields {
  Section = 'seccion',
  MainTitle = 'titulo',
  Image = 'img',
  RedirectURL = 'goto',
}


export interface MarketNavigableBanner {
  [MarketNavigableBannerFields.Section]: string;
  [MarketNavigableBannerFields.MainTitle]: string;
  [MarketNavigableBannerFields.Image]: string;
  [MarketNavigableBannerFields.RedirectURL]: string;
}