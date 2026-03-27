import {HttpAxiosRequest} from "../httpAxiosBase";
import {BaseResponse} from "../../types/baseEntities";
import {SitesContactForm} from "../../types/sites/sitesTypes";

export const HttpSites = {
    getEndpoint: (url: string): string => `/sites${url}`,

    contact: (bodyForm: SitesContactForm): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(HttpSites.getEndpoint(`/contacto`),
            bodyForm
        );
    },
}