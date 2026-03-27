import { EntityFilterPagination, EntityWithId } from '../baseEntities';
import {
  PersonAddress,
  PersonMail,
  PersonPhoneNumber,
} from './personReferentialData';
import {PersonTypes} from "./personEnums";
import {EntityAddress} from "../general/generalReferentialData";

export enum PersonFields {
  LegalName = 'razonSocial',
  FirstName = 'nombre',
  LastName = 'apellido',
  CUIT = 'cuit',
  PersonTypeCode = 'codPersonaTipo',
  DocumentTypeCode = 'codDocumentoTipo',
  DocumentNumber = 'numeroDocumento',
  BirthdayDate = 'fechaNacimiento',
  PersonTypeDesc = 'descPersonaTipo',
  PersonClasificationDesc = 'descPersonaClasificacion',
  PersonMarritalStatusDesc = 'descPersonaEstadoCivil',
  GenderDesc = 'descPersonaGenero',
}

export interface Person extends EntityWithId<number> {
  [PersonFields.FirstName]: string;
  [PersonFields.LastName]: string;
  [PersonFields.CUIT]: string;
}

export interface PersonView extends EntityWithId<number> {
  [PersonFields.LegalName]: string;
  [PersonFields.FirstName]: string;
  [PersonFields.LastName]: string;
  [PersonFields.CUIT]: string;
  [PersonFields.PersonTypeCode]: number;
  [PersonFields.DocumentTypeCode]: number;
  [PersonFields.DocumentNumber]: number;
  [PersonFields.BirthdayDate]: string;
  [PersonFields.PersonTypeDesc]: string;
  [PersonFields.PersonClasificationDesc]: string;
  [PersonFields.PersonMarritalStatusDesc]: string;
  [PersonFields.GenderDesc]: string;
}

export enum NewPersonDTOFields {
  PhoneNumber = 'telefono',
  Mail = 'mail',
  BirthDate = 'fechaNacimiento',
  Gender = 'genero',
  MaritalStatusCode = 'estadoCivil',
  AfipResponsbilityType = 'responsabilidadAfip',
  FiscalAddress = 'domicilioFiscal',
  LegalAddress = 'domicilioLegal',
  ActivityAddress = 'domicilioActividad',
  File = 'file',
}

export interface NewPersonDTO {
  [NewPersonDTOFields.PhoneNumber]: string;
  [NewPersonDTOFields.Mail]: string;
  [NewPersonDTOFields.BirthDate]: Date;
  [NewPersonDTOFields.Gender]: string;
  [NewPersonDTOFields.MaritalStatusCode]: number;
  [NewPersonDTOFields.FiscalAddress]: string;
  [NewPersonDTOFields.LegalAddress]: string;
  [NewPersonDTOFields.ActivityAddress]: string;
  [NewPersonDTOFields.File]: File;
}

export enum NosisResponseFields {
  Valid = 'esValida',
  StatusDescription = 'descripcionEstado',
  PersonId = 'idPersona',
  BusinessName = 'razonSocial',
  FiscalAddress = 'domicilioFiscal',
}

export interface NosisResponse {
  [NosisResponseFields.Valid]: boolean;
  [NosisResponseFields.StatusDescription]: string;
  [NosisResponseFields.PersonId]: number;
  [NosisResponseFields.BusinessName]: string;
  [NosisResponseFields.FiscalAddress]: EntityAddress;
}

export enum NosisMainDataResponseFields {
  Valid = 'esValida',
  StatusDescription = 'descripcionEstado',
  BusinessName = 'razonSocial',
  Identification = 'identificacion',
  LastName = 'apellido',
  FirstName = 'nombre',
  PersonTypeCode = 'codPersonaTipo',
  Gender = 'sexo',
  FiscalAddressStreet = 'domicilioFiscalCalle',
  FiscalAddressNumber = 'domicilioFiscalNro',
  FiscalAddressFloor = 'domicilioFiscalPiso',
  FiscalAddressApt = 'domicilioFiscalDepto',
  FiscalAddressMunicipality = 'domicilioFiscalLocalidad',
  FiscalAddressPostalCode = 'domicilioFiscalCP',
  FiscalAddressProvince = 'domicilioFiscalProvincia',
}

