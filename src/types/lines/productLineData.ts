import {
  EntityFilterPagination,
  EntityPaginationFields,
  EntityWithId,
  EntityWithIdAndDescription, EntityWithIdAndDescriptionQuantity,
  EntityWithIdFields,
} from '../baseEntities';
import { ProductLineTemplateType } from './productLineEnums';
import { CompanyFileType } from '../company/companyEnums';
import { MarketIntermediateAnswersFilter } from '../market/marketIntermediateData';
import {SolicitationTypes} from "../solicitations/solicitationEnums";
import {PersonTypes} from "../person/personEnums";

export enum ProductLineFields {
  Id = 'id',
  UniqueId = 'uniqueId',
  IsActive = 'estaActiva',
  OffererId = 'idOferente',
  OffererUrlLogo = 'urlOferenteLogo',
  SolicitationId = 'idSolicitud',
  SolicitationTypeCode = 'codSolicitudTipo',
  SolicitationTypeDesc = 'descSolicitudTipo',
  OffererBusinessName = 'razonSocialOferente',
  ProductCode = 'codProducto',
  ProductDesc = 'descProducto',
  Line = 'descProductoLinea',
  LineLarge = 'descProductoLineaLarga',
  RateCode = 'codProductoTasaTipo',
  RateDesc = 'descProductoTasaTipo',
  AmortizationCode = 'codProductoAmortizacion',
  AmortizationDesc = 'descProductoAmortizacionTipo',
  DateLastModified = 'fechaUltMod',
  CurrentStageId = 'idEtapaActual',
  MessageId = 'idMensaje',
  CheckIssuerDesc = 'descChequeEmisor',
  CheckTypeDesc = 'descChequeTipo',
  AdditionalCostsDesc = 'descGastosAdicionales',
  TypeOfGoodDesc = 'descBienTipo',
  Costs = 'decGastos',
  Amount = 'monto',
  AmountMin = 'montoMin',
  AmountMax = 'montoMax',
  DateSince = 'fechaVigDesde',
  DateTo = 'fechaVigHasta',
  Date = 'fechaVig',
  RateMin = 'tasaMin',
  RateMax = 'tasaMax',
  RateInformation = 'descripcionTasa',
  Rate = 'tasa',
  MonthsMin = 'plazoMesesMin',
  MonthsMax = 'plazoMesesMax',
  MonthGrace = 'mesesGracia',
  ListNeedCodes = 'listaCodsNecesidad',
  Active = 'activo',
  IsInShoppingCart = 'estaPresenteCarrito',
  ProductTemplateCode = 'codProductoPlantilla',
  FileTypeCode = 'codLegajoTipo',
  FileTypeDescription = 'descLegajoTipo',
  FileTypeLabelDescription = 'descLegajoTipoEtiqueta',
  CompletedDetailRequired = 'completoDetalleSolicitud',
  RequestDetailRequired = 'requiereDetalleSolicitud',
  Commission = 'comisiones',
  CommissionDesc = 'descComisiones',
  Subscription = 'suscripcion',
  CurrencyCode = 'codMoneda',
  CurrencyCodeDesc = 'descCodMoneda',
  CurrencyDesc = 'descMoneda',
  CoverageGuarantee = 'porcCoberturaAval',
  Canon = 'canon',
  Expenses = 'gastos',
  HasPeriodGrace = 'tienePeriodoGracia',
  Repurchase = 'recompra',
  Disclaimer = 'disclaimer',
  ListRequirements = 'listaRequerimientos',
  ListRequisites = 'listaRequisitos',
  ListRequisitesPolicyRestrictive = 'listaRequisitosResctrictivos',
  CodsCheckIssuer = 'codsChequeEmisor',
  CodsCheckType = 'codsChequeTipo',
  CodsCurrency = 'codsMoneda',
  CodsProductAmortizationType = 'codsProductoAmortizacionTipo',
  CodsGoodsType = 'codsBienTipo',
  ProductLineDescriptions = 'productoLineaDescripciones',
  CodsProductRateType = 'codsProductoTasaTipo',
  ProductLineStatusCode = 'codProductoLineaEstado',
  ProductLineStatusDesc = 'descProductoLineaEstado',
  ProductDestinyCode = 'codProductoDestino',
  Order = 'orden',

  ProductInstrumentCode = 'codProductoInstrumento',
  ProductInstrumentDesc = 'descProductoInstrumento',

  ProductInstrumentTypeCode = 'codProductoInstrumentoTipo',
  ProductInstrumentTypeDesc = 'descProductoInstrumentoTipo',

  ProductServiceCode = 'codProductoServicio',
  ProductServiceDesc = 'descProductoServicio',
  InitialMessage = 'detalleMensajeInicial',

  OffererWorkTeamsId = 'idOferenteEquipoTrabajo',
  OffererWorkTeamsName = 'nombreEquipoTrabajo',

