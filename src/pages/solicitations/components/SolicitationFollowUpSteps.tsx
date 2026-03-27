import React, {useEffect, useState} from "react";
import {Skeleton} from "@mui/lab";
import {Check} from "phosphor-react";
import {Box, Card, Stack, Step, Stepper, Typography} from "@mui/material";
import {HttpSolicitation} from "http/index";
import {BaseIconWrapper} from "components/icons/Icons";
import {SolicitationStep, SolicitationStepFields} from "types/solicitations/solicitationData";
import {TypographyBase} from "../../../components/misc/TypographyBase";

interface SolicitationFollowUpStepsProps {
  solicitationId?: number,
  fromCompany?: boolean,
  horizontal?: boolean
}

function SolicitationFollowUpSteps({solicitationId, fromCompany, horizontal}: SolicitationFollowUpStepsProps) {
  const [steps, setSteps] = useState<SolicitationStep[]>();
  const [activeStep, setActiveStep] = useState<number>()
  
  useEffect(() => {
    if (steps) setActiveStep(steps.findIndex(step => step[SolicitationStepFields.IsCurrentStep]));
  }, [steps]);
  const loadSteps = (id: number) => {
    const fnGetSteps = fromCompany ?
      HttpSolicitation.getSolicitationCompanySteps :
      HttpSolicitation.getSolicitationOffererSteps;
    
    fnGetSteps(id).then(setSteps);
  }
  
  useEffect(() => {
    setSteps(undefined);
    
    if (solicitationId)
      loadSteps(solicitationId)
  }, [solicitationId]);
  
  return (
    <Stack spacing={1}>
      {steps ?
          horizontal ?
              <Box sx={{
                width: '100%',
                overflow: 'hidden'
              }}>
                <Stepper
                    activeStep={activeStep}
                    alternativeLabel
                    sx={{
                      '& .MuiStepConnector-root': {
                        top: '8px !important',
                        '& > span': {
                          borderBottom: '1px dashed #4DAB2B !important',
                          margin: 0
                        },
                      }
                    }}
                >
                    {steps.map((step, index) => (
                        <Step key={`step_${index}`}>
                          <StepLabel
                              StepIconComponent={() => (
                                  <Box sx={{
                                    minHeight: '32px',
                                    minWidth: '32px',
                                    height: '32px',
                                    width: '32px',
                                    backgroundColor: step[SolicitationStepFields.IsCurrentStep] ? 'white' :
                                        (step[SolicitationStepFields.CompletedStep] ? '#4DAB2B' : '#F7FAFC'),
                                    borderRadius: '100px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    border: step[SolicitationStepFields.IsCurrentStep] ? '1px solid #4DAB2B' : 'none'
                                  }}>
                                    {step[SolicitationStepFields.CompletedStep] ? (
                                        <BaseIconWrapper
                                            Icon={Check}
                                            size={'sm'}
                                            width={'32px'}
                                            height={'32px'}
                                            bg={'#4DAB2B'}
                                            color={"white"}
                                        />
                                    ) : (
                                        <Typography
                                            fontWeight={500}
                                            fontSize={15}
                                            color={step[SolicitationStepFields.IsCurrentStep] ? 'black' : '#A0AEC0'}
                                        >
                                          {index + 1}
                                        </Typography>
                                    )}
                                  </Box>
                              )}
                              sx={{
                                '& .MuiStepLabel-label': {
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '100%'
                                }
                              }}
                          >
                            <Stack spacing={0.5} alignItems="center">
                                <Typography variant="body2" fontWeight={500}>
                                  {step[SolicitationStepFields.Title]}
                                </Typography>

                              <TypographyBase
                                  variant={"caption"}
                                  color="text.lighter"
                                  maxLines={2}
                                  tooltip
                                  fontWeight={600}
                              >
                                {step[SolicitationStepFields.Description]}
                              </TypographyBase>
                            </Stack>
                          </StepLabel>
                        </Step>
                    ))}
                  </Stepper>
              </Box>
              :
        (
          steps.map((step, idx) =>
            <Box sx={{
              padding: '16px 8px',
              width: '100%',
              borderRadius: '8px',
              backgroundColor: step[SolicitationStepFields.IsCurrentStep] ? '#F7FAFC' : 'white'
            }} key={`stepCart_${idx}`}>
              <Stack direction='row' alignItems='center' spacing={1}>
                {step[SolicitationStepFields.CompletedStep] ?
                  <BaseIconWrapper Icon={Check} size={'sm'} width={'32px'} height={'32px'} bg={'#F7FAFC'}/>
                  :
                  <Box sx={{ minHeight: '32px !important', minWidth: '32px !important', height: '32px !important', width: '32px !important', backgroundColor: step[SolicitationStepFields.IsCurrentStep] ? 'white' : '#F7FAFC', borderRadius: '100px', display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'}}>
                    <Typography fontWeight={500} fontSize={15} color={step[SolicitationStepFields.IsCurrentStep] ? 'black' : '#A0AEC0'}>
                      {idx+1}
                    </Typography>
                  </Box>
                }
                <Stack>
                  {step[SolicitationStepFields.CompletedStep] ?
                    <Typography variant={'caption'} color={'#818992'}>Completado</Typography>
                    :
                    <Typography variant={'body2'} fontWeight={500}>{step[SolicitationStepFields.Title]}</Typography>
                  }
                  {
                    step[SolicitationStepFields.CompletedStep] ?
                      <Typography variant={'body2'} fontWeight={500}>{step[SolicitationStepFields.Title]}</Typography>
                      :
                      <Typography variant={'label'} color={'#818992'}>{step[SolicitationStepFields.Description]}</Typography>
                  }
                </Stack>
              </Stack>
            </Box>
          ))
        :
        (Array.from({length: 3}).map(() =>
            <Skeleton sx={{height: '60px', width: '100%'}}/>
          )
        )
      }
    </Stack>
  )
}

const StepLabel = ({ children, StepIconComponent, ...props }) => {
  return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <StepIconComponent />
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          {children}
        </Box>
      </Box>
  );
};

export default SolicitationFollowUpSteps;