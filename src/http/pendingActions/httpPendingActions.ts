import {HttpAxiosRequest} from "../httpAxiosBase";
import {PendingActionView} from "../../types/actions/actionData";


export const HttpPendingActions = {
    getEndpoint: (url: string = ''): string => `/acciones-pendientes${url}`,
    
    getPendingActions: (companyId?: number): Promise<PendingActionView[]> => {
        return HttpAxiosRequest.getWithQueryParamsSerializer(
            HttpPendingActions.getEndpoint(),
            { idEmpresa: companyId },
        )
    }
}