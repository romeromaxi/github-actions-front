import { HttpAxiosRequest } from '../httpAxiosBase';
import { BaseResponse } from '../../types/baseEntities';
import {
  ConversationMessageInsert,
  ConversationMessageViewDTO,
} from '../../types/conversations/conversationMessageData';

export const HttpConversationMessages = {
  getEndpoint: (conversationId: number, url: string = ''): string =>
    `conversaciones/${conversationId}/mensajes${url}`,

  getByConversationId: (
    conversationId: number,
  ): Promise<ConversationMessageViewDTO[]> => {
    return HttpAxiosRequest.get(
      HttpConversationMessages.getEndpoint(conversationId),
    );
  },

  postSingleMessageByConversationId: (
    conversationId: number,
    messageInsert: ConversationMessageInsert,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpConversationMessages.getEndpoint(conversationId),
      {
        ...messageInsert,
      },
    );
  },
};
