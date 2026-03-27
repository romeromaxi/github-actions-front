import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader } from '@mui/material';
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
import { DownloadButton } from '../../../../../../components/buttons/Buttons';
import {ButtonExportDropdown} from "../../../../../../components/buttons/ButtonExportDropdown";

const data1 = [
  {
    name: 'Equipo 1',
    admission: 7,
    lessThan10: 3,
    between11and30: 3,
    moreThan30: 1,
  },
  {
    name: 'Equipo 2',
    admission: 13,
    lessThan10: 4,
    between11and30: 4,
    moreThan30: 5,
  },
  {
    name: 'Equipo 3',
    admission: 18,
    lessThan10: 7,
    between11and30: 8,
    moreThan30: 3,
  },
  {
    name: 'Equipo 4',
    admission: 5,
    lessThan10: 1,
    between11and30: 2,
    moreThan30: 2,
  },
  {
    name: 'Equipo 5',
    admission: 8,
    lessThan10: 3,
    between11and30: 2,
    moreThan30: 3,
  },
  {
    name: 'Equipo 6',
    admission: 7,
    lessThan10: 2,
    between11and30: 2,
    moreThan30: 3,
  },
  {
    name: 'Equipo 7',
    admission: 6,
    lessThan10: 1,
    between11and30: 2,
    moreThan30: 3,
  },
];

function TeamSolicitationByTimeInStageChart() {
  const theme = useTheme();
  const [data, setData] = React.useState(data1);

  return (
    <Card sx={{ width: '100%', height: '90vh' }}>
      <CardHeader
        title={'Tiempo en Análisis'}
        action={
          <ButtonExportDropdown onExportExcel={() => {}} size={'small'} />
        }
      />

      <CardContent sx={{ width: 1, height: 9 / 10, p: 2 }}>
        <ResponsiveContainer width="99%" height={'99%'}>
          <BarChart
            data={data}
            margin={{
              top: 15,
              right: 25,
              left: 0,
              bottom: 25,
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

            <Tooltip
            // formatter={(value, name) => [`${value}`, `Custom ${name}`]}
            />
            <Legend layout="horizontal" verticalAlign="top" align="center" />

            <Bar
              dataKey={'lessThan10'}
              name={'Menos de 10'}
              barSize={50}
              stackId="a"
              fill={theme.palette.success.main}
            />
            <Bar
              dataKey={'between11and30'}
              name={'Entre 11 y 30'}
              barSize={50}
              stackId="a"
              fill={theme.palette.warning.light}
            />
            <Bar
              dataKey={'moreThan30'}
              name={'Más de 30'}
              barSize={50}
              stackId="a"
              fill={theme.palette.error.light}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default TeamSolicitationByTimeInStageChart;