export interface NosisMainDataResponse {
  [NosisMainDataResponseFields.Valid]: boolean;
  [NosisMainDataResponseFields.StatusDescription]: string;
  [NosisMainDataResponseFields.BusinessName]: string;
  [NosisMainDataResponseFields.Identification]: string;
  [NosisMainDataResponseFields.LastName]: string;
  [NosisMainDataResponseFields.FirstName]: string;
  [NosisMainDataResponseFields.PersonTypeCode]: number;
  [NosisMainDataResponseFields.Gender]: string;
  [NosisMainDataResponseFields.FiscalAddressStreet]: string;
  [NosisMainDataResponseFields.FiscalAddressFloor]: string;
  [NosisMainDataResponseFields.FiscalAddressApt]: string;
  [NosisMainDataResponseFields.FiscalAddressMunicipality]: string;
  [NosisMainDataResponseFields.FiscalAddressPostalCode]: string;
  [NosisMainDataResponseFields.FiscalAddressProvince]: string;
}

export enum PersonViewWithReferentialDataFields {
  Person = 'person',
  PhoneNumber = 'phoneNumber',
  Mail = 'mail',
  ListAddressess = 'listAddressess',
}

export interface PersonViewWithReferentialData {
  [PersonViewWithReferentialDataFields.Person]: PersonView;
  [PersonViewWithReferentialDataFields.PhoneNumber]: PersonPhoneNumber;
  [PersonViewWithReferentialDataFields.Mail]: PersonMail;
  [PersonViewWithReferentialDataFields.ListAddressess]: PersonAddress[];
}

export enum PersonQuaFilterSearchFields {
  BusinessName = 'razonSocial',
  Cuit = 'cuit',
  ValidationStateCodes = 'codsValidacionEstado',
}

export interface PersonQuaFilterSearch extends EntityFilterPagination {
  [PersonQuaFilterSearchFields.BusinessName]: string;
  [PersonQuaFilterSearchFields.Cuit]: string;
  [PersonQuaFilterSearchFields.ValidationStateCodes]: number[];
}

export enum PersonSummaryViewFields {
  BusinessName = 'razonSocial',
  CUIT = 'cuit',
  CompanyId = 'idEmpresa',
  UserId = 'idUsuario',
  ValidationStateCode = 'codValidacionEstado',
  ValidationStateDesc = 'descValidacionEstado',
  ValidationStateObservations = 'observacionValidacionEstado',
  ValidationStateDate = 'fechaUltValidacionEstado',
  PersonTypeCode = 'codPersonaTipo',
  PersonTypeDesc = 'descPersonaTipo',
  AllowsResult = 'permiteResultado',
}

export interface PersonSummaryView extends EntityWithId<number> {
  [PersonSummaryViewFields.BusinessName]: string;
  [PersonSummaryViewFields.CUIT]: string;
  [PersonSummaryViewFields.CompanyId]?: number;
  [PersonSummaryViewFields.UserId]?: number;
  [PersonSummaryViewFields.ValidationStateCode]: number;
  [PersonSummaryViewFields.ValidationStateDesc]: string;
  [PersonSummaryViewFields.ValidationStateObservations]: string;
  [PersonSummaryViewFields.ValidationStateDate]?: Date;
  [PersonSummaryViewFields.PersonTypeCode]: number;
  [PersonSummaryViewFields.PersonTypeDesc]: string;
  [PersonSummaryViewFields.AllowsResult]: boolean;
}

export enum PersonUpdateValidateStateFields {
  ValidationStateCode = 'codValidacionEstado',
  ValidationStateObservations = 'observacionValidacionEstado',
}

