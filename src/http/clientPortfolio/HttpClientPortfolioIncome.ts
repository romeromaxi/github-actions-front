
import {HttpAxiosRequest} from "../httpAxiosBase";
import {IncomeStatementWithPrevious} from "../../types/general/generalFinanceData";
import {ClientPortfolioIncomeLastYearStatement} from "../../types/offerer/clientPortfolioFinancialData";


export const HttpClientPortfolioIncome = {
    getEndpoint: (guid: number | string, url: string = '')=> `/carpetas/${guid}/estado-resultado${url}`,

    getById: (
        guid: number | string,
        incomeStatementId: number,
    ): Promise<ClientPortfolioIncomeLastYearStatement> => {
        return HttpAxiosRequest.get(
            HttpClientPortfolioIncome.getEndpoint(
                guid,
                `/${incomeStatementId}`,
            ),
        );
    },

    update: (
        guid: number | string,
        incomeStatementId: number,
        incomeStatement: IncomeStatementWithPrevious,
    ): Promise<any> => {
        return HttpAxiosRequest.put(
            HttpClientPortfolioIncome.getEndpoint(
                guid,
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