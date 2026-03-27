import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  CompanyAddressInsertDTO,
  CompanyAddressViewDTO,
  CompanyMailInsert,
  CompanyMailViewDTO,
  CompanyPhoneInsertDTO,
  CompanyPhoneNumberInsert,
  CompanyPhoneViewDTO,
} from 'types/company/companyReferentialData';

export const HttpCompanyMail = {
  getEndpoint: (companyId: number, url: string): string =>
    `empresa/${companyId}/mails${url}`,

  insert: (companyId: number, companyMail: CompanyMailInsert): Promise<any> => {
    return HttpAxiosRequest.post(HttpCompanyMail.getEndpoint(companyId, ''), {
      ...companyMail,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  get: (companyId: number): Promise<CompanyMailViewDTO> => {
    return HttpAxiosRequest.get(HttpCompanyMail.getEndpoint(companyId, ''));
  },
};

export const HttpCompanyPhoneNumber = {
  getEndpoint: (companyId: number, url: string): string =>
    `empresa/${companyId}/telefonos${url}`,

  insert: (
    companyId: number,
    companyPhoneNumber: CompanyPhoneInsertDTO,
  ): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpCompanyPhoneNumber.getEndpoint(companyId, ''),
      { ...companyPhoneNumber, codModulo: 1, codOrigen: 1 },
    );
  },

  insertList: (
    companyId: number,
    companyPhoneNumbers: CompanyPhoneInsertDTO[],
  ): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpCompanyPhoneNumber.getEndpoint(companyId, '/lista'),
      { telefonos: companyPhoneNumbers, codModulo: 1, codOrigen: 1 },
    );
  },

  get: (companyId: number): Promise<CompanyPhoneViewDTO[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyPhoneNumber.getEndpoint(companyId, ''),
    );
  },

  getMain: (companyId: number): Promise<CompanyPhoneViewDTO> => {
    return HttpAxiosRequest.get(
      HttpCompanyPhoneNumber.getEndpoint(companyId, '/principal'),
    );
  },
};

export const HttpCompanyAddress = {
  getEndpoint: (companyId: number, url: string): string =>
    `empresa/${companyId}/domicilios${url}`,

  insertList: (
    companyId: number,
    addressList: CompanyAddressInsertDTO[],
  ): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpCompanyAddress.getEndpoint(companyId, '/lista'),
      { listaDomicilio: addressList, codModulo: 1, codOrigen: 1 },
    );
  },

  get: (companyId: number): Promise<CompanyAddressViewDTO[]> => {
    return HttpAxiosRequest.get(HttpCompanyAddress.getEndpoint(companyId, ''));
  },
};
