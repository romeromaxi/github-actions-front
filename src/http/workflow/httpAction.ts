import { HttpAxiosRequest } from '../httpAxiosBase';
import { ActionExecute, ActionView } from 'types/workflow/actionData';
import { BaseResponse } from '../../types/baseEntities';

export const HttpAction = {
  getEndpoint: (url: string): string => `workflow/acciones${url}`,

  getActionsByCurrentStage: (stageId: number): Promise<ActionView[]> =>
    HttpAxiosRequest.get(HttpAction.getEndpoint(`/${stageId}`)),

  executeAction: (
    actionId: number,
    dataExecute: ActionExecute,
  ): Promise<BaseResponse> =>
    HttpAxiosRequest.post(
      HttpAction.getEndpoint(`/${actionId}/ejecutar`),
      dataExecute,
    ),
};
