import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Alert } from '@mui/lab';
import {
  SolicitationTotalsView,
  SolicitationTotalsViewFields,
} from '../../../../../types/solicitations/solicitationData';
import { HttpSolicitation } from '../../../../../http';
import { EntityWithIdFields } from '../../../../../types/baseEntities';
import { SolicitationClassificationStatusType } from '../../../../../types/solicitations/solicitationEnums';
import { SolicitationClassificationStatusColorMap } from '../../../../../util/typification/solicitationStatesColor';

interface OffererSolicitationPieChartProps {
  offererId: number;
}

function OffererSolicitationPieChart({
  offererId,
}: OffererSolicitationPieChartProps) {
  const [pieData, setPieData] = useState<SolicitationTotalsView[]>();

  useEffect(() => {
    HttpSolicitation.getOffererSolicitationsByStatesClassifications(
      offererId,
    ).then((res) => {
      setPieData(res);
    });
  }, []);

  const getTotalQuantity = () => {
    let total: number = 0;
    pieData &&
      pieData.length !== 0 &&
      pieData.map(
        (t) => (total += t[SolicitationTotalsViewFields.SolicitationsQuantity]),
      );

    return total;
  };

  return (
    <Card sx={{ width: 1, height: 1, maxHeight: '450px' }}>
      <CardHeader
        title={
          <Typography fontSize={28} fontWeight={600} color={'rgb(0, 158, 247)'}>
            {getTotalQuantity()}
          </Typography>
        }
        subheader={'Cantidad de solicitudes totales por estado agrupado'}
      />
      <CardContent
        sx={{
          width: 1,
          height: 9 / 10,
          pr: getTotalQuantity() !== 0 ? 0 : '2.25rem',
        }}
      >
        {pieData && pieData.length !== 0 && getTotalQuantity() ? (
          <ResponsiveContainer width="99%" height={'99%'}>
            <PieChart width={420} height={300}>
              <Pie
                data={pieData}
                dataKey="cantidadSolicitudes"
                nameKey="descripcion"
                cx="52%"
                cy="50%"
                fill="#8884d8"
                innerRadius={'65%'}
                outerRadius={'90%'}
                label
                blendStroke
                radius={'50%'}
                cornerRadius={'50%'}
                paddingAngle={-15}
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      SolicitationClassificationStatusColorMap[
                        entry[
                          EntityWithIdFields.Id
                        ] as SolicitationClassificationStatusType
                      ].dark
                    }
                  />
                ))}
              </Pie>
              <Legend
                layout={'vertical'}
                align={'right'}
                verticalAlign={'middle'}
              />
              <Tooltip />
            </PieChart>
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

export default OffererSolicitationPieChart;
