import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  SocietyPerson,
  SocietyPersonaPost,
  SocietyPersonaUpdate,
  SocietyPersonFields,
} from '../../types/company/companySocietyData';
import { BaseResponse } from '../../types/baseEntities';

export const HttpCompanySociety = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}/personas${url}`,

  getListByCompanyId: (companyId: number): Promise<SocietyPerson[]> => {
    return HttpAxiosRequest.get(HttpCompanySociety.getEndpoint(companyId));
  },

  post: (data: SocietyPersonaPost): Promise<void> => {
    return HttpAxiosRequest.post(
      HttpCompanySociety.getEndpoint(data[SocietyPersonFields.CompanyId]),
      {
        ...data,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  update: (
    companyId: number,
    companySocietyId: number,
    data: SocietyPersonaUpdate,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.put(
      HttpCompanySociety.getEndpoint(companyId, `/${companySocietyId}`),
      {
        ...data,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  delete: (companyId: number, companySocietyId: number): Promise<void> => {
    return HttpAxiosRequest.delete(
      HttpCompanySociety.getEndpoint(companyId, `/${companySocietyId}`),
    );
  },
};
