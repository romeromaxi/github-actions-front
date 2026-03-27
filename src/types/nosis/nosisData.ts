import { EntityWithId } from '../baseEntities';
import {
  ContributionStatus,
  SituationTypeCodes,
} from '../general/generalEnums';
import {PersonTypes} from "../person/personEnums";

export enum AfipActivityFields {
  Activity = 'actividad',
  ActivityDesc = 'descActividad',
  SectorDesc = 'descActividadSector',
  Date = 'fechaActividad',
  LevelThreeCLANAENCode = 'codCLANAENivelTres',
  LevelFiveCLANAENCode = 'codCLANAENivelCinco',
  MainActivity = 'esActividadPrincipal',
}

export interface AfipActivity {
  [AfipActivityFields.Activity]: string;
  [AfipActivityFields.ActivityDesc]: string;
  [AfipActivityFields.SectorDesc]: string;
  [AfipActivityFields.Date]: Date;
  [AfipActivityFields.LevelThreeCLANAENCode]: string;
  [AfipActivityFields.LevelFiveCLANAENCode]: string;
  [AfipActivityFields.MainActivity]: boolean;
}

export enum SocialSecurityContributionsFields {
  TotalContributions = 'cantidadAportesPatronalesEmpleadorPagosUltDoceMeses',
  PartialContributions = 'cantidadAportesPatronalesEmpleadorPagoParcialUltDoceMeses',
  UnpaidContributions = 'cantidadAportesPatronalesEmpleadorImpagosUltDoceMeses',
}

export interface SocialSecurityContributions {
  [SocialSecurityContributionsFields.TotalContributions]: number;
  [SocialSecurityContributionsFields.PartialContributions]: number;
  [SocialSecurityContributionsFields.UnpaidContributions]: number;
}

export enum SocialSecurityContributionDetailFields {
  Period = 'periodo',
  SSContribution = 'aporteSegSocial',
  OOSSContribution = 'contribOOSS',
  //no se que nombre ponerle a esto
  OOSSAporte = 'aporteOOSS',
}

export interface SocialSecurityContributionDetail {
  [SocialSecurityContributionDetailFields.Period]: string;
  [SocialSecurityContributionDetailFields.SSContribution]: ContributionStatus;
  [SocialSecurityContributionDetailFields.OOSSContribution]: ContributionStatus;
  [SocialSecurityContributionDetailFields.OOSSAporte]: ContributionStatus;
}

export enum BouncedChequesFields {
  NoFundsQuantity = 'cantidadSinFondosNoPagados',
  NoFundsAmount = 'montoSinFondosNoPagados',
  OthersQuantity = 'cantidadOtrosMotivosNoPagados',
  OthersAmount = 'montoOtrosMotivosNoPagados',
  NoFundsPenaltyQuantity = 'cantidadSinFondosSinPagoMulta',
  NoFundsPenaltyAmount = 'montoSinFondosSinPagoMulta',
  LastTwelveMonthsDisabled = 'inhabilitadoUltimosDoceMeses',
  LastTwelveMonthsEnabledDisabled = 'rehabilitadoConInhabilitaciónUltDoceMeses',
}

export interface BouncedCheques {
  [BouncedChequesFields.NoFundsQuantity]: number;
  [BouncedChequesFields.NoFundsAmount]: number;
  [BouncedChequesFields.OthersQuantity]: number;
  [BouncedChequesFields.OthersAmount]: number;
  [BouncedChequesFields.NoFundsPenaltyQuantity]: number;
  [BouncedChequesFields.NoFundsPenaltyAmount]: number;
  [BouncedChequesFields.LastTwelveMonthsDisabled]: boolean;
  [BouncedChequesFields.LastTwelveMonthsEnabledDisabled]: boolean;
}

export enum BouncedChequeDetailFields {
  CUIT = 'cuitRelacionado',
  PenaltyPaymentDate = 'fechaPagoMulta',
  PenaltyPaid = 'pagoMulta',
  PaymentDate = 'fechaPago',
  Reason = 'causal',
  Amount = 'monto',
  BounceDate = 'fechaRechazo',
  ChequeNumber = 'numeroCheque',
  JudicialName = 'denominacionJudicial',
  ReasonCode = 'codBasesPublicasConsultaChequesRechazadosCausal'
}

