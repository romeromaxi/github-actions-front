import React from 'react';
import { ChartConfiguration, nullConfiguration } from '../../types/chart';
import { getBaseColor } from '../../util/typification/generalColors';
import { EnumColors } from '../../types/general/generalEnums';
import { DoughnutChart } from './DoughnutChart';

interface BureauDoughnutChartProps {
  labels: string[] | string[][];
  width?: number;
  height?: number;
}

function EmptyDoughnutChart({
  labels,
  width,
  height,
}: BureauDoughnutChartProps) {
  const chartConfiguration: ChartConfiguration = {
    ...nullConfiguration,
  };

  chartConfiguration.data.labels = labels;
  chartConfiguration.data.datasets.data = [1000, 0, 0, 0];
  chartConfiguration.options.cutout = 65;
  chartConfiguration.data.datasets.label = 'dataset_empty';

  chartConfiguration.data.datasets.backgroundColor = [
    `${getBaseColor(EnumColors.GREY)}`,
  ];
  return (
    <DoughnutChart
      name={'chart'}
      configuration={chartConfiguration}
      plugins={{
        tooltip: {
          enabled: false,
        },
      }}
      height={height ? height : 180}
      width={width ? width : 500}
    />
  );
}

export default EmptyDoughnutChart;
