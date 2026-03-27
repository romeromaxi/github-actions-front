import {useMemo} from "react";
import {Chip} from "@mui/material";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {SolicitationStatusType} from "types/solicitations/solicitationEnums";
import {SolicitationStatusColorMap} from "util/typification/solicitationStatesColor";
import {WrapperIcons} from "components/icons/Icons";
import { BanIcon, ClockIcon, FileCheck2Icon, FileSearchIcon, SendIcon } from "lucide-react"

interface SolicitationTableStatusCompanyChipProps {
    solicitation: SolicitationViewDTO
}

function SolicitationTableStatusCompanyChip({ solicitation }: SolicitationTableStatusCompanyChipProps) {
    const statusCode = solicitation[SolicitationViewDTOFields.CompanySolicitationStatusTypeCode] as SolicitationStatusType;
    const statusColor = SolicitationStatusColorMap[statusCode];
    
    const StatusIcon = useMemo(() => {
        switch (statusCode) {
            case SolicitationStatusType.ReadyToSend:
                return ClockIcon;
            
            case SolicitationStatusType.GeneralCompanySent:
            case SolicitationStatusType.AssistedSearchCompanySent:
            case SolicitationStatusType.OrienteerCompanySent:
                return SendIcon;

            case SolicitationStatusType.GeneralCompanyCancelled:
            case SolicitationStatusType.GeneralCompanyExpired:
            case SolicitationStatusType.GeneralCompanyNotAdmitted:
            case SolicitationStatusType.AssistedSearchCompanyNotAdmitted:
            case SolicitationStatusType.AssistedSearchCompanyCancelled:
            case SolicitationStatusType.OrienteerCompanyNotAdmitted:
            case SolicitationStatusType.OrienteerCompanyCancelled:
                return BanIcon;
                
            case SolicitationStatusType.GeneralCompanyUnderReview:
            case SolicitationStatusType.GeneralCompanyAdmissionDerivation:
            case SolicitationStatusType.AssistedSearchCompanyInProgress:
            case SolicitationStatusType.OrienteerCompanyInProgress:
                return FileSearchIcon;
            
            case SolicitationStatusType.GeneralCompanyProposed:
            case SolicitationStatusType.AssistedSearchCompanyCompleted:
            case SolicitationStatusType.OrienteerCompanyCompleted:
                return FileCheck2Icon;

            default:
                return undefined
        }
    }, [statusCode]);
    
    return (
        <Chip variant={'status-solicitation'}
              label={solicitation[SolicitationViewDTOFields.CompanySolicitationStatusTypeDesc]} 
              icon={StatusIcon ? <WrapperIcons Icon={StatusIcon} color={statusColor?.text} size={'sm'} /> : undefined}
              sx={{
                  backgroundColor: `${statusColor?.background} !important`,
                  color: `${statusColor?.text} !important`,
                  boxShadow: `inset 0 0 0 1px ${statusColor?.text}`,
              }}
        />
    )
}

export default SolicitationTableStatusCompanyChip;