  RecommendationDescription = 'textoRecomendacion',
  RecommendationCompanyId = 'idEmpresaRecomendacion',
  RecommendationCompanyPersonTypeCode = 'codPersonaTipoEmpresaRecomendacion',

  FinancialEntityRelatedIds = 'idsEntidadFinancieraRelacionada',
  FinancialEntityRelatedDesc = 'descEntidadFinancieraRelacionada',

  AlertCode = 'codAlerta',
  GroupedCartLabel = 'carritoEtiquetaAgrupacion',
  SubGroupedCartLabel = 'carritoEtiquetaSubAgrupacion'
}

interface ProductLineViewBasicData extends EntityWithId<number> {
  [ProductLineFields.UniqueId]: string;
  [ProductLineFields.OffererId]: number;
  [ProductLineFields.OffererBusinessName]: string;
  [ProductLineFields.OffererUrlLogo]?: string;
  [ProductLineFields.ProductCode]: number;
  [ProductLineFields.ProductDesc]: string;
  [ProductLineFields.Line]: string;
  [ProductLineFields.LineLarge]: string;
  [ProductLineFields.ProductServiceCode]: number;
  [ProductLineFields.ProductServiceDesc]?: string;
  [ProductLineFields.ProductInstrumentDesc]?: string;
  [ProductLineFields.ProductTemplateCode]: ProductLineTemplateType;
  [ProductLineFields.FileTypeCode]: CompanyFileType;
  [ProductLineFields.FileTypeDescription]: string;
  [ProductLineFields.FileTypeLabelDescription]: string;
  [ProductLineFields.SolicitationTypeCode]: SolicitationTypes;
  [ProductLineFields.SolicitationTypeDesc]: string;
  [ProductLineFields.RecommendationDescription]?: string;
  [ProductLineFields.RecommendationCompanyId]?: number;
  [ProductLineFields.RecommendationCompanyPersonTypeCode]?: PersonTypes;
  [ProductLineFields.IsActive]: boolean;
}

export interface ProductLineView extends ProductLineViewBasicData {  
  [ProductLineFields.AmountMin]?: number;
  [ProductLineFields.AmountMax]?: number;
  [ProductLineFields.MonthsMin]: number;
  [ProductLineFields.MonthsMax]: number;
  [ProductLineFields.Commission]?: number;
  [ProductLineFields.CoverageGuarantee]?: number;
  [ProductLineFields.CurrencyCode]?: number;
  [ProductLineFields.CurrencyDesc]?: string;
  [ProductLineFields.CurrencyCodeDesc]?: string;

  [ProductLineFields.SolicitationId]: number;
  [ProductLineFields.InitialMessage]?: string;
  [ProductLineFields.GroupedCartLabel]?: string;
  [ProductLineFields.SubGroupedCartLabel]?: string;
  [ProductLineFields.Order]: number;
  [ProductLineFields.Active]: boolean;
  [ProductLineFields.IsInShoppingCart]?: boolean;
}

export interface ProductLineViewDetail extends ProductLineView {
  [ProductLineFields.RateCode]?: number;
  [ProductLineFields.RateDesc]?: string;

  [ProductLineFields.AmortizationCode]?: number;
  [ProductLineFields.AmortizationDesc]?: string;

  [ProductLineFields.Amount]?: number;

  [ProductLineFields.DateSince]?: string;
  [ProductLineFields.DateTo]?: string;

  [ProductLineFields.RateMin]: number;
  [ProductLineFields.RateMax]: number;
  [ProductLineFields.RateInformation]?: string;

  [ProductLineFields.MonthGrace]?: number;

  [ProductLineFields.ListRequirements]?: ProductLineRequirementInsert[];
  [ProductLineFields.ListRequisites]: ProductLineRequisiteDetailView[];
  [ProductLineFields.ListRequisitesPolicyRestrictive]: number[];
  [ProductLineFields.ProductLineDescriptions]: ProductLineDescriptionsView;

  [ProductLineFields.DateLastModified]?: Date;
  [ProductLineFields.Active]: boolean;

  [ProductLineFields.ProductDestinyCode]: number;

  [ProductLineFields.CommissionDesc]?: string;

  [ProductLineFields.Subscription]?: number;
  [ProductLineFields.Canon]?: string;
  [ProductLineFields.Expenses]?: number;
  [ProductLineFields.HasPeriodGrace]?: boolean;
  [ProductLineFields.Repurchase]?: string;
  [ProductLineFields.Disclaimer]?: string;

  [ProductLineFields.ProductLineStatusCode]: number;
  [ProductLineFields.ProductLineStatusDesc]: string;

  [ProductLineFields.ProductInstrumentTypeCode]: number;
  [ProductLineFields.ProductInstrumentCode]: number;
  [ProductLineFields.AdditionalCostsDesc]: string;

  [ProductLineFields.MessageId]: number;
  [ProductLineFields.CurrentStageId]: number;

