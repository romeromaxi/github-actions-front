import {
  SolicitationEventView,
  SolicitationEventViewFields,
} from '../../types/solicitations/solicitationEventData';
import { SolicitationEventType } from '../../types/solicitations/solicitationEventEnums';
import { HttpAxiosRequest } from '../httpAxiosBase';

export const HttpSolicitationEvent = {
  getEndpoint: (solicitationId: number, url: string = ''): string =>
    `solicitudes/${solicitationId}/eventos${url}`,

  getEventList: (solicitationId: number): Promise<SolicitationEventView[]> => {
    return HttpAxiosRequest.get(
      HttpSolicitationEvent.getEndpoint(solicitationId),
    );
  },
};
