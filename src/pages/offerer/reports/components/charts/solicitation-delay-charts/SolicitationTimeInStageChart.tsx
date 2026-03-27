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
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
} from '@mui/material';
import DataBox from '../../DataBox';
import OffererSolicitationTable from '../../../../components/OffererSolicitation/OffererSolicitationTable/OffererSolicitationTable';
import { DownloadButton } from '../../../../../../components/buttons/Buttons';
import { HttpOffererReports } from '../../../../../../http/offerer/httpOffererReports';
import { downloadFileBlobHelper } from '../../../../../../util/helpers';
import {
  OffererReportSolicitationByTimeInStage,
  OffererReportSolicitationByTimeInStageFields,
} from '../../../../../../types/offerer/offererReports';
import { useEffect } from 'react';
import { SolicitationStateChartForm } from '../../../hooks/useSolicitationFilter';
import {ButtonExportDropdown} from "../../../../../../components/buttons/ButtonExportDropdown";

interface SolicitationTimeInStageChartProps {
  offererId: number;
  filter: SolicitationStateChartForm;
}

const SolicitationTimeInStageChart: React.FC<
  SolicitationTimeInStageChartProps
> = ({ offererId, filter }: SolicitationTimeInStageChartProps) => {
  const theme = useTheme();
  const [data, setData] = React.useState<
    OffererReportSolicitationByTimeInStage[]
  >([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  useEffect(() => {
    console.log(filter);
    HttpOffererReports.getSolicitationsByTimeInStage(offererId, filter).then(
      setData,
    );
  }, [offererId, filter]);

  return (
    <Card sx={{ width: '100%', height: '90vh' }}>
      <CardHeader
        title={'Tiempo de Solicitudes por Etapa'}
        action={
            <ButtonExportDropdown onExportExcel={() =>
                HttpOffererReports.exportSolicitationsByTimeInStage(
                offererId,
            ).then(downloadFileBlobHelper)} size={'small'} />
        }
      />

      <CardContent sx={{ width: 1, height: 9 / 10, p: 2 }}>
        <Stack direction={'row'} gap={2}>
          <DataBox
            label={'Menos de 10'}
            value={`${data.reduce((total, item) => total + item[OffererReportSolicitationByTimeInStageFields.UnderTenDays], 0)}`}
          />
          <DataBox
            label={'Entre 11 y 30'}
            value={`${data.reduce((total, item) => total + item[OffererReportSolicitationByTimeInStageFields.ElevenToThirtyDays], 0)}`}
          />
          <DataBox
            label={'Más de 30'}
            value={`${data.reduce((total, item) => total + item[OffererReportSolicitationByTimeInStageFields.MoreThanThirtyDays], 0)}`}
          />
        </Stack>
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
              dataKey={OffererReportSolicitationByTimeInStageFields.StageDesc}
              type="category"
              angle={-25}
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
              dataKey={
                OffererReportSolicitationByTimeInStageFields.UnderTenDays
              }
              name={'Bajo 10'}
              stackId="a"
              fill={theme.palette.primary.main}
              barSize={50}
              onClick={() => setDialogOpen(true)}
            />
            <Bar
              dataKey={
                OffererReportSolicitationByTimeInStageFields.ElevenToThirtyDays
              }
              name={'Entre 11 y 30'}
              stackId="a"
              fill={theme.palette.warning.light}
              barSize={50}
              onClick={() => setDialogOpen(true)}
            />
            <Bar
              dataKey={
                OffererReportSolicitationByTimeInStageFields.MoreThanThirtyDays
              }
              name={'Sobre 30'}
              stackId="a"
              fill={theme.palette.error.light}
              barSize={50}
              onClick={() => setDialogOpen(true)}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth={'lg'}
        fullWidth
      >
        <DialogContent>
          <OffererSolicitationTable />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SolicitationTimeInStageChart;
