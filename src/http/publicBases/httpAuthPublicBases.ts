import { HttpAxiosRequestPublicBases } from '../httpAxiosPublicBasesBase';

export const HttpAuthPublicBases = {
  getEndpoint: (url: string): string => `bases-publicas/auth${url}`,

  ping: (): Promise<void> => {
    return HttpAxiosRequestPublicBases.get(
      HttpAuthPublicBases.getEndpoint('/ping'),
    );
  },
};
