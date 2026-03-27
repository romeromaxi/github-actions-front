import {useMemo} from "react";
import {Chip} from "@mui/material";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {SolicitationClassificationStatusColorMap} from "util/typification/solicitationStatesColor";
import {WrapperIcons} from "components/icons/Icons";
import {
    BanIcon, ClockIcon, FileCheck2Icon, FileSearchIcon
} from "lucide-react";
import {SolicitationClassificationStatusType} from "types/solicitations/solicitationEnums";

interface SolicitationTableStatusClassificationOffererChipProps {
    solicitation: SolicitationViewDTO;
}

function SolicitationTableStatusClassificationOffererChip({solicitation}: SolicitationTableStatusClassificationOffererChipProps) {
    const statusCode = solicitation[SolicitationViewDTOFields.OffererSolicitationClassificationStatusCode] as SolicitationClassificationStatusType;
    const statusColor = SolicitationClassificationStatusColorMap?.[statusCode] || SolicitationClassificationStatusColorMap[SolicitationClassificationStatusType.Received];

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

            default:
                return undefined;
        }
    }, [statusCode]);

    return (
        <Chip variant={"status-solicitation" as any}
              label={solicitation[SolicitationViewDTOFields.OffererSolicitationClassificationStatusDesc]}
              icon={StatusIcon ? <WrapperIcons Icon={StatusIcon} color={statusColor?.dark} size={"sm"}/> : undefined}
              sx={{
                  backgroundColor: `${statusColor?.light} !important`,
                  color: `${statusColor?.dark} !important`,
                  boxShadow: `inset 0 0 0 1px ${statusColor?.dark}`,
              }}
        />
    );
}

export default SolicitationTableStatusClassificationOffererChip;

