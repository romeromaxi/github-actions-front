import {HttpAxiosRequest} from "../httpAxiosBase";
import {PatrimonialStatementWithPrevious} from "../../types/general/generalFinanceData";
import {ClientPortfolioPatrimonialStatement} from "../../types/offerer/clientPortfolioFinancialData";


export const HttpClientPortfolioPatrimonial = {
    getEndpoint: (guid: string, url: string = '')=> `/carpetas/${guid}/estado-patrimonial${url}`,

    getById: (
        guid: string,
        patrimonialStatementId: number,
    ): Promise<ClientPortfolioPatrimonialStatement> => {
        return HttpAxiosRequest.get(
            HttpClientPortfolioPatrimonial.getEndpoint(
                guid,
                `/${patrimonialStatementId}`,
            ),
        );
    },

    update: (
        guid: string,
        patrimonialStatementId: number,
        patrimonialStatement: PatrimonialStatementWithPrevious,
    ): Promise<any> => {
        return HttpAxiosRequest.put(
            HttpClientPortfolioPatrimonial.getEndpoint(
                guid,
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