import { HttpAxiosRequest } from 'http/httpAxiosBase';
import {
    SolicitationAccessView,
    SolicitationAllowAccess,
    SolicitationShareDerivation
} from 'types/solicitations/solicitationData';
import {BaseResponse} from 'types/baseEntities';
import {OffererSummaryView} from "types/offerer/offererData";

export const HttpSolicitationShareAccess = {
  getEndpoint: (solicitationId: number, url: string = ''): string => `solicitudes/${solicitationId}/compartir${url}`,

  shareSolicitation: (solicitationId: number, lstAccess: SolicitationAllowAccess[]) : Promise<BaseResponse> =>
      HttpAxiosRequest.post(
          HttpSolicitationShareAccess.getEndpoint(solicitationId),
          lstAccess
      ),
  
  getSolicitationsShared: (solicitationId: number) : Promise<SolicitationAccessView[]> =>
      HttpAxiosRequest.get(
          HttpSolicitationShareAccess.getEndpoint(solicitationId)
      ),

    getPotentialOfferers: (solicitationId: number) : Promise<OffererSummaryView[]> =>
        HttpAxiosRequest.get(
            HttpSolicitationShareAccess.getEndpoint(solicitationId, '/relacionados')
        ),
    
    sendRequestDerivation: (solicitationId: number, derivationData: SolicitationShareDerivation) : Promise<BaseResponse> =>
        HttpAxiosRequest.post(
            HttpSolicitationShareAccess.getEndpoint(solicitationId, '/derivacion'),
            derivationData
        )
};
