import {
    SolicitationSharedViewDTO,
    SolicitationSharedViewDTOFields
} from "../../../types/solicitations/solicitationData";
import React from "react";
import {Chip, Stack} from "@mui/material";
import {DataWithLabel} from "../../../components/misc/DataWithLabel";
import {dateFormatter} from "../../../util/formatters/dateFormatter";
import {stringFormatter} from "../../../util/formatters/stringFormatter";
import {TypographyBase} from "../../../components/misc/TypographyBase";


interface SharedSolicitationGuidHeaderProps {
    solicitation: SolicitationSharedViewDTO
}


const SharedSolicitationGuidHeader = ({solicitation} : SharedSolicitationGuidHeaderProps) => {

    return (
        <Stack spacing={1}>
            <Chip label={solicitation[SolicitationSharedViewDTOFields.ProductDesc]} color={'default'} size={'small'} />
            <TypographyBase variant={'body2'} fontWeight={500} tooltip maxLines={1}>
                {solicitation[SolicitationSharedViewDTOFields.ProductLineDesc]}
            </TypographyBase>
            <TypographyBase variant={'caption'} fontWeight={500} tooltip maxLines={1} color={'text.lighter'}>
                {solicitation[SolicitationSharedViewDTOFields.ProductLineLongDesc]}
            </TypographyBase>
            <DataWithLabel label={'Fecha de Alta'} 
                           data={dateFormatter.toShortDate(solicitation[SolicitationSharedViewDTOFields.StartDate],)} 
                           rowDirection
            />
            <DataWithLabel label={'Oferente'} data={
                <TypographyBase variant={'body2'} fontWeight={500} tooltip maxLines={1}>
                    {solicitation[SolicitationSharedViewDTOFields.BusinessNameOfferer]}
                </TypographyBase>
            } rowDirection />
            <DataWithLabel label={'Empresa'} data={<TypographyBase variant={'body2'} fontWeight={500} tooltip maxLines={1}>
                {solicitation[SolicitationSharedViewDTOFields.BusinessNameCompany]}
            </TypographyBase>} rowDirection />
            <DataWithLabel label={'CUIT de la Empresa'} data={stringFormatter.formatCuit(solicitation[SolicitationSharedViewDTOFields.CompanyCuit])} rowDirection />
        </Stack>
    );
}


export default SharedSolicitationGuidHeader