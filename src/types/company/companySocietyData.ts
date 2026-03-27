import { EntityWithId } from '../baseEntities';
import {PersonPersonalDataView, PersonRelationship} from "../person/personData";
import {EntityAddress, EntityMail, EntityPhoneNumber} from "../general/generalReferentialData";

export enum SocietyPersonFields {
  CompanyId = 'idEmpresa',
  PersonId = 'idPersona',
  ParticipationPercent = 'porcParticipacion',
  PersonRelationshipTypeCode = 'codEmpresaPersonaRelacionTipo',
  PersonRelationshipTypeDesc = 'descEmpresaPersonaRelacionTipo',
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
  [SocietyPersonFields.PersonRelationshipTypeCode]: number;
  [SocietyPersonFields.PersonRelationshipTypeDesc]: string;
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
  [SocietyPersonFields.PersonRelationshipTypeCode]: number;
}

export interface SocietyPersonaUpdate {
  [SocietyPersonFields.ParticipationPercent]: number;
  [SocietyPersonFields.PersonRelationshipTypeCode]: number;
}

export enum CompanyPersonRelationshipFields {
  CompanyId = 'idEmpresa',
  PersonId = 'idPersona',
  ParticipationPercent = 'porcParticipacion',
  PersonRelationshipTypeCode = 'codEmpresaPersonaRelacionTipo',
  PersonRelationshipTypeDesc = 'descEmpresaPersonaRelacionTipo',
  PersonRelationshipTypeClassificationCode = 'codEmpresaPersonaRelacionTipoClasificacion',
  PositionSpouseDesc = 'descCargoConyuge',
  PositionAuthorityDesc = 'descCargoAutoridad',
  PositionEmployeeDesc = 'descCargoEmpleado',
  PositionOthersDesc = 'descCargoOtros',
  DocumentsQuantity = 'cantidadDocumentos',
  CUIT = 'cuit',
  DNI = 'numeroDocumento',
  LegalName = 'razonSocial',
  Name = 'nombre',
  LastName = 'apellido',
  CompleteFiscalAddress = 'domicilioFiscalCalleCompleta',
  IsPoliticallyExposed = 'esPersonaExpuestaPoliticamente'
}

export interface CompanyPersonRelationship extends PersonRelationship {
  [CompanyPersonRelationshipFields.CompanyId]: number;
}

export enum RelatedPersonWithReferentialDataFields {
  Person = 'person',
  Phone = 'phone',
  Mail = 'mail',
  ListAddressess = 'listAddressess',
}

export interface RelatedPersonWithReferentialData {
  [RelatedPersonWithReferentialDataFields.Person]: PersonPersonalDataView;
  [RelatedPersonWithReferentialDataFields.Phone]: EntityPhoneNumber[];
  [RelatedPersonWithReferentialDataFields.Mail]: EntityMail;
  [RelatedPersonWithReferentialDataFields.ListAddressess]: EntityAddress[];
}

export enum RelatedPersonType {
  Associate = 1,
  Authorities = 5,
  Employees = 6,
  Others = 7,
}
