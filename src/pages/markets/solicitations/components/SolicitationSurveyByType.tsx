import {useEffect, useState} from "react";
import {SolicitationSurveyQuestion} from "types/solicitations/solicitationSurveyData";
import {HttpCacheSolicitation} from "http/index";
import SolicitationSurveyQuestionForm from "pages/solicitations/survey/SolicitationSurveyQuestionComponent";

interface SolicitationSurveyByTypeProps {
  solicitationTypeCode: number,
  productLineId: number,
  allowEdit?: boolean
}

function SolicitationSurveyByType({solicitationTypeCode, allowEdit, productLineId}: SolicitationSurveyByTypeProps) {
  
  const [questions, setQuestions] = useState<SolicitationSurveyQuestion[]>();

  useEffect(() => {
    setQuestions(undefined);
    HttpCacheSolicitation.getSolicitationSurveyQuestionBySolicitationType(solicitationTypeCode, [productLineId])
      .then(setQuestions)
  }, []);
  
  return (
    <SolicitationSurveyQuestionForm questions={questions} 
                                    allowEdit={allowEdit} />
  )
}

export default SolicitationSurveyByType;