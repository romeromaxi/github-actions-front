import { EntityWithId } from '../baseEntities';

export enum RoleFields {
  CompanyId = 'idEmpresa',
  PersonId = 'idPersona',
  UserRelationshipCode = 'codEmpresaUsuarioRelacion',
  UserRelationshipDesc = 'descEmpresaUsuarioRelacion',
  UserCompanyBondCod = 'codEmpresaUsuarioVinculo',
  UserCompanyBondDesc = 'descEmpresaUsuarioVinculo',
  CUIT = 'cuit',
  DNI = 'numeroDocumento',
  LegalName = 'razonSocial',
  Name = 'nombre',
  LastName = 'apellido',
  Mail = 'mail',
  PersonTypeCode = 'codPersonaTipo',
  Gender = 'sexo',
  AreaCode = 'codigoArea',
  PhoneCode = 'codigoTelefonico',
  PhoneNumber = 'telefono',
  Blocked = 'estaBloqueado',
  IsOwnUser = 'esUsuarioPropio'
}

export interface Role extends EntityWithId<number> {
  [RoleFields.CompanyId]: number;
  [RoleFields.PersonId]: number;
  [RoleFields.UserRelationshipCode]: number;
  [RoleFields.UserRelationshipDesc]: string;
  [RoleFields.UserCompanyBondCod]: number;
  [RoleFields.UserCompanyBondDesc]: string;
  [RoleFields.CUIT]: string;
  [RoleFields.DNI]: string;
  [RoleFields.LegalName]: string;
  [RoleFields.Name]: string;
  [RoleFields.LastName]: string;
  [RoleFields.Mail]: string;
  [RoleFields.AreaCode]: string;
  [RoleFields.PhoneCode]: string;
  [RoleFields.PhoneNumber]: string;
  [RoleFields.Blocked]: boolean;
  [RoleFields.IsOwnUser]: boolean;
}

export interface RolePost {
  [RoleFields.CompanyId]: number;
  [RoleFields.Mail]: string;
  [RoleFields.CUIT]: string;
  [RoleFields.UserRelationshipCode]: number;
  [RoleFields.LegalName]: string;
  [RoleFields.LastName]: string;
  [RoleFields.Name]: string;
  [RoleFields.PersonTypeCode]: number;
  [RoleFields.Gender]: string;
}

export enum RoleInvitationFields {
  CompanyId = 'idEmpresa',
  UserRelationshipCode = 'codEmpresaUsuarioRelacion',
  UserRelationshipDesc = 'descEmpresaUsuarioRelacion',
  CUIT = 'cuit',
  LegalName = 'razonSocial',
  Mail = 'mail',
}

export interface RoleInvitation extends EntityWithId<number> {
  [RoleInvitationFields.CompanyId]: number;
  [RoleInvitationFields.UserRelationshipCode]: number;
  [RoleInvitationFields.UserRelationshipDesc]: string;
  [RoleInvitationFields.CUIT]: string;
  [RoleInvitationFields.LegalName]: string;
  [RoleInvitationFields.Mail]: string;
}

export enum RoleInvitationPostFields {
  Mail = 'mail',
  CUIT = 'cuit',
  LegalName = 'razonSocial',
  UserRelationshipCode = 'codEmpresaUsuarioRelacion',
  UserBondTypeCode = 'codEmpresaUsuarioVinculo',
}

export interface RoleInvitationPost {
  [RoleInvitationPostFields.Mail]: string;
  [RoleInvitationPostFields.CUIT]: string;
  [RoleInvitationPostFields.LegalName]: string;
  [RoleInvitationPostFields.UserRelationshipCode]: number;
  [RoleInvitationPostFields.UserBondTypeCode]: number;
}

export interface CompanyInvitationUpdate {
  [RoleInvitationPostFields.Mail]: string;
  [RoleInvitationPostFields.UserRelationshipCode]: number;
}

export enum CompanyInvitationRoleNewFields {
  CompanyId = 'idEmpresa',
  UserRelationshipCompanyCode = 'codEmpresaUsuarioRelacion',
  UserRelationshipCompanyDesc = 'descEmpresaUsuarioRelacion',
  CUIT = 'cuit',
  BusinessName = 'razonSocial',
  Mail = 'mail',
  UserCompanyBondCode = 'codEmpresaUsuarioVinculo',
  UserCompanyBondDesc = 'descEmpresaUsuarioVinculo',
}

export interface CompanyInvitationRoleNew extends EntityWithId<number> {
  [CompanyInvitationRoleNewFields.CompanyId]: number;
  [CompanyInvitationRoleNewFields.UserRelationshipCompanyCode]: number;
  [CompanyInvitationRoleNewFields.UserRelationshipCompanyDesc]: string;
  [CompanyInvitationRoleNewFields.CUIT]: string;
  [CompanyInvitationRoleNewFields.BusinessName]: string;
  [CompanyInvitationRoleNewFields.Mail]: string;
  [CompanyInvitationRoleNewFields.UserCompanyBondCode]: number;
  [CompanyInvitationRoleNewFields.UserCompanyBondDesc]: string;
}
