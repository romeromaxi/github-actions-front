import {HttpAxiosRequest} from "http/httpAxiosBase";
import {EntityWithIdAndDescription} from "types/baseEntities";

export const HttpCacheSections = {
    getEndpoint: (url: string = '') => `cache/secciones${url}`,

    getByCompanyFileType: (companyFileType: number): Promise<EntityWithIdAndDescription[]> =>
        HttpAxiosRequest.get(
            HttpCacheSections.getEndpoint(`/legajos/${companyFileType}`)
        ), 
}