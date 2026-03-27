import {
  BaseRequest,
  EntityFilterPagination,
  EntityWithId,
} from '../baseEntities';

export enum DocumentFields {
  FileTypeCode = 'codArchivoTipo',
  FileSubtypeCode = 'codArchivoSubtipo',
  FileSectionCode = 'codSeccion',
  TitleDocument = 'titulo',
  DescriptionDocument = 'descripcion',
  BeginDate = 'fechaAlta',
  FromDate = 'fechaDesde',
  ToDate = 'fechaHasta',
  ExpirationDate = 'fechaVencimiento',
  EmissionDate = 'fechaEmision',
  FileTypeDesc = 'descArchivoTipo',
  FileSubtypeDesc = 'descArchivoSubtipo',
  RelatedInformationDesc = 'descDatoRelacionado',
  FileSectionDesc = 'descSeccion',
  NumberFiles = 'cantidadArchivos',
  FileDesc = 'descArchivo',
  FileSize = 'archivoTamanio',
  Observations = 'observaciones',
  Approved = 'fueAprobado',
  HasRelatedFolders = 'tieneCarpetasRelacionadas',
  RelatedFoldersQty = 'cantidadCarpetasRelacionadas',
  RelatedId = 'idRelacionado'
}

export interface Document extends EntityWithId<number> {
  [DocumentFields.FileTypeCode]: number;
  [DocumentFields.FileSubtypeCode]: number;
  [DocumentFields.FileSectionCode]: number;
  [DocumentFields.TitleDocument]: string;
  [DocumentFields.DescriptionDocument]: string;
  [DocumentFields.BeginDate]: Date;
  [DocumentFields.FromDate]: Date;
  [DocumentFields.ToDate]: Date;
  [DocumentFields.ExpirationDate]: Date;
  [DocumentFields.EmissionDate]: Date;
  [DocumentFields.FileTypeDesc]: string;
  [DocumentFields.FileSubtypeDesc]: string;
  [DocumentFields.NumberFiles]: number;
  [DocumentFields.FileDesc]: string;
  [DocumentFields.FileSectionDesc]: string;
  [DocumentFields.FileSize]: number;
  [DocumentFields.Observations]: string;
  [DocumentFields.RelatedId]?: number;
  [DocumentFields.RelatedInformationDesc]: string;
  [DocumentFields.Approved]?: boolean;
  [DocumentFields.HasRelatedFolders]?: boolean;
  [DocumentFields.RelatedFoldersQty]: number;
}

export enum DocumentDeleteFields {
  RelatedId = 'idRelacionado',
  SectionCod = 'codSeccion',
}

export interface DocumentDelete {
  [DocumentDeleteFields.RelatedId]?: number;
  [DocumentDeleteFields.SectionCod]?: number;
}

export interface DocumentInsert extends EntityWithId<number> {
  [DocumentFields.FileTypeCode]?: number;
  [DocumentFields.FileSectionCode]?: number;
  [DocumentFields.TitleDocument]: string;
  [DocumentFields.DescriptionDocument]: string;
  [DocumentFields.FromDate]?: Date;
  [DocumentFields.ToDate]?: Date;
  [DocumentFields.ExpirationDate]?: Date;
  [DocumentFields.EmissionDate]?: Date;
  [DocumentFields.FileSubtypeCode]?: number;
  [DocumentFields.RelatedId]?: number;
}

export enum FileBaseFields {
  FileTypeCode = 'codArchivoTipo',
  FilePathCode = 'codPathFile',
  FilePathPrefix = 'pathFilePrefijo',
  FileDesc = 'descArchivo',
  HasPhysicalFile = 'tieneArchivoFisico',
  ExpirationDate = 'fechaVencimiento',
  RegisterUserId = 'idUsuarioAlta',
  BeginDate = 'fechaAlta',
  PhysicalFilePath = 'pathFisicoArchivo',
  VirtualFilePath = 'pathVirtualArchivo',
  FileTypeDesc = 'descArchivoTipo',
  FileSectionCode = 'codSeccion',
  Observation = 'observacion',

  FileSize = 'archivoTamanio',
  DocumentId = 'idDocumento',
}

export interface FileBase extends EntityWithId<number> {
  [FileBaseFields.FileTypeCode]: number;
  [FileBaseFields.FilePathCode]: number;
  [FileBaseFields.FilePathPrefix]: string;
  [FileBaseFields.FileDesc]: string;
  [FileBaseFields.HasPhysicalFile]: boolean;
  [FileBaseFields.ExpirationDate]?: Date;
  [FileBaseFields.RegisterUserId]: number;
  [FileBaseFields.BeginDate]: Date;

  [FileBaseFields.PhysicalFilePath]: string;
  [FileBaseFields.VirtualFilePath]: string;

