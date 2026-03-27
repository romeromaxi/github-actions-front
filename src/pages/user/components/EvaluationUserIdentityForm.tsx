import {
    DialogContent,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Stack,
    Step,
    StepButton,
    Stepper,
    Typography,
    Box,
    Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
    BaseQueryResultFields,
    EvaluationQueryResultFields,
    UserEvaluateIdentityPublicBases,
    UserEvaluateIdentityPublicBasesFields,
    ValidationQuestionary,
} from "../../../types/user";
import { ChangeEvent, useState } from "react";
import { useAction } from "../../../hooks/useAction";
import { HttpUser } from "../../../http";

interface EvaluationUserIdentityFormProps {
    afterSubmit: () => void;
    queryId: number;
    questionary: ValidationQuestionary[];
    backToValidation: () => void;
    waitBackgroundProcessing?: boolean
}

const EvaluationUserIdentityForm = ({
                                        afterSubmit,
                                        queryId,
                                        questionary,
                                        backToValidation,
                                        waitBackgroundProcessing = false,
                                    }: EvaluationUserIdentityFormProps) => {
    const methods = useForm<UserEvaluateIdentityPublicBases>();
    const { showLoader, hideLoader, snackbarError } = useAction();

    const [activeStep, setActiveStep] = useState<number>(0);
    const [answers, setAnswers] = useState<{ [key: string]: number }>({});

    const handleChange = (event: ChangeEvent<HTMLInputElement>, idPregunta: number) => {
        const value = (event.target as HTMLInputElement).value;
        setAnswers((prev) => ({
            ...prev,
            [idPregunta]: Number(value),
        }));
    };

    const formatResponse = () => {
        return Object.entries(answers)
            .map(([idPregunta, nroOpcion]) => `${idPregunta}-${nroOpcion}`)
            .join(",");
    };

    const onEvaluate = () => {
        const formattedAnswers = formatResponse();
        const submitData: UserEvaluateIdentityPublicBases = {
            [UserEvaluateIdentityPublicBasesFields.QueryId]: queryId,
            [UserEvaluateIdentityPublicBasesFields.Questionary]: formattedAnswers,
            [UserEvaluateIdentityPublicBasesFields.WaitBackgroundProcessing]: waitBackgroundProcessing,
        };

        showLoader();

        HttpUser.evaluateIdentityQueryNosis(submitData).then((r) => {
            hideLoader();
            if (r[BaseQueryResultFields.IsValid] && r[EvaluationQueryResultFields.ApprovesEvaluation]) {
                afterSubmit();
            } else {
                snackbarError(r[BaseQueryResultFields.StateDescription]);
                backToValidation();
            }
        });
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const buttonDisabled = answers[questionary[activeStep].idPregunta] === undefined;

    return (
        <form onSubmit={methods.handleSubmit(onEvaluate)}>
            <DialogContent>
                <Stack direction="column" spacing={4}>
                    <Box sx={{ flex: 1 }}>
                        <Stack direction="column" alignItems="stretch" spacing={2}>
                            <FormControl>
                                <Typography variant="body2" sx={{ fontSize: 16, fontWeight: "bold" }}>
                                    {questionary[activeStep]?.pregunta}
                                </Typography>
                                <RadioGroup
                                    id={`select-label-${activeStep}`}
                                    value={answers[questionary[activeStep].idPregunta] ?? ""}
                                    onChange={(event) => handleChange(event, questionary[activeStep].idPregunta)}
                                    sx={{ marginTop: 1 }}
                                >
                                    {questionary[activeStep].opciones.map((opcion, index) => (
                                        <Stack key={`option-${index}`} direction="row" alignItems="center">
                                            <FormControlLabel value={index} control={<Radio />} label={""} />
                                            <Typography fontSize={14}>{opcion}</Typography>
                                        </Stack>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        </Stack>
                    </Box>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={2}
                    >
                        <Stepper activeStep={activeStep}>
                            {questionary.map((pregunta, index) => {
                                const isCompleted = !!answers[pregunta.idPregunta];
                                const disabled = index > activeStep && !isCompleted;

                                return (
                                    <Step key={pregunta.idPregunta} completed={isCompleted}>
                                        <StepButton
                                            onClick={() => {
                                                if (!disabled) setActiveStep(index);
                                            }}
                                            disabled={disabled}
                                            StepIconProps={{
                                                sx: {
                                                    width: 28,
                                                    height: 28,
                                                    fontSize: 16,
                                                    color: isCompleted && activeStep !== index && "#008547",
                                                    backgroundColor: isCompleted && activeStep !== index && "#D8F3E6"
                                                },
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontWeight: activeStep === index ? "bold" : "normal",
                                                    color: 'black',
                                                    ml: 1
                                                }}
                                            >
                                                {`Pregunta ${index + 1}`}
                                            </Typography>
                                        </StepButton>
                                    </Step>
                                );
                            })}
                        </Stepper>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {activeStep === questionary.length - 1 ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    size="small"
                                    disabled={buttonDisabled}
                                >
                                    Finalizar
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNext}
                                    size="small"
                                    disabled={buttonDisabled}
                                >
                                    Siguiente
                                </Button>
                            )}
                        </Box>
                    </Stack>
                </Stack>
            </DialogContent>
        </form>
    );
};

export default EvaluationUserIdentityForm;