export interface BouncedChequeDetail {
  [BouncedChequeDetailFields.CUIT]: string;
  [BouncedChequeDetailFields.PenaltyPaymentDate]: Date;
  [BouncedChequeDetailFields.PenaltyPaid]: boolean;
  [BouncedChequeDetailFields.PaymentDate]: Date | null;
  [BouncedChequeDetailFields.Reason]: string;
  [BouncedChequeDetailFields.Amount]: number;
  [BouncedChequeDetailFields.BounceDate]: Date;
  [BouncedChequeDetailFields.ChequeNumber]: string;
  [BouncedChequeDetailFields.JudicialName]: string | null;
  [BouncedChequeDetailFields.ReasonCode]: NosisQueryChequesReasonCodes | null;
}

export enum NosisQueryChequesReasonCodes {
  FormalDefects = 1,
  WithoutFunds = 2,
  AtRegistration = 3,
  Other = 4
}

export enum BouncedChequePersonTypeDetailFields {
  PersonTypeCode = 'codPersonaTipo',
  Reason = 'causal',
  Quantity = 'cantidadTotal',
  Amount = 'montoTotal',
  UnpaidQuantity = 'cantidadNoPagada',
  UnpaidAmount = 'montoNoPagada',
  PaidQuantity = 'cantidadPagada',
  PaidAmount = 'montoPagada',
}

export interface BouncedChequePersonTypeDetail {
  [BouncedChequePersonTypeDetailFields.PersonTypeCode]: number;
  [BouncedChequePersonTypeDetailFields.Reason]: string;
  [BouncedChequePersonTypeDetailFields.Quantity]: number;
  [BouncedChequePersonTypeDetailFields.Amount]: number;
  [BouncedChequePersonTypeDetailFields.UnpaidQuantity]: number;
  [BouncedChequePersonTypeDetailFields.UnpaidAmount]: number;
  [BouncedChequePersonTypeDetailFields.PaidQuantity]: number;
  [BouncedChequePersonTypeDetailFields.PaidAmount]: number;
}

export enum DebtHistoryDetailFields {
  EntityCode = 'codEntidad',
  Period = 'periodo',
  SituationCode = 'situacion',
  Amount = 'monto',
}

export interface DebtHistoryDetail {
  [DebtHistoryDetailFields.EntityCode]: string;
  [DebtHistoryDetailFields.Period]: string;
  [DebtHistoryDetailFields.SituationCode]: SituationTypeCodes;
  [DebtHistoryDetailFields.Amount]: number;
}

export enum CurrentDebtFields {
  SitOneAmount = 'montoSituacionUno',
  SitOneQuantity = 'cantidadSituacionUno',
  SitTwoAmount = 'montoSituacionDos',
  SitTwoQuantity = 'cantidadSituacionDos',
  SitThreeAmount = 'montoSituacionTres',
  SitThreeQuantity = 'cantidadSituacionTres',
  SitFourAmount = 'montoSituacionCuatro',
  SitFourQuantity = 'cantidadSituacionCuatro',
  SitFiveAmount = 'montoSituacionCinco',
  SitFiveQuantity = 'cantidadSituacionCinco',
  SitSixAmount = 'montoSituacionSeis',
  SitSixQuantity = 'cantidadSituacionSeis',
  OverdraftAmount = 'lineaDescubiertoCuentaCorrienteMonto',
  OverdraftQuantity = 'lineaDescubiertoCuentaCorrienteCantidad',
}

export interface CurrentDebt {
  [CurrentDebtFields.SitOneAmount]: number;
  [CurrentDebtFields.SitOneQuantity]: number;
  [CurrentDebtFields.SitTwoAmount]: number;
  [CurrentDebtFields.SitTwoQuantity]: number;
  [CurrentDebtFields.SitThreeAmount]: number;
  [CurrentDebtFields.SitThreeQuantity]: number;
  [CurrentDebtFields.SitFourAmount]: number;
  [CurrentDebtFields.SitFourQuantity]: number;
  [CurrentDebtFields.SitFiveAmount]: number;
  [CurrentDebtFields.SitFiveQuantity]: number;
  [CurrentDebtFields.SitSixAmount]: number;
  [CurrentDebtFields.SitSixQuantity]: number;
  [CurrentDebtFields.OverdraftAmount]: number;
  [CurrentDebtFields.OverdraftQuantity]: number;
}

