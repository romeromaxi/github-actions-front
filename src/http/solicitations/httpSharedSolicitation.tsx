import {HttpAxiosRequest} from "../httpAxiosBase";
import {SolicitationSharedViewDTO} from "../../types/solicitations/solicitationData";


export const HttpSharedSolicitation = {
    getEndpoint: (url: string = '') : string => `solicitudes-compartidas${url}`,
    
    getByGuid: (guid: string) : Promise<SolicitationSharedViewDTO> => {
        return HttpAxiosRequest.get(
            HttpSharedSolicitation.getEndpoint(`/${guid}`)
        )
    }
}