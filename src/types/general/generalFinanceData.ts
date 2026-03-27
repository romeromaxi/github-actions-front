import {BaseRequest, EntityWithId} from "../baseEntities";
import {FinancialYearStatus, Sections} from "./generalEnums";


export enum FinancialYearFields {
    Day = 'dia',
    Month = 'mes',
    Year = 'anio',
    Date = 'fecha',
    CurrencyCode = 'codMoneda',
    CurrencyDesc = 'descMoneda',
    CurrencyCodeDesc = 'descCodMoneda',
    DocumentsQuantity = 'cantidadDocumentos',
    NumberOfMonths = 'cantMeses',
    AmountUnitCode = 'codImporteUnidad',
    PatrimonialStatementId = 'idEstadoPatrimonial',
    IncomeStatementId = 'idEstadoResultado',
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
    DocumentId = 'idDocumento',
    DocumentTypeCode = 'codDocumentoTipo',
    OcrBalanceStatusCode = 'codEstadoContableEstado',
    OCRProcessGuid = 'uniIdOCRProcesamiento',
    BalanceTypeCode = 'codEstadoContableTipo',
}

export interface FinancialYear extends EntityWithId<number> {
    [FinancialYearFields.Day]: number;
    [FinancialYearFields.Year]: number;
    [FinancialYearFields.Month]: number;
    [FinancialYearFields.Date]: Date;
    [FinancialYearFields.NumberOfMonths]: number;
    [FinancialYearFields.AmountUnitCode]: number;
    [FinancialYearFields.DocumentsQuantity]?: number;
    [FinancialYearFields.PatrimonialStatementId]: number;
    [FinancialYearFields.IncomeStatementId]: number;

    [FinancialYearFields.CurrencyCode]: number;
    [FinancialYearFields.CurrencyDesc]: string;
    [FinancialYearFields.CurrencyCodeDesc]: string;

    [FinancialYearFields.ActiveTotal]: number;
    [FinancialYearFields.PassiveTotal]: number;
    [FinancialYearFields.NetPatrimonyTotal]: number;
    [FinancialYearFields.IncomeTotal]: number;
    [FinancialYearFields.EgressTotal]: number;
    [FinancialYearFields.NetResult]: number;
    [FinancialYearFields.IncomeSales]: number;
    [FinancialYearFields.AmortizationTotal]: number;
    
    [FinancialYearFields.OcrBalanceStatusCode]?: FinancialYearStatus;
    [FinancialYearFields.OCRProcessGuid]?: string;
    [FinancialYearFields.DocumentId]?: number;
    [FinancialYearFields.DocumentTypeCode]?: number;
    [FinancialYearFields.BalanceTypeCode]?: BalanceTypes;
}

export enum BalanceTypes {
    Simplified = 1,
    Detailed = 2
}

export enum PatrimonialStatementFields {
    Year = 'anio',
    // Activo Corriente
    ActiveCurrentAvailabilities = 'activoCorriente_Disponibilidades',
    ActiveCurrentSalesReceivables = 'activoCorriente_CreditosPorVentas',
    ActiveCurrentExchangeThing = 'activoCorriente_BienesDeCambio',
    ActiveCurrentPartnerAccountsCP = 'activoCorriente_CuentasParticulares',
    ActiveCurrentOthers = 'activoCorriente_OtrosActivos',
    ActiveCurrentTotal = 'activoCorriente_Total',
    // Activo Corriente - Desuso
    ActiveCurrentCashBanks = 'activoCorriente_CajaBancos',
    ActiveCurrentInvestments = 'activoCorriente_Inversiones',
    ActiveCurrentOtherReceivables = 'activoCorriente_OtrosCreditos',
    // Activo No Corriente
    ActiveNotCurrentThingOfUse = 'activoNoCorriente_BienesDeUso',
    ActiveNotCurrentLandAndBuildings = 'activoNoCorriente_Inmuebles',
    ActiveNotCurrentOtherGoods = 'activoNoCorriente_OtrosBienesDeUso',
    ActiveNotCurrentPartnerAccountsLP = 'activoNoCorriente_CuentasParticulares',
    ActiveNotCurrentOthers = 'activoNoCorriente_OtrosActivos',
    ActiveNotCurrentTotal = 'activoNoCorriente_Total',
    // Activo No Corriente - Desuso
    ActiveNotCurrentOtherReceivables = 'activoNoCorriente_OtrosCreditos',
    ActiveNotCurrentDeferredTaxes = 'activoNoCorriente_ImpuestosDiferidos',
    ActiveNotCurrentExchangeThing = 'activoNoCorriente_BienesDeCambio',
    ActiveNotCurrentInvestments = 'activoNoCorriente_Inversiones',
    ActiveNotCurrentIntangibles = 'activoNoCorriente_ActivosIntangibles',
    ActiveNotCurrentPermanentParticipations = 'activoNoCorriente_ParticipacionesPermanentes',
    // Activo Total
    ActiveTotal = 'activo_Total',

