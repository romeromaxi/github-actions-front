import { Card, CardContent, CardHeader, Grid, Skeleton } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { SolicitationSummaryViewDTO } from 'types/solicitations/solicitationData';
import { RefreshIconButton } from 'components/buttons/Buttons';
import { HttpSolicitation } from 'http/index';
import { EntityWithIdFields } from 'types/baseEntities';
import {useSolicitation} from "../../../../hooks/contexts/SolicitationsContext";
import PymeCurrentSolicitationsInOfferer
  from "../../../../pages/offerer/components/OffererSolicitation/PymeCurrentSolicitationsInOfferer";

interface OffererPymeCurrentSolicitationsProps {
  offererId: number;
  companyId: number;
}

const OffererPymeCurrentSolicitations = ({
  offererId,
  companyId
}: OffererPymeCurrentSolicitationsProps) => {
  const { solicitation } = useSolicitation();
  const [solicitations, setSolicitations] = useState<
    SolicitationSummaryViewDTO[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadSolicitations = useCallback(() => {
    if (!!solicitation) {
      setLoading(true);
      HttpSolicitation.getByOffererAndCompanyId(offererId, companyId).then(
        (response) => {
          const filteredSolicitationList = response.filter(
            (s) =>
              s[EntityWithIdFields.Id] !== solicitation[EntityWithIdFields.Id],
          );
          setSolicitations(filteredSolicitationList);
          setLoading(false);
        },
      );
    } else {
      setSolicitations([]);
    }
  }, [solicitation, offererId, companyId]);

  useEffect(() => {
    if (solicitation) loadSolicitations();
  }, [solicitation, loadSolicitations]);

  return (
    <>
      <Card>
        <CardHeader
          title={'Solicitudes vinculadas'}
          subheader={
            solicitations &&
            `${solicitations.length} solicitudes más fueron recibidas`
          }
          action={
            <RefreshIconButton onClick={loadSolicitations} sx={{ mt: 1 }} />
          }
        />
        <CardContent>
          {!loading ? (
            <PymeCurrentSolicitationsInOfferer
              solicitations={solicitations}
            />
          ) : (
            <Grid container spacing={1} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Skeleton width="100%" />
              </Grid>
              <Grid item xs={12}>
                <Skeleton width="100%" />
              </Grid>
              <Grid item xs={12}>
                <Skeleton width="100%" />
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default OffererPymeCurrentSolicitations;
