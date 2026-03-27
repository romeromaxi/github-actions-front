import {
  EntityFilterPagination,
  EntityWithId,
  EntityWithIdAndDescription,
} from '../baseEntities';
import { BaseAddress } from '../address/addressData';
import { EntityAddress } from '../general/generalReferentialData';
import { SolicitationViewDTOFields } from '../solicitations/solicitationData';
import { SolicitationAlertType } from '../solicitations/solicitationEnums';
import { PersonTypes } from '../person/personEnums';
import {
  CompanyAddressInsertDTO,
  CompanyAddressViewDTO,
  CompanyPhoneInsertDTO,
  CompanyPhoneViewDTO,
} from './companyReferentialData';

export enum CompanyFields {
  BusinessName = 'razonSocial',
  CUIT = 'cuit',
  FiscalAddress = 'domicilioFiscal',
  AfipActivityStartDate = 'inicioActividad',
  SocialResponsibiltiy = 'cargasSociales',
  BCRAStatus = 'estadoBCRA',
  TitularAfipStatus = 'titularEstadoAfip',
  TitularCUIT = 'cuitTitular',
  Score = 'score',
  UsersQuantity = 'cantidadUsuarios',
  RelatedPeopleQuantity = 'cantidadPeronasRelacionadas',
  Website = 'web',
  CompanyTypeDesc = 'descTipo',
  Mail = 'mail',
  AreaCode = 'codigoArea',
  Phone = 'telefono',
  Web = 'web',
  SocialNetwork = 'redSocial',
  CompanyAge = 'antiguedadEmpresa',
  NumberEmployees = 'cantidadEmpleados',
  AlertCode = 'codAlerta',
  AfipSectionCode = 'codAfipTramo',
  AfipSectionDesc = 'descAfipTramo',
  IsLeadByWoman = 'esEmpresaLideradaPorMujeres',
  DocumentTypeCode = 'codPersonaDocumentoTipo',
  DocumentTypeDesc = 'descPersonaDocumentoTipo',
  DocumentNumber = 'numeroDocumento',
  BirthdayDate = 'fechaNacimiento',
}

export interface Company extends EntityWithId<number> {
  [CompanyFields.BusinessName]: string;
  [CompanyFields.CUIT]: string;
  [CompanyFields.UsersQuantity]?: number;
  [CompanyFields.RelatedPeopleQuantity]?: number;
  [CompanyFields.CompanyTypeDesc]: string;
  [CompanyFields.TitularAfipStatus]: string;
  [CompanyFields.TitularCUIT]: string;
  [CompanyFields.Score]: number;
  [CompanyFields.BCRAStatus]: string;
  [CompanyFields.FiscalAddress]: string;
  [CompanyFields.AfipActivityStartDate]: Date;
  [CompanyFields.SocialResponsibiltiy]: string;
  [CompanyFields.Mail]: string;
  [CompanyFields.AreaCode]?: string;
  [CompanyFields.Phone]: string;
  [CompanyFields.Web]: string;
  [CompanyFields.SocialNetwork]: string;
  [CompanyFields.CompanyAge]?: number;
  [CompanyFields.NumberEmployees]?: number;
  [CompanyFields.AlertCode]: SolicitationAlertType;
  [CompanyFields.AfipSectionCode]?: number;
  [CompanyFields.AfipSectionDesc]?: string;
  [CompanyFields.IsLeadByWoman]?: boolean;
  [CompanyFields.DocumentTypeCode]?: number;
  [CompanyFields.DocumentTypeDesc]?: string;
  [CompanyFields.DocumentNumber]?: string;
  [CompanyFields.BirthdayDate]?: Date;
}

export enum CompanyUpdateDTOFields {
  Mail = 'mail',
  PhoneNumber = 'telefono',
  Cellphone = 'celular',
  ActivityTypeCode = 'tipoActividad',
  SectorCode = 'sector',
  ActivityStartDate = 'inicioActividad',
  ClanaeMainTypeCode = 'clanaePrincipal',
  ClanaeSecondaryTypeCode = 'clanaeSecundario',
  FiscalAddress = 'domicilioFiscal',
  ActivityAddress = 'domicilioActividad',
  LegalAddress = 'domicilioLegal',
}

