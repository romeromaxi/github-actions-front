import { EntityWithIdAndDescription } from '../baseEntities';

export interface FileType extends EntityWithIdAndDescription {}

export enum FileSubtypeFields {
  FileTypeCode = 'codArchivoTipo',
  FileTypeDesc = 'descArchivoTipo',
  Observations = 'observaciones',
}

export interface FileSubtype extends EntityWithIdAndDescription {
  [FileSubtypeFields.FileTypeCode]: number;
  [FileSubtypeFields.FileTypeDesc]: string;
  [FileSubtypeFields.Observations]: string;
}

export enum FileSolicitationTemplateFields {
  Detail = 'detalle',
  ForHumanPerson = 'paraPersonaHumana',
  ForLegalPerson = 'paraPersonaJuridica',
  PersonTypeCodes = 'codsPersonaTipo',
}

export interface FileSolicitationTemplate extends EntityWithIdAndDescription {
  [FileSolicitationTemplateFields.Detail]?: string;
  [FileSolicitationTemplateFields.ForHumanPerson]: boolean;
  [FileSolicitationTemplateFields.ForLegalPerson]: boolean;
  [FileSolicitationTemplateFields.PersonTypeCodes]?: number[];
}

export enum SolicitationTemplateFormFields {
  Files = 'filesForm',
  TemplateId = 'idPlantilla',
  RelatedFileIds = 'idsDocumento',
}

export interface SolicitationTemplateForm {
  [SolicitationTemplateFormFields.Files]?: File[];
  [SolicitationTemplateFormFields.TemplateId]: number;
  [SolicitationTemplateFormFields.RelatedFileIds]?: number[];
}
