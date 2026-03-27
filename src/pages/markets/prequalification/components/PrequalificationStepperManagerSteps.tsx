import React, {useContext} from "react";
import clsx from "clsx";
import { Check, PaperPlaneTilt } from "@phosphor-icons/react";
import {Box, Button, Stack, Theme, Typography, useMediaQuery} from "@mui/material";
import {CompanyLogoById} from "../../../company/components/CompanyLogo";
import {CompanyViewDTO, CompanyViewDTOFields} from "types/company/companyData";
import {BaseIconWrapper} from "components/icons/Icons";
import {BackIconButton} from "components/buttons/Buttons";
import {Skeleton} from "@mui/lab";
import {PrequalificationDataSteps, PrequalificationStepperContext} from "../PrequalificationStepper";
import PrequalificationStepperManagerStepsStyles from "./PrequalificationStepperManagerSteps.styles";
import {EntityWithIdFields} from "types/baseEntities";
import {PersonTypes} from "../../../../types/person/personEnums";

interface PrequalificationStepperManagerStepsProps {
    steps: PrequalificationDataSteps[],
    company?: CompanyViewDTO,
    activeStep: number,
    onConfirm?: () => void
}

function PrequalificationStepperManagerSteps({ company, steps, activeStep, onConfirm }: PrequalificationStepperManagerStepsProps) {
    const { stepperDone, handleBack, handleNext } = useContext(PrequalificationStepperContext);
    const classes = PrequalificationStepperManagerStepsStyles();

    const isFirstStep = (step: number) => step === 0;
    const isLastStep = (step: number) => step + 1 === steps.length;
    const isMobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
    
    return (
        <Stack spacing={4}>
            <Stack direction={'row'} spacing={1} alignItems={'center'}>
                <CompanyLogoById companyId={company?.[EntityWithIdFields.Id]}
                                 isPhysicalPerson={company?.[CompanyViewDTOFields.PersonTypeCode] === PersonTypes.Physical}
                />

                {
                    company ?
                        <Typography className={'text-ellipsis-two-lines'} variant={isMobileScreenSize ? 'h5' : 'h4'}>
                            {`Envío de solicitudes para ${company?.[CompanyViewDTOFields.BusinessName]}`}
                        </Typography>
                        :
                        <Skeleton variant={'text'} width={'80%'} />
                }
            </Stack>
            
            <Stack spacing={2}>
                {
                    steps.map((step, idx) =>
                        <Box key={`stepCart_${idx}`}
                             className={clsx(classes.stepContainer, {
                                 [classes.stepContainerActive]: idx === activeStep
                             })}
                        >
                        <Stack direction='row' alignItems='center' spacing={2}>
                            {
                                idx < activeStep ? 
                                    <BaseIconWrapper Icon={Check} size={'sm'} width={'32px'} height={'32px'} bg={'#F7FAFC'}/>
                                    :
                                    <Box className={clsx(classes.numberStep, {
                                            [classes.numberStepActive]: idx === activeStep
                                         })}
                                    >
                                        <Typography fontWeight={500} fontSize={15} color={activeStep === idx ? 'black' : '#A0AEC0'}>
                                            { idx + 1}
                                        </Typography>
                                    </Box>
                            }
                            <Stack>
                                { idx < activeStep && <Typography variant={'caption'} color={'text.lighter'}>Completado</Typography>}
                                
                                <Typography variant={isMobileScreenSize ? 'body2' : 'body1'} fontWeight={500}>
                                    {step.summaryLabel || step.label}
                                </Typography>
                            </Stack>
                        </Stack>
                    </Box>
                )}
                <Stack direction='row' alignItems='center' spacing={1} justifyContent={'center'}>
                    {
                        !isFirstStep(activeStep) && 
                            <BackIconButton onClick={handleBack} disabled={stepperDone} sx={{backgroundColor: '#F7FAFC', color: 'black'}}/>
                    }
                    
                    {
                        isLastStep(activeStep) ?
                            <Button variant={'contained'}
                                    endIcon={<PaperPlaneTilt />}
                                    disabled={stepperDone}
                                    onClick={onConfirm}
                                    fullWidth
                            >
                                Enviar
                            </Button>
                            :
                            <Button variant={'contained'}
                                    onClick={handleNext}
                                    disabled={stepperDone}
                                    fullWidth
                            >
                                Continuar
                            </Button>
                    }
                </Stack>
            </Stack>
        </Stack>
    )
}

export default PrequalificationStepperManagerSteps;