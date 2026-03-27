import {Box, Card, CardContent} from "@mui/material";
import {useState} from "react";
import {ValidationQuestionary} from "types/user";
import {userStorage} from "util/localStorage";
import {ValidationStatesType} from "types/person/personEnums";
import {UserValidationStageType} from "../components/ValidateUserIdentityDialog";
import ValidateUserIdentityForm from "../components/ValidateUserIdentityForm";
import EvaluationUserIdentityForm from "../components/EvaluationUserIdentityForm";
import {useSnackbarActions} from "hooks/useSnackbarActions";
import {useUser} from "hooks/contexts/UserContext";
import {useLoaderActions} from "hooks/useLoaderActions";

interface UserValidationComponentProps {
    onSubmit: () => void,
    waitBackgroundProcessing?: boolean,
    onClickReturn?: () => void,
    backLabel?: string
}

const UserValidationComponent = (props: UserValidationComponentProps) => {
    const { addSnackbarSuccess } = useSnackbarActions();
    const { refreshUser } = useUser();
    const { showLoader, hideLoader } = useLoaderActions();
    
    const [idQuery, setIdQuery] = useState<number>()
    const [validationStage, setValidationStage] = useState<UserValidationStageType>(UserValidationStageType.Validation)
    const [questionaryData, setQuestionaryData] = useState<ValidationQuestionary[]>([])

    const handleSentValidation = (queryId: number, reqEval: boolean, appliesQuest: boolean, questionary: ValidationQuestionary[], cuit?: string) => {
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
        showLoader();
        userStorage.setValidatedIdentityCode(ValidationStatesType.Validated);
        refreshUser()
            .finally(() => {
                hideLoader();
                addSnackbarSuccess('La validación de identidad fue exitosa.');
                props.onSubmit();
            });
    }
    
    return (
        <Box sx={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
            <Card variant={'onboarding'}>
                <CardContent sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {
                        validationStage === UserValidationStageType.Validation &&
                        <ValidateUserIdentityForm afterSubmit={handleSentValidation}
                                                  waitBackgroundProcessing={props.waitBackgroundProcessing}
                                                  wrappedBack={props.onClickReturn}
                                                  backLabel={props.backLabel}
                        />
                    }
                    {
                        validationStage === UserValidationStageType.Evaluation && idQuery &&
                        <EvaluationUserIdentityForm afterSubmit={onCompleteProcess}
                                                    queryId={idQuery}
                                                    questionary={questionaryData}
                                                    backToValidation={handleBackEvaluation}
                                                    waitBackgroundProcessing={props.waitBackgroundProcessing}
                        />
                    }
                </CardContent>
            </Card>
        </Box>
    )
}


export default UserValidationComponent;