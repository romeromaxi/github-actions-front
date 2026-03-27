import {CompanyFileType} from 'types/company/companyEnums';
import {SolicitationTypes} from "types/solicitations/solicitationEnums";
import {
  SolicitationSurveyAnswerInsert,
  SolicitationSurveyAnswerInsertFields
} from "../../types/solicitations/solicitationSurveyData";

export enum MarketSolicitationFields {
  CompanyId = 'companyId',
  SolicitationIdList = 'solicitationIdList',
  SolicitationType = 'solicitationType',
  FileType = 'fileType',
}

export type MarketSolicitation = {
  [MarketSolicitationFields.CompanyId]: number;
  [MarketSolicitationFields.SolicitationIdList]: number[];
  [MarketSolicitationFields.SolicitationType]: SolicitationTypes;
  [MarketSolicitationFields.FileType]: CompanyFileType;
};

export type MarketSurveyAnswers = {
  [key: string]: any
};

class MarketSolicitationStorage {
  currentSolicitationKey: string = 'LUCMarketCurrentSolicitation';
  currentSolicitationSurveyAnswersKey: string = 'LUCMarketCurrentSolicitationSurveyAnswers';

  public setCurrentSolicitation(solicitation: MarketSolicitation) {
    sessionStorage.setItem(
      this.currentSolicitationKey,
      JSON.stringify(solicitation),
    );
  }

  public getCurrentSolicitation(): MarketSolicitation {
    return (
      JSON.parse(
        sessionStorage.getItem(this.currentSolicitationKey) as string,
      ) ||
      ({
        [MarketSolicitationFields.CompanyId]: 0,
        [MarketSolicitationFields.SolicitationIdList]: [],
        [MarketSolicitationFields.SolicitationType]: SolicitationTypes.None,
        [MarketSolicitationFields.FileType]: CompanyFileType.None,
      } as MarketSolicitation)
    );
  }
  
  public clearSolicitation() {
    sessionStorage.removeItem(this.currentSolicitationKey);
    sessionStorage.removeItem(this.currentSolicitationSurveyAnswersKey);
  }
  
  public setSurveyAnswers(answers: MarketSurveyAnswers) {
    sessionStorage.setItem(
      this.currentSolicitationSurveyAnswersKey,
      JSON.stringify(answers),
    );
  }

  public getSurveyAnswers() {
    return JSON.parse(
      sessionStorage.getItem(this.currentSolicitationSurveyAnswersKey) as string,
      );
  }

  public getSurveyAnswersAsInsertList(): SolicitationSurveyAnswerInsert[] {
    const data = this.getSurveyAnswers();
    
    return Object.keys(data).map(key => {
      const questionId = parseInt(key);
      const response = data[key];
      return Array.isArray(response) ?
        response.map((option: number) => ({
          [SolicitationSurveyAnswerInsertFields.SolicitationSurveyQuestionCode]: questionId,
          [SolicitationSurveyAnswerInsertFields.Answer]: undefined,
          [SolicitationSurveyAnswerInsertFields.SolicitationSurveyQuestionOptionCode]: option
        }))
        :
        (typeof response === 'number') ?
          {
            [SolicitationSurveyAnswerInsertFields.SolicitationSurveyQuestionCode]: questionId,
            [SolicitationSurveyAnswerInsertFields.Answer]: undefined,
            [SolicitationSurveyAnswerInsertFields.SolicitationSurveyQuestionOptionCode]: response as number
          }
          : {
            [SolicitationSurveyAnswerInsertFields.SolicitationSurveyQuestionCode]: questionId,
            [SolicitationSurveyAnswerInsertFields.Answer]: response === null ? '' : `${response}`,
            [SolicitationSurveyAnswerInsertFields.SolicitationSurveyQuestionOptionCode]: undefined
          };
    }).flat();
    
  }
}

export const marketSolicitationStorage = new MarketSolicitationStorage();
