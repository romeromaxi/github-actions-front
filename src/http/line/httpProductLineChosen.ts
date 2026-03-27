import {
    ProductLineChosenHistoryView,
    ProductLineChosenView, ProductLineInternalSelectedLineForm,
    ProductLineView
} from "../../types/lines/productLineData";
import {HttpAxiosRequest} from "../httpAxiosBase";
import {BaseResponse} from "../../types/baseEntities";


export const HttpProductLineChosen = {
    getEndpoint: (url: string = '') => `producto-lineas/elegidos${url}`,
    
    getSelectedProductLines: () : Promise<ProductLineView[]> =>
        HttpAxiosRequest.get(
            HttpProductLineChosen.getEndpoint()
        ),
    
    insertSelectedProductLine: (data: ProductLineInternalSelectedLineForm) : Promise<BaseResponse> => 
        HttpAxiosRequest.post(
            HttpProductLineChosen.getEndpoint(),
            data
        ),
    
    getChosenSelectedProductLines: () : Promise<ProductLineChosenView[]> =>
        HttpAxiosRequest.get(
            HttpProductLineChosen.getEndpoint('/busquedas'),
        ),
    
    getProposals: () : Promise<ProductLineView[]> =>
        HttpAxiosRequest.get(
            HttpProductLineChosen.getEndpoint('/propuestas')
        ),
    
    applyProposal: () : Promise<BaseResponse> =>
        HttpAxiosRequest.post(
            HttpProductLineChosen.getEndpoint('/propuestas'),
            {
                codModulo: 1,
                codOrigen: 1
            }
        ),
    
    getHistoriesByProductLineId: (lineId: number) : Promise<ProductLineChosenHistoryView[]> => 
        HttpAxiosRequest.get(
            HttpProductLineChosen.getEndpoint(`/${lineId}/historias`)
        )
}