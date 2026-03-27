import { EntityWithId, EntityWithIdFields } from '../baseEntities';
import { Sections } from '../general/generalEnums';
import {
    PatrimonialStatement,
    PatrimonialStatementFields,
    FinancialYear, IncomeStatement, IncomeStatementFields, FinancialYearFields
} from "../general/generalFinanceData";

export enum CompanyFinancialYearFields {
  CompanyId = 'idEmpresa'
}

export interface CompanyFinancialYear extends FinancialYear {
  [CompanyFinancialYearFields.CompanyId]: number;
}


export enum CompanyBasePatrimonialStatementFields {
  FinancialYearId = 'idEmpresaEjercicio',
  CompanyId = 'idEmpresa',
  Year = 'anio'
}

export interface CompanyBasePatrimonialStatement extends PatrimonialStatement {
  [CompanyBasePatrimonialStatementFields.FinancialYearId]: number;
  [CompanyBasePatrimonialStatementFields.CompanyId]: number;
  [CompanyBasePatrimonialStatementFields.Year]: number;
}

export enum CompanyPatrimonialStatementFields {
  LastPatrimonialStatement = 'estadoPatrimonialAnterior',
}

export interface CompanyPatrimonialStatement
  extends CompanyBasePatrimonialStatement {
  [CompanyPatrimonialStatementFields.LastPatrimonialStatement]: CompanyBasePatrimonialStatement;
}

export const companyPatrimonialStatementInitial: CompanyBasePatrimonialStatement =
  {
    [EntityWithIdFields.Id]: 0,
    [CompanyBasePatrimonialStatementFields.FinancialYearId]: 0,
    [CompanyBasePatrimonialStatementFields.CompanyId]: 0,
    [CompanyBasePatrimonialStatementFields.Year]: 0,

    [PatrimonialStatementFields.ActiveCurrentCashBanks]: 0,
    [PatrimonialStatementFields.ActiveCurrentInvestments]: 0,
    [PatrimonialStatementFields.ActiveCurrentOtherReceivables]: 0,
    [PatrimonialStatementFields.ActiveCurrentExchangeThing]: 0,
    [PatrimonialStatementFields.ActiveCurrentOthers]: 0,
    [PatrimonialStatementFields.ActiveCurrentTotal]: 0,

    [PatrimonialStatementFields.ActiveNotCurrentSalesReceivables]: 0,
    [PatrimonialStatementFields.ActiveNotCurrentOtherReceivables]: 0,
    [PatrimonialStatementFields.ActiveNotCurrentExchangeThing]: 0,
    [PatrimonialStatementFields.ActiveNotCurrentThingOfUse]: 0,
    [PatrimonialStatementFields.ActiveNotCurrentInvestments]: 0,
    [PatrimonialStatementFields.ActiveNotCurrentIntangibles]: 0,
    [PatrimonialStatementFields.ActiveNotCurrentDeferredTaxes]: 0,
    [PatrimonialStatementFields.ActiveNotCurrentPermanentParticipations]: 0,
    [PatrimonialStatementFields.ActiveNotCurrentOthers]: 0,
    [PatrimonialStatementFields.ActiveNotCurrentTotal]: 0,

    [PatrimonialStatementFields.ActiveTotal]: 0,

    [PatrimonialStatementFields.PassiveCurrentCommercialDebt]: 0,
    [PatrimonialStatementFields.PassiveCurrentLoans]: 0,
    [PatrimonialStatementFields.PassiveCurrentRemunerationsSocialCharges]: 0,
    [PatrimonialStatementFields.PassiveCurrentFiscalCharges]: 0,
    [PatrimonialStatementFields.PassiveCurrentCustomerAdvances]: 0,
    [PatrimonialStatementFields.PassiveCurrentDividendsPayable]: 0,
    [PatrimonialStatementFields.PassiveCurrentOtherDebts]: 0,
    [PatrimonialStatementFields.PassiveCurrentProvisions]: 0,
    [PatrimonialStatementFields.PassiveCurrentTotal]: 0,

    [PatrimonialStatementFields.PassiveNotCurrentCommercialDebt]: 0,
    [PatrimonialStatementFields.PassiveNotCurrentLoans]: 0,
    [PatrimonialStatementFields.PassiveNotCurrentRemunerationsSocialCharges]: 0,
    [PatrimonialStatementFields.PassiveNotCurrentFiscalCharges]: 0,
    [PatrimonialStatementFields.PassiveNotCurrentCustomerAdvances]: 0,
    [PatrimonialStatementFields.PassiveNotCurrentDividendsPayable]: 0,
    [PatrimonialStatementFields.PassiveNotCurrentOtherDebts]: 0,
    [PatrimonialStatementFields.PassiveNotCurrentProvisions]: 0,
    [PatrimonialStatementFields.PassiveNotCurrentTotal]: 0,

    [PatrimonialStatementFields.PassiveTotal]: 0,

    [PatrimonialStatementFields.NetPatrimonyTotal]: 0,

    [PatrimonialStatementFields.IsValid]: false,
  };

