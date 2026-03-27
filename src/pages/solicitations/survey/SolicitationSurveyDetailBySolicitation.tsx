import {useEffect, useState} from "react";
import {SolicitationSurveyQuestionAnswer} from "types/solicitations/solicitationSurveyData";
import {HttpSolicitationSurvey} from "http/solicitations/httpSolicitationSurvey";
import SolicitationSurveyDetailView from "./SolicitationSurveyDetailView";

interface SolicitationSurveyDetailBySolicitationProps {
    solicitationId: number
}

function SolicitationSurveyDetailBySolicitation({ solicitationId }: SolicitationSurveyDetailBySolicitationProps) {
    const [answersSurvey, setAnserwsSurvey] = useState<SolicitationSurveyQuestionAnswer[]>();

    useEffect(() => {
        HttpSolicitationSurvey.getSurveyAnswersBySolicitationId(solicitationId)
            .then(setAnserwsSurvey)
    }, [solicitationId]);
    
    return (
        <SolicitationSurveyDetailView answers={answersSurvey} />
    )
}

export default SolicitationSurveyDetailBySolicitation;