    // Pasivo Corriente
    PassiveCurrentCommercialDebt = 'pasivoCorriente_DeudasComerciales',
    PassiveCurrentBankDebts = 'pasivoCorriente_DeudasBancarias',
    PassiveCurrentSocialDebts = 'pasivoCorriente_DeudasSociales',
    PassiveCurrentOtherDebts = 'pasivoCorriente_OtrasDeudas',
    PassiveCurrentTotal = 'pasivoCorriente_Total',
    // Pasivo Corriente - Desuso
    PassiveCurrentLoans = 'pasivoCorriente_Prestamos',
    PassiveCurrentRemunerationsSocialCharges = 'pasivoCorriente_RemuneracionesCargasSociales',
    PassiveCurrentFiscalCharges = 'pasivoCorriente_CargasFiscales',
    PassiveCurrentCustomerAdvances = 'pasivoCorriente_AnticiposDeClientes',
    PassiveCurrentDividendsPayable = 'pasivoCorriente_DividendosAPagar',
    PassiveCurrentProvisions = 'pasivoCorriente_Previsiones',
    PassiveCurrentFiscalDebts = 'pasivoCorriente_DeudasFiscales',

    // Pasivo No Corriente
    PassiveNotCurrentBankDebts = 'pasivoNoCorriente_DeudasBancarias',
    PassiveNotCurrentFiscalDebts = 'pasivoNoCorriente_DeudasFiscales',
    PassiveNotCurrentOthers = 'pasivoNoCorriente_OtrosPasivos',
    PassiveNotCurrentTotal = 'pasivoNoCorriente_Total',
    // Pasivo No Corriente - Desuso
    PassiveNotCurrentCommercialDebt = 'pasivoNoCorriente_DeudasComerciales',
    PassiveNotCurrentLoans = 'pasivoNoCorriente_Prestamos',
    PassiveNotCurrentRemunerationsSocialCharges = 'pasivoNoCorriente_RemuneracionesCargasSociales',
    PassiveNotCurrentFiscalCharges = 'pasivoNoCorriente_CargasFiscales',
    PassiveNotCurrentCustomerAdvances = 'pasivoNoCorriente_AnticiposDeClientes',
    PassiveNotCurrentDividendsPayable = 'pasivoNoCorriente_DividendosAPagar',
    PassiveNotCurrentOtherDebts = 'pasivoNoCorriente_OtrasDeudas',
    PassiveNotCurrentProvisions = 'pasivoNoCorriente_Previsiones',
    // Pasivo Total
    PassiveTotal = 'pasivo_Total',

    // Patrimonio Neto
    NetPatrimonyTotal = 'patrimonioNeto_Total',
    IsValid = 'esValido',
}


export interface PatrimonialStatement extends EntityWithId<number> {
    [FinancialYearFields.Year]: number;
    [FinancialYearFields.OcrBalanceStatusCode]?: FinancialYearStatus;
    [FinancialYearFields.BalanceTypeCode]?: BalanceTypes;
    [PatrimonialStatementFields.ActiveCurrentCashBanks]: number;
    [PatrimonialStatementFields.ActiveCurrentInvestments]: number;
    [PatrimonialStatementFields.ActiveCurrentOtherReceivables]: number;
    [PatrimonialStatementFields.ActiveCurrentExchangeThing]: number;
    [PatrimonialStatementFields.ActiveCurrentOthers]: number;
    [PatrimonialStatementFields.ActiveCurrentSalesReceivables]: number;
    [PatrimonialStatementFields.ActiveCurrentAvailabilities]: number;
    [PatrimonialStatementFields.ActiveCurrentTotal]: number;