export const patrimonialStatementInitial: PatrimonialStatement =
    {
        [EntityWithIdFields.Id]: 0,
        [FinancialYearFields.Year]: 0,

        [PatrimonialStatementFields.ActiveCurrentCashBanks]: 0,
        [PatrimonialStatementFields.ActiveCurrentInvestments]: 0,
        [PatrimonialStatementFields.ActiveCurrentOtherReceivables]: 0,
        [PatrimonialStatementFields.ActiveCurrentExchangeThing]: 0,
        [PatrimonialStatementFields.ActiveCurrentOthers]: 0,
        [PatrimonialStatementFields.ActiveCurrentTotal]: 0,

        [PatrimonialStatementFields.ActiveNotCurrentSalesReceivables]: 0,
        [PatrimonialStatementFields.ActiveNotCurrentOtherReceivables]: 0,
        [PatrimonialStatementFields.ActiveNotCurrentExchangeThing]: 0,
        [PatrimonialStatementFields.ActiveNotCurrentThingOfUse]: 0,
        [PatrimonialStatementFields.ActiveNotCurrentInvestments]: 0,
        [PatrimonialStatementFields.ActiveNotCurrentIntangibles]: 0,
        [PatrimonialStatementFields.ActiveNotCurrentDeferredTaxes]: 0,
        [PatrimonialStatementFields.ActiveNotCurrentPermanentParticipations]: 0,
        [PatrimonialStatementFields.ActiveNotCurrentOthers]: 0,
        [PatrimonialStatementFields.ActiveNotCurrentTotal]: 0,

        [PatrimonialStatementFields.ActiveTotal]: 0,

        [PatrimonialStatementFields.PassiveCurrentCommercialDebt]: 0,
        [PatrimonialStatementFields.PassiveCurrentLoans]: 0,
        [PatrimonialStatementFields.PassiveCurrentRemunerationsSocialCharges]: 0,
        [PatrimonialStatementFields.PassiveCurrentFiscalCharges]: 0,
        [PatrimonialStatementFields.PassiveCurrentCustomerAdvances]: 0,
        [PatrimonialStatementFields.PassiveCurrentDividendsPayable]: 0,
        [PatrimonialStatementFields.PassiveCurrentOtherDebts]: 0,
        [PatrimonialStatementFields.PassiveCurrentProvisions]: 0,
        [PatrimonialStatementFields.PassiveCurrentTotal]: 0,

        [PatrimonialStatementFields.PassiveNotCurrentCommercialDebt]: 0,
        [PatrimonialStatementFields.PassiveNotCurrentLoans]: 0,
        [PatrimonialStatementFields.PassiveNotCurrentRemunerationsSocialCharges]: 0,
        [PatrimonialStatementFields.PassiveNotCurrentFiscalCharges]: 0,
        [PatrimonialStatementFields.PassiveNotCurrentCustomerAdvances]: 0,
        [PatrimonialStatementFields.PassiveNotCurrentDividendsPayable]: 0,
        [PatrimonialStatementFields.PassiveNotCurrentOtherDebts]: 0,
        [PatrimonialStatementFields.PassiveNotCurrentProvisions]: 0,
        [PatrimonialStatementFields.PassiveNotCurrentTotal]: 0,

        [PatrimonialStatementFields.PassiveTotal]: 0,

        [PatrimonialStatementFields.NetPatrimonyTotal]: 0,

        [PatrimonialStatementFields.IsValid]: false,
    };

export enum CompanyIncomeStatementFields {
  FinancialYearId = 'idEmpresaEjercicio',
  CompanyId = 'idEmpresa',
  Year = 'anio',
}

