import {
  EntityFilterPagination,
  EntityPagination,
  EntityWithId,
} from '../baseEntities';
import { BaseAddress } from '../address/addressData';

export enum OffererFields {
  BusinessName = 'razonSocial',
  CUIT = 'cuit',
  OffererLogoUrl = 'urlOferenteLogo',
  FiscalAddress = 'domicilioFiscal',
  AfipActivityStartDate = 'inicioActividad',
  SocialResponsibiltiy = 'cargasSociales',
  Type = 'tipo',
  Status = 'estado',
  TitularAfipStatus = 'titularEstadoAfip',
  TitularCUIT = 'cuitTitular',
  Score = 'score',
  UsersQuantity = 'cantidadUsuarios',
  RelatedPeopleQuantity = 'cantidadPeronasRelacionadas',
  Website = 'web',
  Responsible = 'responsable',
  StatusCode = 'codestado',
  LogInName = 'nombreAcceso',
  BusinessTradeName = 'nombreFantasia'
}

export interface Offerer extends EntityWithId<number> {
  [OffererFields.BusinessName]: string;
  [OffererFields.OffererLogoUrl]?: string;
  [OffererFields.CUIT]: string;
  [OffererFields.UsersQuantity]?: number;
  [OffererFields.RelatedPeopleQuantity]?: number;
  [OffererFields.Status]?: string;
  [OffererFields.Type]?: string;
  [OffererFields.StatusCode]: number;
  [OffererFields.Responsible]?: string;
  [OffererFields.LogInName]?: string;
  [OffererFields.BusinessTradeName]?: string;
}

export interface OffererSummaryView extends EntityWithId<number> {
  [OffererFields.BusinessName]: string;
  [OffererFields.CUIT]: string;
}

export enum OffererUpdateDTOFields {
  Mail = 'mail',
  PhoneNumber = 'telefono',
  Cellphone = 'celular',
  FiscalAddress = 'domicilioFiscal',
  ActivityAddress = 'domicilioActividad',
  LegalAddress = 'domicilioLegal',
}

export interface OffererUpdateDTO {
  [OffererUpdateDTOFields.Mail]: string;
  [OffererUpdateDTOFields.PhoneNumber]: string;
  [OffererUpdateDTOFields.Cellphone]: string;
  [OffererUpdateDTOFields.FiscalAddress]: BaseAddress;
  [OffererUpdateDTOFields.ActivityAddress]: BaseAddress;
  [OffererUpdateDTOFields.LegalAddress]: BaseAddress;
}

export enum OffererViewDTOFields {
  PersonId = 'idPersona',
  OffererId = 'idOferente',
  OffererUrlLogo = 'urlOferenteLogo',
  BusinessName = 'razonSocial',
  CUIT = 'cuit',
  UsersQuantity = 'cantidadUsuarios',
  RelatedPeopleQuantity = 'cantidadPeronasRelacionadas',
  Web = 'web',
  TypeDesc = 'descPersonaClasificacion',
  Type = 'codPersonaTipo',
}

export enum OffererProfileType {
  CommercialOperator = 5,
  Administrator = 6,
  ApproverOperator = 10,
  EvalutatorOperator = 11,
}

export interface OffererViewDTO extends EntityWithId<number> {
  [OffererViewDTOFields.PersonId]: number;
  [OffererViewDTOFields.OffererId]: number;
  [OffererViewDTOFields.OffererUrlLogo]?: string;
  [OffererViewDTOFields.BusinessName]: string;
  [OffererViewDTOFields.CUIT]: string;
  [OffererViewDTOFields.UsersQuantity]: number;
  [OffererViewDTOFields.RelatedPeopleQuantity]: number;
  [OffererViewDTOFields.Web]: string;
  [OffererViewDTOFields.TypeDesc]: string;
  [OffererViewDTOFields.Type]: number;
}

export enum OffererQuaFilterSearchFields {
  OffererName = 'razonSocial',
  OffererCuit = 'cuit',
  OffererTypeCods = 'codsOferenteTipo',
}

export interface OffererQuaFilterSearch extends EntityFilterPagination {
  [OffererQuaFilterSearchFields.OffererName]?: string;
  [OffererQuaFilterSearchFields.OffererCuit]?: string;
  [OffererQuaFilterSearchFields.OffererTypeCods]?: number[];
}

export enum OffererSummaryTotalsViewFields {
  UsersQuantity = 'cantidadUsuarios',
  CommercialUsersQuantity = 'cantidadUsuariosComerciales',
  UsersWithoutGroupQuantity = 'cantidadUsuariosSinGrupo',
  UsersWithoutRoleQuantity = 'cantidadUsuariosSinRol',
}

export interface OffererSummaryTotalsView {
  [OffererSummaryTotalsViewFields.UsersQuantity]: number;
  [OffererSummaryTotalsViewFields.CommercialUsersQuantity]: number;
  [OffererSummaryTotalsViewFields.UsersWithoutGroupQuantity]: number;
  [OffererSummaryTotalsViewFields.UsersWithoutRoleQuantity]: number;
}

export enum OffererTemplateInsertFields {
  Description = 'descripcion',
  Detail = 'detalle',
  PersonTypeCods = 'codsPersonaTipo',
}

export interface OffererTemplateInsert {
  [OffererTemplateInsertFields.Description]: string;
  [OffererTemplateInsertFields.PersonTypeCods]: number[];
  [OffererTemplateInsertFields.Detail]: string;
}