  [ProductLineFields.CodsCheckIssuer]?: number[];
  [ProductLineFields.CodsCheckType]?: number[];
  [ProductLineFields.CodsCurrency]?: number[];
  [ProductLineFields.CodsProductAmortizationType]?: number[];
  [ProductLineFields.CodsProductRateType]?: number[];
  [ProductLineFields.CodsGoodsType]?: number[];
  [ProductLineFields.FinancialEntityRelatedIds]?: number[];
  [ProductLineFields.FinancialEntityRelatedDesc]?: string;
  [ProductLineFields.TypeOfGoodDesc]?: string;
  [ProductLineFields.CheckTypeDesc]?: string;
  [ProductLineFields.CheckIssuerDesc]?: string;

  [ProductLineFields.OffererWorkTeamsName]?: string;

  [ProductLineFields.CompletedDetailRequired]: boolean;
  [ProductLineFields.RequestDetailRequired]: boolean;
  [ProductLineFields.ListNeedCodes]?: number[];
}

export enum ProductLineHighlightedSectionFields {
  Title = 'titulo',
  ProductLines = 'destacadas',
}

export interface ProductLineHighlightedSection extends EntityWithId<number> {
  [ProductLineHighlightedSectionFields.Title]: string;
  [ProductLineHighlightedSectionFields.ProductLines]: ProductLineView[];
}

export enum ProductLineSummaryShoppingCartFields {
  Quantity = 'cantidadLineas',
  ProductLines = 'listaRecientes',
}

export interface ProductLineSummaryShoppingCart {
  [ProductLineSummaryShoppingCartFields.Quantity]: number;
  [ProductLineSummaryShoppingCartFields.ProductLines]: ProductLineView[];
}

export interface ProductLineViewWithRequirement extends ProductLineViewBasicData {
  [ProductLineFields.ListRequirements]: ProductLineRequirementDetailView[];
}

export enum ProductLineInsertFields {
  OffererId = 'idOferente',
  ProductCode = 'codProducto',
  Line = 'descProductoLinea',
  LineLarge = 'descProductoLineaLarga',
  ProductInstrumentTypeCode = 'codProductoInstrumentoTipo',
  ProductInstrumentCode = 'codProductoInstrumento',
  ProductDestinyCode = 'codProductoDestino',
  ProductServiceCode = 'codProductoServicio',
  ProductNeedsCode = 'codProductoNecesidad',
  OffererWorkTeamsId = 'idOferenteEquipoTrabajo',
}

export interface ProductLineInsert extends EntityWithId<number> {
  [ProductLineInsertFields.OffererId]: number;
  [ProductLineInsertFields.ProductCode]?: number;
  [ProductLineInsertFields.Line]: string;
  [ProductLineInsertFields.LineLarge]: string;
  [ProductLineInsertFields.ProductInstrumentCode]: number;
  [ProductLineInsertFields.ProductInstrumentTypeCode]: number;
  [ProductLineInsertFields.ProductDestinyCode]: number;
  [ProductLineInsertFields.ProductServiceCode]: number;
  [ProductLineInsertFields.ProductNeedsCode]: number;
  [ProductLineInsertFields.OffererWorkTeamsId]?: number;
}

export interface ProductLineUpdate extends EntityWithId<number> {
  [ProductLineFields.ProductCode]: number;
  [ProductLineFields.ProductDesc]: string;
  [ProductLineFields.Line]: string;
  [ProductLineFields.LineLarge]: string;
  [ProductLineFields.ProductTemplateCode]?: number;
  [ProductLineFields.RateCode]?: number;
  [ProductLineFields.AmortizationCode]?: number;
  [ProductLineFields.Amount]?: number;
  [ProductLineFields.AmountMin]?: number;
  [ProductLineFields.AmountMax]?: number;
  [ProductLineFields.DateSince]?: string;
  [ProductLineFields.DateTo]?: string;
  [ProductLineFields.RateMin]?: number;
  [ProductLineFields.RateMax]?: number;
  [ProductLineFields.MonthsMin]?: number;
  [ProductLineFields.MonthsMax]?: number;
  [ProductLineFields.MonthGrace]?: number;
  [ProductLineFields.Commission]?: number;
  [ProductLineFields.Subscription]?: number;
  [ProductLineFields.CoverageGuarantee]?: number;
  [ProductLineFields.Canon]?: string;
  [ProductLineFields.Expenses]?: number;
  [ProductLineFields.HasPeriodGrace]?: boolean;
  [ProductLineFields.Repurchase]?: string;
  [ProductLineFields.Disclaimer]?: string;
  [ProductLineFields.CurrencyCode]?: number;
  [ProductLineFields.FileTypeCode]: number;
  [ProductLineFields.ListRequirements]?: ProductLineRequirementInsert[];
  [ProductLineFields.ListRequisites]?: ProductLineRequisiteDetailInsert[];
  [ProductLineFields.ListRequisitesPolicyRestrictive]?: number[];
}