export interface CompanyIncomeStatement extends IncomeStatement {
  [CompanyIncomeStatementFields.FinancialYearId]: number;
  [CompanyIncomeStatementFields.CompanyId]: number;
  [CompanyIncomeStatementFields.Year]: number;
}

export enum CompanyIncomeLastYearStatementFields {
  LastYearIncomeStatement = 'estadoResultadoAnterior',
}

export interface CompanyIncomeLastYearStatement extends CompanyIncomeStatement {
  [CompanyIncomeLastYearStatementFields.LastYearIncomeStatement]: CompanyIncomeStatement;
}

export const companyIncomeStatementInitial: CompanyIncomeStatement = {
  [EntityWithIdFields.Id]: 0,
  [CompanyIncomeStatementFields.FinancialYearId]: 0,
  [CompanyIncomeStatementFields.CompanyId]: 0,
  [CompanyIncomeStatementFields.Year]: 0,

  [IncomeStatementFields.IncomeSales]: 0,
  [IncomeStatementFields.IncomeTotal]: 0,
  [IncomeStatementFields.EgressCMV]: 0,
  [IncomeStatementFields.EgressExpenseAdministrative]: 0,
  [IncomeStatementFields.EgressExpenseManufacturing]: 0,
  [IncomeStatementFields.EgressExpenseMarketing]: 0,
  [IncomeStatementFields.EgressExpenseFinancial]: 0,
  [IncomeStatementFields.EgressOtherIncomeExpenses]: 0,
  [IncomeStatementFields.EgressATP]: 0,
  [IncomeStatementFields.EgressResultsSalesThingOfUse]: 0,
  [IncomeStatementFields.EgressRECPAM]: 0,
  [IncomeStatementFields.EgressTotal]: 0,
  [IncomeStatementFields.NetResult]: 0,
  [IncomeStatementFields.AmortizationTotal]: 0,
};

export const incomeStatementInitial: IncomeStatement = {
    [EntityWithIdFields.Id]: 0,
    [FinancialYearFields.Year]: 0,

    [IncomeStatementFields.IncomeSales]: 0,
    [IncomeStatementFields.IncomeTotal]: 0,
    [IncomeStatementFields.EgressCMV]: 0,
    [IncomeStatementFields.EgressExpenseAdministrative]: 0,
    [IncomeStatementFields.EgressExpenseManufacturing]: 0,
    [IncomeStatementFields.EgressExpenseMarketing]: 0,
    [IncomeStatementFields.EgressExpenseFinancial]: 0,
    [IncomeStatementFields.EgressOtherIncomeExpenses]: 0,
    [IncomeStatementFields.EgressATP]: 0,
    [IncomeStatementFields.EgressResultsSalesThingOfUse]: 0,
    [IncomeStatementFields.EgressRECPAM]: 0,
    [IncomeStatementFields.EgressTotal]: 0,
    [IncomeStatementFields.NetResult]: 0,
    [IncomeStatementFields.AmortizationTotal]: 0,
};

export enum CompanyFinanceHeaderFields {
  CompanyId = 'idEmpresa',
  Date = 'fecha',
  ActiveTotal = 'activo_Total',
  PassiveTotal = 'pasivo_Total',
  DocumentsQuantity = 'cantidadDocumentos',
  NetPatrimonyTotal = 'patrimonioNeto_Total',
  GrossProfitTotal = 'resultadoBruto_Total',
  TotalResult = 'resultado_Total',
}

export interface CompanyFinanceHeader extends EntityWithId<number> {
  [CompanyFinanceHeaderFields.CompanyId]: number;
  [CompanyFinanceHeaderFields.Date]: Date;
  [CompanyFinanceHeaderFields.ActiveTotal]: number;
  [CompanyFinanceHeaderFields.PassiveTotal]: number;
  [CompanyFinanceHeaderFields.DocumentsQuantity]?: number;
  [CompanyFinanceHeaderFields.NetPatrimonyTotal]: number;
  [CompanyFinanceHeaderFields.GrossProfitTotal]: number;
  [CompanyFinanceHeaderFields.TotalResult]: number;
}


export enum CompanyDeclarationOfAssetsInsertFields {
    Year = 'anio',
    Date = 'fecha'
}

export interface CompanyDeclarationOfAssetsInsert {
    [CompanyDeclarationOfAssetsInsertFields.Year]: number;
}

export enum CompanyFinanceHeaderBySectionFields {
  Section = 'section',
}