    [PatrimonialStatementFields.ActiveNotCurrentOtherReceivables]: number;
    [PatrimonialStatementFields.ActiveNotCurrentExchangeThing]: number;
    [PatrimonialStatementFields.ActiveNotCurrentThingOfUse]: number;
    [PatrimonialStatementFields.ActiveNotCurrentInvestments]: number;
    [PatrimonialStatementFields.ActiveNotCurrentIntangibles]: number;
    [PatrimonialStatementFields.ActiveNotCurrentDeferredTaxes]: number;
    [PatrimonialStatementFields.ActiveNotCurrentPermanentParticipations]: number;
    [PatrimonialStatementFields.ActiveNotCurrentLandAndBuildings]: number;
    [PatrimonialStatementFields.ActiveNotCurrentPartnerAccountsLP]: number;
    [PatrimonialStatementFields.ActiveNotCurrentOthers]: number;
    [PatrimonialStatementFields.ActiveNotCurrentOtherGoods]: number;
    [PatrimonialStatementFields.ActiveNotCurrentTotal]: number;

    [PatrimonialStatementFields.ActiveTotal]: number;

    [PatrimonialStatementFields.PassiveCurrentCommercialDebt]: number;
    [PatrimonialStatementFields.PassiveCurrentLoans]: number;
    [PatrimonialStatementFields.PassiveCurrentRemunerationsSocialCharges]: number;
    [PatrimonialStatementFields.PassiveCurrentFiscalCharges]: number;
    [PatrimonialStatementFields.PassiveCurrentCustomerAdvances]: number;
    [PatrimonialStatementFields.PassiveCurrentSocialDebts]: number;
    [PatrimonialStatementFields.PassiveCurrentFiscalDebts]: number;
    [PatrimonialStatementFields.PassiveCurrentBankDebts]: number;
    [PatrimonialStatementFields.PassiveCurrentDividendsPayable]: number;
    [PatrimonialStatementFields.PassiveCurrentOtherDebts]: number;
    [PatrimonialStatementFields.PassiveCurrentProvisions]: number;
    [PatrimonialStatementFields.PassiveCurrentTotal]: number;

    [PatrimonialStatementFields.PassiveNotCurrentCommercialDebt]: number;
    [PatrimonialStatementFields.PassiveNotCurrentBankDebts]: number;
    [PatrimonialStatementFields.PassiveNotCurrentFiscalDebts]: number;
    [PatrimonialStatementFields.PassiveNotCurrentLoans]: number;
    [PatrimonialStatementFields.PassiveNotCurrentRemunerationsSocialCharges]: number;
    [PatrimonialStatementFields.PassiveNotCurrentFiscalCharges]: number;
    [PatrimonialStatementFields.PassiveNotCurrentCustomerAdvances]: number;
    [PatrimonialStatementFields.PassiveNotCurrentDividendsPayable]: number;
    [PatrimonialStatementFields.PassiveNotCurrentOtherDebts]: number;
    [PatrimonialStatementFields.PassiveNotCurrentProvisions]: number;
    [PatrimonialStatementFields.PassiveNotCurrentTotal]: number;
    [PatrimonialStatementFields.PassiveNotCurrentOthers]: number;

    [PatrimonialStatementFields.PassiveTotal]: number;

    [PatrimonialStatementFields.NetPatrimonyTotal]: number;

    [PatrimonialStatementFields.IsValid]: boolean;
}

export interface FinancialYearInsert {
    [FinancialYearFields.Year]: number;
}


export enum IncomeStatementFields {
    Sales = 'ventas',
    CostOfSales = 'costoVentas',
    GrossResult = 'resultadoBruto',
    OperatingExpenses = 'gastosOperativos',
    OperatingResults = 'resultadosOperativos',
    OtherIncomeAndExpenses = 'otrosIngresosGastos',
    ExtraordinaryResults = 'resultadosExtraordinarios',
    IncomeTaxExpense = 'impuestoALasGanancias',
    InterestIncome = 'interesesGanados',
    InterestExpense = 'interesesPerdidos',
    NetResult = 'resultadoNeto',
    AmortizationTotal = 'amortizacionTotal'
}


