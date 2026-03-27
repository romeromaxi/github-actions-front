import { HttpAxiosRequest } from '../httpAxiosBase';
import { FileBlobResponse } from 'types/files/filesData';

export const HttpOffererLogo = {
  getEndpoint: (url: string): string => `oferente${url}/logos`,

  getByOffererId: (offererId: number): Promise<FileBlobResponse> => {
    return HttpAxiosRequest.getBlob(
      HttpOffererLogo.getEndpoint(`/${offererId}`),
    );
  },

  update: (offererId: number, logo: File): Promise<void> => {
    let formData: FormData = new FormData();
    formData.append('file', logo);

    return HttpAxiosRequest.post(
      HttpOffererLogo.getEndpoint(`/${offererId}`),
      formData,
    );
  },
};
