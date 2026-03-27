import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  OffererAddressInsertDTO,
  OffererAddressViewDTO,
  OffererMailInsert,
  OffererMailViewDTO,
  OffererPhoneNumberInsert,
  OffererPhoneViewDTO,
} from 'types/offerer/offererReferentialData';

export const HttpOffererMail = {
  getEndpoint: (offererId: number, url: string): string =>
    `oferente/${offererId}/mails${url}`,

  insert: (offererId: number, offererMail: OffererMailInsert): Promise<any> => {
    return HttpAxiosRequest.post(HttpOffererMail.getEndpoint(offererId, ''), {
      ...offererMail,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  get: (offererId: number): Promise<OffererMailViewDTO> => {
    return HttpAxiosRequest.get(HttpOffererMail.getEndpoint(offererId, ''));
  },
};

export const HttpOffererPhoneNumber = {
  getEndpoint: (offererId: number, url: string): string =>
    `oferente/${offererId}/telefonos${url}`,

  insert: (
    offererId: number,
    offererPhoneNumber: OffererPhoneNumberInsert,
  ): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpOffererPhoneNumber.getEndpoint(offererId, ''),
      { ...offererPhoneNumber, codModulo: 1, codOrigen: 1 },
    );
  },

  get: (offererId: number): Promise<OffererPhoneViewDTO> => {
    return HttpAxiosRequest.get(
      HttpOffererPhoneNumber.getEndpoint(offererId, ''),
    );
  },
};

export const HttpOffererAddress = {
  getEndpoint: (offererId: number, url: string): string =>
    `oferente/${offererId}/domicilios${url}`,

  insertList: (
    offererId: number,
    addressList: OffererAddressInsertDTO[],
  ): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpOffererAddress.getEndpoint(offererId, '/lista'),
      { listaDomicilio: addressList, codModulo: 1, codOrigen: 1 },
    );
  },

  get: (offererId: number): Promise<OffererAddressViewDTO[]> => {
    return HttpAxiosRequest.get(HttpOffererAddress.getEndpoint(offererId, ''));
  },
};