export interface PersonUpdateValidateState {
  [PersonUpdateValidateStateFields.ValidationStateCode]: number;
  [PersonUpdateValidateStateFields.ValidationStateObservations]: string;
}


export enum ProfilePersonTypes {
  Company = 'company',
  Offerer = 'offerer'
}


export enum PersonRelationshipFields {
  PersonId = 'idPersona',
  FolderId = 'idCarpeta',
  BasePersonId = 'idPersonaBase',
  PersonTypeCode = 'codPersonaTipo',
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
  IsPoliticallyExposed = 'esPersonaExpuestaPoliticamente',
  OriginEntityId = 'idEntidadOrigen',
  PublicBasesQueryId = 'idBasesPublicasConsulta'
}


export interface PersonRelationship extends EntityWithId<number> {
  [PersonRelationshipFields.PersonId]: number;
  [PersonRelationshipFields.FolderId]: string;
  [PersonRelationshipFields.BasePersonId]?: number;
  [PersonRelationshipFields.PersonTypeCode]: PersonTypes;
  [PersonRelationshipFields.ParticipationPercent]?: number;
  [PersonRelationshipFields.PersonRelationshipTypeCode]: number;
  [PersonRelationshipFields.PersonRelationshipTypeDesc]: string;
  [PersonRelationshipFields.PersonRelationshipTypeClassificationCode]: number;
  [PersonRelationshipFields.PositionSpouseDesc]?: string;
  [PersonRelationshipFields.PositionAuthorityDesc]?: string;
  [PersonRelationshipFields.PositionEmployeeDesc]: string;
  [PersonRelationshipFields.PositionOthersDesc]?: string;
  [PersonRelationshipFields.DocumentsQuantity]?: number;
  [PersonRelationshipFields.CUIT]: string;
  [PersonRelationshipFields.DNI]: string;
  [PersonRelationshipFields.LegalName]: string;
  [PersonRelationshipFields.Name]: string;
  [PersonRelationshipFields.LastName]: string;
  [PersonRelationshipFields.CompleteFiscalAddress]: string;
  [PersonRelationshipFields.IsPoliticallyExposed]?: boolean;
  [PersonRelationshipFields.OriginEntityId]?: string;
  [PersonRelationshipFields.PublicBasesQueryId]?: number;
}


export enum PersonRelationshipInsertFields {
  IsPoliticallyExposed = 'esPersonaExpuestaPoliticamente'
}
export interface PersonRelationshipInsert {
  [PersonRelationshipFields.PersonId]: number;
  [PersonRelationshipFields.ParticipationPercent]?: number;
  [PersonRelationshipFields.PositionAuthorityDesc]?: string;
  [PersonRelationshipFields.PositionEmployeeDesc]?: string;
  [PersonRelationshipFields.PositionOthersDesc]?: string;
  [PersonRelationshipInsertFields.IsPoliticallyExposed]?: boolean;
  [PersonRelationshipFields.CUIT]: string;
}


export enum PersonRelationshipFormFields {
  IsMember = 'esSocio',
  IsSpouse = 'esConyuge',
  IsAuthority = 'esAutoridad',
  IsEmployee = 'esEmpleado',
  IsOther = 'esOtro',
}

export interface PersonRelationshipInsertFormType
    extends PersonRelationshipInsert {
  [PersonRelationshipFormFields.IsMember]: boolean;
  [PersonRelationshipFormFields.IsSpouse]: boolean;
  [PersonRelationshipFormFields.IsAuthority]: boolean;
  [PersonRelationshipFormFields.IsEmployee]: boolean;
  [PersonRelationshipFormFields.IsOther]: boolean;
}


export enum PersonRelationshipFilterFields {
  ListRelationshipTypes = 'lstCodsPersonaRelacionTipoClasificacion',
}

export interface PersonRelationshipFilter {
  [PersonRelationshipFilterFields.ListRelationshipTypes]?: number[];
}

