import React from 'react';
import { Box } from '@mui/material';
import { ChartConfiguration, nullConfiguration } from '../../types/chart';
import EmptyDoughnutChart from './EmptyDoughnutChart';
import { DoughnutChart } from './DoughnutChart';
import { chartColors } from './chartColors';

interface SolicitationsDoughnutChartProps {
  labels: string[] | string[][];
  data: number[];
  colors?: string[];
  width: number;
  height: number;
}

function SolicitationsDoughnutChart({
  labels,
  data,
  colors,
  width,
  height,
}: SolicitationsDoughnutChartProps) {
  const chartConfiguration: ChartConfiguration = {
    ...nullConfiguration,
  };

  chartConfiguration.data.labels = labels;
  chartConfiguration.data.datasets.data = data;
  chartConfiguration.options.cutout = 65;
  chartConfiguration.data.datasets.label = 'dataset_solicitationsChart';

  chartConfiguration.data.datasets.backgroundColor = colors || chartColors;
  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-start !important',
      }}
    >
      {data.reduce((partialSum, a) => partialSum + a, 0) ? (
        <DoughnutChart
          name={'chart'}
          configuration={chartConfiguration}
          width={width}
          height={height}
        />
      ) : (
        <EmptyDoughnutChart labels={labels} width={width} height={height} />
      )}
    </Box>
  );
}

export default SolicitationsDoughnutChart;
