import React, {useEffect, useState} from "react";
import {Skeleton} from "@mui/lab";
import {Divider, Stack, Tooltip} from "@mui/material";
import {SolicitationCompanyDataHeaderContainer, SolicitationCompanyDataHeaderContainerFields, SolicitationViewDTO} from "types/solicitations/solicitationData";
import {CompanyLogoById} from "../../../../company/components/CompanyLogo";
import {
    SolicitationCompanyDataHeader,
    SolicitationCompanyDataHeaderFields,
    SolicitationViewDTOFields
} from "types/solicitations/solicitationData";
import {PersonTypes} from "types/person/personEnums";
import {TypographyBase} from "components/misc/TypographyBase";
import {stringFormatter} from "util/formatters/stringFormatter";
import {themeColorDefinition} from "util/themes/definitions";

interface OffererSolicitationCompanyDataHeaderComponentProps {
    solicitation?: SolicitationViewDTO,
    headerContainer?: SolicitationCompanyDataHeaderContainer,
    actions?: React.ReactNode,
    children?: React.ReactNode,
}

function OffererSolicitationCompanyDataHeaderComponent({ solicitation, headerContainer, actions, children }: OffererSolicitationCompanyDataHeaderComponentProps) {

    const [dataCompanyHeaders, setDataCompanyHeaders] = useState<{
        common: SolicitationCompanyDataHeader[],
        highlighted: SolicitationCompanyDataHeader[]
    }>();
    
    useEffect(() => {
        if (!!headerContainer) {
            const dataHeaders = headerContainer[SolicitationCompanyDataHeaderContainerFields.DataHeaders] || [];

            setDataCompanyHeaders({
                common: dataHeaders.filter(x =>
                    !x[SolicitationCompanyDataHeaderFields.IsHighlighted] &&
                    !!x[SolicitationCompanyDataHeaderFields.Value]
                ),
                highlighted: dataHeaders.filter(x =>
                    x[SolicitationCompanyDataHeaderFields.IsHighlighted]
                )
            })
        }
    }, [headerContainer]);
    
    if (!solicitation)
        return null;
    
    return (
        <Stack spacing={2}>
            <Stack direction={{ xs: 'column-reverse', md: "row" }}
                   justifyContent={'space-between'}
                   alignItems={{ xs: 'start', md: 'center' }}
                   spacing={1}
            >
                <Stack direction={"row"} spacing={2} alignItems={'center'}>
                    <CompanyLogoById companyId={solicitation[SolicitationViewDTOFields.CompanyId]}
                                     isPhysicalPerson={solicitation[SolicitationViewDTOFields.CompanyPersonTypeCode] === PersonTypes.Physical}
                                     size={'lg'}
                    />

                    <Stack spacing={0.25}>
                        <TypographyBase variant={'button1'} tooltip maxLines={2}>
                            {solicitation[SolicitationViewDTOFields.CompanyBusinessName]}
                        </TypographyBase>
                        <TypographyBase variant={'body3'} color={'text.lighter'}>
                            {stringFormatter.formatCuit(solicitation[SolicitationViewDTOFields.CompanyCUIT])}
                        </TypographyBase>
                    </Stack>
                </Stack>

                { !!actions && actions }
                {/*<Button variant={'text'}
                        color={'primary'}
                        size={'small'}
                        endIcon={<ExternalLinkIcon />}
                        minPadding
                >
                    Ir a detalle de la PyME
                </Button>*/}
            </Stack>

            {
                !dataCompanyHeaders ?
                    <Skeleton />
                    :
                    dataCompanyHeaders.common.length ?
                        <TypographyBase variant={'body3'}
                                        color={'text.lighter'}>
                            {
                                dataCompanyHeaders.common.map((d, idx) => (
                                    <React.Fragment>
                                        <Tooltip title={(d[SolicitationCompanyDataHeaderFields.Value] || '').length > 50 ? d[SolicitationCompanyDataHeaderFields.Value] : ''}>
                                            <span>{stringFormatter.cutIfHaveMoreThan(d[SolicitationCompanyDataHeaderFields.Value] || null, 50)}</span>
                                        </Tooltip>
                                        {idx < dataCompanyHeaders.common.length - 1 && " • "}
                                    </React.Fragment>
                                ))}
                        </TypographyBase>
                        :
                        <React.Fragment></React.Fragment>
            }

            {
                (!dataCompanyHeaders || !!dataCompanyHeaders.highlighted.length) &&
                <Divider />
            }

            <Stack direction={{ xs: 'column', md: "row" }}
                   justifyContent={'space-between'}
                   spacing={2}>
                {
                    !dataCompanyHeaders ?
                        Array.from({ length: 4 }).map((_, idx) => (
                            <Stack key={`offererSolicitationCompanyHeaderDataBlockLoading_${idx}`}
                                   width={1}>
                                <Skeleton />
                            </Stack>
                        ))
                        :
                        dataCompanyHeaders.highlighted.length ?
                            dataCompanyHeaders.highlighted.map((d, idx) => (
                                <OffererSolicitationCompanyHeaderDataBlock key={`offererSolicitationCompanyHeaderDataBlock_${idx}`}
                                                                           label={d[SolicitationCompanyDataHeaderFields.Description]}
                                                                           data={d[SolicitationCompanyDataHeaderFields.Value] || '-'}
                                />
                            ))
                            :
                            <React.Fragment></React.Fragment>
                }
            </Stack>

            { !!children && children }
        </Stack>
    )
}

interface OffererSolicitationCompanyHeaderDataBlockProps {
    label: string,
    data: string,
}

function OffererSolicitationCompanyHeaderDataBlock({ label, data }: OffererSolicitationCompanyHeaderDataBlockProps) {
    return (
        <Stack spacing={0.5}
               padding={1.5}
               borderRadius={4}
               sx={{ backgroundColor: themeColorDefinition.UIElements.backgrounds.disabled }}
               width={1}
        >
            <TypographyBase variant={'body2'}>
                {label}
            </TypographyBase>
            <TypographyBase variant={'body1'} fontWeight={600}>
                {data}
            </TypographyBase>
        </Stack>
    )
}

export default OffererSolicitationCompanyDataHeaderComponent;