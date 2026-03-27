import { HttpAxiosRequest } from '../httpAxiosBase';
import {
  CompanyInvitationRoleNew,
  CompanyInvitationUpdate,
  RoleInvitation,
  RoleInvitationPost,
} from 'types/company/rolesData';
import {BaseRequestFields, BaseResponse} from '../../types/baseEntities';
import { CompanyInvitationDetailDialogForm } from '../../pages/company/invitations/CompanyInvitationDetailDialog';
import { CompanyAlreadyValidatedFormData } from '../../pages/company/newCompany/CompanyAlreadyValidatedForm';
import { Http } from '@mui/icons-material';
import {CompanyResponsibleInviteData, CompanyUnconfirmedRegisterDataFields} from "../../types/company/companyData";
import {FileBaseFields} from "../../types/files/filesData";

export const HttpCompanyRolesInvitation = {
  getEndpoint: (companyId: number, url: string = ''): string =>
    `empresa/${companyId}/invitaciones${url}`,

  getPendingInvitations: (companyId: number): Promise<RoleInvitation[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyRolesInvitation.getEndpoint(companyId),
    );
  },

  sendInvitation: (
    companyId: number,
    roleInvitationPost: RoleInvitationPost,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompanyRolesInvitation.getEndpoint(companyId),
      {
        ...roleInvitationPost,
        codModulo: 1,
      },
    );
  },

  update: (
    companyId: number,
    companyInvitationId: number,
    invitationUpdate: CompanyInvitationUpdate,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.put(
      HttpCompanyRolesInvitation.getEndpoint(
        companyId,
        `/${companyInvitationId}`,
      ),
      {
        ...invitationUpdate,
        codModulo: 1,
      },
    );
  },

  forward: (
    companyId: number,
    companyInvitationId: number,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompanyRolesInvitation.getEndpoint(
        companyId,
        `/${companyInvitationId}/reenviar`,
      ),
      {},
    );
  },

  delete: (
    companyId: number,
    companyInvitationId: number,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.delete(
      HttpCompanyRolesInvitation.getEndpoint(
        companyId,
        `/${companyInvitationId}`,
      ),
    );
  },

  getNews: (companyId: number): Promise<CompanyInvitationRoleNew[]> => {
    return HttpAxiosRequest.get(
      HttpCompanyRolesInvitation.getEndpoint(companyId, '/entrantes'),
    );
  },

  insertNew: (
    companyId: number,
    data: CompanyAlreadyValidatedFormData,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompanyRolesInvitation.getEndpoint(companyId, '/entrantes'),
      {
        ...data,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  accept: (
    companyId: number,
    invId: number,
    data: CompanyInvitationDetailDialogForm,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompanyRolesInvitation.getEndpoint(
        companyId,
        `/entrantes/${invId}/aprobar`,
      ),
      {
        ...data,
        codModulo: 1,
        codOrigen: 1,
      },
    );
  },

  postUsePlatform: (
    companyId: number,
    mail: string,
    personId: number,
  ): Promise<BaseResponse> => {
    return HttpAxiosRequest.post(
      HttpCompanyRolesInvitation.getEndpoint(companyId, `/uso-plataforma`),
      {
        mail: mail,
        idPersona: personId,
        codOrigen: 1,
        codModulo: 1,
      },
    );
  },
  
  inviteResponsible: (companyId: number, data: CompanyResponsibleInviteData) : Promise<BaseResponse> => {
    const formData = new FormData()

    if (data[CompanyUnconfirmedRegisterDataFields.FileAble])
      formData.append(
          CompanyUnconfirmedRegisterDataFields.FileAble,
          data[CompanyUnconfirmedRegisterDataFields.FileAble].file,
          data[CompanyUnconfirmedRegisterDataFields.FileAble][FileBaseFields.FileDesc],
      );

    formData.append(CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail, data[CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail] ?? '')
    formData.append(CompanyUnconfirmedRegisterDataFields.ResponsibleGuestPersonId, !!data[CompanyUnconfirmedRegisterDataFields.ResponsibleGuestPersonId] ? `${data[CompanyUnconfirmedRegisterDataFields.ResponsibleGuestPersonId]}` : '')
    formData.append(BaseRequestFields.ModuleCode, '1')
    formData.append(BaseRequestFields.OriginCode, '1')
    
    return HttpAxiosRequest.post(
        HttpCompanyRolesInvitation.getEndpoint(companyId, '/responsable'),
        formData
    )
  }
};
