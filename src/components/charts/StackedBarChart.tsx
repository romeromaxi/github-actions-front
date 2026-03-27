import React from 'react';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ChartDataset } from '../../types/chart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export interface StackedBarChartProps {
  title: string;
  labels: string[];
  datasets: ChartDataset[];
  options?: Partial<ChartOptions<'bar'>>;
  maxY?: number;
}

export function StackedBarChart({
  title,
  labels,
  datasets,
  maxY,
  options,
}: StackedBarChartProps) {
  const data = {
    labels,
    datasets: datasets,
  };

  const chartOptions = {
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        //min: 0,
        max: maxY,
        ticks: {
          stepSize: 20,
        },
      },
    },
    ...options,
  };

  return <Bar options={chartOptions} data={data} />;
}
