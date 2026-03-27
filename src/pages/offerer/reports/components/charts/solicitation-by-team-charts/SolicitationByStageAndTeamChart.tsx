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
import { DownloadButton } from '../../../../../../components/buttons/Buttons';
import {ButtonExportDropdown} from "../../../../../../components/buttons/ButtonExportDropdown";

const data1 = [
  {
    name: 'Equipo 1',
    AdmitirSolicitud: 9,
    Asignar: 4,
    AprobarComunicacionAdmision: 7,
    ElaborarPrecalificacion: 3,
    AprobarComunicacionPrecalificacion: 2,
  },
  {
    name: 'Equipo 2',
    AdmitirSolicitud: 4,
    Asignar: 3,
    AprobarComunicacionAdmision: 1,
    ElaborarPrecalificacion: 7,
    AprobarComunicacionPrecalificacion: 9,
  },
  {
    name: 'Equipo 3',
    AdmitirSolicitud: 12,
    Asignar: 4,
    AprobarComunicacionAdmision: 4,
    ElaborarPrecalificacion: 1,
    AprobarComunicacionPrecalificacion: 4,
  },
  {
    name: 'Equipo 4',
    AdmitirSolicitud: 4,
    Asignar: 4,
    AprobarComunicacionAdmision: 11,
    ElaborarPrecalificacion: 6,
    AprobarComunicacionPrecalificacion: 2,
  },
  {
    name: 'Equipo 5',
    AdmitirSolicitud: 2,
    Asignar: 14,
    AprobarComunicacionAdmision: 9,
    ElaborarPrecalificacion: 13,
    AprobarComunicacionPrecalificacion: 2,
  },
];

const SolicitationByStageAndTeamChart: React.FC = () => {
  const theme = useTheme();
  const [data, setData] = React.useState(data1);

  const COLORS = [
    theme.palette.primary.dark,
    theme.palette.warning.light,
    theme.palette.error.light,
    theme.palette.success.main,
    theme.palette.info.light,
  ];

  return (
    <Card sx={{ width: '100%', height: '65vh' }}>
      <CardHeader
        title={'Solicitudes por Etapa y Equipo'}
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
              bottom: 15,
            }}
            layout={'horizontal'}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis type="number" />
            <XAxis
              dataKey="name"
              type="category"
              interval={0}
              textAnchor="end"
            />

            <Tooltip
            // formatter={(value, name) => [`${value}`, `Custom ${name}`]}
            />
            <Legend layout="horizontal" verticalAlign="top" align="center" />

            <Bar
              dataKey={'AdmitirSolicitud'}
              name={'Admitir Solicitud'}
              stackId="a"
              fill={theme.palette.primary.main}
              barSize={50}
            />
            <Bar
              dataKey={'Asignar'}
              name={'Asignar'}
              stackId="a"
              fill={theme.palette.warning.light}
              barSize={50}
            />
            <Bar
              dataKey={'AprobarComunicacionAdmision'}
              name={'Aprobar Comunicación Admisión'}
              stackId="a"
              fill={theme.palette.success.main}
              barSize={50}
            />
            <Bar
              dataKey={'ElaborarPrecalificacion'}
              name={'Elaborar Precalificación'}
              stackId="a"
              fill={theme.palette.info.dark}
              barSize={50}
            />
            <Bar
              dataKey={'AprobarComunicacionPrecalificacion'}
              name={'Aprobar Comunicación Precalificacion'}
              stackId="a"
              fill={theme.palette.error.light}
              barSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SolicitationByStageAndTeamChart;
