import { HttpAxiosRequest } from "http/httpAxiosBase";
import {SolicitationCommunicationView} from "types/solicitations/solicitationCommunicationData";

export const HttpSolicitationCommunication = {
  getEndpoint: (solicitationId: number, url: string = ''): string => `solicitudes/${solicitationId}/comunicaciones${url}`,

  getByIdSolicitation: (solicitationId: number) : Promise<SolicitationCommunicationView[]> =>
      HttpAxiosRequest.get(
          HttpSolicitationCommunication.getEndpoint(solicitationId),
      ),
};
