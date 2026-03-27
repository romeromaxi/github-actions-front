import { EntityWithId } from '../baseEntities';

export enum SocietyPersonFields {
  CompanyId = 'idEmpresa',
  PersonId = 'idPersona',
  ParticipationPercent = 'porcParticipacion',
  PersonRelationshipCode = 'codEmpresaPersonaRelacion',
  PersonRelationshipDesc = 'descEmpresaPersonaRelacion',
  CUIT = 'cuit',
  DNI = 'numeroDocumento',
  LegalName = 'razonSocial',
  Name = 'nombre',
  LastName = 'apellido',
}

export interface SocietyPerson extends EntityWithId<number> {
  [SocietyPersonFields.CompanyId]: number;
  [SocietyPersonFields.PersonId]: number;
  [SocietyPersonFields.ParticipationPercent]: number;
  [SocietyPersonFields.PersonRelationshipDesc]: string;
  [SocietyPersonFields.CUIT]: string;
  [SocietyPersonFields.DNI]: string;
  [SocietyPersonFields.LegalName]: string;
  [SocietyPersonFields.Name]: string;
  [SocietyPersonFields.LastName]: string;
}

export interface SocietyPersonaPost {
  [SocietyPersonFields.CompanyId]: number;
  [SocietyPersonFields.PersonId]: number;
  [SocietyPersonFields.ParticipationPercent]: number;
  [SocietyPersonFields.PersonRelationshipCode]: number;
}
