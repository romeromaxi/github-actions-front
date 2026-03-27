import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Alert } from '@mui/lab';
import {
  SolicitationTotalsView,
  SolicitationTotalsViewFields,
} from '../../../../../types/solicitations/solicitationData';
import { HttpSolicitation } from '../../../../../http';
import { SolicitationStatusColorMap } from '../../../../../util/typification/solicitationStatesColor';
import { SolicitationStatusType } from '../../../../../types/solicitations/solicitationEnums';
import { EntityWithIdFields } from '../../../../../types/baseEntities';

interface OffererSolicitationByStatusChartProps {
  offererId: number;
}

function OffererSolicitationByStatusChart({
  offererId,
}: OffererSolicitationByStatusChartProps) {
  const [statusData, setStatusData] = useState<SolicitationTotalsView[]>();

  useEffect(() => {
    HttpSolicitation.getOffererCurrentSolicitationsByStatesClassifications(
      offererId,
    ).then((res) => {
      setStatusData(res);
    });
  }, []);

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
            color={'rgb(114, 57, 234)'}
          >
            {getTotalQuantity()}
          </Typography>
        }
        subheader={'Cantidad de solicitudes activas por estado'}
      />
      <CardContent sx={{ width: 1, height: 9 / 10 }}>
        {statusData && statusData.length !== 0 && getTotalQuantity() !== 0 ? (
          <ResponsiveContainer width="99%" height={'99%'}>
            <BarChart
              width={450}
              height={350}
              data={statusData}
              margin={{
                top: 5,
                right: 25,
                left: 0,
                bottom: 5,
              }}
              layout={'vertical'}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type={'number'}
                dataKey={'cantidadSolicitudes'}
                allowDecimals={false}
              />
              <YAxis
                type={'category'}
                dataKey={'descripcion'}
                tick={{ strokeWidth: 2, fontWeight: 'bold', fontSize: 10 }}
                width={120}
              />
              <Tooltip />
              <Bar
                dataKey={'cantidadSolicitudes'}
                radius={[0, 10, 10, 0]}
                name={'Cantidad por estado'}
                label={{ value: 'Estados', angle: -90, position: 'insideLeft' }}
                barSize={30}
              >
                {statusData.map((entry, index) => {
                  return (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        SolicitationStatusColorMap[
                          entry[EntityWithIdFields.Id] as SolicitationStatusType
                        ].dark
                      }
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
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
}

export default OffererSolicitationByStatusChart;
