import {HttpAxiosRequest} from "../httpAxiosBase";
import {BaseResponse} from "../../types/baseEntities";
import {
    SolicitationFinancialYear,
    SolicitationIncomeLastYearStatement,
    SolicitationPatrimonialStatement
} from "../../types/solicitations/solicitationFinancialData";
import {
    FinancialIndicators,
    FinancialYearInsert, IncomeStatementWithPrevious,
    PatrimonialStatementWithPrevious
} from "../../types/general/generalFinanceData"
import {FileBlobResponse} from "../../types/files/filesData";


export const HttpSolicitationFinance = {
    getEndpoint: (solicitationId: number, url: string = '') => `solicitud/${solicitationId}/ejercicios${url}`,

    getById: (
        solicitationId: number,
        financialYearId: number,
    ): Promise<SolicitationFinancialYear> => {
        return HttpAxiosRequest.get(
            HttpSolicitationFinance.getEndpoint(solicitationId, `/${financialYearId}`),
        );
    },

    getListBysolicitationId: (solicitationId: number): Promise<SolicitationFinancialYear[]> => {
        return HttpAxiosRequest.get(HttpSolicitationFinance.getEndpoint(solicitationId));
    },

    insert: (
        solicitationId: number,
        newFinance: FinancialYearInsert,
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(HttpSolicitationFinance.getEndpoint(solicitationId), {
            ...newFinance,
            codModulo: 1,
            codOrigen: 1,
        });
    },

    getIndicatorsBySolicitationId: (
        solicitationId: number,
    ): Promise<FinancialIndicators[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitationFinance.getEndpoint(solicitationId, '/indicadores'),
        );
    },

    deleteFinancialYear: (
        solicitationId: number,
        financialYearId: number,
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.delete(
            HttpSolicitationFinance.getEndpoint(solicitationId, `/${financialYearId}`),
        );
    },

    exportToExcel: (
        solicitationId: number,
        statementId: number,
    ): Promise<FileBlobResponse> =>
        HttpAxiosRequest.getBlob(
            HttpSolicitationFinance.getEndpoint(
                solicitationId,
                `/exportar/${statementId}/excel`,
            ),
        ),
}


export const HttpSolicitationPatrimonialStatement = {
    getEndpoint: (solicitationId: number, url: string = ''): string =>
        `solicitud/${solicitationId}/estado-patrimonial${url}`,

    getById: (
        solicitationId: number,
        patrimonialStatementId: number,
    ): Promise<SolicitationPatrimonialStatement> => {
        return HttpAxiosRequest.get(
            HttpSolicitationPatrimonialStatement.getEndpoint(
                solicitationId,
                `/${patrimonialStatementId}`,
            ),
        );
    },

    update: (
        solicitationId: number,
        patrimonialStatementId: number,
        patrimonialStatement: PatrimonialStatementWithPrevious,
    ): Promise<any> => {
        return HttpAxiosRequest.put(
            HttpSolicitationPatrimonialStatement.getEndpoint(
                solicitationId,
                `/${patrimonialStatementId}`,
            ),
            {
                ...patrimonialStatement,
                codModulo: 1,
                codOrigen: 1,
            },
        );
    },
}


export const HttpSolicitationIncomeStatement = {
    getEndpoint: (solicitationId: number, url: string = ''): string =>
        `solicitud/${solicitationId}/estado-resultado${url}`,

    getById: (
        solicitationId: number,
        incomeStatementId: number,
    ): Promise<SolicitationIncomeLastYearStatement> => {
        return HttpAxiosRequest.get(
            HttpSolicitationIncomeStatement.getEndpoint(
                solicitationId,
                `/${incomeStatementId}`,
            ),
        );
    },

    update: (
        solicitationId: number,
        incomeStatementId: number,
        incomeStatement: IncomeStatementWithPrevious,
    ): Promise<any> => {
        return HttpAxiosRequest.put(
            HttpSolicitationIncomeStatement.getEndpoint(
                solicitationId,
                `/${incomeStatementId}`,
            ),
            {
                ...incomeStatement,
                codModulo: 1,
                codOrigen: 1,
            },
        );
    },
}