export interface IncomeStatement extends EntityWithId<number> {
    [FinancialYearFields.Year]: number;
    [IncomeStatementFields.Sales]: number;
    [IncomeStatementFields.CostOfSales]: number;
    [IncomeStatementFields.GrossResult]: number;
    [IncomeStatementFields.OperatingExpenses]: number;
    [IncomeStatementFields.OperatingResults]: number;
    [IncomeStatementFields.OtherIncomeAndExpenses]: number;
    [IncomeStatementFields.ExtraordinaryResults]: number;
    [IncomeStatementFields.IncomeTaxExpense]: number;
    [IncomeStatementFields.InterestIncome]: number;
    [IncomeStatementFields.InterestExpense]: number;
    [IncomeStatementFields.NetResult]: number;
    [IncomeStatementFields.AmortizationTotal]: number;
}

export enum IncomeStatementWithPreviousFields {
    LastIncomeStatement = 'estadoResultadoAnterior'
}

export interface IncomeStatementWithPrevious extends IncomeStatement {
    [IncomeStatementWithPreviousFields.LastIncomeStatement]: IncomeStatement
}


export enum FlowFields {
    Date = 'fecha',
    Income = 'ingresos',
    Sale = 'ventas',
    MonthQuantity = 'cantMeses'
}


export interface Flow extends EntityWithId<number> {
    [FlowFields.Date]: Date;
    [FlowFields.Income]: number;
    [FlowFields.Sale]: number;
    [FlowFields.MonthQuantity]?: number;
}


export interface FlowInsert extends EntityWithId<number> {
    [FlowFields.Date]: Date;
    [FlowFields.Income]: number;
    [FlowFields.Sale]: number;
}

export enum FlowSemesterDataFields {
    Month = 'mes',
    AllowEdit = 'permiteEditar'
}

export interface FlowSemesterData extends EntityWithId<number> {
    [FlowSemesterDataFields.Month]: string;
    [FlowSemesterDataFields.AllowEdit]: boolean;
    [FlowFields.Date]: Date;
    [FlowFields.Income]: number;
    [FlowFields.Sale]: number;
}


export enum FlowSemesterViewFields {
    SemesterNumber = 'numeroSemestre',
    SemesterYear = 'anioSemestre',
    Flows = 'movimientos',
    AllowDelete = 'permiteEliminar',
}

export interface FlowSemesterView {
    [FlowSemesterViewFields.SemesterNumber]: number;
    [FlowSemesterViewFields.SemesterYear]: number;
    [FlowSemesterViewFields.Flows]: FlowSemesterData[];
    [FlowSemesterViewFields.AllowDelete]: boolean;
}

export interface FlowSemesterDelete {
    [FlowSemesterViewFields.SemesterNumber]: number;
    [FlowSemesterViewFields.SemesterYear]: number;
}


export enum FlowInsertRequestFields {
    FlowList = 'lstMovimientos',
}

export interface FlowInsertRequest extends BaseRequest {
    [FlowInsertRequestFields.FlowList]: FlowInsert[]
}


export enum FinancialIndicatorsFields {
    Year = 'anio',
    WorkingCapital = 'capitalDeTrabajo',
    CurrentLiquidity = 'liquidezCorriente',
    Indebtedness = 'endeudamientoTotal',
    DeferredIndebtedness = 'endeudamientoDiferido',
    AverageMonthlySales = 'ventasMensualesPromedio',
    Solvency = 'solvencia',
    ProfitabilitySales = 'rentabilidadSobreVentas',
    ReturnOnTotalAssets = 'utilidadNetaSobrePatrimonioNeto',
    SalesPostBalance = 'ventasPostBalance',
    PurchasesPostBalance = 'comprasPostBalance'
}


export interface FinancialIndicators {
    [FinancialIndicatorsFields.Year]: number;
    [FinancialIndicatorsFields.WorkingCapital]?: number;
    [FinancialIndicatorsFields.CurrentLiquidity]?: number;
    [FinancialIndicatorsFields.AverageMonthlySales]?: number;
    [FinancialIndicatorsFields.Solvency]?: number;
    [FinancialIndicatorsFields.Indebtedness]?: number;
    [FinancialIndicatorsFields.ProfitabilitySales]?: number;
    [FinancialIndicatorsFields.DeferredIndebtedness]?: number;
    [FinancialIndicatorsFields.ReturnOnTotalAssets]?: number;
    [FinancialIndicatorsFields.SalesPostBalance]?: number;
    [FinancialIndicatorsFields.PurchasesPostBalance]?: number;
}


