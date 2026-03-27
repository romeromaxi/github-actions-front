import React, {useEffect, useState} from "react";
import {SolicitationStep, SolicitationStepFields} from "types/solicitations/solicitationData";
import {HttpSolicitation} from "http/index";
import {Stack, Step, StepLabel, Stepper} from "@mui/material";
import {TypographyBase} from "components/misc/TypographyBase";
import SolicitationFollowUpStepsDotConnector from "../followUp/SolicitationFollowUpStepsDotConnector";
import SolicitationFollowUpStepsDotIcon from "../followUp/SolicitationFollowUpStepsDotIcon";

interface SolicitationFollowUpStepsDotsProps {
    solicitationId?: number,
}

function SolicitationFollowUpStepsDots({solicitationId}: SolicitationFollowUpStepsDotsProps) {
    const [steps, setSteps] = useState<SolicitationStep[]>();

    const loadSteps = (id: number) => {
        const fnGetSteps = HttpSolicitation.getSolicitationOffererSteps;

        fnGetSteps(id).then(setSteps);
    }

    useEffect(() => {
        setSteps(undefined);

        if (solicitationId)
            loadSteps(solicitationId)
    }, [solicitationId]);
    
    return (
        <Stack spacing={1.3} 
               direction={{ xs: 'column', md: 'row' }}
               minWidth={{ xs: 'auto', md: '500px' }}
        >

            <Stepper
                sx={{
                    width: '-webkit-fill-available'
                }}
                alternativeLabel
                activeStep={steps ? steps.findIndex(x => x[SolicitationStepFields.IsCurrentStep]) : undefined}
                connector={<SolicitationFollowUpStepsDotConnector steps={steps ?? []} />}
            >
                {steps && steps.map((label, index) => (
                    <Step key={index}
                          completed={index < steps.findIndex(x => x[SolicitationStepFields.IsCurrentStep])}
                    >
                        <StepLabel
                            StepIconComponent={(props) => (
                                <SolicitationFollowUpStepsDotIcon step={label}
                                                                  {...props}
                                    
                                />
                            )}
                        >
                            <Stack spacing={0.25}>
                                <TypographyBase variant={'body2'} fontWeight={600}>
                                    {label[SolicitationStepFields.Title]}
                                </TypographyBase>
                                
                                {/*<TypographyBase variant={'body4'}
                                                color={'text.lighter'}
                                                fontWeight={400}
                                >
                                    {dateFormatter.toShortDateWithMonthName(new Date())}
                                </TypographyBase>*/}
                            </Stack>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
        </Stack>
    )
}

export default SolicitationFollowUpStepsDots;