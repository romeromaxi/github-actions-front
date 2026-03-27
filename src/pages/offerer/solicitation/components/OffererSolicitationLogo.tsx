import React, {useMemo} from "react";
import {
    borderRadiusMap,
    CompanyLogo,
    CompanyLogoById,
    SizeCompanyLogo,
} from "../../../company/components/CompanyLogo";
import OffererLogo, {OffererLogoWithCompanyLogo} from "../../components/OffererLogo";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {PersonTypes} from "types/person/personEnums";
import {SolicitationTypes} from "types/solicitations/solicitationEnums";

interface OffererSolicitationLogoProps {
    solicitation: SolicitationViewDTO | undefined,
    userOffererId: number,
    isLoading?: boolean,
    size?: SizeCompanyLogo,
    badgeSize?: SizeCompanyLogo
}

function OffererSolicitationLogo({ isLoading = false, solicitation, userOffererId, size = 'md', badgeSize = 'sm' }: OffererSolicitationLogoProps) {

    const borderRadiusBySize = useMemo(() => {
        if (typeof size === 'number') {
            return  `${borderRadiusMap['md']} !important`
        }

        return `${borderRadiusMap[size]} !important`
    }, [size]);
    
    if (isLoading || !solicitation)
        return (
            <CompanyLogo loading />
        )

    const offererBase = solicitation[SolicitationViewDTOFields.OffererId] === userOffererId;
    const betweenOfferers = solicitation[SolicitationViewDTOFields.SolicitationTypeCode] === SolicitationTypes.BetweenOfferers;

    if (betweenOfferers)
        return (
            <OffererLogo offererUrlLogo={offererBase ? solicitation[SolicitationViewDTOFields.IntermediaryOffererUrlLogo] : solicitation[SolicitationViewDTOFields.OffererUrlLogo]}
                         size={size}
                         sx={{ borderRadius: borderRadiusBySize, backgroundColor: 'white' }}
            />
        )

    if (!!solicitation[SolicitationViewDTOFields.IntermediaryOffererUrlLogo])
        return (
            <OffererLogoWithCompanyLogo
                offererLogoProps={{
                    offererUrlLogo: solicitation?.[SolicitationViewDTOFields.IntermediaryOffererUrlLogo],
                    size: size,
                    sx: { borderRadius: borderRadiusBySize,  }
                }}
                companyLogoProps={{
                    companyId: solicitation?.[SolicitationViewDTOFields.CompanyId],
                    isPhysicalPerson: solicitation?.[SolicitationViewDTOFields.CompanyPersonTypeCode] === PersonTypes.Physical,
                    size: badgeSize
                }}
            />
        )

    return (
        <CompanyLogoById companyId={solicitation?.[SolicitationViewDTOFields.CompanyId]}
                         isPhysicalPerson={solicitation?.[SolicitationViewDTOFields.CompanyPersonTypeCode] === PersonTypes.Physical}
                         size={size}
        />
    )
}

export default OffererSolicitationLogo;