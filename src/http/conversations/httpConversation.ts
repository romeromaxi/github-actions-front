import { HttpAxiosRequest } from '../httpAxiosBase';
import { BaseResponse } from 'types/baseEntities';
import {
  ConversationPost,
  ConversationViewDTO,
} from 'types/conversations/conversationData';

export const HttpConversation = {
  getEndpoint: (url: string): string => `conversaciones${url}`,

  postBySolicitationId: (
    solicitationId: number,
    conversationPost: ConversationPost,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpConversation.getEndpoint(`/solicitudes/${solicitationId}`),
      {
        ...conversationPost,
      },
    );
  },

  getCurrentConversationBySolicitationId: (
    solicitationId: number,
  ): Promise<ConversationViewDTO> => {
    return HttpAxiosRequest.get(
      HttpConversation.getEndpoint(`/solicitudes/${solicitationId}`),
    );
  },

  getCurrentConversationByProductLineId: (
    productLineId: number,
  ): Promise<ConversationViewDTO> => {
    return HttpAxiosRequest.get(
      HttpConversation.getEndpoint(`/producto-lineas/${productLineId}`),
    );
  },

  deleteBySolicitationId: (solicitationId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.delete(
      HttpConversation.getEndpoint(`/${solicitationId}`),
    );
  },

  readConversationById: (conversationId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpConversation.getEndpoint(`/${conversationId}`),
      {},
    );
  },
};
