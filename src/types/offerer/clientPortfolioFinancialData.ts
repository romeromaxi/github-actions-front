import {FinancialYear, IncomeStatement, PatrimonialStatement} from "../general/generalFinanceData";

export enum ClientPortfolioFinancialYearFields {
    FolderId = 'idCarpeta'
}
export interface ClientPortfolioFinancialYear extends FinancialYear {
    [ClientPortfolioFinancialYearFields.FolderId]: string;
}

export enum ClientPortfolioBasePatrimonialStatementFields {
    FinancialYearId = 'idCarpetaEjercicio',
    ClientPortfolioId = 'idCarpeta',
    Year = 'anio'
}

export interface ClientPortfolioBasePatrimonialStatement extends PatrimonialStatement {
    [ClientPortfolioBasePatrimonialStatementFields.FinancialYearId]: number;
    [ClientPortfolioBasePatrimonialStatementFields.ClientPortfolioId]: string;
    [ClientPortfolioBasePatrimonialStatementFields.Year]: number;
}

export enum ClientPortfolioPatrimonialStatementFields {
    LastPatrimonialStatement = 'estadoPatrimonialAnterior',
}

export interface ClientPortfolioPatrimonialStatement
    extends ClientPortfolioBasePatrimonialStatement {
    [ClientPortfolioPatrimonialStatementFields.LastPatrimonialStatement]: ClientPortfolioBasePatrimonialStatement;
}

export enum ClientPortfolioIncomeStatementFields {
    FinancialYearId = 'idCarpetaEjercicio',
    ClientPortfolioId = 'idCarpeta',
    Year = 'anio',
}

export interface ClientPortfolioIncomeStatement extends IncomeStatement {
    [ClientPortfolioIncomeStatementFields.FinancialYearId]: number;
    [ClientPortfolioIncomeStatementFields.ClientPortfolioId]: string;
    [ClientPortfolioIncomeStatementFields.Year]: number;
}

export enum ClientPortfolioIncomeLastYearStatementFields {
    LastYearIncomeStatement = 'estadoResultadoAnterior',
}

export interface ClientPortfolioIncomeLastYearStatement extends ClientPortfolioIncomeStatement {
    [ClientPortfolioIncomeLastYearStatementFields.LastYearIncomeStatement]: ClientPortfolioIncomeStatement;
}