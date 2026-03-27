import { HttpAxiosRequest } from '../httpAxiosBase';

import {
  EntityPhoneNumberInsert,
  EntityMailInsert,
  EntityAddressInsert,
} from 'types/general/generalReferentialData';
import {
  CompanyPersonAddressViewDTO,
  CompanyPersonMailViewDTO,
  CompanyPersonPhoneViewDTO,
} from 'types/company/companyPersonReferentialData';
import { CompanyPhoneInsertDTO } from '../../types/company/companyReferentialData';
import {BaseResponse} from "../../types/baseEntities";

export const HttpCompanyPersonMail = {
  getEndpoint: (companyId: number, personId: number, url: string): string =>
    `empresa/${companyId}/persona/${personId}/mails${url}`,

  insert: (
    companyId: number,
    personId: number,
    companyMail: EntityMailInsert,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompanyPersonMail.getEndpoint(companyId, personId, ''),
      { ...companyMail, codModulo: 1, codOrigen: 1 },
    );
  },

  get: (
    companyId: number,
    personId: number,
  ): Promise<CompanyPersonMailViewDTO> => {
    return HttpAxiosRequest.get(
      HttpCompanyPersonMail.getEndpoint(companyId, personId, ''),
    );
  },
};

export const HttpCompanyPersonPhoneNumber = {
  getEndpoint: (companyId: number, personId: number, url: string): string =>
    `empresa/${companyId}/persona/${personId}/telefonos${url}`,

  insert: (
    companyId: number,
    personId: number,
    companyPhoneNumber: EntityPhoneNumberInsert,
  ): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpCompanyPersonPhoneNumber.getEndpoint(companyId, personId, ''),
      { ...companyPhoneNumber, codModulo: 1, codOrigen: 1 },
    );
  },

  insertList: (
    companyId: number,
    personId: number,
    companyPhoneNumberList: CompanyPhoneInsertDTO[],
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompanyPersonPhoneNumber.getEndpoint(companyId, personId, '/lista'),
      { telefonos: companyPhoneNumberList, codModulo: 1, codOrigen: 1 },
    );
  },

  get: (
    companyId: number,
    personId: number,
  ): Promise<CompanyPersonPhoneViewDTO[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyPersonPhoneNumber.getEndpoint(companyId, personId, ''),
    );
  },
};

export const HttpCompanyPersonAddress = {
  getEndpoint: (companyId: number, personId: number, url: string): string =>
    `empresa/${companyId}/persona/${personId}/domicilios${url}`,

  insert: (
    companyId: number,
    personId: number,
    address: EntityAddressInsert,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompanyPersonAddress.getEndpoint(companyId, personId, ''),
      { ...address, codModulo: 1, codOrigen: 1 },
    );
  },

  insertList: (
    companyId: number,
    personId: number,
    addressList: EntityAddressInsert[],
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompanyPersonAddress.getEndpoint(companyId, personId, '/lista'),
      { listaDomicilio: addressList, codModulo: 1, codOrigen: 1 },
    );
  },

  get: (
    companyId: number,
    personId: number,
  ): Promise<CompanyPersonAddressViewDTO[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyPersonAddress.getEndpoint(companyId, personId, ''),
    );
  },
};
