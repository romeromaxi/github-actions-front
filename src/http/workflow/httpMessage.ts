import { HttpAxiosRequest } from '../httpAxiosBase';
import { ActionExecute, ActionView } from 'types/workflow/actionData';
import { BaseResponse } from '../../types/baseEntities';

export const HttpMessage = {
  getEndpoint: (url: string): string => `workflow/mensajes${url}`,

  readMessage: (messageId: number): Promise<BaseResponse> =>
    HttpAxiosRequest.get(HttpMessage.getEndpoint(`/${messageId}/leer`)),

  closeMessage: (messageId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpMessage.getEndpoint(`/${messageId}/cerrar`),
      {},
    );
  },
};
