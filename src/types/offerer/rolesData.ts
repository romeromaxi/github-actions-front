import { EntityWithId } from '../baseEntities';

export enum RoleFields {
  OffererId = 'idOferente',
  PersonId = 'idPersona',
  CompanyId = 'idEmpresa',
  UserRelationshipCode = 'codOferenteUsuarioRelacion',
  UserRelationshipDesc = 'descOferenteUsuarioRelacion',
  CUIT = 'cuit',
  DNI = 'numeroDocumento',
  LegalName = 'razonSocial',
  Name = 'nombre',
  LastName = 'apellido',
  Mail = 'mail',
  PersonTypeCode = 'codPersonaTipo',
  Gender = 'sexo',
  PhoneNumber = 'telefono',
}

export interface Role extends EntityWithId<number> {
  [RoleFields.OffererId]: number;
  [RoleFields.PersonId]: number;
  [RoleFields.CompanyId]: number;
  [RoleFields.UserRelationshipCode]: number;
  [RoleFields.UserRelationshipDesc]: string;
  [RoleFields.CUIT]: string;
  [RoleFields.DNI]: string;
  [RoleFields.LegalName]: string;
  [RoleFields.Name]: string;
  [RoleFields.LastName]: string;
  [RoleFields.Mail]: string;
  [RoleFields.PhoneNumber]: string;
}

export interface RolePost {
  [RoleFields.OffererId]: number;
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
  OffererId = 'idOferente',
  UserRelationshipCode = 'codOferenteUsuarioRelacion',
  UserRelationshipDesc = 'descOferenteUsuarioRelacion',
  CUIT = 'cuit',
  LegalName = 'razonSocial',
}

export interface RoleInvitation extends EntityWithId<number> {
  [RoleInvitationFields.OffererId]: number;
  [RoleInvitationFields.UserRelationshipCode]: number;
  [RoleInvitationFields.UserRelationshipDesc]: string;
  [RoleInvitationFields.CUIT]: string;
  [RoleInvitationFields.LegalName]: string;
}

export enum RoleInvitationPostFields {
  PersonId = 'idPersonaInvitado',
  Mail = 'mail',
  CUIT = 'cuit',
  LegalName = 'razonSocial',
  UserRelationshipCode = 'codOferenteUsuarioRelacion',
}

export interface RoleInvitationPost {
  [RoleInvitationPostFields.PersonId]?: number;
  [RoleInvitationPostFields.Mail]: string;
  [RoleInvitationPostFields.CUIT]: string;
  [RoleInvitationPostFields.LegalName]: string;
  [RoleInvitationPostFields.UserRelationshipCode]: number;
}

export enum OffererRoleFields {
  OffererId = 'idOferente',
  UserId = 'idUsuario',
  PersonId = 'idPersona',
  CUIT = 'cuit',
  DNI = 'numeroDocumento',
  LegalName = 'razonSocial',
  Name = 'nombre',
  LastName = 'apellido',
  Mail = 'mail',
  GroupIds = 'idsGrupo',
  GroupNames = 'nombreGrupos',
  OriginId = 'idOrigen',
  Sector = 'sector',
  WorkTeamIds = 'idsEquipoTrabajo',
}

export interface OffererRole extends EntityWithId<number> {
  [OffererRoleFields.OffererId]: number;
  [OffererRoleFields.UserId]: number;
  [OffererRoleFields.PersonId]: number;
  [OffererRoleFields.CUIT]: string;
  [OffererRoleFields.DNI]: string;
  [OffererRoleFields.LegalName]: string;
  [OffererRoleFields.Name]: string;
  [OffererRoleFields.LastName]: string;
  [OffererRoleFields.Mail]: string;
  [OffererRoleFields.GroupIds]: number[];
  [OffererRoleFields.GroupNames]: string;
  [OffererRoleFields.WorkTeamIds]: number[];
}

export interface OffererRolePost {
  [OffererRoleFields.OffererId]: number;
  [OffererRoleFields.Mail]: string;
  [OffererRoleFields.CUIT]: string;
  [OffererRoleFields.LegalName]: string;
  [OffererRoleFields.LastName]: string;
  [OffererRoleFields.Name]: string;
  [OffererRoleFields.GroupIds]: number[];
  [OffererRoleFields.OriginId]: string;
  [OffererRoleFields.Sector]: string;
  [OffererRoleFields.WorkTeamIds]: number[];
}

export enum OffererRoleInvitationPostFields {
  PersonId = 'idPersonaInvitado',
  Mail = 'mail',
  CUIT = 'cuit',
  LegalName = 'razonSocial',
  GroupIds = 'idsGrupo',
}

export interface OffererRoleInvitationPost {
  [OffererRoleInvitationPostFields.PersonId]?: number;
  [OffererRoleInvitationPostFields.Mail]: string;
  [OffererRoleInvitationPostFields.CUIT]: string;
  [OffererRoleInvitationPostFields.LegalName]: string;
  [OffererRoleInvitationPostFields.GroupIds]: number[];
}
