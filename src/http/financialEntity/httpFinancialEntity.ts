import {HttpAxiosRequest} from "../httpAxiosBase";

export const HttpFinancialEntity = {
    getEndpoint: (url: string = ''): string =>
        `entidades-financieras${url}`,

    getMailInvitations: (financialEntityId: number) : Promise<string[]> => {
        return HttpAxiosRequest.get(
            HttpFinancialEntity.getEndpoint(`/${financialEntityId}/invitados`)
        )
    }
}