export enum CurrentDebtDetailFields {
  EntityCode = 'codEntidad',
  Entity = 'descEntidad',
  SituationCode = 'situacion',
  Period = 'periodo',
  Amount = 'monto',
  Percentage = 'porcentaje',
  DaysUnpaid = 'cantidadDiasAtraso',
}

export interface CurrentDebtDetail {
  [CurrentDebtDetailFields.EntityCode]: string;
  [CurrentDebtDetailFields.Entity]: string;
  [CurrentDebtDetailFields.SituationCode]: SituationTypeCodes;
  [CurrentDebtDetailFields.Period]: string;
  [CurrentDebtDetailFields.Amount]: number;
  [CurrentDebtDetailFields.Percentage]: number;
  [CurrentDebtDetailFields.DaysUnpaid]: number;
}

export enum BalanceFields {
  LastBalanceDate = 'fechaUltimoBalance',
  CurrentActive = 'montoActivoCorriente',
  NonCurrentActive = 'montoActivoNoCorriente',
  ActiveTotal = 'montoActivoTotal',
  CurrentPassive = 'montoPasivoCorriente',
  NonCurrentPassive = 'montoPasivoNoCorriente',
  PassiveTotal = 'montoPasivoTotal',
  NetWorth = 'montoPatrimonioNeto',
  FiscalYearResult = 'montoResultadoEjercicio',
  NetIncome = 'montoVentasNetas',
  EstimatedBilling = 'facturacionEstimada',
  MaxOpening = 'maximaApertura',
}

export interface Balance {
  [BalanceFields.LastBalanceDate]: Date;
  [BalanceFields.CurrentActive]: number;
  [BalanceFields.NonCurrentActive]: number;
  [BalanceFields.ActiveTotal]: number;
  [BalanceFields.CurrentPassive]: number;
  [BalanceFields.NonCurrentPassive]: number;
  [BalanceFields.PassiveTotal]: number;
  [BalanceFields.NetWorth]: number;
  [BalanceFields.FiscalYearResult]: number;
  [BalanceFields.NetIncome]: number;
  [BalanceFields.EstimatedBilling]: number;
  [BalanceFields.MaxOpening]: number;
}

export enum IdentityFields {
  BusinessName = 'razonSocial',
  Identification = 'identificacion',
  LastName = 'apellido',
  FirstName = 'nombre',
  Gender = 'sexo',
  Birthdate = 'fechaNacimiento',
  PersonTypeCode = 'codPersonaTipo',
  PartnerTypeDesc = 'tipoSocietario',
  IsSocietyPartner = 'esIntegranteSociedad',
  IsMonotributista = 'esMonotributista',
  AfipSeniority = 'antiguedadAFIP',
  CompanyAge = 'edadEmpresa',
  EmployeeQuantity = 'cantidadEmpleados',
  FiscalAddressStreet = 'domicilioFiscalCalle',
  FiscalAddressNumber = 'domicilioFiscalNro',
  FiscalAddressFloor = 'domicilioFiscalPiso',
  FiscalAddressApartment = 'domicilioFiscalDepto',
  FiscalAddressMunicipality = 'domicilioFiscalLocalidad',
  FiscalAddressZipCode = 'domicilioFiscalCP',
  FiscalAddressProvince = 'domicilioFiscalProvincia',
  SocialContractDate = 'fechaContratoSocial',
  AfipRegistrationDate = 'fechaInscripcionAFIP',
}

export interface Identity {
  [IdentityFields.BusinessName]: string;
  [IdentityFields.Identification]: string;
  [IdentityFields.LastName]: string;
  [IdentityFields.FirstName]: string;
  [IdentityFields.Gender]: string;
  [IdentityFields.Birthdate]: Date;
  [IdentityFields.PersonTypeCode]: number;
  [IdentityFields.PartnerTypeDesc]: string;
  [IdentityFields.IsSocietyPartner]: boolean;
  [IdentityFields.IsMonotributista]: boolean;
  [IdentityFields.AfipSeniority]: number;
  [IdentityFields.CompanyAge]: number;
  [IdentityFields.EmployeeQuantity]: number;
  [IdentityFields.FiscalAddressStreet]: string;
  [IdentityFields.FiscalAddressNumber]: string;
  [IdentityFields.FiscalAddressFloor]: string;
  [IdentityFields.FiscalAddressApartment]: string;
  [IdentityFields.FiscalAddressMunicipality]: string;
  [IdentityFields.FiscalAddressZipCode]: string;
  [IdentityFields.FiscalAddressProvince]: string;
  [IdentityFields.SocialContractDate]?: Date;
  [IdentityFields.AfipRegistrationDate]?: Date;
}

