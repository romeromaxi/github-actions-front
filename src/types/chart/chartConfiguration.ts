export interface ChartConfiguration {
  data: ChartData;
  options: ChartOptions;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  cutout?: number;
  legend: ChartOptionTitle;
  title?: ChartOptionTitle;
  scales?: object;
  tooltips?: object;
}

export interface ChartOptionTitle {
  display: boolean;
}

export interface ChartData {
  labels: string[] | string[][];
  datasets: ChartDataset;
}

export interface ChartDataset {
  data: number[];
  label: string;
  borderWidth?: number;
  backgroundColor: string | string[];
  hoverBackgroundColor?: string[];
  borderColor?: string;
  hoverBorderColor?: string;
  hoverBorderWidth?: number;
}

export const nullConfiguration: ChartConfiguration = {
  data: {
    labels: [],
    datasets: {
      label: '',
      backgroundColor: [],
      data: [],
      borderWidth: 2,
    },
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: 65,
    legend: {
      display: false,
    },
  },
};
