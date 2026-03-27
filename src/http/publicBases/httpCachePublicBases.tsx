import { HttpAxiosRequestPublicBases } from '../httpAxiosPublicBasesBase';
import { SituationType } from '../../types/nosis/nosisData';

export const HttpCachePublicBases = {
  getEndpoint: (url: string = ''): string => `cache${url}`,

  getSituationTypes: (): Promise<SituationType[]> => {
    return HttpAxiosRequestPublicBases.get(
      HttpCachePublicBases.getEndpoint(`/tipos-situaciones/`),
    );
  },
};