export interface CompanyFinanceHeaderSection extends CompanyFinanceHeader {
  [CompanyFinanceHeaderBySectionFields.Section]: Sections;
}

export enum CompanyAffidavitFields {
  CompanyId = 'idEmpresa',
  Date = 'fecha',

  CountryAssets_Buildings = 'bienesPais_Inmuebles',
  CountryAssets_RealRights = 'bienesPais_DerechosReales',
  CountryAssets_Cars = 'bienesPais_Automotores',
  CountryAssets_Vessels = 'bienesPais_Naves',
  CountryAssets_Aircraft = 'bienesPais_Aeronaves',
  CountryAssets_PatrimonyCompanyUnipersonalExploitation = 'bienesPais_PatrimonioEmpresaEmplotacionUnipersonal',
  CountryAssets_Shares = 'bienesPais_Acciones',
  CountryAssets_PublicPrivateDegrees = 'bienesPais_TitulosPublicosYPrivados',
  CountryAssets_Credits = 'bienesPais_Creditos',
  CountryAssets_MoneyDeposits = 'bienesPais_DepositosEnDinero',
  CountryAssets_Cash = 'bienesPais_DineroEnEfectivo',
  CountryAssets_MovableAssetsRegistered = 'bienesPais_BienesMueblesRegistrados',
  CountryAssets_OtherAssets = 'bienesPais_OtrosBienes',
  CountryAssets_HouseholdAssets = 'bienesPais_BienesEnHogar',
  CountryAssets_Total = 'bienesPais_Total',

  ExteriorAssets_Buildings = 'bienesExterior_Inmuebles',
  ExteriorAssets_RealRights = 'bienesExterior_DerechosReales',
  ExteriorAssets_Cars = 'bienesExterior_Automotores',
  ExteriorAssets_Credits = 'bienesExterior_Creditos',
  ExteriorAssets_MoneyDeposits = 'bienesExterior_DepositosEnDinero',
  ExteriorAssets_MovableAssetsRoving = 'bienesExterior_BienesMueblesSemovientes',
  ExteriorAssets_Degree = 'bienesExterior_Titulos',
  ExteriorAssets_OtherAssets = 'bienesExterior_OtrosBienes',
  ExteriorAssets_Total = 'bienesExterior_Total',
}

export interface CompanyAffidavit extends EntityWithId<number> {
  [CompanyAffidavitFields.CompanyId]: number;
  [CompanyAffidavitFields.Date]: Date;

  [CompanyAffidavitFields.CountryAssets_Buildings]: number;
  [CompanyAffidavitFields.CountryAssets_RealRights]: number;
  [CompanyAffidavitFields.CountryAssets_Cars]: number;
  [CompanyAffidavitFields.CountryAssets_Vessels]: number;
  [CompanyAffidavitFields.CountryAssets_Aircraft]: number;
  [CompanyAffidavitFields.CountryAssets_PatrimonyCompanyUnipersonalExploitation]: number;
  [CompanyAffidavitFields.CountryAssets_Shares]: number;
  [CompanyAffidavitFields.CountryAssets_PublicPrivateDegrees]: number;
  [CompanyAffidavitFields.CountryAssets_Credits]: number;
  [CompanyAffidavitFields.CountryAssets_MoneyDeposits]: number;
  [CompanyAffidavitFields.CountryAssets_Cash]: number;
  [CompanyAffidavitFields.CountryAssets_MovableAssetsRegistered]: number;
  [CompanyAffidavitFields.CountryAssets_OtherAssets]: number;
  [CompanyAffidavitFields.CountryAssets_HouseholdAssets]: number;
  [CompanyAffidavitFields.CountryAssets_Total]: number;

  [CompanyAffidavitFields.ExteriorAssets_Buildings]: number;
  [CompanyAffidavitFields.ExteriorAssets_RealRights]: number;
  [CompanyAffidavitFields.ExteriorAssets_Cars]: number;
  [CompanyAffidavitFields.ExteriorAssets_Credits]: number;
  [CompanyAffidavitFields.ExteriorAssets_MoneyDeposits]: number;
  [CompanyAffidavitFields.ExteriorAssets_MovableAssetsRoving]: number;
  [CompanyAffidavitFields.ExteriorAssets_Degree]: number;
  [CompanyAffidavitFields.ExteriorAssets_OtherAssets]: number;
  [CompanyAffidavitFields.ExteriorAssets_Total]: number;
}

