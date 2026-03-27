import {EntityWithIdAndDescription} from "../../types/baseEntities";
import {HttpAxiosRequest} from "../httpAxiosBase";

export const HttpOffererSolicitationFilter = {
    getEndpoint: (offererId: number, url: string = '') => `solicitudes/oferentes/${offererId}/filtros${url}`,
    
    getCompanies: (offererId: number): Promise<EntityWithIdAndDescription[]> => {
        return HttpAxiosRequest.get(
            HttpOffererSolicitationFilter.getEndpoint(offererId, '/empresas'),
        )
    } 
}