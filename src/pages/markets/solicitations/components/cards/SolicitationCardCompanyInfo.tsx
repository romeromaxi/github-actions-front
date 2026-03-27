import React from "react";
import {Stack} from "@mui/material";
import {CompanyLogoById} from "pages/company/components/CompanyLogo";
import {SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {PersonTypes} from "types/person/personEnums";
import {TypographyBase} from "components/misc/TypographyBase";

interface SolicitationCardCompanyInfoProps {
    solicitation: any;
}

function SolicitationCardCompanyInfo({solicitation}: SolicitationCardCompanyInfoProps) {
    const companyId = solicitation[SolicitationViewDTOFields.CompanyId];
    const companyBusinessName = solicitation[SolicitationViewDTOFields.CompanyBusinessName];
    
    return (
        <Stack direction='row' alignItems='center' spacing={2} sx={{ width: '100%', overflow: 'hidden' }}>
            <CompanyLogoById
                companyId={companyId}
                isPhysicalPerson={solicitation[SolicitationViewDTOFields.CompanyPersonTypeCode] === PersonTypes.Physical}
                size={'sm'}
            />
            <TypographyBase fontWeight={600} fontSize={16} tooltip maxLines={1}>
                {companyBusinessName}
            </TypographyBase>
        </Stack>
    )
}

export default SolicitationCardCompanyInfo;