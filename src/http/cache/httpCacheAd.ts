import {HttpAxiosRequest} from "../httpAxiosBase";
import {EntityWithIdAndDescription} from "types/baseEntities";
import {AdDestinationType} from "types/ad/adData";

export const HttpCacheAd = {
    getEndpoint: (url: string = '') => `cache/publicidades${url}`,
    
    getDestinations: () : Promise<AdDestinationType[]> => {
        return HttpAxiosRequest.get(
            HttpCacheAd.getEndpoint('/destinos')
        )
    },

    getLocations: () : Promise<EntityWithIdAndDescription[]> => {
        return HttpAxiosRequest.get(
            HttpCacheAd.getEndpoint('/ubicaciones')
        )
    },
}