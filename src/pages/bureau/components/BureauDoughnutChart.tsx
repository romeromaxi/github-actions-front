import React from 'react';
import { ChartConfiguration, nullConfiguration } from '../../../types/chart';
import { DoughnutChart } from '../../../components/charts/DoughnutChart';
import EmptyDoughnutChart from '../../../components/charts/EmptyDoughnutChart';
import { chartColors } from '../../../components/charts/chartColors';

interface BureauDoughnutChartProps {
  labels: string[] | string[][];
  data: number[];
  colors?: string[];
}

function BureauDoughnutChart({
  labels,
  data,
  colors,
}: BureauDoughnutChartProps) {
  const chartConfiguration: ChartConfiguration = {
    ...nullConfiguration,
  };

  const height =
    100 + labels.length * 50 > 300 ? 100 + labels.length * 65 : 300;

  chartConfiguration.data.labels = labels;
  chartConfiguration.data.datasets.data = data;
  chartConfiguration.options.cutout = 65;
  chartConfiguration.data.datasets.label = 'dataset_bureauChart';

  chartConfiguration.data.datasets.backgroundColor = colors || chartColors;
  return (
    <div>
      {data.reduce((partialSum, a) => partialSum + a, 0) ? (
        <DoughnutChart
          name={'chart'}
          configuration={chartConfiguration}
          height={180}
          width={600}
        />
      ) : (
        <EmptyDoughnutChart labels={labels} />
      )}
    </div>
  );
}

export default BureauDoughnutChart;
