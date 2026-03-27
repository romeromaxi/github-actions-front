import React, { useEffect } from 'react';
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
import { HttpOffererReports } from '../../../../../../http/offerer/httpOffererReports';
import { downloadFileBlobHelper } from '../../../../../../util/helpers';
import {
  OffererReportSolicitationsByStageAndTeam,
  OffererReportSolicitationsByStageAndTeamFields,
} from '../../../../../../types/offerer/offererReports';

const data1 = [
  {
    name: 'Equipo 1',
    admission: 7,
    assignation: 2,
    admissionApproval: 3,
    preparePrequalification: 1,
    communicatePrequalification: 1,
  },
  {
    name: 'Equipo 2',
    admission: 1,
    assignation: 2,
    admissionApproval: 4,
    preparePrequalification: 5,
    communicatePrequalification: 6,
  },
  {
    name: 'Equipo 3',
    admission: 3,
    assignation: 2,
    admissionApproval: 2,
    preparePrequalification: 1,
    communicatePrequalification: 8,
  },
  {
    name: 'Equipo 4',
    admission: 3,
    assignation: 1,
    admissionApproval: 4,
    preparePrequalification: 5,
    communicatePrequalification: 1,
  },
  {
    name: 'Equipo 5',
    admission: 8,
    assignation: 4,
    admissionApproval: 6,
    preparePrequalification: 1,
    communicatePrequalification: 1,
  },
  {
    name: 'Equipo 6',
    admission: 2,
    assignation: 2,
    admissionApproval: 13,
    preparePrequalification: 4,
    communicatePrequalification: 0,
  },
  {
    name: 'Equipo 7',
    admission: 7,
    assignation: 9,
    admissionApproval: 3,
    preparePrequalification: 2,
    communicatePrequalification: 4,
  },
];

interface TeamSolicitationsByStageProps {
  offererId: number;
}

function TeamSolicitationsByStage({
  offererId,
}: TeamSolicitationsByStageProps) {
  const theme = useTheme();
  const [data, setData] = React.useState<
    OffererReportSolicitationsByStageAndTeam[]
  >([]);

  useEffect(() => {
    HttpOffererReports.getSolicitationsByStageAndTeam(offererId).then(setData);
  }, [offererId]);

  return (
    <Card sx={{ width: '100%', height: '90vh' }}>
      <CardHeader
        title={'Solicitudes Por Equipo y Por Etapa'}
        action={
          <DownloadButton
            sx={{ mt: 1 }}
            size={'small'}
            onClick={() =>
              HttpOffererReports.exportSolicitationsByStageAndTeam(
                offererId,
              ).then(downloadFileBlobHelper)
            }
          >
            Exportar
          </DownloadButton>
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
              dataKey={OffererReportSolicitationsByStageAndTeamFields.TeamDesc}
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
              dataKey={OffererReportSolicitationsByStageAndTeamFields.Admission}
              name={'Admisión'}
              barSize={50}
              stackId="a"
              fill={theme.palette.success.main}
            />
            <Bar
              dataKey={
                OffererReportSolicitationsByStageAndTeamFields.AdmissionApproval
              }
              name={'Aprobación Comunicación Admisión'}
              barSize={50}
              stackId="a"
              fill={theme.palette.primary.main}
            />
            <Bar
              dataKey={
                OffererReportSolicitationsByStageAndTeamFields.PrequalificationAnalysis
              }
              name={'Elaborar Precalificación'}
              barSize={50}
              stackId="a"
              fill={theme.palette.error.light}
            />
            <Bar
              dataKey={
                OffererReportSolicitationsByStageAndTeamFields.PrequalificationApproval
              }
              name={'Aprobar Comunicación Precalificación'}
              barSize={50}
              stackId="a"
              fill={theme.palette.warning.light}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export default TeamSolicitationsByStage;