export interface CompanyUpdateDTO {
  [CompanyUpdateDTOFields.Mail]: string;
  [CompanyUpdateDTOFields.PhoneNumber]: string;
  [CompanyUpdateDTOFields.Cellphone]: string;
  [CompanyUpdateDTOFields.ActivityTypeCode]: number;
  [CompanyUpdateDTOFields.SectorCode]: number;
  [CompanyUpdateDTOFields.ActivityStartDate]: Date;
  [CompanyUpdateDTOFields.ClanaeMainTypeCode]: string;
  [CompanyUpdateDTOFields.ClanaeSecondaryTypeCode]: string;
  [CompanyUpdateDTOFields.FiscalAddress]: BaseAddress;
  [CompanyUpdateDTOFields.ActivityAddress]: BaseAddress;
  [CompanyUpdateDTOFields.LegalAddress]: BaseAddress;
}

export enum CompanyViewDTOFields {
  PersonId = 'idPersona',
  CompanyId = 'idEmpresa',
  OffererId = 'idOferente',
  BusinessName = 'razonSocial',
  CUIT = 'cuit',
  UsersQuantity = 'cantidadUsuarios',
  UsersPendingApprovalQuantity = 'cantidadUsuariosPendientesAprobacion',
  RelatedPeopleQuantity = 'cantidadPeronasRelacionadas',
  Mail = 'mail',
  Web = 'web',
  SocialNetwork = 'redSocial',
  CompanyAge = 'antiguedadEmpresa',
  NumberEmployees = 'cantidadEmpleados',

  PersonClassificationTypeCode = 'codPersonaClasificacion',
  PersonClassificationTypeDesc = 'descPersonaClasificacion',
  PersonTypeCode = 'codPersonaTipo',
  PersonTypeDesc = 'descPersonaTipo',
  CompanyTypeDesc = 'descTipo',
  AfipPrincipalActivityCode = 'codAfipActividadPpal',
  AfipRegistrationDate = 'fechaInscripcionAFIP',
  CompanyStateCode = 'codValidacionEstado',
  CompanyStateDesc = 'descValidacionEstado',
  CompanyStateObservation = 'observacionValidacionEstado',
  CompletedData = 'completoRegistracion',
  Address = 'direccion',
  DayClosing = 'diaCierre',
  MonthClosing = 'mesCierre',
  YearLastClosing = 'anioUltimoCierre',
  CurrencyCode = 'codMoneda',

  BelongsEconomicGroup = 'perteneceGrupoEconomico',
  ActivityStartDate = 'actividadFechaInicio',
  HasActivityStartDateFromAfip = 'tieneFechaInicioDesdeAfip',
  AfipResponsibilityTypeCode = 'codAfipResponsableTipo',
  RegisteredAtIIBB = 'estaInscriptoIIBB',
  SelfEmployedTypeCode = 'codAutonomoTipo',
  MonotaxTypeCode = 'codMonotributoTipo',
  SelfEmployedTypeDesc = 'descAutonomoTipo',
  MonotaxTypeDesc = 'descMonotributoTipo',
  PersonResponsibilityTypeDesc = 'descAfipResponsableTipo',
  SocialContractDate = 'fechaContratoSocial',
  CertificatePymeDate = 'fechaCertificadoPyme',
  HasMultilateralAgreement = 'poseeConvenioMultilateral',
  HasCertificatePyme = 'poseeCertificadoPyme',
  UserCompanyRelationshipTypeDesc = 'descUsuarioConsultaEmpresaRelacion',
  UserCompanyBondTypeDesc = 'descUsuarioConsultaEmpresaVinculo',
  AreaCode = 'codigoArea',
  Phone = 'telefono',
  AlertCode = 'codAlerta',
  AfipSectionDesc = 'descAfipTramo',
  IsLeadByWoman = 'esEmpresaLideradaPorMujeres',
  IsUserCompany = 'esEmpresaUsuario',
  DocumentTypeCode = 'codPersonaDocumentoTipo',
  DocumentTypeDesc = 'descPersonaDocumentoTipo',
  DocumentNumber = 'numeroDocumento',
  BirthdayDate = 'fechaNacimiento',
  LastModifiedDate = 'fechaUltModEstado',
  BillingAmount = 'montoFacturacion',
  CompanyUserQueryStateCode = 'codUsuarioConsultaEmpresaEstado',
  CompanyUserQueryStateDesc = 'descUsuarioConsultaEmpresaEstado',
  CompanyQueryStateUserClassificationCode = 'codUsuarioConsultaEmpresaEstadoClasificacion',
  CompanyQueryStateUserClassificationDesc = 'descUsuarioConsultaEmpresaEstadoClasificacion',
  AllowCompanyAccess = 'permiteAccesoAEmpresa',
  AllowFullAccess = 'permiteAccesoFull',
  AllowResponsibleInvitation = 'permiteEnviarInvitacionResponsable',
  AllowGetResponsability = 'permiteAcreditarResponsabilidad',
  AllowViewDocumentationResponsability = 'permiteVerDocumentacionResponsabilidad',
  MailInvitationResponsible = 'mailInvitacionResponsable',
  IsPoliticallyExposed = 'esPersonaExpuestaPoliticamente',
  HasSocialImpact = 'empresaImpactoSocial',
  SolicitationsWithAlert = 'cantidadSolicitudesConAlerta',
  SolicitationsReadyToSend = 'cantidadSolicitudesEnCarrito',
  SolicitationsInProgress = 'cantidadSolicitudesEnCurso',
  HasCompleteCompanyFileData = 'tieneCompletoLegajoContacto',
}

