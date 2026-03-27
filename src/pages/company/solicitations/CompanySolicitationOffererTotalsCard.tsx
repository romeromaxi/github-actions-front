import React, { useEffect, useState } from 'react';
import {
  SolicitationTotalsView,
  SolicitationTotalsViewFields,
} from '../../../types/solicitations/solicitationData';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import OffererLogo from '../../offerer/components/OffererLogo';
import { Alert } from '@mui/lab';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CompanyOffererLinesStatsDialog from './CompanyOffererLinesStatsDialog';
import { HttpSolicitation } from '../../../http';
import { EntityWithIdAndDescriptionFields } from '../../../types/baseEntities';

interface CompanySolicitationOffererTotalsCardProps {
  companyId: number;
}

function CompanySolicitationOffererTotalsCard({
  companyId,
}: CompanySolicitationOffererTotalsCardProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [statusData, setStatusData] = useState<SolicitationTotalsView[]>();

  useEffect(() => {
    HttpSolicitation.getTotalLinesByOfferer(companyId).then((res) =>
      setStatusData(res),
    );
  }, []);

  const onClose = () => setOpen(false);

  return (
    <Card sx={{ width: 1, height: 1, maxHeight: '400px' }}>
      <CardHeader
        title={
          <Typography
            fontSize={28}
            fontWeight={600}
            color={'rgb(241, 65, 108)'}
          >
            {statusData && statusData.length}
          </Typography>
        }
        subheader={`Cantidad de oferentes contactados`}
      />
      <CardContent>
        <Stack direction={'column'} gap={2}>
          {statusData && statusData.length !== 0 ? (
            <Box sx={{ width: '100%' }}>
              {statusData.slice(0, 3).map((s) => (
                <Stack spacing={1}>
                  <Stack direction={'row'} alignItems={'center'} mt={1} mb={2}>
                    <Grid container alignItems={'center'} spacing={2}>
                      <Grid item xs={3}>
                        <OffererLogo
                          offererId={s[EntityWithIdAndDescriptionFields.Id]}
                          sx={{ width: '7rem', height: '4.5rem' }}
                        />
                      </Grid>
                      <Grid item xs={6.5}>
                        <Typography
                          sx={{
                            textTransform: 'capitalize',
                            textAlign: 'left',
                          }}
                        >
                          {s[EntityWithIdAndDescriptionFields.Description]}
                        </Typography>
                      </Grid>
                      <Grid item xs={2.5}>
                        <Typography fontWeight={600} fontSize={15}>
                          {`${s[SolicitationTotalsViewFields.SolicitationsQuantity] === 1 ? `${s[SolicitationTotalsViewFields.SolicitationsQuantity]} linea` : `${s[SolicitationTotalsViewFields.SolicitationsQuantity]} lineas`}`}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Stack>
                  <Divider sx={{ width: '100%' }} />
                </Stack>
              ))}
              {statusData.length > 3 && (
                <Stack>
                  <Button
                    variant="contained"
                    color={'primary'}
                    size={'small'}
                    startIcon={<SearchRoundedIcon />}
                    onClick={() => {
                      setOpen(true);
                    }}
                    sx={{ padding: '0.5rem !important' }}
                  >
                    Ver todos
                  </Button>
                </Stack>
              )}
              <CompanyOffererLinesStatsDialog
                open={open}
                data={statusData}
                onClose={onClose}
              />
            </Box>
          ) : (
            <Box sx={{ width: '100%' }}>
              <Alert severity={'info'}>
                Aún no se han registrado solicitudes
              </Alert>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default CompanySolicitationOffererTotalsCard;
