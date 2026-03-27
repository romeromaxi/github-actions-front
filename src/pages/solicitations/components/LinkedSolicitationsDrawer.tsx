import {
    SolicitationSummaryViewDTO,
    SolicitationViewDTO,
    SolicitationViewDTOFields
} from "../../../types/solicitations/solicitationData";
import {Alert, Skeleton, Stack} from "@mui/material";
import React, {useCallback, useEffect, useState} from "react";
import {HttpSolicitation} from "../../../http";
import {EntityWithIdFields} from "../../../types/baseEntities";
import SolicitationRelatedOffererCompanySummary from "./SolicitationRelatedOffererCompanySummary";
import DrawerBase from "../../../components/misc/DrawerBase";


interface LinkedSolicitationsDrawerProps {
    open: boolean,
    onClose: () => void,
    solicitation: SolicitationViewDTO
}


const LinkedSolicitationsDrawer = ({open, onClose, solicitation} : LinkedSolicitationsDrawerProps) => {
    const [solicitations, setSolicitations] = useState<
        SolicitationSummaryViewDTO[]
    >([]);

    const loadSolicitations = useCallback(() => {
        HttpSolicitation.getByOffererAndCompanyId(solicitation[SolicitationViewDTOFields.OffererId], solicitation[SolicitationViewDTOFields.CompanyId]).then(
            (response) => {
                const filteredSolicitationList = response.filter(
                    (s) =>
                        s[EntityWithIdFields.Id] !== solicitation[EntityWithIdFields.Id],
                );
                setSolicitations(filteredSolicitationList);
            },
        );
    }, []);

    useEffect(() => {
        loadSolicitations();
    }, []);
    
    return (
        <DrawerBase show={open}
                    onCloseDrawer={onClose}
                    title={'Solicitudes vinculadas'}
        >
            <Stack spacing={1}>
                {
                    solicitations ?
                        solicitations.length !== 0 ?
                            solicitations.map((s, idx) => (
                                <SolicitationRelatedOffererCompanySummary key={`solicitationRelatedOffererCompanySummary_${idx}`}
                                                                          solicitation={s}
                                                                          fromCompany
                                />
                            ))
                            :
                            <Alert severity={'info'}>Esta solicitud no tiene otras solicitudes vinculadas</Alert>
                        :
                        Array.from({ length: 3 }).map((_, idx) => (
                            <Skeleton key={`solicitationRelatedOffererCompany_${idx}`} variant={'text'} />
                        ))
                }
            </Stack>
        </DrawerBase>
    )
}


export default LinkedSolicitationsDrawer