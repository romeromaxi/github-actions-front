import { EntityWithId } from '../baseEntities';

export enum UserInvitationFromCompanyFields {
  CompanyId = 'idEmpresa',
  UserRelationshipCode = 'codEmpresaUsuarioRelacion',
  UserRelationshipDesc = 'descEmpresaUsuarioRelacion',
  CompanyLegalName = 'razonSocialEmpresa',
  UserCompanyBondDesc = 'descEmpresaUsuarioVinculo',
  CompanyCuit = 'cuitEmpresa',
  CompanyPersonTypeCode = 'codPersonaTipoEmpresa',
  UserWhoInvitesBusinessName = 'razonSocialUsuarioInvita',
}

export interface UserInvitationFromCompany extends EntityWithId<number> {
  [UserInvitationFromCompanyFields.CompanyId]: number;
  [UserInvitationFromCompanyFields.UserRelationshipCode]: number;
  [UserInvitationFromCompanyFields.UserRelationshipDesc]: string;
  [UserInvitationFromCompanyFields.CompanyLegalName]: string;
  [UserInvitationFromCompanyFields.UserCompanyBondDesc]?: string;
  [UserInvitationFromCompanyFields.CompanyCuit]?: string;
  [UserInvitationFromCompanyFields.CompanyPersonTypeCode]?: number;
  [UserInvitationFromCompanyFields.UserWhoInvitesBusinessName]?: string;
}
