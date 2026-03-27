import React, {useMemo} from "react";
import {Box} from "@mui/material";
import {EntityWithIdFields} from "types/baseEntities";
import {SolicitationClassificationStatusType} from "types/solicitations/solicitationEnums";
import {BanIcon, CheckIcon, ClockIcon, FileCheck2Icon, FileSearchIcon, XIcon} from "lucide-react";
import {SolicitationStep, SolicitationStepFields} from "types/solicitations/solicitationData";
import {themeColorDefinition} from "util/themes/definitions";
import {WrapperIcons} from "components/icons/Icons";
import {SolicitationClassificationStatusColorMap} from "util/typification/solicitationStatesColor";

interface SolicitationFollowUpStepsDotIconProps {
    step: SolicitationStep,
    active?: boolean;
    completed?: boolean;
}

function SolicitationFollowUpStepsDotIcon({ step, active, completed }: SolicitationFollowUpStepsDotIconProps) {
    const height = '24px';
    const width = '24px';
    const borderRadius = '100px';

    const statusCode = step[EntityWithIdFields.Id] as SolicitationClassificationStatusType;
    const StatusIcon = useMemo(() => {
        switch (statusCode) {
            case SolicitationClassificationStatusType.Received:
            case SolicitationClassificationStatusType.Pending:
            case SolicitationClassificationStatusType.UnderReview:
            case SolicitationClassificationStatusType.ReceivedAssistedSearch:
                return ClockIcon;

            case SolicitationClassificationStatusType.InProgress:
            case SolicitationClassificationStatusType.AssistanceAssistedSearch:
                return FileSearchIcon;

            case SolicitationClassificationStatusType.Proposal:
            case SolicitationClassificationStatusType.TrackingAssistedSearch:
                return FileCheck2Icon;

            case SolicitationClassificationStatusType.Cancelled:
            case SolicitationClassificationStatusType.NotAccepted:
                return BanIcon;
                
            case SolicitationClassificationStatusType.Dismiss:
                return XIcon;

            default:
                return undefined;
        }
    }, [statusCode]);

    if (completed || (step[SolicitationStepFields.IsResultStep] && step[SolicitationStepFields.IsFavorableResult] && active)) {
        return (
            <Box height={height}
                 width={width}
                 borderRadius={borderRadius}
                 textAlign={'center'}
                 sx={{
                     backgroundColor: themeColorDefinition.systemFeedback.success.primary,
                     //boxShadow: `inset 0 0 0 1px ${themeColorDefinition.UIElements.borders.primary}`
                 }}
            >
                <WrapperIcons Icon={CheckIcon} size={'xsm'}
                              color={themeColorDefinition.systemFeedback.success.primaryContrastText}
                />
            </Box>
        );
    }

    if (active) {
        return (
            <Box height={height}
                 width={width}
                 borderRadius={borderRadius}
                 textAlign={'center'}
                 sx={{
                     backgroundColor: SolicitationClassificationStatusColorMap[step[EntityWithIdFields.Id] as SolicitationClassificationStatusType].light,
                     color: `${SolicitationClassificationStatusColorMap[step[EntityWithIdFields.Id] as SolicitationClassificationStatusType].dark} !important`,
                     boxShadow: `inset 0 0 0 1px ${SolicitationClassificationStatusColorMap[step[EntityWithIdFields.Id] as SolicitationClassificationStatusType].dark}`
                 }}
            >
                {
                    StatusIcon &&
                        <WrapperIcons Icon={StatusIcon} size={'xsm'} />
                }
            </Box>
        );
    }

    return (
        <Box height={height}
             width={width}
             borderRadius={borderRadius}
             sx={{
                 backgroundColor: themeColorDefinition.UIElements.borders.tertiary,
                 boxShadow: `inset 0 0 0 1px ${themeColorDefinition.UIElements.borders.primary}`
             }}
        />
    );
}

export default SolicitationFollowUpStepsDotIcon;