export enum DescriptionFinancialTotalsFields {
    Description = 'description',
    LabelDescription = 'labelDescription',
    TotalCurrentYear = 'totalCurrentYear',
    TotalPreviousYear = 'totalPreviousYear',
    Variation = 'variation',
    Highlighted = 'highlighted',
    HighlightedEditable = 'highlightedEditable',
    Field = 'field'
}

export interface DescriptionFinancialTotals {
    [DescriptionFinancialTotalsFields.Description]: string;
    [DescriptionFinancialTotalsFields.LabelDescription]?: string;
    [DescriptionFinancialTotalsFields.TotalCurrentYear]: number | string;
    [DescriptionFinancialTotalsFields.TotalPreviousYear]: number | string;
    [DescriptionFinancialTotalsFields.Variation]: string;
    [DescriptionFinancialTotalsFields.Highlighted]: boolean;
    [DescriptionFinancialTotalsFields.HighlightedEditable]?: boolean;
    [DescriptionFinancialTotalsFields.Field]: string;
}

export enum PatrimonialStatementWithPreviousFields {
    LastPatrimonialStatement = 'estadoPatrimonialAnterior'
}

export interface PatrimonialStatementWithPrevious extends PatrimonialStatement {
    [PatrimonialStatementWithPreviousFields.LastPatrimonialStatement]: PatrimonialStatement;
}

export enum DynamicActiveCurrentFields {
    Disponibilidades = 'Disponibilidades',
    CreditosPorVentas = 'Créditos Por Ventas',
    BienesDeCambio = 'Bienes De Cambio',
    CuentaParticularesCP = 'Cuenta Particulares CP',
    OtrosActivosCP = 'Otros Activos CP',
    Total = 'Total'
}

export enum DynamicActiveNotCurrentFields {
    BienesDeUso = 'Bienes De Uso',
    Inmuebles = 'Inmuebles',
    OtrosBienesDeUso = 'Otros Bienes De Uso',
    CuentaParticularesLP = 'Cuentas Particulares LP',
    OtrosActivosLP = 'Otros Activos LP',
    Total = 'Total'
}

export enum DynamicActiveFields {
    ActiveCurrent = 'activo_corriente',
    ActiveNotCurrent = 'activo_no_corriente',
    Total = 'total'
}

export enum DynamicPassiveCurrentFields {
    DeudasComerciales = 'Deudas Comerciales',
    DeudasBancariasCP = 'Deudas Bancarias CP',
    DeudasSociales = 'Deudas Sociales',
    DeudasFiscalesCP = 'Deudas Fiscales CP',
    OtrasDeudasCP = 'Otras Deudas CP',
    Total = 'Total'
}

export enum DynamicPassiveNotCurrentFields {
    DeudasBancariasLP = 'Deudas Bancarias LP',
    DeudasFiscalesLP = 'Deudas Fiscales LP',
    OtrosPasivosLP = 'Otros Pasivos LP',
    Total = 'Total'
}

export enum DynamicPassiveFields {
    PassiveCurrent = 'pasivo_corriente',
    PassiveNotCurrent = 'pasivo_no_corriente',
    Total = 'total'
}

export enum DynamicNetPatrimonyFields {
    Total = 'total'
}

export interface DynamicActiveCurrent {
    [DynamicActiveCurrentFields.Disponibilidades]: number;
    [DynamicActiveCurrentFields.CreditosPorVentas]: number;
    [DynamicActiveCurrentFields.BienesDeCambio]: number;
    [DynamicActiveCurrentFields.CuentaParticularesCP]: number;
    [DynamicActiveCurrentFields.OtrosActivosCP]: number;
    [DynamicActiveCurrentFields.Total]: number;
}

export interface DynamicActiveNotCurrent {
    [DynamicActiveNotCurrentFields.BienesDeUso]: number;
    [DynamicActiveNotCurrentFields.Inmuebles]: number;
    [DynamicActiveNotCurrentFields.OtrosBienesDeUso]: number;
    [DynamicActiveNotCurrentFields.CuentaParticularesLP]: number;
    [DynamicActiveNotCurrentFields.OtrosActivosLP]: number;
    [DynamicActiveNotCurrentFields.Total]: number;
}

export interface DynamicActive {
    [DynamicActiveFields.ActiveCurrent]: DynamicActiveCurrent;
    [DynamicActiveFields.ActiveNotCurrent]: DynamicActiveNotCurrent;
    [DynamicActiveFields.Total]: number;
}

