import {HttpAxiosRequest} from "../httpAxiosBase";
import {AdHistoryView, AdInsert, AdView, AdViewDetail} from "../../types/ad/adData";
import {BaseResponse} from "../../types/baseEntities";


export const HttpAds = {
    getEndpoint: (url: string = '') => `/publicidades${url}`,
    
    getMarketAd: () : Promise<AdView[]> => {
        return HttpAxiosRequest.get(
            HttpAds.getEndpoint('/market')
        )
    },
    
    search: () : Promise<AdViewDetail[]> => {
        return HttpAxiosRequest.get(
            HttpAds.getEndpoint('/busqueda')
        )
    },
    
    insert: (adInsert: AdInsert) : Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpAds.getEndpoint(),
            {
                ...adInsert,
                codModulo: 1,
                codOrigen: 1
            }
        )
    },
    
    update: (guid: string, body: AdInsert) : Promise<BaseResponse> => {
        return HttpAxiosRequest.put(
            HttpAds.getEndpoint(`/${guid}`),
            {
                ...body, codModulo: 1, codOrigen: 1
            }
        )
    },
    
    getActualPreviewByLocation: (locationId: number): Promise<AdView[]> => {
        return HttpAxiosRequest.get(
            HttpAds.getEndpoint(`/${locationId}/actual`)
        )
    },
    
    getProposalsByLocation: (locationId: number): Promise<AdView[]> => {
        return HttpAxiosRequest.get(
            HttpAds.getEndpoint(`/${locationId}/propuestas`)
        )
    },
    
    applyProposalByLocation: (locationId: number | null | undefined) : Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpAds.getEndpoint(`/${locationId}/propuestas`),
            {
                codModulo: 1,
                codOrigen: 1
            }
        )
    },
    
    getHistoricData: (adId: string) : Promise<AdHistoryView[]> => {
        return HttpAxiosRequest.get(
            HttpAds.getEndpoint(`/${adId}/historias`)
        )
    }
}