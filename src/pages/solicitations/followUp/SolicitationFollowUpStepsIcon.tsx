import React from "react";
import {Box} from "@mui/material";
import {BaseIconWrapper, WrapperIcons} from "components/icons/Icons";
import {SolicitationStep, SolicitationStepFields} from "types/solicitations/solicitationData";
import {themeColorDefinition} from "util/themes/definitions";
import {EntityWithIdFields} from "types/baseEntities";
import {BanIcon, CheckIcon, FileSearchIcon} from "lucide-react";
import { SolicitationClassificationStatusTypes } from "types/solicitations/solicitationEnums";

interface SolicitationFollowUpStepsIconProps {
    step: SolicitationStep
}


function SolicitationFollowUpStepsIcon({ step }: SolicitationFollowUpStepsIconProps) {
    const baseIconSize: string = '30px';
    const iconInBadgeSize: string = '18px';
    
    if (step[SolicitationStepFields.IsCurrentStep] &&
        step[SolicitationStepFields.IsResultStep]
    ) {
        return (
            step[SolicitationStepFields.IsFavorableResult] ?
                <BaseIconWrapper Icon={CheckIcon}
                                 size={iconInBadgeSize}
                                 width={baseIconSize}
                                 height={baseIconSize}
                                 bg={'#309D6A'}
                                 color={themeColorDefinition.UIElements.altTexts.default}
                />
                :
                <WrapperIcons Icon={BanIcon} size={baseIconSize} />
        )
    }
    
    if (step[SolicitationStepFields.CompletedStep])
        return (
            <BaseIconWrapper Icon={CheckIcon}
                             size={iconInBadgeSize}
                             width={baseIconSize}
                             height={baseIconSize}
                             bg={'#309D6A'}
                             color={themeColorDefinition.UIElements.altTexts.default} 
            />
        );

    if (step[SolicitationStepFields.IsCurrentStep]) {
        switch (step[EntityWithIdFields.Id]) {
            case SolicitationClassificationStatusTypes.Sent:
                return (
                    <BaseIconWrapper Icon={CheckIcon}
                                     size={iconInBadgeSize}
                                     width={baseIconSize}
                                     height={baseIconSize}
                                     bg={themeColorDefinition.systemFeedback.accent.strong}
                                     color={themeColorDefinition.UIElements.altTexts.default}
                    />
                );
                
            case SolicitationClassificationStatusTypes.UnderReview:
                return (
                    <WrapperIcons Icon={FileSearchIcon} size={baseIconSize} />
                );
                
            default:
                return <React.Fragment />
        }
    }

    return (
        <Box width={baseIconSize} 
             height={baseIconSize} 
             borderRadius={10}
             sx={{ backgroundColor: themeColorDefinition.UIElements.backgrounds.tertiary }}
        />
    )
}

export default SolicitationFollowUpStepsIcon;