export interface DynamicPassiveCurrent {
    [DynamicPassiveCurrentFields.DeudasComerciales]: number;
    [DynamicPassiveCurrentFields.DeudasBancariasCP]: number;
    [DynamicPassiveCurrentFields.DeudasSociales]: number;
    [DynamicPassiveCurrentFields.DeudasFiscalesCP]: number;
    [DynamicPassiveCurrentFields.OtrasDeudasCP]: number;
    [DynamicPassiveCurrentFields.Total]: number;
}

export interface DynamicPassiveNotCurrent {
    [DynamicPassiveNotCurrentFields.DeudasBancariasLP]: number;
    [DynamicPassiveNotCurrentFields.DeudasFiscalesLP]: number;
    [DynamicPassiveNotCurrentFields.OtrosPasivosLP]: number;
    [DynamicPassiveNotCurrentFields.Total]: number;
}

export interface DynamicPassive {
    [DynamicPassiveFields.PassiveCurrent]: DynamicPassiveCurrent;
    [DynamicPassiveFields.PassiveNotCurrent]: DynamicPassiveNotCurrent;
    [DynamicPassiveFields.Total]: number;
}

export interface DynamicNetPatrimony {
    [DynamicNetPatrimonyFields.Total]: number;
}

export interface DynamicBalanceSection {
    [key: string]: number | DynamicBalanceSection;
}

export enum DynamicFinancialStatementFields {
    Date = 'fecha',
    Active = 'activo',
    Passive = 'pasivo',
    NetPatrimony = 'patrimonio_neto',

    Sales = 'ventas',
    CostOfSales = 'costoVentas',
    GrossResult = 'resultadoBruto',
    OperatingExpenses = 'gastosOperativos',
    OperatingResults = 'resultadosOperativos',
    OtherIncomeAndExpenses = 'otrosIngresosGastos',
    ExtraordinaryResults = 'resultadosExtraordinarios',
    IncomeTaxExpense = 'impuestoALasGanancias',
    InterestIncome = 'interesesGanados',
    InterestExpense = 'interesesPerdidos',
    NetResult = 'resultadoNeto',
    AmortizationTotal = 'amortizacionTotal'
}

export interface DynamicFinancialStatement {
    [DynamicFinancialStatementFields.Date]: string;
    [DynamicFinancialStatementFields.Active]: DynamicActive;
    [DynamicFinancialStatementFields.Passive]: DynamicPassive;
    [DynamicFinancialStatementFields.NetPatrimony]: DynamicNetPatrimony;
    [DynamicFinancialStatementFields.Sales]: number;
    [DynamicFinancialStatementFields.CostOfSales]: number;
    [DynamicFinancialStatementFields.GrossResult]: number;
    [DynamicFinancialStatementFields.OperatingExpenses]: number;
    [DynamicFinancialStatementFields.OperatingResults]: number;
    [DynamicFinancialStatementFields.OtherIncomeAndExpenses]: number;
    [DynamicFinancialStatementFields.ExtraordinaryResults]: number;
    [DynamicFinancialStatementFields.IncomeTaxExpense]: number;
    [DynamicFinancialStatementFields.InterestIncome]: number;
    [DynamicFinancialStatementFields.InterestExpense]: number;
    [DynamicFinancialStatementFields.AmortizationTotal]: number;
    [DynamicFinancialStatementFields.NetResult]: number;
}

export enum FinancialStatementFields {
    PatrimonialStatement = 'estadoPatrimonial',
    IncomeStatement = 'estadoResultado'
}


export interface FinancialStatement {
    [FinancialStatementFields.PatrimonialStatement]: PatrimonialStatementWithPrevious,
    [FinancialStatementFields.IncomeStatement]: IncomeStatementWithPrevious
}

export enum DynamicFinancialStatementWithPreviousFields {
    LastDynamicFinancialStatement = 'estadoFinancieroAnterior'
}

export interface DynamicFinancialStatementWithPrevious extends DynamicFinancialStatement {
    [DynamicFinancialStatementWithPreviousFields.LastDynamicFinancialStatement]: DynamicFinancialStatement;
}

export enum FinancialStatementOCRProcessFields {
    SectionCode = 'codSeccion',
    RelatedId = 'idRelacionado'
}

export interface FinancialStatementOCRProcess {
    [FinancialStatementOCRProcessFields.SectionCode]: Sections,
    [FinancialStatementOCRProcessFields.RelatedId]: number,
}
