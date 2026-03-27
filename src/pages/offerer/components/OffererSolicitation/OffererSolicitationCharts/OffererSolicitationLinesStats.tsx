import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Alert } from '@mui/lab';
import { stringFormatter } from '../../../../../util/formatters/stringFormatter';
import {
  SolicitationTotalsView,
  SolicitationTotalsViewFields,
} from '../../../../../types/solicitations/solicitationData';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { HttpSolicitation } from '../../../../../http';
import { EntityWithIdAndDescriptionFields } from '../../../../../types/baseEntities';
import OffererLinesDialog from '../../OffererLinesDialog';

interface OffererSolicitationLinesStatsProps {
  offererId: number;
}

const OffererSolicitationLinesStats = ({
  offererId,
}: OffererSolicitationLinesStatsProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const [statusData, setStatusData] = useState<SolicitationTotalsView[]>();

  useEffect(() => {
    HttpSolicitation.getOffererSolicitationsByCompanies(offererId).then((res) =>
      setStatusData(res),
    );
  }, []);

  const onClose = () => setOpen(false);

  const getTotalQuantity = () => {
    let total: number = 0;
    statusData &&
      statusData.length !== 0 &&
      statusData.map(
        (t) => (total += t[SolicitationTotalsViewFields.SolicitationsQuantity]),
      );

    return total;
  };

  return (
    <Card sx={{ width: 1, height: 1, maxHeight: '450px' }}>
      <CardHeader
        title={
          <Typography
            fontSize={28}
            fontWeight={600}
            color={'rgb(241, 65, 108)'}
          >
            {getTotalQuantity()}
          </Typography>
        }
        subheader={'Cantidad de solicitudes asociadas a cada linea'}
      />
      <CardContent>
        {statusData && statusData.length !== 0 ? (
          <Box sx={{ width: '100%' }}>
            {statusData.slice(0, 7).map((line) => (
              <Stack spacing={1} mt={1}>
                <Stack
                  direction={'row'}
                  alignItems={'center'}
                  justifyContent={'space-between'}
                >
                  <Tooltip
                    title={line[EntityWithIdAndDescriptionFields.Description]}
                    placement={'top'}
                  >
                    <Typography fontSize={16} fontWeight={600}>
                      {stringFormatter.cutIfHaveMoreThan(
                        line[EntityWithIdAndDescriptionFields.Description],
                        34,
                      )}
                    </Typography>
                  </Tooltip>
                  <Typography fontSize={18} fontWeight={600}>
                    {line[SolicitationTotalsViewFields.SolicitationsQuantity]}
                  </Typography>
                </Stack>
                <Divider sx={{ width: '100%' }} />
              </Stack>
            ))}
            {statusData.length > 7 && (
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
            <OffererLinesDialog
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
      </CardContent>
    </Card>
  );
};

export default OffererSolicitationLinesStats;
