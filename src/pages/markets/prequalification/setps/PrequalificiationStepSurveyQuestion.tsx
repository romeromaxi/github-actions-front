import React, {useContext, useEffect} from "react";
import {FormProvider} from "react-hook-form";
import {Box, Card} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import {PrequalificationStepperContext} from "../PrequalificationStepper";
import SolicitationSurveyQuestionForm from "pages/solicitations/survey/SolicitationSurveyQuestionComponent";
import {SolicitationSurveyContext, SolicitationSurveyFormTypeFields} from "hooks/contexts/SolicitationSurveyContext";
import {ControlledTextFieldFilled} from "components/forms";

function PrequalificiationStepSurveyQuestion() {
    const { setOnBeforeSubmit } = useContext(PrequalificationStepperContext);
    const { updateAnswers, questions, methods } = useContext(SolicitationSurveyContext);

    useEffect(() => {
        const handleBeforeSubmit = async () => {
            return await updateAnswers();
        };

        setOnBeforeSubmit(() => handleBeforeSubmit)
    }, [])
  
  return (
    <Card>
        <FormProvider {...methods}>
            <SolicitationSurveyQuestionForm nameBase={SolicitationSurveyFormTypeFields.SurveyAnswers}
                                            questions={questions}
                                            allowEdit
            />
        </FormProvider>

        <Box mt={2}>
            <TypographyBase variant={'label'} fontWeight={500}>
                Mensaje
            </TypographyBase>
            <ControlledTextFieldFilled control={methods.control}
                                       name={SolicitationSurveyFormTypeFields.Message}
                                       multiline
                                       rows={4}
            />
        </Box>
    </Card>
  )
}

export default PrequalificiationStepSurveyQuestion;