  [FileBaseFields.FileTypeDesc]: string;
  [FileBaseFields.FileSectionCode]: number;
  [FileBaseFields.Observation]: string;

  [FileBaseFields.FileSize]: number;
  [FileBaseFields.DocumentId]: number;
}

export enum FileBaseInsertFields {
  DocumentId = 'idDocumento',
  FileSize = 'archivoTamanio',
  HasPhysicalFile = 'tieneArchivoFisico',
  File = 'file',
  ModuleCode = 'codModulo',
  OriginCode = 'codOrigen',
}

export interface FileBaseInsert extends FileBase {
  [FileBaseInsertFields.File]: File;
}

export enum FileCompanyFields {
  CompanyId = 'idEmpresa',
}

export interface FileCompany extends FileBase {
  [FileCompanyFields.CompanyId]: number;
}

export enum FileCompanyPersonFields {
  CompanyId = 'idEmpresa',
  PersonId = 'idPersona',
}

export interface FileCompanyPerson extends FileBase {
  [FileCompanyPersonFields.CompanyId]: number;
  [FileCompanyPersonFields.PersonId]: number;
}

export enum FileCompanyFinancialYearFields {
  CompanyFinancialYearId = 'idEmpresaEjercicio',
}

export interface FileCompanyFinancialYear extends FileBase {
  [FileCompanyFinancialYearFields.CompanyFinancialYearId]: number;
}

export enum FileOffererFields {
  OffererId = 'idOferente',
}

export interface FileOfferer extends FileBase {
  [FileOffererFields.OffererId]: number;
}

export enum FileOffererPersonFields {
  OffererId = 'idOferente',
  PersonId = 'idPersona',
}

export interface FileOffererPerson extends FileBase {
  [FileOffererPersonFields.OffererId]: number;
  [FileOffererPersonFields.PersonId]: number;
}

export enum FileSolicitationFields {
  TitleSolicitation = 'tituloSolicitud',
  IsRequested = 'esSolicitada',
  Sent = 'fueEnviada',
  SolicitationDate = 'fechaSolicitado',
  SolicitationRequestId = 'idSolicitudArchivoSolicitado',
  SentDate = 'fechaEnvio',
}

export interface FileSolicitation extends Document {
  [FileSolicitationFields.TitleSolicitation]: string;
  [FileSolicitationFields.IsRequested]: boolean;
  [FileSolicitationFields.Sent]: boolean;
  [FileSolicitationFields.SolicitationDate]: Date;
  [FileSolicitationFields.SolicitationRequestId]: number;
  [FileSolicitationFields.SentDate]?: Date;
}

export enum FileUpdateDTOFields {
  Title = 'titulo',
  Description = 'descripcion',
  DateFrom = 'fechaDesde',
  DateTo = 'fechaHasta',
  ExpirationDate = 'fechaVencimiento',
  EmissionDate = 'fechaEmision',
  SectionCode = 'codSeccion',
  FileTypeCode = 'codArchivoTipo',
  RelatedId = 'idRelacionado'
}

export interface DocumentUpdateViewDTO extends EntityWithId<number> {
  [FileUpdateDTOFields.Title]: string;
  [FileUpdateDTOFields.Description]: string;
  [FileUpdateDTOFields.DateFrom]?: Date;
  [FileUpdateDTOFields.DateTo]?: Date;
  [FileUpdateDTOFields.EmissionDate]?: Date;
  [FileUpdateDTOFields.ExpirationDate]?: Date;
  [FileUpdateDTOFields.SectionCode]?: number;
  [FileUpdateDTOFields.FileTypeCode]?: number;
  [FileUpdateDTOFields.RelatedId]?: number;
}

export interface FileUpdateDTO {
  [FileUpdateDTOFields.Title]: string;
  [FileUpdateDTOFields.Description]: string;
  [FileUpdateDTOFields.DateFrom]?: Date;
  [FileUpdateDTOFields.DateTo]?: Date;
  [FileUpdateDTOFields.EmissionDate]?: Date;
  [FileUpdateDTOFields.ExpirationDate]?: Date;
  [FileUpdateDTOFields.SectionCode]?: number;
  [FileUpdateDTOFields.FileTypeCode]?: number | null;
  [FileUpdateDTOFields.RelatedId]?: number;
}
export enum FileSolicitationRequestInsertFields {
  SolicitationRequestId = 'idSolicitudArchivoSolicitado',
}

export interface FileSolicitationRequestInsert extends FormData {
  [FileSolicitationRequestInsertFields.SolicitationRequestId]: number;
}

export enum DocumentToFileRequestLinkFields {
  SolicitationRequestId = 'idSolicitudArchivoSolicitado',
  DocumentIdList = 'idsDocumentos',
  OriginCode = 'codOrigen',
}

