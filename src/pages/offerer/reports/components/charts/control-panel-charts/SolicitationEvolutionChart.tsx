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
import { Card, CardContent, CardHeader, Stack } from '@mui/material';
import DataBox from '../../DataBox';
import {
  OffererReportEvolutionViewsVsReceivedSolicitations,
  OffererReportEvolutionViewsVsReceivedSolicitationsFields,
  PeriodicityTypes,
} from '../../../../../../types/offerer/offererReports';
import { HttpOffererReports } from '../../../../../../http/offerer/httpOffererReports';
import {
  SolicitationEvolutionChartForm,
  SolicitationEvolutionChartFormFields,
} from './SolicitationEvolutionChartWithFilter';
import { DownloadButton } from '../../../../../../components/buttons/Buttons';
import { downloadFileBlobHelper } from '../../../../../../util/helpers';
import { dateFormatter } from '../../../../../../util/formatters/dateFormatter';
import {ButtonExportDropdown} from "../../../../../../components/buttons/ButtonExportDropdown";

const data2 = [
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/1/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 0,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 0,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/2/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 8,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 2,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/3/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 5,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 0,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/4/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 3,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 2,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/5/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 8,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 5,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/6/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 10,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 3,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/7/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 4,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 5,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/8/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 6,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 7,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/9/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 8,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 4,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/10/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 9,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 5,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/11/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 9,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 5,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/12/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 0,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 2,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/13/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 2,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 6,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/14/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 7,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 4,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/15/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 3,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 2,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/16/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 5,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 3,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/17/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 3,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 7,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/18/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 4,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 4,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/19/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 2,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 2,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/20/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 0,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 0,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/21/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 0,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 2,
  },
  {
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date]: new Date(
      '1/22/2024',
    ),
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views]: 4,
    [OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations]: 0,
  },
];

interface SolicitationEvolutionChartProps {
  offererId: number;
  filter: SolicitationEvolutionChartForm;
}

const SolicitationEvolutionChart: React.FC<SolicitationEvolutionChartProps> = ({
  offererId,
  filter,
}: SolicitationEvolutionChartProps) => {
  const [data, setData] = React.useState<
    OffererReportEvolutionViewsVsReceivedSolicitations[]
  >([]);

  const theme = useTheme();

  useEffect(() => {
    HttpOffererReports.getEvolutionViewsVsReceivedSolicitations(
      offererId,
      filter,
    ).then(setData);
  }, [offererId, filter]);

  return (
    <Card sx={{ width: '100%', height: '85vh' }}>
      <CardHeader
        title={'Evolución Solicitudes Recibidas'}
        action={
          <ButtonExportDropdown onExportExcel={() =>
              HttpOffererReports.exportEvolutionViewsVsReceivedSolicitations(
                  offererId,
                  filter,
              ).then(downloadFileBlobHelper)} size={'small'} />
        }
      />

      <CardContent sx={{ width: 1, height: 9 / 10, p: 2 }}>
        <Stack direction={'row'} gap={2}>
          <DataBox
            label={'Total Visitas'}
            value={`${data.reduce((total, item) => total + item[OffererReportEvolutionViewsVsReceivedSolicitationsFields.Views] || 0, 0)}`}
          />
          <DataBox
            label={'Total Solicitudes'}
            value={`${data.reduce((total, item) => total + item[OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations] || 0, 0)}`}
          />
        </Stack>
        <ResponsiveContainer width="99%" height={'99%'}>
          <BarChart
            data={data}
            margin={{
              top: 0,
              bottom: 90,
              right: 25,
              left: 0,
            }}
            layout={'horizontal'}
          >
            <text
              x={'50%'}
              y={20}
              fill="black"
              textAnchor="middle"
              dominantBaseline="central"
            >
              <tspan fontSize="1.225rem" fontWeight={600}></tspan>
            </text>
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis type="number" />
            <XAxis
              dataKey={
                OffererReportEvolutionViewsVsReceivedSolicitationsFields.Date
              }
              type="category"
              interval={0}
              angle={-45}
              textAnchor="end"
              tickFormatter={(str) => {
                const date = new Date(str);
                const formmater =
                  filter[
                    SolicitationEvolutionChartFormFields.PeriodicityCode
                  ] === PeriodicityTypes.Monthly
                    ? dateFormatter.toYearMonth
                    : dateFormatter.toShortDate;
                return formmater(date);
              }}
            />

            <Tooltip />

            {/*<Legend layout="horizontal" verticalAlign="top" align="center" wrapperStyle={{bottom: 15}}/>*/}

            <Legend layout="horizontal" verticalAlign="top" />

            <Bar
              dataKey={
                OffererReportEvolutionViewsVsReceivedSolicitationsFields.ReceivedSolicitations
              }
              name="Solicitudes Recibidas"
              fill={theme.palette.success.main}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SolicitationEvolutionChart;
