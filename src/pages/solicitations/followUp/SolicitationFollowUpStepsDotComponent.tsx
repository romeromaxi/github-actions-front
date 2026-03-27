import React from "react";
import {Box, Stack} from "@mui/material";
import {SolicitationStep} from "types/solicitations/solicitationData";
import {SolicitationStepFields} from "types/solicitations/solicitationData";
import {themeColorDefinition} from "util/themes/definitions";
import {WrapperIcons} from "components/icons/Icons";
import {TypographyBase} from "components/misc/TypographyBase";
import {CheckIcon} from "lucide-react";

interface SolicitationFollowUpStepsDotComponentProps {
    step: SolicitationStep,
    isFirstStep: boolean
}

function SolicitationFollowUpStepsDotComponent({ step, isFirstStep }: SolicitationFollowUpStepsDotComponentProps) {
    return (
        <React.Fragment>
            <Stack>
                {
                    step[SolicitationStepFields.CompletedStep] ?
                        <Box height={'24px'}
                             width={'24px'}
                             borderRadius={'100px'}
                             textAlign={'center'}
                             sx={{
                                 backgroundColor: themeColorDefinition.systemFeedback.success.primary,
                                 //boxShadow: `inset 0 0 0 1px ${themeColorDefinition.UIElements.borders.primary}`
                             }}
                        >
                            <WrapperIcons Icon={CheckIcon} size={'14.4'}
                                          color={themeColorDefinition.systemFeedback.success.primaryContrastText}
                            />
                        </Box>
                        :
                        <Box height={'24px'}
                             width={'24px'}
                             borderRadius={'100px'}
                             sx={{
                                 backgroundColor: themeColorDefinition.UIElements.borders.tertiary,
                                 boxShadow: `inset 0 0 0 1px ${themeColorDefinition.UIElements.borders.primary}`
                             }}
                        />
                }
    
                <TypographyBase variant={'body2'} fontWeight={600}>
                    {step[SolicitationStepFields.Title]}
                </TypographyBase>
            </Stack>
        </React.Fragment>
    )
}

export default SolicitationFollowUpStepsDotComponent;