export interface CompanyViewDTO extends EntityWithId<number> {
  [CompanyViewDTOFields.CompanyId]: number;
  [CompanyViewDTOFields.PersonId]: number;
  [CompanyViewDTOFields.OffererId]: number;
  [CompanyViewDTOFields.BusinessName]: string;
  [CompanyViewDTOFields.CUIT]: string;
  [CompanyViewDTOFields.UsersQuantity]: number;
  [CompanyViewDTOFields.UsersPendingApprovalQuantity]: number;
  [CompanyViewDTOFields.RelatedPeopleQuantity]: number;
  [CompanyViewDTOFields.Mail]: string;
  [CompanyViewDTOFields.Web]: string;
  [CompanyViewDTOFields.SocialNetwork]: string;
  [CompanyViewDTOFields.CompanyAge]?: number;
  [CompanyViewDTOFields.NumberEmployees]?: number;
  [CompanyViewDTOFields.PersonClassificationTypeCode]: number;
  [CompanyViewDTOFields.PersonClassificationTypeDesc]: string;
  [CompanyViewDTOFields.PersonTypeCode]: PersonTypes;
  [CompanyViewDTOFields.PersonTypeDesc]: string;
  [CompanyViewDTOFields.CompanyTypeDesc]: string;
  [CompanyViewDTOFields.AfipPrincipalActivityCode]: number;
  [CompanyViewDTOFields.Address]: EntityAddress[];
  [CompanyViewDTOFields.DayClosing]?: number;
  [CompanyViewDTOFields.MonthClosing]?: number;
  [CompanyViewDTOFields.YearLastClosing]?: number;
  [CompanyViewDTOFields.CurrencyCode]?: number;
  [CompanyViewDTOFields.DocumentTypeCode]?: number;
  [CompanyViewDTOFields.DocumentTypeDesc]?: string;
  [CompanyViewDTOFields.DocumentNumber]?: string;
  [CompanyViewDTOFields.BirthdayDate]?: Date;
  [CompanyViewDTOFields.CompanyStateCode]: number;
  [CompanyViewDTOFields.CompanyStateDesc]: string;
  [CompanyViewDTOFields.CompanyStateObservation]?: string;
  [CompanyViewDTOFields.CompletedData]?: boolean;
  [CompanyViewDTOFields.BelongsEconomicGroup]?: boolean;
  [CompanyViewDTOFields.ActivityStartDate]?: Date;
  [CompanyViewDTOFields.HasActivityStartDateFromAfip]?: boolean;
  [CompanyViewDTOFields.AfipResponsibilityTypeCode]?: number;
  [CompanyViewDTOFields.RegisteredAtIIBB]?: boolean;
  [CompanyViewDTOFields.SelfEmployedTypeCode]?: number;
  [CompanyViewDTOFields.MonotaxTypeCode]?: number;
  [CompanyViewDTOFields.SelfEmployedTypeDesc]?: string;
  [CompanyViewDTOFields.MonotaxTypeDesc]?: string;
  [CompanyViewDTOFields.PersonResponsibilityTypeDesc]: string;
  [CompanyViewDTOFields.SocialContractDate]?: Date;
  [CompanyViewDTOFields.CertificatePymeDate]?: Date;
  [CompanyViewDTOFields.HasMultilateralAgreement]?: boolean;
  [CompanyViewDTOFields.HasCertificatePyme]?: boolean;
  [CompanyViewDTOFields.AfipRegistrationDate]?: Date;
  [CompanyViewDTOFields.UserCompanyRelationshipTypeDesc]?: string;
  [CompanyViewDTOFields.UserCompanyBondTypeDesc]?: string;
  [CompanyFields.AreaCode]?: string;
  [CompanyFields.Phone]?: string;
  [CompanyViewDTOFields.AlertCode]: SolicitationAlertType;
  [CompanyViewDTOFields.AfipSectionDesc]?: string;
  [CompanyViewDTOFields.IsLeadByWoman]?: boolean;
  [CompanyViewDTOFields.IsUserCompany]: boolean;
  [CompanyViewDTOFields.LastModifiedDate]?: Date;
  [CompanyViewDTOFields.BillingAmount]?: number;
  [CompanyViewDTOFields.CompanyUserQueryStateCode]: number;
  [CompanyViewDTOFields.CompanyUserQueryStateDesc]: string;
  [CompanyViewDTOFields.CompanyQueryStateUserClassificationCode]?: number;
  [CompanyViewDTOFields.CompanyQueryStateUserClassificationDesc]?: string;
  [CompanyViewDTOFields.AllowCompanyAccess]: boolean;
  [CompanyViewDTOFields.AllowFullAccess]: boolean;
  [CompanyViewDTOFields.AllowResponsibleInvitation]: boolean;
  [CompanyViewDTOFields.AllowGetResponsability]: boolean;
  [CompanyViewDTOFields.AllowViewDocumentationResponsability]: boolean;
  [CompanyViewDTOFields.MailInvitationResponsible]?: string;
  [CompanyViewDTOFields.IsPoliticallyExposed]?: boolean;
  [CompanyViewDTOFields.HasSocialImpact]?: boolean;
  [CompanyViewDTOFields.SolicitationsWithAlert]?: number;
  [CompanyViewDTOFields.SolicitationsReadyToSend]?: number;
  [CompanyViewDTOFields.SolicitationsInProgress]?: number;
  [CompanyViewDTOFields.HasCompleteCompanyFileData]?: boolean;
}

