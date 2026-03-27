import * as React from 'react';

import { useTheme } from '@mui/material/styles';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader } from '@mui/material';
import {ButtonExportDropdown} from "../../../../../../components/buttons/ButtonExportDropdown";

const data1 = [
  { name: 'Equipo 1', admission: 5, resolved: 12 },
  { name: 'Equipo 2', admission: 7, resolved: 1 },
  { name: 'Equipo 3', admission: 3, resolved: 8 },
  { name: 'Equipo 4', admission: 11, resolved: 4 },
  { name: 'Equipo 5', admission: 2, resolved: 6 },
  { name: 'Equipo 6', admission: 4, resolved: 9 },
  { name: 'Equipo 7', admission: 14, resolved: 9 },
];

const TeamReceivedSolicitationsChart: React.FC = () => {
  const theme = useTheme();

  return (
    <Card sx={{ width: '100%', height: '90vh' }}>
      <CardHeader
        title={'Solicitudes Recibidas'}
        action={
            <ButtonExportDropdown onExportExcel={() => {}} size='small' />
        }
      />

      <CardContent sx={{ width: 1, height: 9 / 10, p: 2 }}>
        <ResponsiveContainer width="99%" height={'99%'}>
          <BarChart
            data={data1}
            margin={{
              top: 15,
              right: 25,
              left: 0,
            }}
            layout={'horizontal'}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis type="number" />
            <XAxis
              dataKey="name"
              type="category"
              angle={-30}
              interval={0}
              textAnchor="end"
              tick={{
                fontSize: '0.8125rem',
              }}
            />

            <Tooltip />
            <Legend layout="horizontal" verticalAlign="top" align="center" />

            <Bar
              dataKey={'analysis'}
              name={'En Análisis'}
              barSize={50}
              stackId="a"
              fill={theme.palette.primary.main}
            />
            <Bar
              dataKey={'resolved'}
              barSize={50}
              name={'Resueltas'}
              stackId="a"
              fill={theme.palette.success.main}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TeamReceivedSolicitationsChart;
