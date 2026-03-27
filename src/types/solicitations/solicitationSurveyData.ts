import {EntityWithIdAndDescription} from "../baseEntities";

export enum SolicitationSurveyQuestionFields {
  SolicitationSurveyQuestionFormatCode = 'codSolicitudEncuestaPreguntaFormato',
  HasObservationsField = 'tieneCampoObservaciones',
}

export interface SolicitationSurveyQuestion extends EntityWithIdAndDescription {
  [SolicitationSurveyQuestionFields.SolicitationSurveyQuestionFormatCode]: number,
  [SolicitationSurveyQuestionFields.HasObservationsField]: boolean,
}

export interface SolicitationSurveyQuestionOption extends EntityWithIdAndDescription { }

export enum SolicitationSurveyAnswerInsertFields {
  SolicitationSurveyQuestionCode = 'codSolicitudEncuestaPregunta',
  Answer = 'respuesta',
  SolicitationSurveyQuestionOptionCode = 'codSolicitudEncuestaPreguntaOpcion',
}

export interface SolicitationSurveyAnswerInsert {
  [SolicitationSurveyAnswerInsertFields.SolicitationSurveyQuestionCode]: number,
  [SolicitationSurveyAnswerInsertFields.Answer]?: string,
  [SolicitationSurveyAnswerInsertFields.SolicitationSurveyQuestionOptionCode]?: number,
}

export enum SolicitationSurveyQuestionAnswerFields {
  Answers = 'respuestas',
}

export interface SolicitationSurveyQuestionAnswer extends SolicitationSurveyQuestion {
  [SolicitationSurveyQuestionAnswerFields.Answers]: SolicitationSurveyQuestionAnswerResponse[]
}

export enum SolicitationSurveyQuestionAnswerResponseFields {
  Answer = 'respuesta',
  SolicitationSurveyQuestionOptionCode = 'codSolicitudEncuestaPreguntaOpcion',
}

export interface SolicitationSurveyQuestionAnswerResponse {
  [SolicitationSurveyQuestionAnswerResponseFields.Answer]?: string,
  [SolicitationSurveyQuestionAnswerResponseFields.SolicitationSurveyQuestionOptionCode]?: number,
}