export interface CompanyForm extends CompanyViewDTO {
  [CompanyViewDTOFields.Mail]: string;
  [CompanyFields.AreaCode]?: string;
  [CompanyViewDTOFields.Phone]: string | CompanyPhoneViewDTO[];
  [CompanyViewDTOFields.Address]: EntityAddress[];
  [SolicitationViewDTOFields.FileId]?: number;
}

export enum CompanyFileCompletenessFields {
    CompanyContactDataCompletenessPercentage = 'porcCompletitudDatosContactoEmpresa',
    CompanyContactDataMissingFieldsCount = 'cantidadCamposFaltantesDatosContactoEmpresa',

    CompanyActivityCompletenessPercentage = 'porcCompletitudActividadEmpresa',
    CompanyActivityMissingFieldsCount = 'cantidadCamposFaltantesActividadEmpresa',

    CompanyFiscalInfoCompletenessPercentage = 'porcCompletitudInformacionFiscalEmpresa',
    CompanyFiscalInfoMissingFieldsCount = 'cantidadCamposFaltantesInformacionFiscalEmpresa',

    CompanyPyMECertificationCompletenessPercentage = 'porcCompletitudCertificacionPyMEEmpresa',
    CompanyPyMECertificationMissingFieldsCount = 'cantidadCamposFaltantesCertificacionPyMEEmpresa',
    
    CompanyTotalDataCompletenessPercentage = 'porcCompletitudTotalEmpresa',
    FinancialInformationCompletenessPercentage = 'porcCompletitudEstadoFinanciero',
    FileTypeShortCompletenessPercentage = 'porcCompletitudLegajoCorto',
    FileTypeShortLastModifiedDate = 'fechaUltModLegajoCorto',
    FileTypeLongCompletenessPercentage = 'porcCompletitudLegajoLargo',
}