export enum ProductLineRequirementFields {
  RequirementCode = 'codRequerimiento',
  RequirementClassificationCode = 'codRequerimientoClasificacion',
  Description = 'descProductoLineaRequerimiento',
  RequirementDescription = 'descRequerimiento',
}

export interface ProductLineRequirementView extends EntityWithId<number> {
  [ProductLineRequirementFields.RequirementCode]: number;
  [ProductLineRequirementFields.RequirementClassificationCode]: number;
  [ProductLineRequirementFields.Description]: string;
  [ProductLineRequirementFields.RequirementDescription]: string;
}

export interface ProductLineRequirementInsert {
  [ProductLineRequirementFields.RequirementCode]: number;
  [ProductLineRequirementFields.Description]: string;
}

export interface ProductLineRequirementDetailView extends EntityWithId<number> {
  [ProductLineRequirementFields.RequirementCode]: number;
  [ProductLineRequirementFields.Description]: string;
  [ProductLineRequirementFields.RequirementDescription]: string;
}

export enum ProductLineRequisiteFields {
  ProductLineId = 'idProductoLinea',
  Title = 'titulo',
  Description = 'descripcion',
  IsPublic = 'esPublico',
  AllowsRestrictivePolicy = 'permitePoliticaRestrictiva',
  ProductLineRequisiteTypeCode = 'codProductoLineaRequisitoTipo',
  ProductLineRequisiteTypeDesc = 'descProductoLineaRequisitoTipo',
  Order = 'orden',
}

export interface ProductLineRequisiteView extends EntityWithIdAndDescription {
  [ProductLineRequisiteFields.Title]: string;
  [ProductLineRequisiteFields.ProductLineRequisiteTypeCode]: number;
  [ProductLineRequisiteFields.Order]: number;
  [ProductLineRequisiteFields.AllowsRestrictivePolicy]: boolean;
}

export enum ProductLineRequisiteDetailFields {
  ProductLineRequisiteId = 'idProductoLineaRequisito',
  ProductLineId = 'idProductoLinea',
  ProvinceCode = 'codProvincia',
  BillingAmountMinimum = 'montoFacturacionMinimo',
  BillingAmountMaximum = 'montoFacturacionMaximo',
  AfipSepymeCode = 'codAfipRamoSepyme',
  SeniorityCompanyMinimum = 'antiguedadEmpresaMinimo',
  SeniorityCompanyMaximum = 'antiguedadEmpresaMaximo',
  AfipSectorCode = 'codAfipSector',
  AfipTaxConditionCode = 'codAfipCondicionFiscal',
  ScoringMinimum = 'scoringMinimo',
  DebtSituationMaximum = 'situacionEndeudamientoMaximo',
  IsExclusiveLedWomen = 'esExclusivoLideradaMujeres',
  IsExclusiveSocialImpact = 'esExclusivoEmpresaConImpactoSocial',
  RequisiteTitle = 'titulo',
  ProductLineRequisiteTypeCode = 'codProductoLineaRequisitoTipo',
}

export interface ProductLineRequisiteDetailView extends EntityWithId<number> {
  [ProductLineRequisiteDetailFields.ProductLineRequisiteId]: number;
  [ProductLineRequisiteDetailFields.ProductLineId]: number;
  [ProductLineRequisiteDetailFields.ProvinceCode]?: number;
  [ProductLineRequisiteDetailFields.BillingAmountMinimum]?: number;
  [ProductLineRequisiteDetailFields.BillingAmountMaximum]?: number;
  [ProductLineRequisiteDetailFields.AfipSepymeCode]?: number;
  [ProductLineRequisiteDetailFields.SeniorityCompanyMinimum]?: number;
  [ProductLineRequisiteDetailFields.SeniorityCompanyMaximum]?: number;
  [ProductLineRequisiteDetailFields.AfipSectorCode]?: number;
  [ProductLineRequisiteDetailFields.AfipTaxConditionCode]?: number;
  [ProductLineRequisiteDetailFields.ScoringMinimum]?: number;
  [ProductLineRequisiteDetailFields.DebtSituationMaximum]?: number;
  [ProductLineRequisiteDetailFields.IsExclusiveLedWomen]?: boolean;
  [ProductLineRequisiteDetailFields.IsExclusiveSocialImpact]?: boolean;
  [ProductLineRequisiteDetailFields.RequisiteTitle]: string;
  [ProductLineRequisiteDetailFields.ProductLineRequisiteTypeCode]: number;
}

export interface ProductLineRequisiteDetailInsert extends EntityWithId<number> {
  [ProductLineRequisiteDetailFields.ProductLineRequisiteId]: number;
  [ProductLineRequisiteDetailFields.ProvinceCode]?: number;
  [ProductLineRequisiteDetailFields.BillingAmountMinimum]?: number;
  [ProductLineRequisiteDetailFields.BillingAmountMaximum]?: number;
  [ProductLineRequisiteDetailFields.AfipSepymeCode]?: number;
  [ProductLineRequisiteDetailFields.SeniorityCompanyMinimum]?: number;
  [ProductLineRequisiteDetailFields.SeniorityCompanyMaximum]?: number;
  [ProductLineRequisiteDetailFields.AfipSectorCode]?: number;
  [ProductLineRequisiteDetailFields.AfipTaxConditionCode]?: number;
  [ProductLineRequisiteDetailFields.IsExclusiveLedWomen]?: boolean;
}

