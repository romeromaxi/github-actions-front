import { HttpAxiosRequest } from '../httpAxiosBase';
import { BaseResponse } from 'types/baseEntities';
import {
  SolicitationSurveyAnswerInsert,
  SolicitationSurveyQuestionAnswer
} from "types/solicitations/solicitationSurveyData";

export const HttpSolicitationSurvey = {
  getEndpoint: (solicitationId: number, url: string = ''): string =>
    `solicitudes/${solicitationId}/encuestas${url}`,

  getSurveyAnswersBySolicitationId: (solicitationId: number): Promise<SolicitationSurveyQuestionAnswer[]> =>
    HttpAxiosRequest.get(
      HttpSolicitationSurvey.getEndpoint(solicitationId)
    ),

  updateSurveyAnswer: (solicitationId: number, answers: SolicitationSurveyAnswerInsert[]): Promise<BaseResponse> => 
    HttpAxiosRequest.post(
      HttpSolicitationSurvey.getEndpoint(solicitationId),
      answers,
    ),
};