export const CompanyAffidavitInitialState: CompanyAffidavit = {
  [EntityWithIdFields.Id]: 0,
  [CompanyAffidavitFields.CompanyId]: 0,
  [CompanyAffidavitFields.Date]: new Date(''),

  [CompanyAffidavitFields.CountryAssets_Buildings]: 0,
  [CompanyAffidavitFields.CountryAssets_RealRights]: 0,
  [CompanyAffidavitFields.CountryAssets_Cars]: 0,
  [CompanyAffidavitFields.CountryAssets_Vessels]: 0,
  [CompanyAffidavitFields.CountryAssets_Aircraft]: 0,
  [CompanyAffidavitFields.CountryAssets_PatrimonyCompanyUnipersonalExploitation]: 0,
  [CompanyAffidavitFields.CountryAssets_Shares]: 0,
  [CompanyAffidavitFields.CountryAssets_PublicPrivateDegrees]: 0,
  [CompanyAffidavitFields.CountryAssets_Credits]: 0,
  [CompanyAffidavitFields.CountryAssets_MoneyDeposits]: 0,
  [CompanyAffidavitFields.CountryAssets_Cash]: 0,
  [CompanyAffidavitFields.CountryAssets_MovableAssetsRegistered]: 0,
  [CompanyAffidavitFields.CountryAssets_OtherAssets]: 0,
  [CompanyAffidavitFields.CountryAssets_HouseholdAssets]: 0,
  [CompanyAffidavitFields.CountryAssets_Total]: 0,

  [CompanyAffidavitFields.ExteriorAssets_Buildings]: 0,
  [CompanyAffidavitFields.ExteriorAssets_RealRights]: 0,
  [CompanyAffidavitFields.ExteriorAssets_Cars]: 0,
  [CompanyAffidavitFields.ExteriorAssets_Credits]: 0,
  [CompanyAffidavitFields.ExteriorAssets_MoneyDeposits]: 0,
  [CompanyAffidavitFields.ExteriorAssets_MovableAssetsRoving]: 0,
  [CompanyAffidavitFields.ExteriorAssets_Degree]: 0,
  [CompanyAffidavitFields.ExteriorAssets_OtherAssets]: 0,
  [CompanyAffidavitFields.ExteriorAssets_Total]: 0,
};

export enum CompanyCertificationsFields {
  CompanyId = 'idEmpresa',
  Date = 'fecha',

  IncomeAnnual_Total = 'ingresosAnuales_Total',

  Debts_Personal = 'deudas_Personales',
  Debts_Tax = 'deudas_Fiscales',
  Debts_Commercial = 'deudas_Comerciales',
  Debts_Total = 'deudas_Total',
}

export interface CompanyCertifications extends EntityWithId<number> {
  [CompanyCertificationsFields.CompanyId]: number;
  [CompanyCertificationsFields.Date]: Date;
  [CompanyCertificationsFields.IncomeAnnual_Total]: number;
  [CompanyCertificationsFields.Debts_Personal]: number;
  [CompanyCertificationsFields.Debts_Tax]: number;
  [CompanyCertificationsFields.Debts_Commercial]: number;
  [CompanyCertificationsFields.Debts_Total]: number;
}

export const CompanyCertificationsInitialState: CompanyCertifications = {
  [EntityWithIdFields.Id]: 0,
  [CompanyCertificationsFields.CompanyId]: 0,
  [CompanyCertificationsFields.Date]: new Date(''),
  [CompanyCertificationsFields.IncomeAnnual_Total]: 0,
  [CompanyCertificationsFields.Debts_Personal]: 0,
  [CompanyCertificationsFields.Debts_Tax]: 0,
  [CompanyCertificationsFields.Debts_Commercial]: 0,
  [CompanyCertificationsFields.Debts_Total]: 0,
};

