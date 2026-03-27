import {EntityWithIdAndDescription} from "../../types/baseEntities";
import {HttpAxiosRequest} from "../httpAxiosBase";


export const HttpCacheConfiguration = {
    getEndpoint: (url: string): string => `cache/configuracion${url}`,

    getMailTemplateClassifications: () : Promise<EntityWithIdAndDescription[]> => {
        return HttpAxiosRequest.get(
            HttpCacheConfiguration.getEndpoint('/mail-plantilla-clasificacion')
        )
    }
}