export enum ProductLineDataPrequalificationFields {
  ProductLineId = 'idProductoLinea',
  Amount = 'monto',
  Observation = 'observacion',
  ExpirationDate = 'fechaVencimiento',
}

export interface ProductLineDataPrequalification {
  [ProductLineDataPrequalificationFields.ProductLineId]: number;
  [ProductLineFields.OffererId]: number;
  [ProductLineFields.Line]: string;
  [ProductLineFields.LineLarge]: string;
  [ProductLineFields.ProductTemplateCode]?: number;
  [ProductLineDataPrequalificationFields.Amount]?: number;
  [ProductLineDataPrequalificationFields.Observation]?: string;
  [ProductLineDataPrequalificationFields.ExpirationDate]?: Date;
}

export enum CompanyLineStatusViewDTOFields {
  BusinessName = 'razonSocial',
  CUIT = 'cuit',
  HasPermissions = 'tienePermiso',
  InShoppingCart = 'estaPresenteCarrito',
  SolicitationInProgress = 'tieneSolicitudEnCurso',
  PersonTypeCode = 'codPersonaTipo',
}

export interface CompanyLineStatusViewDTO extends EntityWithId<number> {
  [CompanyLineStatusViewDTOFields.BusinessName]: string;
  [CompanyLineStatusViewDTOFields.CUIT]: string;
  [CompanyLineStatusViewDTOFields.HasPermissions]: boolean;
  [CompanyLineStatusViewDTOFields.InShoppingCart]: boolean;
  [CompanyLineStatusViewDTOFields.SolicitationInProgress]: boolean;
  [CompanyLineStatusViewDTOFields.PersonTypeCode]?: PersonTypes;
}

export enum ProductLineDescriptionsFields {
  Disclaimer = 'disclaimer',
  CommercialDescription = 'descripcionComercial',
  PrequalificationDetail = 'detallePrecalificacion',
  InstrumentationDetail = 'detalleInstrumentacion',
  GuaranteeDetail = 'garantia'
}

export interface ProductLineDescriptionsView extends EntityWithId<number> {
  [ProductLineDescriptionsFields.Disclaimer]: string;
  [ProductLineDescriptionsFields.CommercialDescription]: string;
  [ProductLineDescriptionsFields.PrequalificationDetail]: string;
  [ProductLineDescriptionsFields.InstrumentationDetail]: string;
  [ProductLineDescriptionsFields.GuaranteeDetail]: string;
}

export enum RequestPublicationFields {
  DateToPublish = 'fechaPublicar',
  DateCancelPublication = 'fechaBajarPublicacion',
}

export interface RequestPublicationData {
  [RequestPublicationFields.DateToPublish]?: Date;
  [RequestPublicationFields.DateCancelPublication]?: Date;
}

export enum FilterProductLineSearchFields {
  IdsProductLine = 'idsProductoLinea',
  CodsProduct = 'codsProducto',
  CodsProductNeed = 'codsProductoNecesidad',
  CodsProductDestiny = 'codsProductoDestino',
  CodsProductService = 'codsProductoServicio',
  CodsProductInstrumentType = 'codsProductoInstrumentoTipo',
  CodsProductInstrument = 'codsProductoInstrumento',
  CodsOfferer = 'codsOferente',
  CodsProvince = 'codsProvincia',
  CodsSector = 'codsSector',
  WomenLeadExclusive = 'esExclusivoLideradaMujeres',
  CodsProductRateType = 'codsProductoTasaTipo',
  CodsProductAmortizationType = 'codsProductoAmortizacionTipo',
  CodsGoodsType = 'codsBienTipo',
  CodsCurrency = 'codsMoneda',
  CodsCheckIssuer = 'codsChequeEmisor',
  CodsCheckType = 'codsChequeTipo',
  AmountToFinance = 'montoAFinanciar',
  CreditTerm = 'plazoCredito',
  HasGracePeriod = 'tienePeriodoGracia',
  CodsAfipSection = 'codsAfipTramo',
  CodsTaxCondition = 'codsConficionFiscal',
  Seniority = 'antiguedadPyme',
  Billing = 'facturacionPyme',
  AmbientOrSocialImpact = 'esExclusivoEmpresaConImpactoSocial',
  CodsSgr = 'codsSgr',
  CodsAlycs = 'codsAlycs',
  CodsEntityFinancialBanks = 'codsBancarias',
  ActualPage = 'actualPage',
  PageSize = 'pageSize',
}