export enum CompanyDeclarationOfAssetsFields {
  CompanyId = 'idEmpresa',
  Date = 'fecha',
  CurrentActiveCash = 'activoCorriente_Caja',
  CurrentActiveBanks = 'activoCorriente_Bancos',
  CurrentActiveInvestments = 'activoCorriente_Inversiones',
  CurrentActiveValuesToDeposit = 'activoCorriente_ValoresADepositar',
  CurrentActiveTradeReceivables = 'activoCorriente_CreditosACobrarComerciales',
  CurrentActiveOtherReceivables = 'activoCorriente_OtrosCreditosDeudores',
  CurrentActiveRawMaterials = 'activoCorriente_MateriasPrimas',
  CurrentActiveMerchandise = 'activoCorriente_Mercaderias',
  CurrentActiveTotal = 'activoCorriente_Total',
  NonCurrentActiveProperties = 'activoNoCorriente_Propiedades',
  NonCurrentActiveMachineryAndVehicles = 'activoNoCorriente_MaquinariasRodados',
  NonCurrentActiveOtherFixedAssets = 'activoNoCorriente_OtrosBienesUso',
  NonCurrentActiveOtherReceivables = 'activoNoCorriente_OtrosCreditosDeudores',
  NonCurrentActiveTotal = 'activoNoCorriente_Total',
  ActiveTotal = 'activo_Total',
  CurrentPassiveBankDebts = 'pasivoCorriente_DeudasBancarias',
  CurrentPassiveBusinessDebts = 'pasivoCorriente_DeudasComerciales',
  CurrentPassiveTaxForecastsDebts = 'pasivoCorriente_DeudasPrevisionalesFiscales',
  CurrentPassiveTotal = 'pasivoCorriente_Total',
  NonCurrentPassiveBankDebts = 'pasivoNoCorriente_DeudasBancarias',
  NonCurrentPassiveBusinessDebts = 'pasivoNoCorriente_DeudasComerciales',
  NonCurrentPassiveTaxForecastsDebts = 'pasivoNoCorriente_DeudasPrevisionalesFiscales',
  NonCurrentPassiveOtherLongTerm = 'pasivoNoCorriente_OtrosPasivosLargoPlazo',
  NonCurrentPassiveTotal = 'pasivoNoCorriente_Total',
  PassiveTotal = 'pasivo_Total',
  NetPatrimonyTotal = 'patrimonioNeto_Total',
  IncomeSalesGrossProfit = 'resultadoBruto_IngresoVentas',
  CMVGrossProfit = 'resultadoBruto_CMV',
  GrossProfitTotal = 'resultadoBruto_Total',
  OtherIncomesResult = 'resultado_OtrosIngresos',
  OtherEgressResult = 'resultado_OtrosEgresos',
  TotalResult = 'resultado_Total',
}

export interface CompanyDeclarationOfAssets extends EntityWithId<number> {
  [CompanyDeclarationOfAssetsFields.CompanyId]: number;
  [CompanyDeclarationOfAssetsFields.Date]: Date;
  [CompanyDeclarationOfAssetsFields.CurrentActiveCash]: number;
  [CompanyDeclarationOfAssetsFields.CurrentActiveBanks]: number;
  [CompanyDeclarationOfAssetsFields.CurrentActiveInvestments]: number;
  [CompanyDeclarationOfAssetsFields.CurrentActiveValuesToDeposit]: number;
  [CompanyDeclarationOfAssetsFields.CurrentActiveTradeReceivables]: number;
  [CompanyDeclarationOfAssetsFields.CurrentActiveOtherReceivables]: number;
  [CompanyDeclarationOfAssetsFields.CurrentActiveRawMaterials]: number;
  [CompanyDeclarationOfAssetsFields.CurrentActiveMerchandise]: number;
  [CompanyDeclarationOfAssetsFields.CurrentActiveTotal]: number;
  [CompanyDeclarationOfAssetsFields.NonCurrentActiveProperties]: number;
  [CompanyDeclarationOfAssetsFields.NonCurrentActiveMachineryAndVehicles]: number;
  [CompanyDeclarationOfAssetsFields.NonCurrentActiveOtherFixedAssets]: number;
  [CompanyDeclarationOfAssetsFields.NonCurrentActiveOtherReceivables]: number;
  [CompanyDeclarationOfAssetsFields.NonCurrentActiveTotal]: number;
  [CompanyDeclarationOfAssetsFields.ActiveTotal]: number;
  [CompanyDeclarationOfAssetsFields.CurrentPassiveBankDebts]: number;
  [CompanyDeclarationOfAssetsFields.CurrentPassiveBusinessDebts]: number;
  [CompanyDeclarationOfAssetsFields.CurrentPassiveTaxForecastsDebts]: number;
  [CompanyDeclarationOfAssetsFields.CurrentPassiveTotal]: number;
  [CompanyDeclarationOfAssetsFields.NonCurrentPassiveBankDebts]: number;
  [CompanyDeclarationOfAssetsFields.NonCurrentPassiveBusinessDebts]: number;
  [CompanyDeclarationOfAssetsFields.NonCurrentPassiveTaxForecastsDebts]: number;
  [CompanyDeclarationOfAssetsFields.NonCurrentPassiveOtherLongTerm]: number;
  [CompanyDeclarationOfAssetsFields.NonCurrentPassiveTotal]: number;
  [CompanyDeclarationOfAssetsFields.PassiveTotal]: number;
  [CompanyDeclarationOfAssetsFields.NetPatrimonyTotal]: number;
  [CompanyDeclarationOfAssetsFields.IncomeSalesGrossProfit]: number;
  [CompanyDeclarationOfAssetsFields.CMVGrossProfit]: number;
  [CompanyDeclarationOfAssetsFields.GrossProfitTotal]: number;
  [CompanyDeclarationOfAssetsFields.OtherIncomesResult]: number;
  [CompanyDeclarationOfAssetsFields.OtherEgressResult]: number;
  [CompanyDeclarationOfAssetsFields.TotalResult]: number;
}

