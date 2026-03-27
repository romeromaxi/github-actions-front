import { EntityWithId } from '../baseEntities';
import { Document } from '../files/filesData';

export enum DocumentFolderFields {
  FolderName = 'nombreCarpeta',
  DocumentsQuantity = 'cantidadDocumentos',
}

export enum DocumentFolderInsertFields {
  FolderName = 'nombreCarpeta',
  FatherFolderId = 'idDocumentoCarpetaPadre',
  CompanyId = 'idEmpresa',
  OffererId = 'idOferente',
}

export interface DocumentFolderInsert extends EntityWithId<number> {
  [DocumentFolderInsertFields.FolderName]: string;
  [DocumentFolderInsertFields.FatherFolderId]?: number;
  [DocumentFolderInsertFields.CompanyId]?: number;
  [DocumentFolderInsertFields.OffererId]?: number;
}

export interface DocumentFolderUpdate extends EntityWithId<number> {
  [DocumentFolderFields.FolderName]: string;
}

export enum DocumentFolderRelatedInsertFields {
  DocumentId = 'idDocumento',
}

export interface DocumentFolderRelatedInsert {
  [DocumentFolderRelatedInsertFields.DocumentId]: number;
}

export interface DocumentFolderSummary extends EntityWithId<number> {
  [DocumentFolderFields.FolderName]: string;
  [DocumentFolderFields.DocumentsQuantity]: number;
}

export enum DocumentFolderViewDTOFields {
  DaughtersFolders = 'carpetasHijas',
  IsPresent = 'estaPresente',
}

export interface DocumentFolderViewDTO extends DocumentFolderSummary {
  [DocumentFolderViewDTOFields.DaughtersFolders]: DocumentFolderViewDTO[];
  [DocumentFolderViewDTOFields.IsPresent]: boolean;
}

export enum DocumentFolderDetailFields {
  ParentFolderId = 'idDocumentoCarpetaPadre',
  FolderName = 'nombreCarpeta',
  IsRoot = 'esCarpetaRaiz',
  FoldersList = 'listadoCarpetas',
  DocumentsList = 'listadoDocumentos',
}

export interface DocumentFolderDetail {
  [DocumentFolderDetailFields.ParentFolderId]?: number;
  [DocumentFolderDetailFields.FolderName]: string;
  [DocumentFolderDetailFields.IsRoot]: boolean;
  [DocumentFolderDetailFields.FoldersList]: DocumentFolderSummary[];
  [DocumentFolderDetailFields.DocumentsList]: Document[];
}

export enum DocumentCopyBodyFields {
  Title = 'titulo',
  Description = 'descripcion',
}

export interface DocumentCopyBody {
  [DocumentCopyBodyFields.Title]: string;
  [DocumentCopyBodyFields.Description]: string;
}

export enum DocumentLibraryFilterFields {
  EntityId = 'idEntidad',
  SolicitationId = 'idSolicitud',
  ClientPortfolioGuid = 'idCarpeta',
}

export interface DocumentLibraryFilter {
  [DocumentLibraryFilterFields.EntityId]: number | null,
  [DocumentLibraryFilterFields.SolicitationId]: number | null
  [DocumentLibraryFilterFields.ClientPortfolioGuid]: string | null
}

export enum DocumentLibraryDocumentFilterFields {
  HierarchyCods = 'codsJerarquia'
}

export interface DocumentLibraryDocumentFilter extends DocumentLibraryFilter {
  [DocumentLibraryDocumentFilterFields.HierarchyCods]: number[] | null,
}

