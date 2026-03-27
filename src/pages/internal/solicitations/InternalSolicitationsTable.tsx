import React from "react";
import {EntityListWithPagination, EntityWithIdFields} from "types/baseEntities";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {Card, CardContent, Stack, Typography} from "@mui/material";
import {ITableColumn, TableWithPaging} from "components/table";
import {stringFormatter} from "util/formatters/stringFormatter";
import {useNavigate} from "react-router-dom";
import CardItemsNotFound from "components/cards/CardItemsNotFound";
import {CompanyLogoById} from "../../company/components/CompanyLogo";
import SolicitationOffererStatusChip, {
    SolicitationCompanyStatusChip
} from "../../offerer/components/OffererSolicitation/SolicitationOffererStatusChip";
import {dateFormatter} from "../../../util/formatters/dateFormatter";
import {TypographyBase} from "../../../components/misc/TypographyBase";
import {NextButton} from "../../../components/buttons/Buttons";
import InternalSolicitationChildrenWrapped from "./components/InternalSolicitationChildrenWrapped";
import {PersonTypes} from "../../../types/person/personEnums";


interface InternalSolicitationsTableProps {
    solicitations?: EntityListWithPagination<SolicitationViewDTO>,
    loading: boolean,
    onPaging: (page: number) => void,
}


const InternalSolicitationsTable = ({solicitations, loading, onPaging} : InternalSolicitationsTableProps) => {
    const navigate = useNavigate()

    const columns: ITableColumn[] = [
        { 
            label: 'ID',
            value: EntityWithIdFields.Id,
            getCollapsable: (solicitation: SolicitationViewDTO) => (
                solicitation[SolicitationViewDTOFields.HasAssociatedSolicitations] ?
                    <InternalSolicitationChildrenWrapped solicitationId={solicitation[EntityWithIdFields.Id]} />
                    :
                    undefined
            )
        },
        {
            label: 'Empresa', textAlign: 'left',
            onRenderCell: (solicitation: SolicitationViewDTO) => (
                <Stack direction='row' alignItems='center' spacing={2}>
                    <CompanyLogoById companyId={solicitation[SolicitationViewDTOFields.CompanyId]}
                                     isPhysicalPerson={solicitation[SolicitationViewDTOFields.CompanyPersonTypeCode] === PersonTypes.Physical}
                    />
                    <Stack overflow='hidden'>
                        <TypographyBase tooltip maxLines={2}>
                            {solicitation[SolicitationViewDTOFields.CompanyBusinessName]}
                        </TypographyBase>
                        <Typography variant='caption' color={'text.lighter'}>
                            {stringFormatter.formatCuit(solicitation[SolicitationViewDTOFields.CompanyCUIT])}
                        </Typography>
                    </Stack>
                </Stack>
            )
        },
        {
            label: 'Línea', textAlign: 'left',
            onRenderCell: (solicitation: SolicitationViewDTO) => (
                <Stack alignItems={'start'} justifyContent={'center'}>
                    <TypographyBase  fontWeight={'400 !important'} color={'text.lighter'} tooltip maxLines={2}>
                        {solicitation[SolicitationViewDTOFields.OffererBusinessName]}
                    </TypographyBase>

                    <TypographyBase variant={'caption'} fontWeight={500} tooltip maxLines={2}>
                        {solicitation[SolicitationViewDTOFields.LineDesc]}
                    </TypographyBase>
                </Stack>
            )
        },
        {
            label: 'Estado Empresa',
            value: SolicitationViewDTOFields.CompanyLastModified,
            helperTooltip: 'Fecha de ingreso al estado',
            onRenderCell: (solicitation: SolicitationViewDTO) => (
                <Stack spacing={1} width={'100%'}>
                    <SolicitationCompanyStatusChip
                        label={
                            solicitation[
                                SolicitationViewDTOFields.CompanySolicitationStatusTypeDesc
                                ] || '-'
                        }
                        statusCode={
                            solicitation[
                                SolicitationViewDTOFields.CompanySolicitationStatusTypeCode
                                ]
                        }
                        alertType={solicitation[SolicitationViewDTOFields.AlertTypeCode]}
                        small
                        sx={{width: '100% !important'}}
                    />
                    <TypographyBase fontWeight={'400 !important'} color={'text.lighter'} textAlign={'center'}>
                        {dateFormatter.toShortDate(solicitation[SolicitationViewDTOFields.CompanyLastModified])}
                    </TypographyBase>
                </Stack>
            )
        },
        {
            label: 'Estado Oferente',
            value: SolicitationViewDTOFields.OffererLastModified,
            helperTooltip: 'Fecha de ingreso al estado',
            onRenderCell: (solicitation: SolicitationViewDTO) => (
                <Stack spacing={1} width={'100%'}>
                    <SolicitationOffererStatusChip
                        label={
                            solicitation[
                                SolicitationViewDTOFields.OffererSolicitationStatusTypeDesc
                                ] || '-'
                        }
                        statusCode={
                            solicitation[
                                SolicitationViewDTOFields.OffererSolicitationStatusTypeCode
                                ]
                        }
                        alertType={solicitation[SolicitationViewDTOFields.AlertTypeCode]}
                        small
                        sx={{width: '100% !important'}}
                    />
                    <Typography fontWeight={'400 !important'} color={'text.lighter'} textAlign={'center'}>
                        {dateFormatter.toShortDate(solicitation[SolicitationViewDTOFields.OffererLastModified])}
                    </Typography>
                </Stack>
            )
        },
        {
            label: '',
            onRenderCell: (solicitation: SolicitationViewDTO) => (
                    <NextButton
                        size={'small'} variant={'contained'}
                        onClick={() =>
                            navigate(
                                `/internal/solicitations/${solicitation[EntityWithIdFields.Id]}`,
                            )
                        }
                    >Ingresar</NextButton>
            ),
        }
    ];



    return (
        loading || solicitations?.lista.length !== 0 ?
            <TableWithPaging title={'Solicitudes'}
                             onPaging={onPaging}
                             isLoading={loading}
                             entityPaginada={solicitations}
                             error={false}
                             columns={columns}
                             onRowClick={(solicitation) =>
                                 navigate(
                                     `/internal/solicitations/${solicitation[EntityWithIdFields.Id]}`,
                             )}
            />
            :
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <CardItemsNotFound title={'Todavía no hay solicitudes enviadas'} />
                    </Stack>
                </CardContent>
            </Card>
    )
}


export default InternalSolicitationsTable