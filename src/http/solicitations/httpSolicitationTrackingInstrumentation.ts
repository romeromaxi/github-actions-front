import { HttpAxiosRequest } from "http/httpAxiosBase";
import {BaseRequestFields, BaseResponse} from "types/baseEntities";
import {
    SolicitationTrackingInstrumentationView,
    SolicitationTrackingUpdateStatus
} from "types/solicitations/solicitationTrackingData";

export const HttpSolicitationTrackingInstrumentation = {
  getEndpoint: (solicitationId: number, url: string = ''): string => `solicitudes/${solicitationId}/seguimientos-instrumentacion${url}`,

  getByIdSolicitation: (solicitationId: number) : Promise<SolicitationTrackingInstrumentationView> =>
      HttpAxiosRequest.get(
          HttpSolicitationTrackingInstrumentation.getEndpoint(solicitationId),
      ),

    updateTrackingStatus: (solicitationId: number, trackingStatus: SolicitationTrackingUpdateStatus) : Promise<BaseResponse> =>
        HttpAxiosRequest.put(
            HttpSolicitationTrackingInstrumentation.getEndpoint(solicitationId),
            {
                ...trackingStatus,
                [BaseRequestFields.ModuleCode]: 1,
                [BaseRequestFields.OriginCode]: 1
            }
        ),
};