export enum MetricsFields {
  Scoring = 'nroScoring',
  ThreeMonthTrendScoring = 'nroScoringTendenciaTresMeses',
  ThreeMonthTrendScoringDesc = 'descScoringTendenciaTresMeses',
  SixMonthTrendScoring = 'nroScoringTendenciaSeisMeses',
  SixMonthTrendScoringDesc = 'descScoringTendenciaSeisMeses',
  NineMonthTrendScoring = 'nroScoringTendenciaNueveMeses',
  NineMonthTrendScoringDesc = 'descScoringTendenciaNueveMeses',
  TwelveMonthTrendScoring = 'nroScoringTendenciaDoceMeses',
  TwelveMonthTrendScoringDesc = 'descScoringTendenciaDoceMeses',
  ServiceScoring = 'nroScoringServicio',
}

export interface Metrics {
  [MetricsFields.Scoring]: number;
  [MetricsFields.ThreeMonthTrendScoring]: number;
  [MetricsFields.ThreeMonthTrendScoringDesc]: string;
  [MetricsFields.SixMonthTrendScoring]: number;
  [MetricsFields.SixMonthTrendScoringDesc]: string;
  [MetricsFields.NineMonthTrendScoring]: number;
  [MetricsFields.NineMonthTrendScoringDesc]: string;
  [MetricsFields.TwelveMonthTrendScoring]: number;
  [MetricsFields.TwelveMonthTrendScoringDesc]: string;
  [MetricsFields.ServiceScoring]: number;
}

export enum NosisDetailQueryFields {
  PersonId = 'idPersona',
  Date = 'fecha',
  ProcessDateCheques = 'fechaProcesoCheque',
  ProcessDateDebt = 'fechaProcesoDeuda',
  BouncedChequesApproved = 'tieneAprobadoChequesRechazados',
  SocialSecurityContributionsApproved = 'tieneAprobadoAportesPatronales',
  BankDebtApproved = 'tieneAprobadoDeudaBanco',
  BureauProfileClasificationCode = 'codBasesPublicasConsultaPerfilClasificacion',
  Valid = 'esValida',
  StatusDesc = 'descripcionEstado',
  Identity = 'identidad',
  Metrics = 'metricas',
  AfipActivityList = 'listaActividadesAFIP',
  SocialSecurityContributions = 'aportePatronalEmpleador',
  SocialSecurityContributionsDetailList = 'listaAportesPatronalesEmpleador',
  BouncedCheques = 'chequesRechazados',
  BouncedChequesDetailList = 'listaChequesRechazadosDetalle',
  BouncedChequesPersonTypeDetailList = 'listaChequesRechazadosDetallePersonaTipo',
  DebtHistoryDetailList = 'listaEndeudamientoHisotricoDetalle',
  CurrentDebt = 'endeudamientoVigente',
  CurrentDebtDetailList = 'listaEndeudamientoVigenteDetalle',
  Balance = 'facturacionBalance',
  IdentityTaxesList = 'listaIdentidadImpuesto',
  Summary = 'resumen',
  CurrentDebtLastTwelveMonthsLst = 'listaEndeudamientoVigenteUltimos12Meses',
  ProvidersByCategory = 'proveedoresPorCategoria'
}


export enum FinanceIndicatorsFields {
  CurrentLiquidity = 'liquidezCorriente',
  Indebtedness = 'endeudamiento',
  Profitability = 'rentabilidad',
  Solvency = 'solvencia',
}

export interface FinanceIndicators {
  [FinanceIndicatorsFields.CurrentLiquidity]?: number;
  [FinanceIndicatorsFields.Indebtedness]?: number;
  [FinanceIndicatorsFields.Profitability]?: number;
  [FinanceIndicatorsFields.Solvency]?: number;
}