export interface FilterProductLineSearch {
  [FilterProductLineSearchFields.IdsProductLine]?: number[];
  [FilterProductLineSearchFields.CodsProduct]?: number[];
  [FilterProductLineSearchFields.CodsProductNeed]?: number[];
  [FilterProductLineSearchFields.CodsProductDestiny]?: number[];
  [FilterProductLineSearchFields.CodsProductService]?: number[];
  [FilterProductLineSearchFields.CodsProductInstrumentType]?: number[];
  [FilterProductLineSearchFields.CodsProductInstrument]?: number[];
  [FilterProductLineSearchFields.CodsOfferer]?: number[];
  [FilterProductLineSearchFields.CodsProvince]?: number[];
  [FilterProductLineSearchFields.CodsSector]?: number[];
  [FilterProductLineSearchFields.WomenLeadExclusive]?: boolean;
  [FilterProductLineSearchFields.CodsProductRateType]?: number[];
  [FilterProductLineSearchFields.CodsProductAmortizationType]?: number[];
  [FilterProductLineSearchFields.CodsCurrency]?: number[];
  [FilterProductLineSearchFields.CodsCheckIssuer]?: number[];
  [FilterProductLineSearchFields.CodsCheckType]?: number[];
  [FilterProductLineSearchFields.AmountToFinance]?: number;
  [FilterProductLineSearchFields.CreditTerm]?: number;
  [FilterProductLineSearchFields.HasGracePeriod]?: boolean;
  [FilterProductLineSearchFields.CodsAfipSection]?: number[];
  [FilterProductLineSearchFields.CodsTaxCondition]?: number[];
  [FilterProductLineSearchFields.Seniority]?: number;
  [FilterProductLineSearchFields.Billing]?: number;
  [FilterProductLineSearchFields.CodsGoodsType]?: number[];
  [FilterProductLineSearchFields.AmbientOrSocialImpact]?: boolean;
  [FilterProductLineSearchFields.CodsSgr]?: number[];
  [FilterProductLineSearchFields.CodsAlycs]?: number[];
  [FilterProductLineSearchFields.CodsEntityFinancialBanks]?: number[];
  [EntityPaginationFields.ActualPage]: number;
  [EntityPaginationFields.PageSize]: number;
}

export enum ProductLineRequisiteDescriptionFields {
  Description = 'descripcion',
  DetailDescription = 'detalleDescripcion',
}

export interface ProductLineRequisiteDescriptionView
    extends EntityWithId<number> {
  [ProductLineRequisiteDescriptionFields.Description]: string;
  [ProductLineRequisiteDescriptionFields.DetailDescription]: string[];
}

export enum LineQuaFilterSearchFields {
  LineProductName = 'codProducto',
  LineOffererName = 'idOferente',
  LineStateCods = 'codsProductoLineaEstado',
}

export interface LineQuaFilterSearch extends EntityFilterPagination {
  [LineQuaFilterSearchFields.LineProductName]?: number;
  [LineQuaFilterSearchFields.LineOffererName]?: number;
  [LineQuaFilterSearchFields.LineStateCods]?: number[];
}

export enum ProductLineStatusHistoryFields {
  UserId = 'idUsuario',
  UserName = 'razonSocialUsuario',
  Date = 'fecha',
  ProductLineStatusCode = 'codProductoLineaEstado',
  ProductLineStatusDesc = 'descProductoLineaEstado',
  Observations = 'observaciones',
}

export interface ProductLineStatusHistoryView extends EntityWithId<number> {
  [ProductLineStatusHistoryFields.UserId]: number;
  [ProductLineStatusHistoryFields.UserName]: string;
  [ProductLineStatusHistoryFields.Date]: Date;
  [ProductLineStatusHistoryFields.ProductLineStatusCode]: number;
  [ProductLineStatusHistoryFields.ProductLineStatusDesc]: string;
  [ProductLineStatusHistoryFields.Observations]: string;
}

export interface ProductLineRequisiteDetailInsertByCode {
  [key: number]: ProductLineRequisiteDetailInsert[];
}

