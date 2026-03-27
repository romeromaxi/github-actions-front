import {HttpAxiosRequest} from "../httpAxiosBase";
import {EntityWithIdAndDescription} from "../../types/baseEntities";


export const HttpCacheUser = {
    getEndpoint: (url: string = '') => `cache/usuarios${url}`,
    
    getTypes: (): Promise<EntityWithIdAndDescription[]> => {
        return HttpAxiosRequest.get(
            HttpCacheUser.getEndpoint('/tipos')
        );
    }
}

export const HttpCacheInternalUser = {
    getEndpoint: (url: string = '') => `cache/usuarios/internos${url}`,

    getGroups: (): Promise<EntityWithIdAndDescription[]> => {
        return HttpAxiosRequest.get(
            HttpCacheInternalUser.getEndpoint('/grupos')
        );
    }
}