export enum CompanyLastYearDeclarationOfAssetsFields {
  LastDeclarationOfAssets = 'manifestacionBienesAnterior',
}

export interface CompanyLastYearDeclarationOfAssets
  extends CompanyDeclarationOfAssets {
  [CompanyLastYearDeclarationOfAssetsFields.LastDeclarationOfAssets]: CompanyDeclarationOfAssets;
}

export const CompanyDeclarationOfAssetsInitialState: CompanyDeclarationOfAssets =
  {
    [EntityWithIdFields.Id]: 0,
    [CompanyDeclarationOfAssetsFields.CompanyId]: 0,
    [CompanyDeclarationOfAssetsFields.Date]: new Date(''),

    [CompanyDeclarationOfAssetsFields.CurrentActiveCash]: 0,
    [CompanyDeclarationOfAssetsFields.CurrentActiveBanks]: 0,
    [CompanyDeclarationOfAssetsFields.CurrentActiveInvestments]: 0,
    [CompanyDeclarationOfAssetsFields.CurrentActiveValuesToDeposit]: 0,
    [CompanyDeclarationOfAssetsFields.CurrentActiveTradeReceivables]: 0,
    [CompanyDeclarationOfAssetsFields.CurrentActiveOtherReceivables]: 0,
    [CompanyDeclarationOfAssetsFields.CurrentActiveRawMaterials]: 0,
    [CompanyDeclarationOfAssetsFields.CurrentActiveMerchandise]: 0,
    [CompanyDeclarationOfAssetsFields.CurrentActiveTotal]: 0,
    [CompanyDeclarationOfAssetsFields.NonCurrentActiveProperties]: 0,
    [CompanyDeclarationOfAssetsFields.NonCurrentActiveMachineryAndVehicles]: 0,
    [CompanyDeclarationOfAssetsFields.NonCurrentActiveOtherFixedAssets]: 0,
    [CompanyDeclarationOfAssetsFields.NonCurrentActiveOtherReceivables]: 0,
    [CompanyDeclarationOfAssetsFields.NonCurrentActiveTotal]: 0,
    [CompanyDeclarationOfAssetsFields.CurrentPassiveBankDebts]: 0,
    [CompanyDeclarationOfAssetsFields.CurrentPassiveBusinessDebts]: 0,
    [CompanyDeclarationOfAssetsFields.CurrentPassiveTaxForecastsDebts]: 0,
    [CompanyDeclarationOfAssetsFields.CurrentPassiveTotal]: 0,
    [CompanyDeclarationOfAssetsFields.NonCurrentPassiveBankDebts]: 0,
    [CompanyDeclarationOfAssetsFields.NonCurrentPassiveBusinessDebts]: 0,
    [CompanyDeclarationOfAssetsFields.NonCurrentPassiveTaxForecastsDebts]: 0,
    [CompanyDeclarationOfAssetsFields.NonCurrentPassiveOtherLongTerm]: 0,
    [CompanyDeclarationOfAssetsFields.NonCurrentPassiveTotal]: 0,
    [CompanyDeclarationOfAssetsFields.NetPatrimonyTotal]: 0,
    [CompanyDeclarationOfAssetsFields.IncomeSalesGrossProfit]: 0,
    [CompanyDeclarationOfAssetsFields.CMVGrossProfit]: 0,
    [CompanyDeclarationOfAssetsFields.GrossProfitTotal]: 0,
    [CompanyDeclarationOfAssetsFields.OtherIncomesResult]: 0,
    [CompanyDeclarationOfAssetsFields.OtherEgressResult]: 0,
    [CompanyDeclarationOfAssetsFields.TotalResult]: 0,
  };

