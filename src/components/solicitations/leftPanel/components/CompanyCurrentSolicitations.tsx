import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useSolicitation} from "hooks/contexts/SolicitationsContext";
import {
    SolicitationViewDTOFields,
    SolicitationSummaryFields,
    SolicitationViewDTO
} from "types/solicitations/solicitationData";
import {HttpSolicitation} from "http/index";
import {EntityWithIdFields} from "types/baseEntities";
import {Collapse, Stack, Button} from "@mui/material";
import SolicitationCard from "pages/markets/solicitations/components/SolicitationCard";
import {TypographyBase} from "components/misc/TypographyBase";

const MAX_VISIBLE = 3;

const sortByLastModifiedDesc = (a: SolicitationViewDTO, b: SolicitationViewDTO) => {
  if (a[SolicitationViewDTOFields.CompanyLastModified] > b[SolicitationViewDTOFields.CompanyLastModified]) return -1;
  if (a[SolicitationViewDTOFields.CompanyLastModified] < b[SolicitationViewDTOFields.CompanyLastModified]) return 1;
  return 0;
}

const CompanyCurrentSolicitations = () => {
    const { solicitation } = useSolicitation();
    const [solicitations, setSolicitations] = useState<
        any[]
    >([]);
    const [expanded, setExpanded] = useState(false);

    const loadSolicitations = useCallback(() => {
        if (!!solicitation) {
            HttpSolicitation.getByOffererAndCompanyId(
                solicitation[SolicitationViewDTOFields.OffererId],
                solicitation[SolicitationViewDTOFields.CompanyId]
            ).then(
                (response) => {
                    const filteredSolicitationList = response.filter(
                        (s) =>
                            s[EntityWithIdFields.Id] !== solicitation[EntityWithIdFields.Id],
                    );
                    const mappedSolicitations = filteredSolicitationList.map(s => ({
                        ...s,
                        [SolicitationViewDTOFields.CompanySolicitationStatusTypeCode]: s[SolicitationSummaryFields.SolicitationStatusTypeCode],
                        [SolicitationViewDTOFields.CompanySolicitationStatusTypeDesc]: s[SolicitationSummaryFields.SolicitationStatusTypeDesc],
                        [SolicitationViewDTOFields.CompanyLastModified]: s[SolicitationSummaryFields.LastModifyDate]
                    }));
                    setSolicitations(mappedSolicitations.sort(sortByLastModifiedDesc));
                },
            );
        } else {
            setSolicitations([]);
        }
    }, [solicitation]);

    useEffect(() => {
        if (solicitation) loadSolicitations();
    }, [solicitation, loadSolicitations]);

    const hasMore = useMemo(() => solicitations.length > MAX_VISIBLE, [solicitations]);

    if (!solicitations || solicitations.length === 0) {
        return <></>;
    }

    return (
        <Stack spacing={4.5}>
            <TypographyBase variant="h3">
                Otras solicitudes con esta entidad
            </TypographyBase>
            <Stack spacing={1.25}>
                {solicitations.slice(0, MAX_VISIBLE).map((s, idx) => (
                    <SolicitationCard
                        key={`linkedSolicitation_${idx}`}
                        solicitation={s}
                        selectedIds={[]}
                        onToggleSelection={() => {}}
                        onReloadSolicitations={() => {}}
                        isMinimalActions
                    />
                ))}

                {hasMore && (
                    <Collapse in={expanded}>
                        <Stack spacing={1.25}>
                            {solicitations.slice(MAX_VISIBLE).map((s, idx) => (
                                <SolicitationCard
                                    key={`linkedSolicitation_more_${idx}`}
                                    solicitation={s}
                                    selectedIds={[]}
                                    onToggleSelection={() => {}}
                                    onReloadSolicitations={() => {}}
                                    isMinimalActions
                                />
                            ))}
                        </Stack>
                    </Collapse>
                )}

                {hasMore && (
                    <Button variant="text" fullWidth onClick={() => setExpanded(!expanded)}>
                        {expanded ? 'Ver menos' : 'Ver más'}
                    </Button>
                )}
            </Stack>
        </Stack>
    );
}


export default CompanyCurrentSolicitations