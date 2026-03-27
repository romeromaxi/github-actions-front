import { EntityWithIdAndDescription } from '../../types/baseEntities';
import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  SolicitationApprovalResultViewDTO,
  SolicitationFilterViewDTO
} from '../../types/solicitations/solicitationApprovalData';
import {SolicitationAccessStateViewDTO, SolicitationMessageCheckout} from "../../types/solicitations/solicitationData";
import {
  SolicitationSurveyQuestion,
  SolicitationSurveyQuestionOption
} from "../../types/solicitations/solicitationSurveyData";

export const HttpCacheSolicitation = {
  getEndpoint: (url: string): string => `cache/solicitudes${url}`,

  getSolicitationStatusesForOfferer: (): Promise<
    EntityWithIdAndDescription[]
  > => {
    return HttpAxiosRequest.get(
      HttpCacheSolicitation.getEndpoint('/oferente/estados'),
    );
  },
  
  getExternalSolicitationStatuses: () : Promise<SolicitationAccessStateViewDTO[]> => {
    return HttpAxiosRequest.get(
        HttpCacheSolicitation.getEndpoint('/accesos-externos/estados')
    )
  },

  getApprovalResults: (): Promise<SolicitationApprovalResultViewDTO[]> => {
    return HttpAxiosRequest.get(
      HttpCacheSolicitation.getEndpoint('/aprobaciones/resultados'),
    );
  },
    
  getFilters: (): Promise<SolicitationFilterViewDTO[]> => {
    return HttpAxiosRequest.get(
      HttpCacheSolicitation.getEndpoint('/filtros'),
    );
  },
    
  getSolicitationSurveyQuestionBySolicitationType: (solicitationType: number, idsProductLine?: number[]) : Promise<SolicitationSurveyQuestion[]> => 
    HttpAxiosRequest.getWithQueryParamsSerializer(
      HttpCacheSolicitation.getEndpoint(`/encuestas/${solicitationType}`),
        {
          'lstIdProductoLinea': idsProductLine
        }
    ),

  getSolicitationSurveyOptionsByQuestion: (surveyQuestionCode: number) : Promise<SolicitationSurveyQuestionOption[]> =>
    HttpAxiosRequest.get(
      HttpCacheSolicitation.getEndpoint(`/encuestas/${surveyQuestionCode}/opciones`)
    ),

  getSolicitationTrackingStatuses: (): Promise<EntityWithIdAndDescription[]> =>
      HttpAxiosRequest.get(
          HttpCacheSolicitation.getEndpoint('/seguimientos/estados'),
      ),

  getSolicitationTrackingGlobalStatuses: (): Promise<EntityWithIdAndDescription[]> =>
    HttpAxiosRequest.get(
      HttpCacheSolicitation.getEndpoint('/seguimientos/estados/generales'),
    ),

  getSolicitationMessageCheckoutBySolicitationType: (solicitationType: number, idsSolicitations?: number[]): Promise<SolicitationMessageCheckout[]> =>
      HttpAxiosRequest.getWithQueryParamsSerializer(
          HttpCacheSolicitation.getEndpoint(`/${solicitationType}/checkouts`),
          {
            'lstIdSolicitudes': idsSolicitations
          }
      ),
};
