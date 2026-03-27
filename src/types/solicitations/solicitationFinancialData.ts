

//puede que esto no exista en un futuro o se pueda hacer mejor
import {FinancialYear, Flow, IncomeStatement, PatrimonialStatement} from "../general/generalFinanceData";


export enum SolicitationFinancialYearFields {
    SolicitationId = 'idSolicitud'
}
export interface SolicitationFinancialYear extends FinancialYear { 
    [SolicitationFinancialYearFields.SolicitationId]: number;
}


export enum SolicitationBasePatrimonialStatementFields {
    FinancialYearId = 'idSolicitudEjercicio',
    SolicitationId = 'idSolicitud',
    Year = 'anio'
}

export interface SolicitationBasePatrimonialStatement extends PatrimonialStatement {
    [SolicitationBasePatrimonialStatementFields.FinancialYearId]: number;
    [SolicitationBasePatrimonialStatementFields.SolicitationId]: number;
    [SolicitationBasePatrimonialStatementFields.Year]: number;
}

export enum SolicitationPatrimonialStatementFields {
    LastPatrimonialStatement = 'estadoPatrimonialAnterior',
}

export interface SolicitationPatrimonialStatement
    extends SolicitationBasePatrimonialStatement {
    [SolicitationPatrimonialStatementFields.LastPatrimonialStatement]: SolicitationBasePatrimonialStatement;
}

export enum SolicitationIncomeStatementFields {
    FinancialYearId = 'idSolicitudEjercicio',
    SolicitationId = 'idSolicitud',
    Year = 'anio',
}

export interface SolicitationIncomeStatement extends IncomeStatement {
    [SolicitationIncomeStatementFields.FinancialYearId]: number;
    [SolicitationIncomeStatementFields.SolicitationId]: number;
    [SolicitationIncomeStatementFields.Year]: number;
}

export enum SolicitationIncomeLastYearStatementFields {
    LastYearIncomeStatement = 'estadoResultadoAnterior',
}

export interface SolicitationIncomeLastYearStatement extends SolicitationIncomeStatement {
    [SolicitationIncomeLastYearStatementFields.LastYearIncomeStatement]: SolicitationIncomeStatement;
}


export enum SolicitationFlowFields {
    SolicitationId = 'idSolicitud'
}


export interface SolicitationFlow extends Flow {
    [SolicitationFlowFields.SolicitationId]: number;
}