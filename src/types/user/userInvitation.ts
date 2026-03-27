import {EntityWithId} from '../baseEntities';

export enum CompanyUserInvitationFields {
  CompanyId = 'idEmpresa',
  CompanyUserRelationshipCode = 'codEmpresaUsuarioRelacion',
  CompanyUserRelationshipDesc = 'descEmpresaUsuarioRelacion',
  CompanyUserBondDesc = 'descEmpresaUsuarioVinculo',
  CompanyBusinessName = 'razonSocialEmpresa',
  CompanyCuit = 'cuitEmpresa',
  CompanyPersonTypeCode = 'codPersonaTipoEmpresa',
  OwnUserInvitationBusinessName = 'razonSocialUsuarioInvita',
}

export interface CompanyUserInvitation extends EntityWithId<number> {
  [CompanyUserInvitationFields.CompanyId]: number;
  [CompanyUserInvitationFields.CompanyUserRelationshipCode]: number;
  [CompanyUserInvitationFields.CompanyUserRelationshipDesc]: string;
  [CompanyUserInvitationFields.CompanyUserBondDesc]: string;
  [CompanyUserInvitationFields.CompanyBusinessName]: string;
  [CompanyUserInvitationFields.CompanyCuit]: string;
  [CompanyUserInvitationFields.CompanyPersonTypeCode]?: number;
  [CompanyUserInvitationFields.OwnUserInvitationBusinessName]: string;
}