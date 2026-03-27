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
import DataBox from '../../DataBox';
import {
  EntityWithIdAndDescriptionFields,
  EntityWithIdAndDescriptionQuantity,
  EntityWithIdAndDescriptionQuantityFields,
} from '../../../../../../types/baseEntities';
import { useEffect } from 'react';
import { HttpOffererReports } from '../../../../../../http/offerer/httpOffererReports';
import { OffererReportReceivedSolicitationsFields } from '../../../../../../types/offerer/offererReports';
import { downloadFileBlobHelper } from '../../../../../../util/helpers';
import {ButtonExportDropdown} from "../../../../../../components/buttons/ButtonExportDropdown";

const keyToDisplayName = {
  [OffererReportReceivedSolicitationsFields.Unassigned]: 'Sin Asignar',
  [OffererReportReceivedSolicitationsFields.Analysis]: 'En Análisis',
  [OffererReportReceivedSolicitationsFields.Terminated]: 'Terminadas',
  [OffererReportReceivedSolicitationsFields.Prequalified]: 'Precalificadas',
};

interface SolicitationsByProductChartProps {
  offererId: number;
}

const SolicitationsByProductChart: React.FC<
  SolicitationsByProductChartProps
> = ({ offererId }: SolicitationsByProductChartProps) => {
  const theme = useTheme();
  const [data, setData] = React.useState<EntityWithIdAndDescriptionQuantity[]>(
    [],
  );

  useEffect(() => {
    HttpOffererReports.getSolicitationsByProduct(offererId).then(setData);
  }, [offererId]);

  return (
    <Card sx={{ width: '100%', height: '75vh' }}>
      <CardHeader
        title={'Solicitudes recibidas por producto'}
        action={
            <ButtonExportDropdown onExportExcel={() =>
                HttpOffererReports.exportSolicitationsByProduct(offererId).then(
                    downloadFileBlobHelper,
                )} size={'small'} />
        }
      />

      <CardContent sx={{ width: 1, height: 9 / 10, p: 2 }}>
        <DataBox
          label={'Solicitudes recibidas'}
          value={`${data.reduce((sum, item) => sum + parseInt(item[EntityWithIdAndDescriptionQuantityFields.Quantity]), 0)}`}
        />
        <ResponsiveContainer width="99%" height={'99%'}>
          <BarChart
            data={data}
            margin={{
              right: 25,
              left: 0,
              bottom: 55,
            }}
            layout={'vertical'}
          >
            {/*<text x={'50%'} y={'1%'} fill="black" textAnchor="middle" dominantBaseline="central">*/}
            {/*    <tspan fontSize="1.225rem"*/}
            {/*           fontWeight={600}*/}
            {/*    >Solicitudes recibidas por producto*/}
            {/*    </tspan>*/}
            {/*</text>*/}
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type={'number'}
              dataKey={EntityWithIdAndDescriptionQuantityFields.Quantity}
              allowDecimals={false}
            />
            <YAxis
              type={'category'}
              dataKey={EntityWithIdAndDescriptionFields.Description}
              tick={{ strokeWidth: 2, fontWeight: 'bold', fontSize: 10 }}
              width={80}
            />
            <Tooltip />
            <Bar
              dataKey={EntityWithIdAndDescriptionQuantityFields.Quantity}
              radius={[0, 10, 10, 0]}
              name={'Cantidad de solicitudes'}
              label={(props) => {
                const { x, y, value } = props;
                const radius = 10;
                return (
                  <text
                    x={x}
                    y={y + radius * 1.5}
                    fill={theme.palette.primary.contrastText}
                    textAnchor="start"
                    dominantBaseline="middle"
                  >
                    {value}
                  </text>
                );
              }}
              barSize={30}
              fill={theme.palette.primary.main}
            />
            <Legend layout="horizontal" verticalAlign="top" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SolicitationsByProductChart;
