import { HttpAxiosRequest } from "http/httpAxiosBase";
import {BaseRequestFields, BaseResponse} from "types/baseEntities";
import {
    SolicitationTrackingFields,
    SolicitationTrackingUpdateStatus,
    SolicitationTrackingView
} from "types/solicitations/solicitationTrackingData";

export const HttpSolicitationTracking = {
  getEndpoint: (solicitationId: number, url: string = ''): string => `solicitudes/${solicitationId}/seguimientos${url}`,

  getByIdSolicitation: (solicitationId: number) : Promise<SolicitationTrackingView[]> =>
      HttpAxiosRequest.get(
          HttpSolicitationTracking.getEndpoint(solicitationId),
      ),
  
  addFinancialEntityToTracking: (solicitationId: number, financialEntityId: number) : Promise<BaseResponse> =>
      HttpAxiosRequest.post(
          HttpSolicitationTracking.getEndpoint(solicitationId),
          {
              [SolicitationTrackingFields.FinancialEntityId]: financialEntityId,
              [BaseRequestFields.ModuleCode]: 1,
              [BaseRequestFields.OriginCode]: 1
          }
      ),

    updateTrackingStatus: (solicitationId: number, solicitationTrackingId: number, trackingStatus: SolicitationTrackingUpdateStatus) : Promise<BaseResponse> =>
        HttpAxiosRequest.put(
            HttpSolicitationTracking.getEndpoint(solicitationId, `/${solicitationTrackingId}`),
            {
                ...trackingStatus,
                [BaseRequestFields.ModuleCode]: 1,
                [BaseRequestFields.OriginCode]: 1
            }
        ),
};