export enum NosisDetailSummaryFields {
  CurrentDebt = 'endeudamientoVigente',
  BouncedCheques = 'chequesRechazados',
  Contributions = 'aportePatronal',
  FinanceIndicators = 'indicadoresFinancieros',
  Scoring = 'nroScoring'
}

export interface NosisDetailSummary {
  [NosisDetailSummaryFields.CurrentDebt]: CurrentDebt,
  [NosisDetailSummaryFields.BouncedCheques]: BouncedCheques,
  [NosisDetailSummaryFields.Contributions]: SocialSecurityContributions,
  [NosisDetailSummaryFields.FinanceIndicators]: FinanceIndicators,
  [NosisDetailSummaryFields.Scoring]?: number
}


export enum NosisTabSection {
  PersonIdentity = 1,
  AfipActivity = 2,
  EmployerContributions = 3,
  RejectedCheques = 4,
  CurrentEndebtness = 5,
  HistoricEndebtness = 6,
  BalanceBilling = 7,
  ScoreMetric = 8,
  PersonIdentityTaxes = 9
}

export enum PublicDataProvidersFields {
  ProviderName = 'nombreProveedor',
  RequestDate = 'fechaConsulta'
}

export interface PublicDataProviders {
    [PublicDataProvidersFields.ProviderName]: string;
    [PublicDataProvidersFields.RequestDate]: Date;
}

export enum BureauProfileClasificationTypes {
    Excellent = 1,
    GoodWithHistory = 2,
    Recoverable = 3,
    Irrecoverable = 4
}

export interface NosisDetailQuery {
  [NosisDetailQueryFields.PersonId]: number;
  [NosisDetailQueryFields.Date]?: Date;
  [NosisDetailQueryFields.ProcessDateCheques]?: Date;
  [NosisDetailQueryFields.ProcessDateDebt]?: Date;
  [NosisDetailQueryFields.BouncedChequesApproved]: boolean;
  [NosisDetailQueryFields.SocialSecurityContributionsApproved]: boolean;
  [NosisDetailQueryFields.BankDebtApproved]: boolean;
  [NosisDetailQueryFields.BureauProfileClasificationCode]?: BureauProfileClasificationTypes;
  [NosisDetailQueryFields.Valid]: boolean;
  [NosisDetailQueryFields.StatusDesc]: string;
  [NosisDetailQueryFields.Identity]: Identity;
  [NosisDetailQueryFields.Metrics]: Metrics;
  [NosisDetailQueryFields.AfipActivityList]: AfipActivity[];
  [NosisDetailQueryFields.SocialSecurityContributions]: SocialSecurityContributions;
  [NosisDetailQueryFields.SocialSecurityContributionsDetailList]: SocialSecurityContributionDetail[];
  [NosisDetailQueryFields.BouncedCheques]: BouncedCheques;
  [NosisDetailQueryFields.BouncedChequesDetailList]: BouncedChequeDetail[];
  [NosisDetailQueryFields.BouncedChequesPersonTypeDetailList]: BouncedChequePersonTypeDetail[];
  [NosisDetailQueryFields.DebtHistoryDetailList]: DebtHistoryDetail[];
  [NosisDetailQueryFields.CurrentDebt]: CurrentDebt;
  [NosisDetailQueryFields.CurrentDebtDetailList]: CurrentDebtDetail[];
  [NosisDetailQueryFields.Balance]: Balance;
  [NosisDetailQueryFields.IdentityTaxesList]: IdentityTaxes[];
  [NosisDetailQueryFields.Summary]: NosisDetailSummary;
  [NosisDetailQueryFields.CurrentDebtLastTwelveMonthsLst]: CurrentDebtLastTwelveMonths[];
  [NosisDetailQueryFields.ProvidersByCategory]: Record<NosisTabSection, PublicDataProviders>
}

export enum NosisQueryFields {
  BusinessName = 'razonSocial',
  Date = 'fecha',
  BouncedChequesApproved = 'tieneAprobadoChequesRechazados',
  SocialSecurityContributionsApproved = 'tieneAprobadoAportesPatronales',
  BankDebtApproved = 'tieneAprobadoDeudaBanco',
  Scoring = 'nroScoring',
  CUIT = 'cuit',
  PersonTypeCode = 'codPersonaTipo',
  IsDefaultPerson = 'esPersonaDefault',
}

