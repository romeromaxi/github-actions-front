import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  SolicitationTotalsView,
  SolicitationTotalsViewFields,
} from '../../../types/solicitations/solicitationData';
import { Alert } from '@mui/lab';
import { EntityWithIdAndDescriptionFields } from '../../../types/baseEntities';

interface CompanyActiveSolicitationsSummaryProps {
  solicitations: SolicitationTotalsView[];
}

const CompanyActiveSolicitationsSummary = ({
  solicitations,
}: CompanyActiveSolicitationsSummaryProps) => {
  const getSolicitationsQuantity = (
    solicitations: SolicitationTotalsView[],
  ) => {
    let qty = 0;

    solicitations.forEach((e) => {
      qty += e[SolicitationTotalsViewFields.SolicitationsQuantity];
    });

    return qty;
  };

  return (
    <>
      {solicitations.length !== 0 ? (
        <Card sx={{ height: '20rem' }}>
          <CardHeader
            title={
              <Typography fontSize={36} fontWeight={600}>
                {getSolicitationsQuantity(solicitations)}
              </Typography>
            }
            subheader={'Solicitudes vigentes'}
            sx={{ paddingBottom: 2 }}
          />
          <CardContent>
            <Stack spacing={1}>
              {solicitations.map((sol) => (
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <Typography fontWeight={600}>
                    {sol[EntityWithIdAndDescriptionFields.Description]}
                  </Typography>
                  <Typography fontWeight={600} color={'#7e8299'}>
                    {sol[SolicitationTotalsViewFields.SolicitationsQuantity]}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ height: '20rem' }}>
          <CardHeader
            title={
              <Typography fontSize={36} fontWeight={600}>
                0
              </Typography>
            }
            subheader={'Solicitudes vigentes'}
            sx={{ paddingBottom: 2 }}
          />
          <CardContent>
            <Box sx={{ width: '100%', marginTop: 4.5 }}>
              <Alert severity="info">
                Al parecer no se han encontrado solicitudes
              </Alert>
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CompanyActiveSolicitationsSummary;