export type ProductLineFormData = {
  [EntityWithIdFields.Id]: number;
  [ProductLineFields.OffererId]: number;
  [ProductLineFields.Line]: string;
  [ProductLineFields.LineLarge]: string;
  [ProductLineFields.DateLastModified]?: Date;
  [ProductLineFields.ProductLineStatusCode]: number;
  [ProductLineFields.ProductLineStatusDesc]: string;
  [ProductLineFields.ProductTemplateCode]?: number;
  [ProductLineFields.ProductServiceCode]: number;
  [ProductLineFields.ProductInstrumentCode]: number;
  [ProductLineFields.ProductInstrumentTypeCode]?: number;
  [ProductLineFields.ProductCode]: number;
  [ProductLineFields.RateCode]?: number;
  [ProductLineFields.AmortizationCode]?: number;
  [ProductLineFields.Amount]?: number;
  [ProductLineFields.AmountMin]?: number;
  [ProductLineFields.AmountMax]?: number;
  [ProductLineFields.DateSince]?: string;
  [ProductLineFields.DateTo]?: string;
  [ProductLineFields.RateMin]?: number;
  [ProductLineFields.RateMax]?: number;
  [ProductLineFields.RateInformation]?: string;
  [ProductLineFields.MonthsMin]?: number;
  [ProductLineFields.MonthsMax]?: number;
  [ProductLineFields.MonthGrace]?: number;
  [ProductLineFields.Commission]?: number;
  [ProductLineFields.CommissionDesc]?: string;
  [ProductLineFields.Subscription]?: number;
  [ProductLineFields.CoverageGuarantee]?: number;
  [ProductLineFields.Canon]?: string;
  [ProductLineFields.Expenses]?: number;
  [ProductLineFields.HasPeriodGrace]?: string;
  [ProductLineFields.Repurchase]?: string;
  [ProductLineFields.Disclaimer]?: string;
  [ProductLineFields.CurrencyCode]?: number;
  [ProductLineFields.CurrentStageId]?: number;
  [ProductLineFields.FileTypeCode]: number;
  [ProductLineFields.OffererWorkTeamsName]?: string;
  [ProductLineFields.ListRequirements]?: ProductLineRequirementInsert[];
  [ProductLineFields.ListRequisites]?: ProductLineRequisiteDetailInsertByCode;
  [ProductLineFields.ProductLineDescriptions]?: ProductLineDescriptionsView;
  [ProductLineFields.FinancialEntityRelatedIds]?: number[];
};

export enum ProductLineRegisterFields {
  ProductLineId = 'idProductoLinea',
  RegisterDesc = 'descRegistro',
  RegisterDate = 'fechaRegistro',
  DocumentId = 'idDocumento',
  BeginBusinessName = 'razonSocialUsuarioAlta',
}

export interface ProductLineRegister extends EntityWithId<number> {
  [ProductLineRegisterFields.ProductLineId]: number;
  [ProductLineRegisterFields.RegisterDesc]: string;
  [ProductLineRegisterFields.RegisterDate]: Date;
  [ProductLineRegisterFields.DocumentId]: number;
  [ProductLineRegisterFields.BeginBusinessName]: string;
}

export enum ProductLineRegisterPostFields {
  RegisterDesc = 'descRegistro',
  RegisterDate = 'fechaRegistro',
  Files = 'files',
}

export interface ProductLineRegisterPost {
  [ProductLineRegisterPostFields.RegisterDesc]: string;
  [ProductLineRegisterPostFields.RegisterDate]: Date;
  [ProductLineRegisterPostFields.Files]?: File[];
}

export enum ProductLineTotalsViewFields {
  ProductLinesQuantity = 'cantidadProductoLineas',
}

export interface ProductLineTotalsView extends EntityWithIdAndDescription {
  [ProductLineTotalsViewFields.ProductLinesQuantity]: number;
}

export enum ProductLineFilterOptionFields {
  Guid = 'uniIdBusquedaDinamica',
}

export interface ProductLineFilterOption
    extends FilterProductLineSearch,
        MarketIntermediateAnswersFilter {
  [ProductLineFilterOptionFields.Guid]?: string;
}

export interface ProductLineViewSummaryWithPublicationData extends ProductLineViewBasicData {
  [ProductLineFields.ProductLineStatusCode]: number;
  [ProductLineFields.ProductLineStatusDesc]: string;
  [ProductLineFields.ProductInstrumentTypeDesc]: string;
  [ProductLineFields.ProductInstrumentDesc]: string;

  [ProductLineFields.Active]: boolean;
  [ProductLineFields.MessageId]?: number;
  [ProductLineFields.CurrentStageId]?: number;
  [ProductLineFields.DateLastModified]: Date;
  [ProductLineFields.AlertCode]?: number;
}

export enum ProductLineOffererFilterFields {
  LineProductCode = 'codProducto',
  LineServiceCode = 'codProductoServicio',
  LineToolTypeCode = 'codProductoInstrumentoTipo',
  LineStateCods = 'codsProductoLineaEstado',
}

export interface ProductLineOffererFilter extends EntityFilterPagination {
  [ProductLineOffererFilterFields.LineProductCode]?: number;
  [ProductLineOffererFilterFields.LineServiceCode]?: number;
  [ProductLineOffererFilterFields.LineToolTypeCode]?: number;
  [ProductLineOffererFilterFields.LineStateCods]?: number[];
}


export enum ProductLineGondolaFilterFields {
  Name = 'nombre',
  ProductLineFilterGondolaType = 'codProductoLineaGondolaFiltroTipo',
  FilterFieldName = 'nombreCampoFiltro',
  Options = 'opciones',
  Detail = 'detalle'
}


export enum ProductLineFilterGondolaTypes {
  Multiselect = 1,
  Input = 2,
  NumberInput = 3,
  CurrencyInput = 4,
  CurrencyInputWithSelect = 5,
  Boolean = 6
}

