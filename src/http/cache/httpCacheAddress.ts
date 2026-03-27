import {
  EntityWithIdAndDescription,
  EntityWithIdAndDescriptionFields,
} from '../../types/baseEntities';

export const HttpCacheAddress = {
  getEndpoint: (url: string): string => `cache/address${url}`,

  getProvinces: (): Promise<EntityWithIdAndDescription[]> => {
    return Promise.resolve([
      {
        [EntityWithIdAndDescriptionFields.Id]: 1,
        [EntityWithIdAndDescriptionFields.Description]: 'Buenos Aires',
      },
      {
        [EntityWithIdAndDescriptionFields.Id]: 2,
        [EntityWithIdAndDescriptionFields.Description]: 'La Pampa',
      },
    ]);
  },
};
