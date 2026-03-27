import {ITableColumn, TableList} from "../../../../components/table";
import React, {useEffect, useState} from "react";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "../../../../types/solicitations/solicitationData";
import {useNavigate} from "react-router-dom";
import {HttpSolicitation} from "../../../../http";
import {EntityWithIdFields} from "../../../../types/baseEntities";
import {Box, Stack, Typography} from "@mui/material";
import {TypographyBase} from "../../../../components/misc/TypographyBase";
import SolicitationOffererStatusChip, {
    SolicitationCompanyStatusChip
} from "../../../offerer/components/OffererSolicitation/SolicitationOffererStatusChip";
import {dateFormatter} from "../../../../util/formatters/dateFormatter";
import {NextButton} from "../../../../components/buttons/Buttons";
import {SolicitationTypes} from "../../../../types/solicitations/solicitationEnums";


interface InternalSolicitationChildrenWrappedProps {
    solicitationId: number;
}


const InternalSolicitationChildrenWrapped = ({solicitationId} : InternalSolicitationChildrenWrappedProps) => {
    const [childrenSolicitations, setChildrenSolicitations] = useState<SolicitationViewDTO[]>()
    const [error, setError] = useState<boolean>(false)
    const navigate = useNavigate()

    const columns: ITableColumn[] = [
        { label: 'ID', value: EntityWithIdFields.Id },
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
            onRenderCell: (solicitation: SolicitationViewDTO) => (
                (solicitation[SolicitationViewDTOFields.SolicitationTypeCode] === SolicitationTypes.BetweenOfferers) ?
                    <Box minWidth={'5rem'}>-</Box>
                    :
                    <Stack spacing={1} width={'100%'}>
                        <SolicitationCompanyStatusChip
                            label={solicitation[SolicitationViewDTOFields.CompanySolicitationStatusTypeDesc] || '-'}
                            statusCode={solicitation[SolicitationViewDTOFields.CompanySolicitationStatusTypeCode]}
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
    
    useEffect(() => {
        HttpSolicitation.getAssociates(solicitationId)
            .then(setChildrenSolicitations)
            .catch(() => setError(true))
    }, []);
    
    
    return (
        <TableList variant={'basic-style-without-boderY'}
                   entityList={childrenSolicitations}
                   columns={columns}
                   isLoading={!childrenSolicitations}
                   error={error}
                   hideColumnName
                   onRowClick={(solicitation) =>
                       navigate(
                           `/internal/solicitations/${solicitation[EntityWithIdFields.Id]}`,
                       )}
        />
    )
}


export default InternalSolicitationChildrenWrapped