export interface DocumentToFileLinkRequest extends BaseRequest {
  [DocumentToFileRequestLinkFields.SolicitationRequestId]: number | null;
  [DocumentToFileRequestLinkFields.DocumentIdList]: number[];
}

export interface DocumentToFileLinkRequestOfferer extends BaseRequest {
  [DocumentToFileRequestLinkFields.DocumentIdList]: number[];
}

export enum FileSolicitationRequestFields {
  SolicitationRequestId = 'idSolicitudArchivoSolicitado',
  DocumentId = 'idDocumento',
}

export interface FileSolicitationRequest {
  [FileSolicitationRequestFields.SolicitationRequestId]: number;
  [FileSolicitationRequestFields.DocumentId]: number;
}

export enum SolicitationFileRequestedFields {
  Title = 'titulo',
  Observations = 'observaciones',
  DocumentId = 'idDocumento',
  SolicitationId = 'idSolicitud',
  BeginDate = 'fechaAlta',
  Sent = 'fueEnviada',
  SentDate = 'fechaEnvio',
  DocumentsQuantity = 'cantidadDocumentos',
  DeleteAllowed = 'permiteEliminar',
}

export interface SolicitationFileRequested extends EntityWithId<number> {
  [SolicitationFileRequestedFields.Title]: string;
  [SolicitationFileRequestedFields.Observations]: string;
  [SolicitationFileRequestedFields.DocumentId]: number;
  [SolicitationFileRequestedFields.SolicitationId]: number;
  [SolicitationFileRequestedFields.BeginDate]: Date;
  [SolicitationFileRequestedFields.Sent]: boolean;
  [SolicitationFileRequestedFields.SentDate]: Date;
  [SolicitationFileRequestedFields.DocumentsQuantity]: number;
  [SolicitationFileRequestedFields.DeleteAllowed]?: boolean;
}

export enum FileBlobResponseFields {
  File = 'file',
  FileName = 'fileName',
}

export interface FileBlobResponse {
  [FileBlobResponseFields.File]: any;
  [FileBlobResponseFields.FileName]: string;
}

export enum FileFilterSearchFields {
  Type = 'codArchivoTipo',
  Subtype = 'codArchivoSubtipo',
}

export interface FileFilterSearch extends EntityFilterPagination {
  [FileFilterSearchFields.Type]?: number;
  [FileFilterSearchFields.Subtype]?: number;
}

export enum RelatedPeopleFileFilterFields {
  PersonId = 'idPersona',
}

export interface RelatedPeopleFileFilter extends FileFilterSearch {
  [RelatedPeopleFileFilterFields.PersonId]: number;
}

export enum PeopleDocumentFields {
  BusinessName = 'razonSocial',
}

export interface PeopleDocument extends Document {
  [PeopleDocumentFields.BusinessName]: string;
}

export enum FinancialYearFileFilterFields {
  Year = 'anio',
}
export interface FinancialYearFileFilter extends FileFilterSearch {
  [FinancialYearFileFilterFields.Year]?: number;
}

export enum FinancialYearDocumentFields {
  Year = 'anio',
}

export interface FinancialYearDocument extends Document {
  [FinancialYearDocumentFields.Year]: Date;
}

export enum StatementsFileFields {
  Date = 'fecha',
}

export interface StatementsFile extends Document {
  [StatementsFileFields.Date]: Date;
}

export enum GeneralFilesCompanyFilterFields {
  SectionCode = 'codSeccion',
  FileTypeCode = 'codArchivoTipo',
}

export interface GeneralFilesCompanyFilter {
  [GeneralFilesCompanyFilterFields.FileTypeCode]?: number;
  [GeneralFilesCompanyFilterFields.SectionCode]?: number;
}

export enum SectionFilesCompanyFilterFields {
  RelatedId = 'idRelacionado',
}

export interface SectionFilesCompanyFilter {
  [GeneralFilesCompanyFilterFields.FileTypeCode]?: number;
  [GeneralFilesCompanyFilterFields.SectionCode]?: number;
  [SectionFilesCompanyFilterFields.RelatedId]?: number;
}

export enum LibraryFilterAllFields {
  SectionCode = 'codSeccion',
  FileTypeCode = 'codArchivoTipo',
  RelatedId = 'idRelacionado',
  DocumentFolderId = 'idDocumentoCarpeta',
  Title = 'titulo'
  
}

export interface LibraryFilterAll {
  [LibraryFilterAllFields.Title]?: string;
  [LibraryFilterAllFields.SectionCode]?: number;
  [LibraryFilterAllFields.FileTypeCode]?: number;
  [LibraryFilterAllFields.RelatedId]?: number;
  [LibraryFilterAllFields.DocumentFolderId]?: number;
}
