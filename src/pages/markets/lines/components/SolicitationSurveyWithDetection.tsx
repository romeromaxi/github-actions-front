import {useEffect, useState} from "react";
import {SolicitationSurveyQuestion} from "types/solicitations/solicitationSurveyData";
import {HttpCacheSolicitation} from "http/index";
import SolicitationSurveyQuestionForm from "pages/solicitations/survey/SolicitationSurveyQuestionComponent";

interface SolicitationSurveyWithDetectionProps {
  solicitationTypeCode: number,
  productLineId: number,
  allowEdit?: boolean,
  onQuestionsDetected?: (hasQuestions: boolean) => void
}

function SolicitationSurveyWithDetection({
  solicitationTypeCode, 
  allowEdit, 
  productLineId,
  onQuestionsDetected
}: SolicitationSurveyWithDetectionProps) {
  
  const [questions, setQuestions] = useState<SolicitationSurveyQuestion[]>();

  useEffect(() => {
    setQuestions(undefined);
    HttpCacheSolicitation.getSolicitationSurveyQuestionBySolicitationType(solicitationTypeCode, [productLineId])
      .then(questions => {
        setQuestions(questions);
        if (onQuestionsDetected) {
          onQuestionsDetected(Array.isArray(questions) && questions.length > 0);
        }
      })
  }, [solicitationTypeCode, productLineId, onQuestionsDetected]);
  
  return (
    <SolicitationSurveyQuestionForm questions={questions} 
                                    allowEdit={allowEdit} />
  )
}

export default SolicitationSurveyWithDetection;

