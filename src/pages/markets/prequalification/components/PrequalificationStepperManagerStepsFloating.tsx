import {Box, Button, Card, Stack, Step, StepButton, StepLabel, Stepper, useMediaQuery, useTheme} from "@mui/material";
import React, {useContext} from "react";
import {PrequalificationDataSteps, PrequalificationStepperContext} from "../PrequalificationStepper";
import {SendIcon} from "lucide-react";

interface PrequalificationStepperManagerStepsFloatingProps {
    steps: PrequalificationDataSteps[],
    activeStep: number,
    onConfirm: () => void
}

function PrequalificationStepperManagerStepsFloating({ steps, activeStep, onConfirm }: PrequalificationStepperManagerStepsFloatingProps) {
    const { handleBack, handleNext, disableNext } = useContext(PrequalificationStepperContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isLastStep = activeStep === steps.length - 1;
    
    return (
        <Box position={"fixed"} 
             zIndex={1000}
             bottom={0}
             left={0}
             right={0}
        >
            <Card sx={{
                padding: '24px 48px',
                borderRadius: '16px 16px 0px 0px !important',
                backdropFilter: 'blur(12.5px)'
            }}>
                <Stack
                    direction={isMobile ? 'column' : 'row'}
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                >
                    <Box>
                        <Stepper activeStep={activeStep}
                                 orientation={isMobile ? 'vertical' : 'horizontal'}
                        >
                            {
                                steps.map((step, idx) => {
                                    const completed = idx < activeStep;
                                    
                                    return (
                                        <Step key={`d`} index={idx}
                                              completed={completed}
                                              active={idx === activeStep}
                                        >
                                            <StepButton sx={{ paddingY: 0 }}
                                                        onClick={completed ? () => handleBack(idx) : undefined}>
                                                <StepLabel>
                                                    {step.title}
                                                </StepLabel>
                                            </StepButton>
                                        </Step>
                                    )
                                })
                            }
                        </Stepper>
                    </Box>
                    
                    <Box>
                        {
                            isLastStep ?
                                <Button variant={'contained'}
                                        onClick={onConfirm}
                                        startIcon={<SendIcon />}
                                        disabled={disableNext}
                                        fullWidth
                                >
                                    Enviar
                                </Button>
                                :

                                <Button variant={'contained'}
                                        onClick={handleNext}
                                        disabled={disableNext}
                                        fullWidth
                                >
                                    Siguiente paso
                                </Button>
                        }
                    </Box>
                    
                </Stack>
            </Card>
        </Box>
    )
}

export default PrequalificationStepperManagerStepsFloating;