import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import React from 'react';
import {
  SolicitationTotalsView,
  SolicitationTotalsViewFields,
} from '../../../types/solicitations/solicitationData';
import { Alert } from '@mui/lab';
import SolicitationsDoughnutChart from '../../../components/charts/SolicitationsDoughnutChart';

interface CompanySolicitationsChartProps {
  solicitationsStates: SolicitationTotalsView[];
}

const CompanySolicitationsChart = ({
  solicitationsStates,
}: CompanySolicitationsChartProps) => {
  const labels: string[] = ['Denegadas', 'Activas', 'Caducadas', 'Canceladas'];
  const colors: string[] = [
    'rgb(227, 25, 25)',
    'rgb(39, 206, 136)',
    'rgb(227, 155, 48)',
    'rgb(209, 105, 2)',
  ];
  const data: number[] = [
    solicitationsStates[0]
      ? solicitationsStates[0][
          SolicitationTotalsViewFields.SolicitationsQuantity
        ]
      : 0,
    solicitationsStates[1]
      ? solicitationsStates[1][
          SolicitationTotalsViewFields.SolicitationsQuantity
        ]
      : 0,
    solicitationsStates[2]
      ? solicitationsStates[2][
          SolicitationTotalsViewFields.SolicitationsQuantity
        ]
      : 0,
    solicitationsStates[3]
      ? solicitationsStates[3][
          SolicitationTotalsViewFields.SolicitationsQuantity
        ]
      : 0,
  ];

  const getTotalStates = () => {
    let total = 0;

    solicitationsStates.forEach((e) => {
      total += e[SolicitationTotalsViewFields.SolicitationsQuantity];
    });

    return total;
  };

  return (
    <>
      {data.reduce((partialSum, a) => partialSum + a, 0) ? (
        <Card sx={{ height: '20rem' }}>
          <CardHeader
            title={
              <Typography fontSize={36} fontWeight={600}>
                {getTotalStates()}
              </Typography>
            }
            subheader={'Solicitudes realizadas'}
            sx={{ paddingBottom: 2, marginBottom: -2 }}
          />
          <CardContent>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                paddingTop: 1.5,
              }}
            >
              <SolicitationsDoughnutChart
                labels={labels}
                data={data}
                colors={colors}
                width={325}
                height={130}
              />
            </Box>
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
            subheader={'Solicitudes realizadas'}
            sx={{ paddingBottom: 2 }}
          />
          <CardContent>
            <Box sx={{ width: '100%', marginTop: 5 }}>
              <Alert severity="info">
                Al parecer no se han encontrado solicitudes. Ingresa al market y
                busca una linea para solicitar
              </Alert>
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default CompanySolicitationsChart;
