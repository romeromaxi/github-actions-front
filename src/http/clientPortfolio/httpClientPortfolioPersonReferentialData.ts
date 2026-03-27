import {
    EntityAddress,
    EntityAddressInsert,
    EntityMail,
    EntityMailInsert,
    EntityPhoneNumber
} from "../../types/general/generalReferentialData";
import {HttpAxiosRequest} from "../httpAxiosBase";
import {BaseResponse} from "../../types/baseEntities";


export const HttpClientPortfolioPersonMails = {
    getEndpoint: (clientPortfolioGuid: string, personId: number, url: string = '') => `/carpetas/${clientPortfolioGuid}/personas/${personId}/mails${url}`,

    insert: (
        clientPortfolioGuid: string,
        personId: number,
        mail: EntityMailInsert,
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpClientPortfolioPersonMails.getEndpoint(clientPortfolioGuid, personId),
            { ...mail, codModulo: 1, codOrigen: 1 },
        );
    },

    get: (
        clientPortfolioGuid: string,
        personId: number,
    ): Promise<EntityMail> => {
        return HttpAxiosRequest.get(
            HttpClientPortfolioPersonMails.getEndpoint(clientPortfolioGuid, personId),
        );
    },
}


export const HttpClientPortfolioPersonPhones = {
    getEndpoint: (clientPortfolioGuid: string, personId: number, url: string = '') => `/carpetas/${clientPortfolioGuid}/personas/${personId}/telefonos${url}`,

    insertList: (
        clientPortfolioGuid: string,
        personId: number,
        phoneNumberList: EntityPhoneNumber[],
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpClientPortfolioPersonPhones.getEndpoint(clientPortfolioGuid, personId, '/lista'),
            { telefonos: phoneNumberList, codModulo: 1, codOrigen: 1 },
        );
    },

    get: (
        clientPortfolioGuid: string,
        personId: number,
    ): Promise<EntityPhoneNumber[]> => {
        return HttpAxiosRequest.get(
            HttpClientPortfolioPersonPhones.getEndpoint(clientPortfolioGuid, personId),
        );
    },
}


export const HttpClientPortfolioPersonAddressses = {
    getEndpoint: (clientPortfolioGuid: string, personId: number, url: string = '') => `/carpetas/${clientPortfolioGuid}/personas/${personId}/domicilios${url}`,

    insert: (
        clientPortfolioGuid: string,
        personId: number,
        address: EntityAddressInsert,
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpClientPortfolioPersonAddressses.getEndpoint(clientPortfolioGuid, personId),
            { ...address, codModulo: 1, codOrigen: 1 },
        );
    },
    
    insertList: (
        clientPortfolioGuid: string,
        personId: number,
        addressList: EntityAddressInsert[],
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpClientPortfolioPersonAddressses.getEndpoint(clientPortfolioGuid, personId, '/lista'),
            { listaDomicilio: addressList, codModulo: 1, codOrigen: 1 },
        );
    },

    get: (
        clientPortfolioGuid: string,
        personId: number,
    ): Promise<EntityAddress[]> => {
        return HttpAxiosRequest.get(
            HttpClientPortfolioPersonAddressses.getEndpoint(clientPortfolioGuid, personId),
        );
    },
};