import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader } from '@mui/material';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { DownloadButton } from '../../../../../../components/buttons/Buttons';

const data1 = [
  {
    name: 'Equipo 1',
    members: 4,
    received: 20,
    admission: 7,
    perMember: 5.0,
  },
  {
    name: 'Equipo 2',
    members: 3,
    received: 40,
    admission: 13,
    perMember: 13.3,
  },
  {
    name: 'Equipo 3',
    members: 7,
    received: 55,
    admission: 18,
    perMember: 7.9,
  },
  {
    name: 'Equipo 4',
    members: 10,
    received: 15,
    admission: 5,
    perMember: 1.5,
  },
  {
    name: 'Equipo 5',
    members: 8,
    received: 24,
    admission: 8,
    perMember: 3.0,
  },
  {
    name: 'Equipo 6',
    members: 5,
    received: 20,
    admission: 7,
    perMember: 4.0,
  },
  {
    name: 'Equipo 7',
    members: 6,
    received: 18,
    admission: 6,
    perMember: 3.0,
  },
];

function TeamSolicitationsResolvedByTeamSize() {
  const theme = useTheme();
  const [data, setData] = React.useState(data1);

  return (
    <Card sx={{ width: '100%', height: '90vh' }}>
      <CardHeader
        title={'Relación Solicitudes Recibidas / Miembros'}
        action={
          <DownloadButton sx={{ mt: 1 }}
                          size={'small'} onClick={() => {}}>
            Exportar
          </DownloadButton>
        }
      />

      <CardContent sx={{ width: 1, height: 9 / 10, p: 2 }}>
        <ResponsiveContainer width="99%" height={'99%'}>
          <ComposedChart data={data}>
            <YAxis type="number" yAxisId="left" />
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
            <CartesianGrid strokeDasharray="3 3" />

            <Bar
              yAxisId="left"
              dataKey={'members'}
              barSize={50}
              name={'Miembros'}
              stackId="a"
              fill={theme.palette.primary.main}
            />
            <Bar
              yAxisId="left"
              dataKey={'received'}
              barSize={50}
              name={'Solicitudes Recibidas'}
              stackId="b"
              fill={theme.palette.success.dark}
            />
            <Line
              yAxisId="left"
              type="monotone"
              name={'Por Miembro'}
              dataKey="perMember"
              stroke={theme.palette.info.light}
              strokeDasharray="5 5"
              strokeWidth={3}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default TeamSolicitationsResolvedByTeamSize;