export enum CompanyFinancialTotalsFields {
  CompanyId = 'idEmpresa',
  Date = 'fecha',

  PatrimonialStatementId = 'idEmpresaEstadoPatrimonial',
  IncomeStatementId = 'idEmpresaEstadoResultado',

  ActiveCurrentTotal = 'activoCorriente_Total',
  ActiveNotCurrentTotal = 'activoNoCorriente_Total',
  ActiveTotal = 'activo_Total',

  PassiveCurrentTotal = 'pasivoCorriente_Total',
  PassiveNotCurrentTotal = 'pasivoNoCorriente_Total',
  PassiveTotal = 'pasivo_Total',

  NetPatrimonyTotal = 'patrimonioNeto_Total',
  IncomeSales = 'ingresoVenta',
  IncomeTotal = 'ingreso_Total',
  EgressTotal = 'egreso_Total',
  NetResult = 'resultadoNeto',
  AmortizationTotal = 'amortizacionTotal',
}

export interface CompanyFinancialTotals extends EntityWithId<number> {
  [CompanyFinancialTotalsFields.CompanyId]: number;
  [CompanyFinancialTotalsFields.Date]: Date;
  [CompanyFinancialTotalsFields.PatrimonialStatementId]: number;
  [CompanyFinancialTotalsFields.IncomeStatementId]: number;
  [CompanyFinancialTotalsFields.ActiveCurrentTotal]: number;
  [CompanyFinancialTotalsFields.ActiveNotCurrentTotal]: number;
  [CompanyFinancialTotalsFields.ActiveTotal]: number;
  [CompanyFinancialTotalsFields.PassiveCurrentTotal]: number;
  [CompanyFinancialTotalsFields.PassiveNotCurrentTotal]: number;
  [CompanyFinancialTotalsFields.PassiveTotal]: number;
  [CompanyFinancialTotalsFields.NetPatrimonyTotal]: number;
  [CompanyFinancialTotalsFields.IncomeSales]: number;
  [CompanyFinancialTotalsFields.IncomeTotal]: number;
  [CompanyFinancialTotalsFields.EgressTotal]: number;
  [CompanyFinancialTotalsFields.NetResult]: number;
  [CompanyFinancialTotalsFields.AmortizationTotal]: number;
}

export enum CompanyDeclarationOfAssetsTotalsFields {
  CompanyId = 'idEmpresa',
  Date = 'fecha',
  CurrentActiveTotal = 'activoCorriente_Total',
  NonCurrentActiveTotal = 'activoNoCorriente_Total',
  ActiveTotal = 'activo_Total',
  CurrentPassiveTotal = 'pasivoCorriente_Total',
  NonCurrentPassiveTotal = 'pasivoNoCorriente_Total',
  PassiveTotal = 'pasivo_Total',
  NetPatrimonyTotal = 'patrimonioNeto_Total',
  TotalIncomes = 'ingresos_Total',
  TotalEgress = 'egresos_Total',
}

export interface CompanyDeclarationOfAssetsTotals extends EntityWithId<number> {
  [CompanyDeclarationOfAssetsTotalsFields.CompanyId]: number;
  [CompanyDeclarationOfAssetsTotalsFields.Date]: Date;
  [CompanyDeclarationOfAssetsTotalsFields.CurrentActiveTotal]: number;
  [CompanyDeclarationOfAssetsTotalsFields.NonCurrentActiveTotal]: number;
  [CompanyDeclarationOfAssetsTotalsFields.ActiveTotal]: number;
  [CompanyDeclarationOfAssetsTotalsFields.CurrentPassiveTotal]: number;
  [CompanyDeclarationOfAssetsTotalsFields.NonCurrentPassiveTotal]: number;
  [CompanyDeclarationOfAssetsTotalsFields.PassiveTotal]: number;
  [CompanyDeclarationOfAssetsTotalsFields.NetPatrimonyTotal]: number;
  [CompanyDeclarationOfAssetsTotalsFields.TotalIncomes]: number;
  [CompanyDeclarationOfAssetsTotalsFields.TotalEgress]: number;
}
