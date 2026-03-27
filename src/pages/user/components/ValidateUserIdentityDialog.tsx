import {Dialog} from "@mui/material";
import React, {useState} from "react";
import {useAction} from "../../../hooks/useAction";
import ValidateUserIdentityForm from "./ValidateUserIdentityForm";
import EvaluationUserIdentityForm from "./EvaluationUserIdentityForm";
import {ValidationQuestionary} from "../../../types/user";
import {userStorage} from "../../../util/localStorage/userStorage";
import {ValidationStatesType} from "../../../types/person/personEnums";


interface ValidateUserIdentityDialogProps {
    open: boolean,
    onClose: () => void,
    onReload: (arg?: string) => void
}

export enum UserValidationStageType {
    Validation = 1,
    Evaluation = 2
}

const ValidateUserIdentityDialog = ({open, onClose, onReload} : ValidateUserIdentityDialogProps) => {
    const [idQuery, setIdQuery] = useState<number>()
    const [validationStage, setValidationStage] = useState<UserValidationStageType>(UserValidationStageType.Validation)
    const [questionaryData, setQuestionaryData] = useState<ValidationQuestionary[]>([])
    const [cuit, setCuit] = useState<string>()
    const { snackbarSuccess } = useAction();

    const handleSentValidation = (queryId: number, reqEval: boolean, appliesQuest: boolean, questionary: ValidationQuestionary[], cuit?: string) => {
        setCuit(cuit)
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
    
    const onCompleteProcess = () => {
        onClose()
        userStorage.setValidatedIdentityCode(ValidationStatesType.Validated)
        snackbarSuccess('La validación de identidad fue exitosa.')
        onReload(cuit)
    }

    return (
        <Dialog open={open}
                onClose={onClose}
                maxWidth={validationStage === UserValidationStageType.Validation ? 'sm' : 'md'}
                fullWidth
        >
            {
                validationStage === UserValidationStageType.Validation &&
                <ValidateUserIdentityForm afterSubmit={handleSentValidation}/>
            }
            {
                validationStage === UserValidationStageType.Evaluation && idQuery &&
                <EvaluationUserIdentityForm afterSubmit={onCompleteProcess}
                                            queryId={idQuery}
                                            questionary={questionaryData}
                                            backToValidation={handleBackEvaluation}
                />
            }
        </Dialog>
    );
}


export default ValidateUserIdentityDialog