export enum CompanyDetailFormFields {
  Mail = 'mail',
  Phone = 'telefono',
  AreaCode = 'codigoArea',
  PhonesList = 'listadoTelefonos',
  Web = 'web',
  DateClosing = 'dateClosing',
  Address = 'direccion',
  PersonTypeDesc = 'descPersonaTipo',
  PersonClassificationTypeDesc = 'descPersonaClasificacion',
  AfipResponsibilityTypeCode = 'codAfipResponsableTipo',
  Company = 'company',
}

export interface CompanyFormData extends CompanyViewDTO {
  [CompanyDetailFormFields.Mail]: string;
  [CompanyDetailFormFields.Phone]: string;
  [CompanyDetailFormFields.AreaCode]?: string;
  [CompanyDetailFormFields.PhonesList]: CompanyPhoneInsertDTO[];
  [CompanyDetailFormFields.Web]: string;
  [CompanyDetailFormFields.DateClosing]: string;
  [CompanyDetailFormFields.Address]:
    | CompanyAddressInsertDTO[]
    | CompanyAddressViewDTO[];
  [CompanyDetailFormFields.Company]: CompanyViewDTO;
}

export interface CompanyFileCompletenessView {
    [CompanyFileCompletenessFields.CompanyContactDataCompletenessPercentage]: number;
    [CompanyFileCompletenessFields.CompanyContactDataMissingFieldsCount]: number;
    [CompanyFileCompletenessFields.CompanyActivityCompletenessPercentage]: number;
    [CompanyFileCompletenessFields.CompanyActivityMissingFieldsCount]: number;
    [CompanyFileCompletenessFields.CompanyFiscalInfoCompletenessPercentage]: number;
    [CompanyFileCompletenessFields.CompanyFiscalInfoMissingFieldsCount]: number;
    [CompanyFileCompletenessFields.CompanyPyMECertificationCompletenessPercentage]: number;
    [CompanyFileCompletenessFields.CompanyPyMECertificationMissingFieldsCount]: number;
    [CompanyFileCompletenessFields.CompanyTotalDataCompletenessPercentage]: number;
    [CompanyFileCompletenessFields.FinancialInformationCompletenessPercentage]: number;
    [CompanyFileCompletenessFields.FileTypeShortCompletenessPercentage]: number;
    [CompanyFileCompletenessFields.FileTypeShortLastModifiedDate]?: Date;
    [CompanyFileCompletenessFields.FileTypeLongCompletenessPercentage]: number;
}

export enum CompanySectionsWithFileTypeFields {
  Id = 'id',
  Description = 'descripcion',
  FileTypes = 'archivosTipos',
  RelatedData = 'datosRelacionados',
  HasRelatedData = 'tieneDatosRelacionados',
  RelatedDataLabel = 'etiquetaDatoRelacionado',
  IsSectionCompanyRepository = 'esSeccionEmpresaRepositorio',
  SectionRelatedDataTypeCode = 'codSeccionDatoRelacionadoTipo',
  PersonTypeCode = 'codPersonaTipo',
}

export interface CompanySectionsWithFileType {
  [CompanySectionsWithFileTypeFields.Id]: number;
  [CompanySectionsWithFileTypeFields.Description]: string;
  [CompanySectionsWithFileTypeFields.FileTypes]: EntityWithIdAndDescription[];
  [CompanySectionsWithFileTypeFields.RelatedData]: CompanySectionsWithFileType[];
  [CompanySectionsWithFileTypeFields.HasRelatedData]: boolean;
  [CompanySectionsWithFileTypeFields.RelatedDataLabel]?: string;
  [CompanySectionsWithFileTypeFields.IsSectionCompanyRepository]: boolean;
  [CompanySectionsWithFileTypeFields.SectionRelatedDataTypeCode]: SectionRelatedDataTypes,
  [CompanySectionsWithFileTypeFields.SectionRelatedDataTypeCode]: SectionRelatedDataTypes,
  [CompanySectionsWithFileTypeFields.PersonTypeCode]: number,
}


export enum SectionRelatedDataTypes {
    FinancialYear = 1,
    RelatedPerson = 2,
    DeclarationOfAssets = 3,
    //Solicitation = 4,
    Company = 5
}

