import 'chart.js/auto';
import { Doughnut } from 'react-chartjs-2';
import { ChartConfiguration } from '../../types/chart/chartConfiguration';

export interface IChartProps {
  name: string;
  configuration: ChartConfiguration;
  plugins?: { [key: string]: any };
  height?: number;
  width?: number;
}

const DoughnutChart = (props: IChartProps) => {
  const chartConfiguration = {
    labels: props.configuration.data.labels,
    datasets: [
      {
        label: props.configuration.data.datasets.label,
        data: props.configuration.data.datasets.data,
        backgroundColor: props.configuration.data.datasets.backgroundColor,
        borderColor: props.configuration.data.datasets.borderColor
          ? props.configuration.data.datasets.borderColor
          : ['white'],
        borderWidth: props.configuration.data.datasets.borderWidth,
      },
    ],
  };

  const chartOptions = {
    // cutout: props.configuration.options.cutout ? props.configuration.options.cutout : 65,
    type: 'doughnut',
    responsive: false,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 0,
        right: 0,
      },
      margin: {
        left: 0,
        right: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
        //casteado a tipo para que no tire error (falso) el chart
        position: 'right',
        // align: "start",
        labels: {
          boxWidth: 13,
          boxHeight: 13,
        },
      },
      ...props?.plugins,
    },
  };

  const finalHeight: number = props.height ? props.height : 200;
  const finalWidth: number = props.width ? props.width : 200;

  // @ts-ignore
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
      <Doughnut
        id={props.name}
        height={finalHeight}
        width={finalWidth}
        data={chartConfiguration}
        options={chartOptions}
      />
    </div>
  );
};

export { DoughnutChart };
