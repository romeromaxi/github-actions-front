import {EntityWithIdAndDescription} from "../../types/baseEntities";
import {HttpAxiosRequest} from "../httpAxiosBase";


export const HttpCacheClientPortfolio = {
    getEndpoint: (url: string = '') => `/cache/carpetas${url}`,
    
    getFolderTypes: () : Promise<EntityWithIdAndDescription[]> => {
        return HttpAxiosRequest.get(
            HttpCacheClientPortfolio.getEndpoint('/tipos')
        )
    }
}