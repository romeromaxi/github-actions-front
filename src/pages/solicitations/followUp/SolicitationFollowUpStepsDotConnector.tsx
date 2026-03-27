import React from "react";
import {StepConnector, useStepContext} from "@mui/material";
import {SolicitationStep, SolicitationStepFields} from "types/solicitations/solicitationData";

interface SolicitationFollowUpStepsDotConnectorProps {
    steps: SolicitationStep[]
}

function SolicitationFollowUpStepsDotConnector(props: SolicitationFollowUpStepsDotConnectorProps) {
    // @ts-ignore
    const { index } = useStepContext();
    const { steps } = props;

    // Index usa el numero de paso (comenzando en 0), por eso el proximo paso es el steps[index]
    const nextStep = steps && steps[index];

    const isSpecial = !!nextStep &&
        nextStep[SolicitationStepFields.IsCurrentStep] &&
        nextStep[SolicitationStepFields.IsResultStep] &&
        !nextStep[SolicitationStepFields.IsFavorableResult];

    return (
        <StepConnector
            {...props}
            sx={{
                "& .MuiStepConnector-line": {
                    height: 3,
                    width: '100%',
                    border: 'none !important',
                    borderRadius: '34px',
                    backgroundColor: "grey.300",
                },
                "&.Mui-active .MuiStepConnector-line": {
                    backgroundColor: isSpecial ? "#720800" : "success.main",
                },
                "&.Mui-completed .MuiStepConnector-line": {
                    backgroundColor: isSpecial ? "#720800" : "success.main",
                    //backgroundColor: isSpecial ? "warning.main" : "success.main",
                },
            }}
        />
    );
}

export default SolicitationFollowUpStepsDotConnector;