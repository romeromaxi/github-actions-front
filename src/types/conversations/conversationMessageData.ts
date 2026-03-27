import { BaseRequest, EntityWithId } from '../baseEntities';

export enum ConversationMessageViewDTOFields {
  ConversationId = 'idConversacion',
  Message = 'mensaje',
  UserId = 'idUsuario',
  Date = 'fecha',
  UserName = 'razonSocialUsuario',
  IsItOwnMessage = 'esMensajePropio',
}

export interface ConversationMessageViewDTO extends EntityWithId<number> {
  [ConversationMessageViewDTOFields.ConversationId]: number;
  [ConversationMessageViewDTOFields.Message]: string;
  [ConversationMessageViewDTOFields.UserId]: number;
  [ConversationMessageViewDTOFields.Date]: Date;
  [ConversationMessageViewDTOFields.UserName]: string;
  [ConversationMessageViewDTOFields.IsItOwnMessage]: boolean;
}

export enum ConversationMessageInsertFields {
  Message = 'mensaje',
}

export interface ConversationMessageInsert extends BaseRequest {
  [ConversationMessageInsertFields.Message]: string;
}
