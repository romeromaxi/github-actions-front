import { HttpAxiosRequest } from '../httpAxiosBase';
import { Role, RoleFields, RolePost } from 'types/company/rolesData';
import { BaseResponse } from '../../types/baseEntities';

export const HttpCompanyRoles = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}/usuarios${url}`,

  getListByCompanyId: (companyId: number): Promise<Role[]> => {
    return HttpAxiosRequest.get(HttpCompanyRoles.getEndpoint(companyId));
  },

  post: (data: RolePost): Promise<void> => {
    return HttpAxiosRequest.post(
      HttpCompanyRoles.getEndpoint(data[RoleFields.CompanyId]),
      {
        ...data,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  updateRole: (
    companyId: number,
    roleId: number,
    newRelationshipCode: number,
    bondCode: number,
  ): Promise<void> => {
    return HttpAxiosRequest.put(
      HttpCompanyRoles.getEndpoint(companyId, `/${roleId}`),
      {
        [RoleFields.UserRelationshipCode]: newRelationshipCode,
        [RoleFields.UserCompanyBondCod]: bondCode,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  deleteById: (companyId: number, roleId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.deleteWithBody(
      HttpCompanyRoles.getEndpoint(companyId, `/${roleId}`),
      { codModulo: 1 },
    );
  },

  delete: (companyId: number): Promise<BaseResponse> => {
    return HttpAxiosRequest.delete(HttpCompanyRoles.getEndpoint(companyId));
  },

  setUserAsAfipResponsible: (companyId: number): Promise<void> => {
    return HttpAxiosRequest.post(
      HttpCompanyRoles.getEndpoint(companyId, '/responsable'),
      {
        codModulo: 1,
      },
    );
  },

  getPending: (companyId: number): Promise<Role[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyRoles.getEndpoint(companyId, '/pendientes'),
    );
  },

  acceptAtCompany: (
    companyId: number,
    companyUserId: number,
    companyUserRelationshipCode: number,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompanyRoles.getEndpoint(companyId, `/${companyUserId}/aceptar`),
      {
        codEmpresaUsuarioRelacion: companyUserRelationshipCode,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  rejectAtCompany: (
    companyId: number,
    companyUserId: number,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompanyRoles.getEndpoint(companyId, `/${companyUserId}/bloquear`),
      {},
    );
  },
};
