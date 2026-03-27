import React, {useContext, useState} from "react";
import {ValidationQuestionary} from "../../../../../types/user";
import {useAction} from "../../../../../hooks/useAction";
import {userStorage} from "../../../../../util/localStorage/userStorage";
import {ValidationStatesType} from "../../../../../types/person/personEnums";
import ValidateUserIdentityForm from "../../../components/ValidateUserIdentityForm";
import EvaluationUserIdentityForm from "../../../components/EvaluationUserIdentityForm";
import {UserValidationStageType} from "../../../components/ValidateUserIdentityDialog";
import {SignupResponsibleStepperFormContext} from "../SignupResponsibleStepperForm";


const ResponsibleInvitationThirdStep = () => {
    const [idQuery, setIdQuery] = useState<number>()
    const [validationStage, setValidationStage] = useState<UserValidationStageType>(UserValidationStageType.Validation)
    const [questionaryData, setQuestionaryData] = useState<ValidationQuestionary[]>([])
    const { snackbarSuccess } = useAction();
    
    const { onFinishProcess, onBack } = useContext(SignupResponsibleStepperFormContext);

    const handleSentValidation = (queryId: number, reqEval: boolean, appliesQuest: boolean, questionary: ValidationQuestionary[]) => {
        if (!reqEval) {
            onCompleteProcess()
        } else {
            setIdQuery(queryId)
            setQuestionaryData(questionary)
            setValidationStage(UserValidationStageType.Evaluation)
        }
    }

    const handleBackEvaluation = () => {
        setValidationStage(UserValidationStageType.Validation)
    }

    const onCompleteProcess = async () => { 
        try {
            userStorage.setValidatedIdentityCode(ValidationStatesType.Validated);
            snackbarSuccess('La validación de identidad fue exitosa.');
            onFinishProcess();
        } catch (error) {
            console.error('Error completing validation:', error);
        }
    };
    
    return (
        <React.Fragment>
            {
                validationStage === UserValidationStageType.Validation &&
                <ValidateUserIdentityForm afterSubmit={handleSentValidation} wrappedBack={onBack}/>
            }
            {
                validationStage === UserValidationStageType.Evaluation && idQuery &&
                <EvaluationUserIdentityForm afterSubmit={onCompleteProcess}
                                            queryId={idQuery}
                                            questionary={questionaryData}
                                            backToValidation={handleBackEvaluation}
                />
            }
        </React.Fragment>
    )
}


export default ResponsibleInvitationThirdStep