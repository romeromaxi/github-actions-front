import {
  BaseRequest,
  EntityWithId,
  EntityWithIdAndDescription,
} from '../baseEntities';

export enum OffererSolicitationAnalysisFormDataRequestFields {
  Message = 'message',
}

export interface OffererSolicitationAnalysisFormDataRequest {
  [OffererSolicitationAnalysisFormDataRequestFields.Message]: string;
}

export enum OffererSolicitationAnalysisFormDataFields {
  Messages = 'messages',
}

export interface OffererSolicitationAnalysisFormData {
  [OffererSolicitationAnalysisFormDataFields.Messages]: OffererSolicitationAnalysisFormDataRequest[];
}

export enum OffererWorkTeamViewFields {
  OffererId = 'idOferente',
  Name = 'nombre',
  Description = 'descripcion',
  BeginDate = 'fechaAlta',
  UsersQuantity = 'cantidadUsuarios',
  ProductLineQuantity = 'cantidadProductoLineas',
}

export interface OffererWorkTeamView extends EntityWithId<number> {
  [OffererWorkTeamViewFields.OffererId]: number;
  [OffererWorkTeamViewFields.Name]: string;
  [OffererWorkTeamViewFields.Description]: string;
  [OffererWorkTeamViewFields.BeginDate]: Date;
  [OffererWorkTeamViewFields.UsersQuantity]: number;
  [OffererWorkTeamViewFields.ProductLineQuantity]: number;
}

export enum OffererWorkTeamRelationshipFields {
  PresentWorkTeam = 'presenteEquipoTrabajo',
  Available = 'estaDisponible',
}

export interface OffererWorkTeamRelationship
  extends EntityWithIdAndDescription {
  [OffererWorkTeamRelationshipFields.PresentWorkTeam]: boolean;
  [OffererWorkTeamRelationshipFields.Available]: boolean;
}

export enum OffererWorkTeamFormFields {
  Name = 'nombre',
  Description = 'descripcion',
  ProductLineIds = 'idsProductoLinea',
  UserIds = 'idsUsuarios',
}

export interface OffererWorkTeamForm extends BaseRequest {
  [OffererWorkTeamFormFields.Name]: string;
  [OffererWorkTeamFormFields.Description]: string;
  [OffererWorkTeamFormFields.ProductLineIds]: number[];
  [OffererWorkTeamFormFields.UserIds]: number[];
}