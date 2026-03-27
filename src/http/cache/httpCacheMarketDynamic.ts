import {MarketIntermadiateDynamicSearchSummary} from "../../types/market/marketIntermediateData";
import {HttpAxiosRequest} from "../httpAxiosBase";


export const HttpCacheMarketDynamic = {
    getEndpoint: (url: string = ''): string =>
        `cache/market/busquedas-dinamicas${url}`,

    getGeneralMarketsTabs: () : Promise<MarketIntermadiateDynamicSearchSummary[]> => {
        return HttpAxiosRequest.get(
            HttpCacheMarketDynamic.getEndpoint('/tiendas/generales')
        )
    },

    getAdvancedMarketsTabs: () : Promise<MarketIntermadiateDynamicSearchSummary[]> => {
        return HttpAxiosRequest.get(
            HttpCacheMarketDynamic.getEndpoint('/tiendas/gondolas')
        )
    },

    getTabsBySection: (section: number) : Promise<MarketIntermadiateDynamicSearchSummary[]> => {
        return HttpAxiosRequest.get(
            HttpCacheMarketDynamic.getEndpoint(`/tiendas/${section}`)
        )
    }
}
