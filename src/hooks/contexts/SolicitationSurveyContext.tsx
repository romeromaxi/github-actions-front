import {createContext, ReactNode, useEffect, useState} from "react";
import {useForm, UseFormReturn} from "react-hook-form";
import {BaseRequestFields, BaseResponse, BaseResponseFields, EntityWithIdFields} from "types/baseEntities";
import {useAction} from "../useAction";
import {marketSolicitationStorage, MarketSurveyAnswers} from "util/sessionStorage/marketSolicitationStorage";
import {HttpSolicitationSurvey} from "http/solicitations/httpSolicitationSurvey";
import {
  SolicitationSurveyAnswerInsert,
  SolicitationSurveyQuestion, SolicitationSurveyQuestionAnswer,
  SolicitationSurveyQuestionAnswerFields,
  SolicitationSurveyQuestionAnswerResponseFields,
  SolicitationSurveyQuestionFields
} from "types/solicitations/solicitationSurveyData";
import {SolicitationSurveyQuestionFormats} from "types/solicitations/solicitationSurveyEnums";
import {HttpSolicitation} from "http/index";
import {
  SolicitationInitialMessageDTO,
  SolicitationInitialMessageDTOFields,
  SolicitationViewDTOFields
} from "types/solicitations/solicitationData";

export enum SolicitationSurveyFormTypeFields {
  Message = 'message',
  SurveyAnswers = 'survey',
}

export interface SolicitationSurveyFormType {
  [SolicitationSurveyFormTypeFields.Message]: string, 
  [SolicitationSurveyFormTypeFields.SurveyAnswers]: MarketSurveyAnswers
}

interface SolicitationSurveyContextProviderProps {
    //solicitationId: number,
    children: ReactNode;
}

export const SolicitationSurveyContext = createContext({
    reloadData: () => {},
    questions: undefined as SolicitationSurveyQuestion[] | undefined,
    answers: undefined as SolicitationSurveyQuestionAnswer[] | undefined,
    updateAnswers: async () : Promise<BaseResponse> => Promise.resolve({} as BaseResponse),
    cancelEditing: () => { }, 
    methods: {} as UseFormReturn<SolicitationSurveyFormType, object>
});

export const SolicitationSurveyContextProvider = ({children}: SolicitationSurveyContextProviderProps) => {
    const { showLoader, hideLoader, snackbarSuccess } = useAction();
    const [questions, setQuestions] = useState<SolicitationSurveyQuestion[]>();
    const [answers, setAnswers] = useState<SolicitationSurveyQuestionAnswer[]>();
    const methods = useForm<SolicitationSurveyFormType>();
    
    const reloadData = () => {
        methods.reset();
        const { solicitationIdList } = marketSolicitationStorage.getCurrentSolicitation();
        const solicitationId = solicitationIdList[0];
        
        Promise.all([
          HttpSolicitationSurvey.getSurveyAnswersBySolicitationId(solicitationId),
          HttpSolicitation.getById(solicitationId)
        ])
          .then(([response, solicitation]) => {
            const marketAnswers : MarketSurveyAnswers = {};

            response.forEach(r => {
              let answers = undefined;

              if (r[SolicitationSurveyQuestionAnswerFields.Answers].length)
                switch (r[SolicitationSurveyQuestionFields.SolicitationSurveyQuestionFormatCode]) {
                  case SolicitationSurveyQuestionFormats.Select:
                    answers = r[SolicitationSurveyQuestionAnswerFields.Answers][0]?.[SolicitationSurveyQuestionAnswerResponseFields.SolicitationSurveyQuestionOptionCode];
                    break;

                  case SolicitationSurveyQuestionFormats.MultiSelect:
                    answers = r[SolicitationSurveyQuestionAnswerFields.Answers].map(x => x[SolicitationSurveyQuestionAnswerResponseFields.SolicitationSurveyQuestionOptionCode]);
                    break;

                  case SolicitationSurveyQuestionFormats.InputText:
                  case SolicitationSurveyQuestionFormats.InputNumber:
                  case SolicitationSurveyQuestionFormats.InputPercentage:
                  case SolicitationSurveyQuestionFormats.InputCurrency:
                  case SolicitationSurveyQuestionFormats.Boolean:
                    answers = r[SolicitationSurveyQuestionAnswerFields.Answers][0]?.[SolicitationSurveyQuestionAnswerResponseFields.Answer];
                    break;
                }

              marketAnswers[r[EntityWithIdFields.Id]] = answers;
            })

            marketSolicitationStorage.setSurveyAnswers(marketAnswers);

            setQuestions(response);
            setAnswers(response);
            methods.reset({
              [SolicitationSurveyFormTypeFields.Message]: solicitation[SolicitationViewDTOFields.InitialMessage],
              [SolicitationSurveyFormTypeFields.SurveyAnswers]: marketAnswers
            });
          })
    }

    const updateAnswers = async (dataForm: MarketSurveyAnswers) : Promise<BaseResponse> => {
      showLoader();
      marketSolicitationStorage.setSurveyAnswers(dataForm[SolicitationSurveyFormTypeFields.SurveyAnswers]);
      
      const data : SolicitationSurveyAnswerInsert[] = marketSolicitationStorage.getSurveyAnswersAsInsertList();
      const { solicitationIdList } = marketSolicitationStorage.getCurrentSolicitation();
      const solicitationId = solicitationIdList[0];

      const messageDTO: SolicitationInitialMessageDTO = {
        [BaseRequestFields.OriginCode]: 1,
        [BaseRequestFields.ModuleCode]: 1,
        [SolicitationInitialMessageDTOFields.Message]: dataForm[SolicitationSurveyFormTypeFields.Message],
      }
      
      const [response, _] = await Promise.all([
        HttpSolicitationSurvey.updateSurveyAnswer(solicitationId, data),
        HttpSolicitation.setInitialMessage(solicitationId, messageDTO)
      ])
      
      if (response[BaseResponseFields.HasError]) {
        hideLoader();
        return response;
      }

      methods.reset(dataForm);

      reloadData();
      snackbarSuccess('Tus respuestas se guardaron correctamente');

      hideLoader();
      return response;
    };

    useEffect(() => {
        reloadData()
    }, []);
        
    const cancelEditing = () => methods.reset(marketSolicitationStorage.getSurveyAnswers());

    return (
      <SolicitationSurveyContext.Provider value={{
          reloadData,
          questions: questions,
          answers: answers,
          cancelEditing,
          updateAnswers: methods.handleSubmit(updateAnswers),
          methods: methods
      }}>
          {children}
      </SolicitationSurveyContext.Provider>
    )
}

