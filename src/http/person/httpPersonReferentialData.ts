import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  PersonAddress,
  PersonAddressInsert,
  PersonAddressInsertListFields,
  PersonMail,
  PersonMailInsert,
  PersonPhoneNumber,
  PersonPhoneNumberInsert,
} from 'types/person/personReferentialData';

export const HttpPersonMail = {
  getEndpoint: (personId: number, url: string): string =>
    `persona/${personId}/mails${url}`,

  insert: (personId: number, personMail: PersonMailInsert): Promise<any> => {
    return HttpAxiosRequest.post(HttpPersonMail.getEndpoint(personId, ''), {
      ...personMail,
      codModulo: 1,
      codOrigen: 1,
    });
  },

  getByPersonId: (personId: number): Promise<PersonMail> => {
    return HttpAxiosRequest.get(HttpPersonMail.getEndpoint(personId, ''));
  },
};

export const HttpPersonPhoneNumber = {
  getEndpoint: (personId: number, url: string): string =>
    `persona/${personId}/telefonos${url}`,

  insert: (
    personId: number,
    personPhoneNumber: PersonPhoneNumberInsert,
  ): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpPersonPhoneNumber.getEndpoint(personId, ''),
      { ...personPhoneNumber, codModulo: 1, codOrigen: 1 },
    );
  },

  getByPersonId: (personId: number): Promise<PersonPhoneNumber> => {
    return HttpAxiosRequest.get(
      HttpPersonPhoneNumber.getEndpoint(personId, ''),
    );
  },
};

export const HttpPersonAddress = {
  getEndpoint: (personId: number, url: string): string =>
    `persona/${personId}/domicilios${url}`,

  insert: (
    personId: number,
    personAdress: PersonAddressInsert,
  ): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpPersonAddress.getEndpoint(personId, ''),
      personAdress,
    );
  },

  insertList: (
    personId: number,
    personAdresses: PersonAddressInsert[],
  ): Promise<any> => {
    return HttpAxiosRequest.post(
      HttpPersonAddress.getEndpoint(personId, '/lista'),
      {
        [PersonAddressInsertListFields.ListPersonAddresses]: personAdresses,
        [PersonAddressInsertListFields.ModuleCode]: 1,
        [PersonAddressInsertListFields.OriginCode]: 1,
      },
    );
  },

  getByPersonId: (personId: number): Promise<PersonAddress[]> => {
    return HttpAxiosRequest.get(HttpPersonAddress.getEndpoint(personId, ''));
  },
};
