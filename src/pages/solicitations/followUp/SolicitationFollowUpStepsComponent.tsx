import React, {useMemo} from "react";
import {Card, Stack, useMediaQuery} from "@mui/material";
import {SolicitationStep, SolicitationStepFields} from "types/solicitations/solicitationData";
import SolicitationFollowUpStepsConnector from "./SolicitationFollowUpStepsConnector";
import {TypographyBase} from "components/misc/TypographyBase";
import SolicitationFollowUpStepsComponentStyles from "./SolicitationFollowUpStepsComponent.styles";
import SolicitationFollowUpStepsIcon from "./SolicitationFollowUpStepsIcon";
import {Theme} from "@mui/material/styles";
import {EntityWithIdFields} from "types/baseEntities";
import {SolicitationClassificationStatusTypes} from "types/solicitations/solicitationEnums";

interface FollowUpStepsStyles {
    connector: 'primary' | 'error' | 'default', 
    extraClasses: string 
}

interface SolicitationFollowUpStepsComponentProps {
    step: SolicitationStep,
    isFirstStep: boolean
}

function SolicitationFollowUpStepsComponent({ step, isFirstStep }: SolicitationFollowUpStepsComponentProps) {
    const classes = SolicitationFollowUpStepsComponentStyles();    
    const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
    
    const stepStyles: FollowUpStepsStyles = useMemo(() => {
        let colorConnector = 'default';
        let extraClasses: string = ""
        
        if (step[SolicitationStepFields.IsCurrentStep]) {
            extraClasses = ` ${classes.currentStep}`
            
            if (step[EntityWithIdFields.Id] === SolicitationClassificationStatusTypes.UnderReview) {
                extraClasses = ` ${classes.currentInProgressStep}`
            }
            
            if (step[SolicitationStepFields.IsResultStep]) {
                colorConnector = step[SolicitationStepFields.IsFavorableResult] ? 'primary' : 'error'
                
                if (!step[SolicitationStepFields.IsFavorableResult]) {
                    extraClasses = ` ${classes.failureResultStep}`
                } else {
                    extraClasses = ` ${classes.successResultStep}`
                }
            } else {
                colorConnector = 'primary'
            }
        }
        
        if (step[SolicitationStepFields.CompletedStep]) {
            colorConnector = 'primary'
            extraClasses += ` ${classes.completeStep}`
        }
        
        return {
            connector: colorConnector,
            extraClasses: extraClasses,
        } as FollowUpStepsStyles
    }, [step])
    
    return (
        <React.Fragment>

            {
                !isFirstStep && (
                    <SolicitationFollowUpStepsConnector color={stepStyles.connector} 
                                                        vertical={isMobile}
                    />
                )
            }

            <Card className={`${classes.root} ${stepStyles.extraClasses}`}>
                <Stack spacing={1.25}
                       justifyContent={'space-between'}
                       height={'-webkit-fill-available'}
                >
                    <Stack direction={'row'} justifyContent={'space-between'}>
                        <TypographyBase variant={'h5'}>
                            {step[SolicitationStepFields.Title]}
                        </TypographyBase>

                        <SolicitationFollowUpStepsIcon step={step} />
                    </Stack>

                    <TypographyBase variant={'body2'}>
                        {step[SolicitationStepFields.Description]}
                    </TypographyBase>
                </Stack>
            </Card>
        </React.Fragment>
    )
}

export default SolicitationFollowUpStepsComponent;