export interface NosisQuery extends EntityWithId<number> {
  [NosisQueryFields.BusinessName]: string;
  [NosisQueryFields.CUIT]: string;
  [NosisQueryFields.PersonTypeCode]?: PersonTypes;
  [NosisQueryFields.Date]: Date;
  [NosisQueryFields.BouncedChequesApproved]: boolean;
  [NosisQueryFields.SocialSecurityContributionsApproved]: boolean;
  [NosisQueryFields.BankDebtApproved]: boolean;
  [NosisQueryFields.Scoring]: number;
  [NosisQueryFields.IsDefaultPerson]?: boolean;
}

export enum NosisTotalFields {
  Description = 'descripcion',
  Quantity = 'cantidad',
  Amount = 'monto',
}

export interface NosisTotal {
  [NosisTotalFields.Description]: string;
  [NosisTotalFields.Quantity]: number;
  [NosisTotalFields.Amount]: number;
}

export enum NosisSummaryQueryFields {
  PersonId = 'idPersona',
  BusinessName = 'razonSocial',
  TotalCurrentDebt = 'totalesEndeudamientoVigente',
  BouncedChequesBCRA = 'chequesRechazadosBCRA',
  SocialSecurityContributions = 'aportePatronalEmpleador',
  Scoring = 'nroScoring',

  BouncedChequesApproved = 'tieneAprobadoChequesRechazados',
  SocialSecurityContributionsApproved = 'tieneAprobadoAportesPatronales',
  BankDebtApproved = 'tieneAprobadoDeudaBanco',
}

export interface NosisSummaryQuery extends EntityWithId<number> {
  [NosisSummaryQueryFields.PersonId]: number;
  [NosisSummaryQueryFields.BusinessName]: string;
  [NosisSummaryQueryFields.TotalCurrentDebt]: NosisTotal[];
  [NosisSummaryQueryFields.BouncedChequesBCRA]: BouncedCheques;
  [NosisSummaryQueryFields.SocialSecurityContributions]: SocialSecurityContributions;
  [NosisSummaryQueryFields.Scoring]: number;

  [NosisSummaryQueryFields.BouncedChequesApproved]: boolean;
  [NosisSummaryQueryFields.SocialSecurityContributionsApproved]: boolean;
  [NosisSummaryQueryFields.BankDebtApproved]: boolean;
}

export enum SituationTypeFields {
  Description = 'descripcion',
  LongDesc = 'descEndeudamientoSituacionTipoLarga',
}

export interface SituationType extends EntityWithId<SituationTypeCodes> {
  [SituationTypeFields.Description]: string;
  [SituationTypeFields.LongDesc]: string;
}

export enum IdentityTaxesFields {
  TaxDescription = 'descripcionImpuesto',
  TaxId = 'idImpuesto',
  Period = 'periodo',
}

export interface IdentityTaxes {
  [IdentityTaxesFields.TaxDescription]: string;
  [IdentityTaxesFields.TaxId]: string;
  [IdentityTaxesFields.Period]: string;
}


export enum CurrentDebtLastTwelveMonthsFields {
  EntityCode = 'codEntidad',
  Entity = 'entidad',
  Period = 'periodo',
  Amount = 'monto',
  Situation = 'situacion',
  DebtSituationTypeDesc = 'descEndeudamientoSituacionTipo',
  DebtSituationLongTypeDesc = 'descEndeudamientoSituacionTipoLarga'
}


export interface CurrentDebtLastTwelveMonths {
  [CurrentDebtLastTwelveMonthsFields.EntityCode]: string;
  [CurrentDebtLastTwelveMonthsFields.Entity]: string;
  [CurrentDebtLastTwelveMonthsFields.Period]: string;
  [CurrentDebtLastTwelveMonthsFields.Amount]?: number;
  [CurrentDebtLastTwelveMonthsFields.Situation]?: SituationTypeCodes;
  [CurrentDebtLastTwelveMonthsFields.DebtSituationTypeDesc]: string;
  [CurrentDebtLastTwelveMonthsFields.DebtSituationLongTypeDesc]: string;
}