export interface ProductLineGondolaFilter {
  [ProductLineGondolaFilterFields.Name]: string;
  [ProductLineGondolaFilterFields.ProductLineFilterGondolaType]: ProductLineFilterGondolaTypes;
  [ProductLineGondolaFilterFields.FilterFieldName]: string;
  [ProductLineGondolaFilterFields.Options]: EntityWithIdAndDescriptionQuantity[];
  [ProductLineGondolaFilterFields.Detail]: string;
}


export enum ProductLineGondolaViewFields {
  Lines = 'lineas',
  Filters = 'filtros'
}

export interface ProductLineGondolaView {
  [ProductLineGondolaViewFields.Lines]: ProductLineView[],
  [ProductLineGondolaViewFields.Filters]: ProductLineGondolaFilter[]
}

export enum ProductLineUserRecommendedFields {
  Title = 'titulo',
  Lines = 'lineas'
}

export interface ProductLineUserRecommended {
  [ProductLineUserRecommendedFields.Title]: string,
  [ProductLineUserRecommendedFields.Lines]: ProductLineView[]
}


export enum ProductLineInternalSelectedLineFormFields {
  Id = 'idProductoLinea',
  Order = 'orden',
  Active = 'activo'
}


export interface ProductLineInternalSelectedLineForm {
  [ProductLineInternalSelectedLineFormFields.Id]: number;
  [ProductLineInternalSelectedLineFormFields.Order]: number | null;
  [ProductLineInternalSelectedLineFormFields.Active]: boolean;
}

export enum ProductLineInternalSelectedFields {
  ProductLineDesc = 'descProductoLinea',
  ProductLineLongDesc = 'descProductoLineaLarga',
  OffererId = 'idOferente',
  OffererBusinessName = 'razonSocialOferente',
  Order = 'orden',
  Active = 'activo'
}


export interface ProductLineInternalSelected extends EntityWithId<number> {
  [ProductLineInternalSelectedFields.ProductLineDesc]: string;
  [ProductLineInternalSelectedFields.ProductLineLongDesc]: string;
  [ProductLineInternalSelectedFields.OffererId]: number;
  [ProductLineInternalSelectedFields.OffererBusinessName]: string;
  [ProductLineInternalSelectedFields.Order]: number;
  [ProductLineInternalSelectedFields.Active]: boolean;
}


export enum ProductLineChosenInsertFields {
  ProductLineId = 'idProductoLinea',
  Order = 'orden',
  Active = 'activo',
}


export interface ProductLineChosenInsert {
  [ProductLineChosenInsertFields.ProductLineId]: number;
  [ProductLineChosenInsertFields.Order]: number;
  [ProductLineChosenInsertFields.Active]: boolean;
}


export enum ProductLineChosenViewFields {
  Order = 'orden',
  Active = 'activo',
  ProposalOrder = 'ordenPropuesta',
  ProposalActive = 'activoPropuesta',
}


export interface ProductLineChosenView extends EntityWithId<number> {
  [ProductLineFields.OffererId]: number;
  [ProductLineFields.OffererBusinessName]: string;
  [ProductLineFields.Line]: string;
  [ProductLineFields.LineLarge]: string;
  [ProductLineChosenViewFields.Order]: number;
  [ProductLineChosenViewFields.Active]: boolean;
  [ProductLineChosenViewFields.ProposalOrder]: number;
  [ProductLineChosenViewFields.ProposalActive]: boolean;
}


export enum ProductLineChosenHistoryFields {
  UserBusinessName = 'razonSocialUsuario',
  Date = 'fecha',
  Observations = 'observaciones'
}

export interface ProductLineChosenHistoryView {
  [ProductLineChosenHistoryFields.UserBusinessName]: string;
  [ProductLineChosenHistoryFields.Date]: Date;
  [ProductLineChosenHistoryFields.Observations]: string;
}


export enum ProductLineRequisiteValidationRequestFields {
    ProductLineIds = 'productoLineaIds',
    CompanyIds = 'empresasIds',
    CheckAll = 'chequeoCompleto'
}


export interface ProductLineRequisiteValidationRequest {
    [ProductLineRequisiteValidationRequestFields.ProductLineIds]: number[];
    [ProductLineRequisiteValidationRequestFields.CompanyIds]: number[];
    [ProductLineRequisiteValidationRequestFields.CheckAll]: boolean;
}


export enum ProductLineRequisiteValidationFields {
    ProductLineId = 'idProductoLinea',
    CompanyId = 'idEmpresa',
    IsValid = 'cumpleRestricciones',
}

export interface ProductLineRequisiteValidation {
    [ProductLineRequisiteValidationFields.ProductLineId]: number;
    [ProductLineRequisiteValidationFields.CompanyId]: number;
    [ProductLineRequisiteValidationFields.IsValid]: boolean;
}