export enum CompanyQuaFilterSearchFields {
  BusinessName = 'razonSocial',
  Cuit = 'cuit',
  CompanyStateCodes = 'codsEmpresaEstado',
}

export interface CompanyQuaFilterSearch extends EntityFilterPagination {
  [CompanyQuaFilterSearchFields.BusinessName]: string;
  [CompanyQuaFilterSearchFields.Cuit]: string;
  [CompanyQuaFilterSearchFields.CompanyStateCodes]: number[];
}

export enum CompanyStateUpdateFields {
  CompanyStateCode = 'codValidacionEstado',
  StateObservation = 'observacionValidacionEstado',
}

export interface CompanyStateUpdate {
  [CompanyStateUpdateFields.CompanyStateCode]: number;
  [CompanyStateUpdateFields.StateObservation]: string;
}

export enum CompanyApprovalFormFields {
  FrontIdFile = 'fileDNIFrente',
  BackIdFile = 'fileDNIDorso',
  FileAble = 'filePoderHabilitante',
}

export interface CompanyApprovalForm {
  [CompanyApprovalFormFields.FrontIdFile]: File;
  [CompanyApprovalFormFields.BackIdFile]: File;
  [CompanyApprovalFormFields.FileAble]: File;
}

export enum CompanyUnconfirmedRegisterDataFields {
  CompanyUserBondCode = 'codEmpresaUsuarioVinculo',
  FileAble = 'filePoderHabilitante',
  ResponsibleGuestMail = 'mailResponsableInvitado',
  ResponsibleGuestPersonId = 'idPersonaResponsableInvitado'
}

export interface CompanyUnconfirmedRegisterData {
  [CompanyViewDTOFields.AreaCode]?: string;
  [CompanyViewDTOFields.Phone]?: string;
  [CompanyViewDTOFields.SocialNetwork]?: string;
  [CompanyViewDTOFields.DayClosing]?: string;
  [CompanyViewDTOFields.MonthClosing]?: string;
  [CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]?: number;
  [CompanyUnconfirmedRegisterDataFields.FileAble]?: File;
  [CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail]?: string;
  [CompanyUnconfirmedRegisterDataFields.ResponsibleGuestPersonId]?: number;
}

export interface CompanyResponsibleInviteData {
  [CompanyUnconfirmedRegisterDataFields.FileAble]: File;
  [CompanyUnconfirmedRegisterDataFields.ResponsibleGuestMail]: string;
  [CompanyUnconfirmedRegisterDataFields.ResponsibleGuestPersonId]: number;
  [CompanyViewDTOFields.CUIT]: string;
}

export enum CompanyKeyDataFields {
  CompanyId = 'idEmpresa',
  PersonId = 'idPersona',
  BusinessName = 'razonSocial',
  CUIT = 'cuit',
  PersonTypeCode = 'codPersonaTipo',
  ValidationStateCode = 'codValidacionEstado',
  IsOwnExistingCompany = 'esPropiaEmpresaExistente',
  ActiveCompany = 'esEmpresaActiva',
}

export interface CompanyKeyData {
  [CompanyKeyDataFields.CompanyId]: number;
  [CompanyKeyDataFields.PersonId]: number;
  [CompanyKeyDataFields.BusinessName]: string;
  [CompanyKeyDataFields.CUIT]: string;
  [CompanyKeyDataFields.PersonTypeCode]?: number;
  [CompanyKeyDataFields.ValidationStateCode]?: number;
  [CompanyKeyDataFields.IsOwnExistingCompany]: boolean;
  [CompanyKeyDataFields.ActiveCompany]: boolean;
}

export enum CompanySolicitationFileHistoryFields {
  Index = 'index',
  SolicitationId = 'idSolicitud',
  Date = 'fecha',
}

export interface CompanySolicitationFileHistory extends EntityWithId<number> {
  [CompanySolicitationFileHistoryFields.Index]: number;
  [CompanySolicitationFileHistoryFields.SolicitationId]: number;
  [CompanySolicitationFileHistoryFields.Date]: Date;
}


export enum CompanyHomeGeneralDataExportFormFields {
    Sections = 'secciones',
}


export interface CompanyHomeGeneralDataExportForm {
    [CompanyHomeGeneralDataExportFormFields.Sections]: number[];
}