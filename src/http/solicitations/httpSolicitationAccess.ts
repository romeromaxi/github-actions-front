import {BaseResponse} from "../../types/baseEntities";
import {HttpAxiosRequest} from "../httpAxiosBase";
import {SolicitationAccessResult, SolicitationAccessResultData} from "../../types/solicitations/solicitationData";
import {SharedSolicitationGuidDialogForm} from "../../pages/sharedSolicitation/SharedSolicitationGuidDialog";


export const HttpSolicitationAccess = {
    getEndpoint: (url: string = '', guid: string) : string => `solicitudes-acceso/${guid}${url}`,
    
    generateAccessPin: (guid: string, captcha?: string) : Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitationAccess.getEndpoint('/generar', guid),
            {captcha: captcha}
        )
    },
    
    validateAccessPin: (guid: string, pinValidationRequest: SharedSolicitationGuidDialogForm) : Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitationAccess.getEndpoint('/validar', guid),
            pinValidationRequest,
            { withCredentials: true }
        )
    },
    
    validateState: (guid: string) : Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitationAccess.getEndpoint('/validar-estado', guid), {}, { withCredentials: true }
        )
    },
    
    getDataAccess: (guid: string) : Promise<SolicitationAccessResult> => {
        return HttpAxiosRequest.get(
            HttpSolicitationAccess.getEndpoint('', guid)
        )
    },
    
    setDataAccess: (guid: string, data: SolicitationAccessResultData) : Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpSolicitationAccess.getEndpoint('', guid),
            data
        )
    }
}