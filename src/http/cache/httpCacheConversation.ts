import {
  EntityWithIdAndDescription,
  EntityWithIdAndDescriptionFields,
} from '../../types/baseEntities';
import { HttpAxiosRequest } from '../httpAxiosBase';

export const HttpCacheConversation = {
  getEndpoint: (url: string): string => `cache/conversaciones${url}`,

  getConversationReasons: (): Promise<EntityWithIdAndDescription[]> => {
    return HttpAxiosRequest.get(HttpCacheConversation.getEndpoint('/motivos'));
  },
};
