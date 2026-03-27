import { BaseRequest, EntityWithId } from '../baseEntities';

export enum ConversationPostFields {
  Title = 'titulo',
  ConversationReasonCode = 'codConversacionMotivo',
  OffererId = 'idOferente',
}

export interface ConversationPost extends BaseRequest {
  [ConversationPostFields.Title]: string;
  [ConversationPostFields.ConversationReasonCode]: number;
  [ConversationPostFields.OffererId]: number;
}

export enum ConversationViewDTOFields {
  Title = 'titulo',
  ConversationReasonCode = 'codConversacionMotivo',
  ConversationReasonDesc = 'descConversacionMotivo',
  StartDate = 'fechaInicio',
  StartUserId = 'idUsuarioInicio',
  StartUserName = 'razonSocialUsuarioInicio',
  IsRead = 'estaLeido',
  ConversationTypeDesc = 'descConversationTipo',
}

export interface ConversationViewDTO extends EntityWithId<number> {
  [ConversationViewDTOFields.Title]: string;
  [ConversationViewDTOFields.ConversationReasonCode]: number;
  [ConversationViewDTOFields.ConversationReasonDesc]: string;
  [ConversationViewDTOFields.StartDate]: Date;
  [ConversationViewDTOFields.StartUserId]: number;
  [ConversationViewDTOFields.StartUserName]: string;
  [ConversationViewDTOFields.IsRead]: boolean;
  [ConversationViewDTOFields.ConversationTypeDesc]: string;
}
