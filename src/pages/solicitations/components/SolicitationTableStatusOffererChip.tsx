import {useMemo} from "react";
import {Chip} from "@mui/material";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {WrapperIcons} from "components/icons/Icons";
import {
    BanIcon,
    ClockIcon,
    FileCheck2Icon,
    FileSearchIcon,
    SendIcon,
    CircleDotIcon,
    LoaderIcon, XIcon
} from "lucide-react";
import {SolicitationStatusType} from "types/solicitations/solicitationEnums";
import {SolicitationStatusColorMap} from "util/typification/solicitationStatesColor";

interface SolicitationTableStatusOffererChipProps {
    solicitation: SolicitationViewDTO;
}

function SolicitationTableStatusOffererChip({solicitation}: SolicitationTableStatusOffererChipProps) {
    const statusCode = solicitation[SolicitationViewDTOFields.OffererSolicitationStatusTypeCode] as SolicitationStatusType;
    const statusColor = SolicitationStatusColorMap?.[statusCode] || SolicitationStatusColorMap[SolicitationStatusType.GeneralOffererSolicitationIncoming];

    const StatusIcon = useMemo(() => {
        switch (statusCode) {
            case SolicitationStatusType.GeneralOffererSolicitationIncoming:
            case SolicitationStatusType.GeneralOffererAdmission:
            case SolicitationStatusType.GeneralOffererAdmissionApproval:
            case SolicitationStatusType.AssistedSearchOffererSolicitationIncoming:
            case SolicitationStatusType.BetweenOfferersReception:
            case SolicitationStatusType.BetweenOfferersAwaitingConfirmation:
                return ClockIcon;

            case SolicitationStatusType.GeneralOffererPrequalificationAnalyisis:
                return FileSearchIcon;
                
            case SolicitationStatusType.GeneralOffererPrequalificationApproval:
                return LoaderIcon;

            case SolicitationStatusType.AssistedSearchOffererDerivation:
                return SendIcon
                
            case SolicitationStatusType.GeneralOffererPrequalifieds:
            case SolicitationStatusType.AssistedSearchOffererCompleted:
            case SolicitationStatusType.BetweenOfferersAcceptedDerivation:
                return FileCheck2Icon;
            
            case SolicitationStatusType.GeneralOffererDenied:
            case SolicitationStatusType.GeneralOffererCancelled:
            case SolicitationStatusType.GeneralOffererExpired:
            case SolicitationStatusType.AssistedSearchOffererCancelled:
            case SolicitationStatusType.AssistedSearchOffererUnableDerivation:
            case SolicitationStatusType.BetweenOfferersRejectedDerivation:
                return BanIcon;
                
            case SolicitationStatusType.GeneralOffererDismiss:
                return  XIcon
                
            default:
                return CircleDotIcon;
        }
    }, [statusCode]);

    return (
        <Chip
            variant={"status-solicitation" as any}
            label={solicitation[SolicitationViewDTOFields.OffererSolicitationStatusLabelDesc]}
            icon={StatusIcon ? <WrapperIcons Icon={StatusIcon} color={statusColor?.dark} size={"sm"} /> : undefined}
            sx={{
                backgroundColor: `${statusColor?.light} !important`,
                color: `${statusColor?.dark} !important`,
                boxShadow: `inset 0 0 0 1px ${statusColor?.dark}`,
            }}
        />
    );
}

export default SolicitationTableStatusOffererChip;

