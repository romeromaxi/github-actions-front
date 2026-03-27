import {
    InternalSolicitationFilter,
    SolicitationViewDTO
} from "../../types/solicitations/solicitationData";
import {EntityListWithPagination} from "../../types/baseEntities";
import {HttpAxiosRequest} from "../httpAxiosBase";


export const HttpSolicitationInternal = {
    getEndpoint: (url: string = '') => `/solicitudes/internas${url}`,

    getSolicitationsByUser: (filter: InternalSolicitationFilter): Promise<EntityListWithPagination<SolicitationViewDTO>> => {
        return HttpAxiosRequest.getWithQueryParamsSerializer(
            HttpSolicitationInternal.getEndpoint(),
            {...filter}
        );
    },
}