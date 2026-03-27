import React, { useContext, useEffect, useState } from 'react';
import {
  DebtHistoryDetail,
  DebtHistoryDetailFields,
  SituationTypeFields,
} from '../../../types/nosis/nosisData';
import { groupBy, groupBySum } from '../../../util/helpers';
import { StackedBarChart } from '../../../components/charts/StackedBarChart';
import { ChartDataset } from '../../../types/chart';
import { dateFormatter } from '../../../util/formatters/dateFormatter';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { BureauInformationContext } from 'hooks/contexts/BureauInformationContext';
import { SituationColorMap } from '../../../util/typification/situationColor';
import { SituationTypeCodes } from '../../../types/general/generalEnums';

interface DebtAmountBySituationChartProps {
  debtHistoryDetailList?: DebtHistoryDetail[];
}

function DebtAmountBySituationChart({
  debtHistoryDetailList,
}: DebtAmountBySituationChartProps) {
  const { situationTypes } = useContext(BureauInformationContext);

  const [chartDatasets, setChartDatasets] = useState<any[]>([]);
  const [chartLabels, setChartLabels] = useState<any[]>([]);

  useEffect(() => {
    if (debtHistoryDetailList) {
      const totalByPeriod = groupBySum(
        debtHistoryDetailList,
        [DebtHistoryDetailFields.Period],
        [DebtHistoryDetailFields.Amount],
      );
      const labels = totalByPeriod.map((e) => e.periodo).reverse();
      setChartLabels(labels.map((l) => dateFormatter.toFormat(l, 'YYYY/MM')));
      const totalByPeriodSituation = groupBySum(
        debtHistoryDetailList,
        [DebtHistoryDetailFields.Period, DebtHistoryDetailFields.SituationCode],
        [DebtHistoryDetailFields.Amount],
      );
      const percentage = totalByPeriodSituation.map((e) => {
        const total = totalByPeriod.find(
          (p) =>
            p[DebtHistoryDetailFields.Period] ===
            e[DebtHistoryDetailFields.Period],
        )?.[DebtHistoryDetailFields.Amount];
        return {
          [DebtHistoryDetailFields.Period]: e[DebtHistoryDetailFields.Period],
          [DebtHistoryDetailFields.SituationCode]:
            e[DebtHistoryDetailFields.SituationCode],
          porcentaje: (e[DebtHistoryDetailFields.Amount] / total) * 100,
        };
      });

      const groupedPercentage = Object.values(
        groupBy(percentage, [DebtHistoryDetailFields.SituationCode]),
      );
      const datasets: ChartDataset[] = [];
      groupedPercentage.forEach(function (v, idx) {
        const situation: SituationTypeCodes =
          v[0][DebtHistoryDetailFields.SituationCode];
        const dates = v.map((e) => e[DebtHistoryDetailFields.Period]);
        const absentDates = labels.filter((e) => !dates.includes(e));
        v.push(
          ...absentDates.map((date) => ({
            [DebtHistoryDetailFields.Period]: date,
            [DebtHistoryDetailFields.SituationCode]: situation,
            porcentaje: 0,
          })),
        );
        v.sort(
          (a, b) =>
            a[DebtHistoryDetailFields.Period] -
            b[DebtHistoryDetailFields.Period],
        );
        datasets.push({
          label:
            situationTypes.find(
              (s) => s[EntityWithIdFields.Id] === situation,
            )?.[SituationTypeFields.Description] || '',
          data: v.map((e) => e.porcentaje),
          backgroundColor: SituationColorMap[situation].dark,
        } as ChartDataset);
      });
      setChartDatasets(datasets);
    }
  }, [debtHistoryDetailList, situationTypes]);

  return (
    <StackedBarChart
      title={'% de Montos por Situación Ult 12 meses'}
      labels={chartLabels}
      datasets={chartDatasets}
      maxY={100}
    />
  );
}

export default DebtAmountBySituationChart;