export interface PersonRelationshipUpdate {
  [PersonRelationshipFields.ParticipationPercent]?: number;
  [PersonRelationshipFields.PositionAuthorityDesc]?: string;
  [PersonRelationshipFields.PositionEmployeeDesc]?: string;
  [PersonRelationshipFields.PositionOthersDesc]?: string;
}


export enum PersonPersonalDataFields {
  PersonId = 'idPersona',
  LegalName = 'razonSocial',
  FirstName = 'nombre',
  LastName = 'apellido',
  CUIT = 'cuit',
  DocumentNumber = 'numeroDocumento',
  BirthdayDate = 'fechaNacimiento',
  GenderCode = 'codPersonaGenero',
  GenderDesc = 'descPersonaGenero',
  PersonTypeCode = 'codPersonaTipo',
  PersonTypeDesc = 'descPersonaTipo',
  PersonMarritalStatusCode = 'codEstadoCivil',
  PersonMarritalStatusDesc = 'descPersonaEstadoCivil',
  PersonResponsibilityTypeCode = 'codAfipResponsableTipo',
  PersonResponsibilityTypeDesc = 'descAfipResponsableTipo',
  IsPolitacllyExposed = 'esPersonaExpuestaPoliticamente',
  FiancePersonCuit = 'cuitPersonaConyuge',
  FiancePersonBusinessName = 'razonSocialPersonaConyuge'
}


export interface PersonPersonalDataView extends EntityWithId<number> {
  [PersonPersonalDataFields.PersonId]: number;
  [PersonPersonalDataFields.LegalName]: string;
  [PersonPersonalDataFields.FirstName]: string;
  [PersonPersonalDataFields.LastName]: string;
  [PersonPersonalDataFields.CUIT]: string;
  [PersonPersonalDataFields.DocumentNumber]: string;
  [PersonPersonalDataFields.BirthdayDate]?: Date;
  [PersonPersonalDataFields.GenderCode]?: number;
  [PersonPersonalDataFields.GenderDesc]: string;
  [PersonPersonalDataFields.PersonTypeCode]?: number;
  [PersonPersonalDataFields.PersonTypeDesc]: string;
  [PersonPersonalDataFields.PersonMarritalStatusCode]?: number;
  [PersonPersonalDataFields.PersonMarritalStatusDesc]: string;
  [PersonPersonalDataFields.PersonResponsibilityTypeCode]?: number;
  [PersonPersonalDataFields.PersonResponsibilityTypeDesc]: string;
  [PersonPersonalDataFields.IsPolitacllyExposed]?: boolean;
  [PersonPersonalDataFields.FiancePersonCuit]?: string;
  [PersonPersonalDataFields.FiancePersonBusinessName]?: string;
}


export enum PersonPersonalDataInsertFields {
  FiancePersonId = 'idPersonaConyuge'
}

export interface PersonPersonalDataInsert extends EntityWithId<number> {
  [PersonPersonalDataFields.BirthdayDate]?: Date;
  [PersonPersonalDataFields.GenderCode]?: number;
  [PersonPersonalDataFields.PersonTypeCode]?: number;
  [PersonPersonalDataFields.PersonMarritalStatusCode]?: number;
  [PersonPersonalDataFields.PersonResponsibilityTypeCode]?: number;
  [PersonPersonalDataFields.IsPolitacllyExposed]?: boolean;
  [PersonPersonalDataInsertFields.FiancePersonId]?: number;
}


export enum PersonValidationDataFields {
  Mail = 'mail',
  CUIT = 'cuit',
  ModuleCode = 'codModulo',
  Captcha = 'captcha'
}


export interface PersonValidationData {
  [PersonValidationDataFields.Mail]: string;
  [PersonValidationDataFields.CUIT]: string;
  [PersonValidationDataFields.ModuleCode]: number;
  [PersonValidationDataFields.Captcha]: string;
}