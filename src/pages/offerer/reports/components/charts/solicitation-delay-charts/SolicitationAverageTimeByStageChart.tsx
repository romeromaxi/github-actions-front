import * as React from 'react';
import { useEffect } from 'react';

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
import { Box, Card, CardContent, CardHeader } from '@mui/material';
import { HttpOffererReports } from '../../../../../../http/offerer/httpOffererReports';
import { OffererReportSolicitationsTimeByStageFields } from '../../../../../../types/offerer/offererReports';
import { downloadFileBlobHelper } from '../../../../../../util/helpers';
import { SolicitationStateChartForm } from '../../../hooks/useSolicitationFilter';
import {ButtonExportDropdown} from "../../../../../../components/buttons/ButtonExportDropdown";


const labelMap: Record<OffererReportSolicitationsTimeByStageFields, string> = {
  [OffererReportSolicitationsTimeByStageFields.Admission]: 'Admitir Solicitud',
  [OffererReportSolicitationsTimeByStageFields.AdmissionApproval]:
    'Aprobar Comunicación Admisión',
  [OffererReportSolicitationsTimeByStageFields.PrequalificationAnalysis]:
    'Elaborar Precalificación',
  [OffererReportSolicitationsTimeByStageFields.PrequalificationApproval]:
    'Aprobar Comunicación Precalificación',
};

interface SolicitationAverageTimebyStageChartProps {
  offererId: number;
  filter: SolicitationStateChartForm;
}

const SolicitationAverageTimeByStageChart: React.FC<
  SolicitationAverageTimebyStageChartProps
> = ({ offererId, filter }: SolicitationAverageTimebyStageChartProps) => {
  const theme = useTheme();
  const [data, setData] = React.useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    HttpOffererReports.getSolicitationsAverageTimeByStage(
      offererId,
      filter,
    ).then((res) => {
      const dataObject = res;

      const data = Object.entries(dataObject).map(([name, value]) => ({
        name: labelMap[name as OffererReportSolicitationsTimeByStageFields],
        value,
      }));

      setData(data);
    });
  }, [offererId, filter]);

  return (
    <Card sx={{ width: '100%', height: '90vh' }}>
      <CardHeader
        title={'Tiempo Promedio por Etapa'}
        action={
          <ButtonExportDropdown onExportExcel={() =>
              HttpOffererReports.exportSolicitationsAverageTimeByStage(
                  offererId,
              ).then(downloadFileBlobHelper)} size={'small'} />
        }
      />

      <CardContent sx={{ width: 1, height: 9 / 10, p: 2 }}>
        <Box sx={{ mt: 7 }} />
        <ResponsiveContainer width="99%" height={'99%'}>
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 25,
              left: 0,
              bottom: 100,
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

            {/*<Tooltip*/}
            {/*    */}
            {/*/>*/}

            <Tooltip />
            <Legend layout="horizontal" verticalAlign="top" align="center" />

            <Bar
              dataKey={'value'}
              name="Tiempo Promedio en Etapa"
              stackId="a"
              fill={theme.palette.warning.light}
              barSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SolicitationAverageTimeByStageChart;
