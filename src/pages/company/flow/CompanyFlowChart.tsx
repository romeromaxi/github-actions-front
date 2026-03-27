import {
  CompanyFlowSemesterData,
} from '../../../types/company/companyFlowData';
import { dateFormatter } from '../../../util/formatters/dateFormatter';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {FlowFields} from "../../../types/general/generalFinanceData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

interface CompanyDetailCardProps {
  flowList: CompanyFlowSemesterData[];
  reverse?: boolean;
}

const getChartDates = (flow: CompanyFlowSemesterData[]) => {
  const dates: string[] = [];
  flow.map((f) => {
    dates
      .push(dateFormatter.toMonthNameWithYear(f[FlowFields.Date], true))
      .toString();
  });
  return dates;
};

const getChartIncomes = (flow: CompanyFlowSemesterData[]) => {
  const incomes: number[] = [];
  flow.map((f) => {
    incomes.push(f[FlowFields.Income]);
  });
  return incomes;
};

const getChartSales = (flow: CompanyFlowSemesterData[]) => {
  const sales: number[] = [];
  flow.map((f) => {
    sales.push(f[FlowFields.Sale]);
  });
  return sales;
};

function CompanyFlowChart({ flowList, reverse }: CompanyDetailCardProps) {
  const flowListOrdered = reverse ? [...flowList].reverse() : flowList;
  const dates = getChartDates(flowListOrdered);
  const incomes = getChartIncomes(flowListOrdered);
  const sales = getChartSales(flowListOrdered);
  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Ventas',
        data: sales,
        backgroundColor: ['rgb(0, 128, 255)'],
        borderColor: ['rgb(0, 128, 255)'],
        borderWidth: 1,
      },
      {
        label: 'Compras',
        data: incomes,
        backgroundColor: ['rgb(255, 51, 51)'],
        borderColor: ['rgb(255, 51, 51)'],
        borderWidth: 1,
      },
    ],
  };
  return <Line options={options} data={data} />;
}

export default CompanyFlowChart;
