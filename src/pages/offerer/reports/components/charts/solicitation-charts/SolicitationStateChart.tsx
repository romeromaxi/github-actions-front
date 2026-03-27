import * as React from 'react';
import { useEffect } from 'react';

import { useTheme } from '@mui/material/styles';
import DataBox from '../../DataBox';
import { SolicitationStateChartForm } from './SolicitationAnalysisAndStateChartWithFilter';
import { HttpOffererReports } from '../../../../../../http/offerer/httpOffererReports';
import {
  EntityWithIdAndDescriptionFields,
  EntityWithIdAndDescriptionQuantity,
  EntityWithIdAndDescriptionQuantityFields,
  EntityWithIdFields,
} from '../../../../../../types/baseEntities';
import { OffererReportReceivedSolicitationsFields } from '../../../../../../types/offerer/offererReports';
import { downloadFileBlobHelper } from '../../../../../../util/helpers';
import BaseSolicitationPieChart from './BaseSolicitationPieChart';

const data1 = [
  { name: 'Admitir Solicitud', solicitations: 20 },
  { name: 'Asignar', solicitations: 10 },
  { name: 'Aprobar Comunicación Admisión', solicitations: 25 },
  { name: 'Elaborar Precalificación', solicitations: 15 },
  { name: 'Aprobar Comunicación Precalificación', solicitations: 15 },
];

const keyToDisplayName = {
  [OffererReportReceivedSolicitationsFields.Unassigned]: 'Sin Asignar',
  [OffererReportReceivedSolicitationsFields.Analysis]: 'En Análisis',
  [OffererReportReceivedSolicitationsFields.Terminated]: 'Terminadas',
  [OffererReportReceivedSolicitationsFields.Prequalified]: 'Precalificadas',
};

interface SolicitationStateChartProps {
  offererId: number;
  filter: SolicitationStateChartForm;
}

const SolicitationStateChart: React.FC<SolicitationStateChartProps> = ({
  offererId,
  filter,
}: SolicitationStateChartProps) => {
  const theme = useTheme();
  const [data, setData] = React.useState<EntityWithIdAndDescriptionQuantity[]>(
    [],
  );

  const COLORS = [
    theme.palette.primary.dark,
    theme.palette.warning.light,
    theme.palette.error.light,
    theme.palette.success.main,
    theme.palette.info.light,
  ];

  useEffect(() => {
    HttpOffererReports.getReceivedSolicitations(offererId, filter).then(
      (response) => {
        const transformedData: EntityWithIdAndDescriptionQuantity[] =
          Object.entries(response).map(([key, value], index) => ({
            [EntityWithIdFields.Id]: index,
            [EntityWithIdAndDescriptionFields.Description]:
              keyToDisplayName?.[key as keyof typeof keyToDisplayName] || key,
            [EntityWithIdAndDescriptionQuantityFields.Quantity]: value,
          }));
        setData(transformedData);
      },
    );
  }, [offererId, filter]);

  const dataBoxMap = (item: EntityWithIdAndDescriptionQuantity) => {
    return (
      <DataBox
        label={item[EntityWithIdAndDescriptionFields.Description]}
        value={item[
          EntityWithIdAndDescriptionQuantityFields.Quantity
        ]?.toString()}
      />
    );
  };

  return (
    <BaseSolicitationPieChart
      title={'Solicitudes Recibidas'}
      data={data}
      onDownload={() =>
        HttpOffererReports.exportReceivedSolicitations(offererId, filter).then(
          downloadFileBlobHelper,
        )
      }
    />
  );
  //     <Card sx={{width: '100%', height: '65vh'}}>
  //         <CardHeader title={'Solicitudes Recibidas'}
  //                     action={
  //                         <DownloadButton
  //                             sx={{mt: 1}}
  //                             onClick={() => HttpOffererReports.exportReceivedSolicitations(offererId, filter)
  //                                 .then(downloadFileBlobHelper)}
  //                         >
  //                             Exportar
  //                         </DownloadButton>}
  //         />
  //
  //         <CardContent sx={{width: 1, height: 9 / 10, p: 2}}>
  //             <div>
  //                 <Stack direction={'row'} gap={1} sx={{mb: 1}}>
  //                     <DataBox
  //                         label={'Total Solicitudes Recibidas'}
  //                         value={`${data.reduce((sum, item) => sum + parseInt(item[EntityWithIdAndDescriptionQuantityFields.Quantity]), 0)}`}
  //                     />
  //                     {
  //                         data.map(dataBoxMap)
  //                     }
  //                 </Stack>
  //
  //             </div>
  //             <ResponsiveContainer width="99%" height={'99%'}>
  //                 <PieChart
  //                     margin={{
  //                         top: 0,
  //                         right: 25,
  //                         left: 0,
  //                         bottom: 100,
  //                     }}
  //                 >
  //                     <Pie
  //                         data={data}
  //                         cx={'50%'}
  //                         cy={'50%'}
  //                         labelLine={false}
  //                         outerRadius={80}
  //                         fill="#8884d8"
  //                         dataKey={EntityWithIdAndDescriptionQuantityFields.Quantity}
  //                         nameKey={EntityWithIdAndDescriptionFields.Description}
  //                         label={({cx, cy, midAngle, outerRadius, descripcion, percent, fill}) => {
  //                             const RADIAN = Math.PI / 180;
  //                             const radius = outerRadius + 10;
  //                             const x = cx + radius * Math.cos(-midAngle * RADIAN);
  //                             const y = cy - 15 + radius * Math.sin(-midAngle * RADIAN);
  //
  //                             const words = descripcion.split(' ');
  //                             const lines = words.reduce((lines: string[], word: string) => {
  //                                 let currentLine = lines[lines.length - 1];
  //                                 if (`${currentLine} ${word}`.length < 25) {
  //                                     lines[lines.length - 1] = `${currentLine} ${word}`;
  //                                 } else {
  //                                     lines.push(word);
  //                                 }
  //                                 return lines;
  //                             }, ['']);
  //
  //                             return (
  //                                 <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'}
  //                                       dominantBaseline="central"
  //                                       fill={fill}
  //                                 >
  //                                     {
  //                                         lines.map((line: string, i: number) => {
  //                                             const isLastLine = i === lines.length - 1;
  //                                             const lineText = isLastLine ? `${line}: ${(percent * 100).toFixed(0)}%` : line;
  //
  //                                             return (
  //                                                 <tspan x={x} dy={`${i + 1.2}em`}>{lineText}</tspan>
  //                                             )
  //                                         })
  //                                     }
  //                                 </text>
  //                             );
  //                         }}
  //                     >
  //
  //                         {
  //                             data.map((entry, index) =>
  //                                 <Cell key={`cell-${index}`}
  //                                  fill={COLORS[index % COLORS.length]}/>)
  //                         }
  //
  //                     </Pie>
  //                     <Tooltip
  //
  //                     />
  //                 </PieChart>
  //             </ResponsiveContainer>
  //         </CardContent>
  //     </Card>
  // );
};

export default SolicitationStateChart;
