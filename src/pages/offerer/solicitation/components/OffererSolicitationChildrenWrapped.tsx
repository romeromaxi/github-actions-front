import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Stack, Typography} from "@mui/material";
import {SolicitationViewDTO, SolicitationViewDTOFields} from "types/solicitations/solicitationData";
import {HttpSolicitation} from "http/solicitations";
import {ITableColumn, TableColumnType, TableList} from "components/table";
import SolicitationOffererStatusChip from "../../components/OffererSolicitation/SolicitationOffererStatusChip";
import {EntityWithIdFields} from "types/baseEntities";
import {TypographyBase} from "components/misc/TypographyBase";
import {NextButton} from "components/buttons/Buttons";


interface OffererSolicitationChildrenWrappedProps {
    solicitationId: number;
    offererId: number;
}


const OffererSolicitationChildrenWrapped = ({solicitationId, offererId} : OffererSolicitationChildrenWrappedProps) => {
    const [childrenSolicitations, setChildrenSolicitations] = useState<SolicitationViewDTO[]>()
    const [error, setError] = useState<boolean>(false)
    const navigate = useNavigate()
    
    useEffect(() => {
        HttpSolicitation.getAssociates(solicitationId)
            .then(setChildrenSolicitations)
            .catch(() => setError(true))
    }, []);

    const columns: ITableColumn[] = [
        {
            label: 'Estado', width: '10%',
            minPadding: true,
            onRenderCell: (solicitation: SolicitationViewDTO) => (
                <SolicitationOffererStatusChip
                    label={solicitation[SolicitationViewDTOFields.OffererSolicitationStatusLabelDesc]}
                    statusCode={solicitation[SolicitationViewDTOFields.OffererSolicitationStatusTypeCode]}
                    alertType={solicitation[SolicitationViewDTOFields.AlertTypeCode]}
                    small
                />
            )
        },
        { 
            label: 'Línea', value: SolicitationViewDTOFields.LineDesc, textAlign: 'left', minPadding: true,
            onRenderCell: (solicitation: SolicitationViewDTO) =>
                <Stack alignItems={'start'} justifyContent={'center'}>
                    {
                        offererId !== solicitation[SolicitationViewDTOFields.OffererId] &&
                        <TypographyBase variant={'caption'} color={'text.disabled'}
                                        fontWeight={400}
                                        tooltip maxLines={2}>
                            {solicitation[SolicitationViewDTOFields.OffererBusinessName]}
                        </TypographyBase>
                    }

                    <TypographyBase variant={'caption'} fontWeight={500} tooltip maxLines={2}>
                        {solicitation[SolicitationViewDTOFields.LineDesc]}
                    </TypographyBase>
                </Stack>
        },
        { label: 'Fecha', value: SolicitationViewDTOFields.OffererLastModified, type: TableColumnType.Date, minPadding: true,},
        {
            label: 'Responsable Asignado', value: SolicitationViewDTOFields.StageResponsibleUserName, minPadding: true,
            onRenderCell: (solicitation: SolicitationViewDTO) => <Typography>{solicitation[SolicitationViewDTOFields.StageResponsibleUserName] ?? '-'}</Typography>
        },
        { label: 'ID', value: EntityWithIdFields.Id, minPadding: true },
        {
            label: '', minPadding: true, width: '10%',
            onRenderCell: (solicitation: SolicitationViewDTO) => (
                <NextButton
                    size={'small'} variant={'contained'}
                    onClick={() => navigate(`/offerer/solicitations/${solicitation[EntityWithIdFields.Id]}`)}
                >
                    Ingresar
                </NextButton>
            ),
        },
    ];
    
    return (
        <TableList variant={'basic-style-without-boderY'}
                   entityList={childrenSolicitations}
                   columns={columns}
                   isLoading={!childrenSolicitations}
                   error={error}
                   hideColumnName
                   onRowClick={(solicitation) =>
                       navigate(`/offerer/solicitations/${solicitation[EntityWithIdFields.Id]}`)}
        />
    )
}


export default OffererSolicitationChildrenWrapped