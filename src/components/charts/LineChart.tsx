import React from 'react';
import { Line } from 'react-chartjs-2';
import { getBaseColor } from '../../util/typification/generalColors';
import { EnumColors } from '../../types/general/generalEnums';
import { ChartOptions } from 'chart.js';

interface LineChartProps {
  labels: string[];
  data: number[];
  title: string;
  options?: Partial<ChartOptions<'line'>>;
}

function LineChart({ labels, data, options, title }: LineChartProps) {
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: title,
        data: data,
        fill: false,
        borderColor: getBaseColor(EnumColors.LIGHTBLUE),
        tension: 0.1,
      },
    ],
  };

  return <Line options={options} data={chartData} />;
}

export default LineChart;
