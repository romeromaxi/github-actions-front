import React, { useContext, useEffect, useState } from 'react';
import {
  DebtHistoryDetail,
  DebtHistoryDetailFields,
  SituationTypeFields,
} from '../../../types/nosis/nosisData';
import { count, groupBy } from '../../../util/helpers';
import { ChartDataset } from '../../../types/chart';
import { StackedBarChart } from '../../../components/charts/StackedBarChart';
import { dateFormatter } from '../../../util/formatters/dateFormatter';
import { BureauInformationContext } from 'hooks/contexts/BureauInformationContext';
import { EntityWithIdFields } from '../../../types/baseEntities';
import { SituationColorMap } from '../../../util/typification/situationColor';

interface EntitiesBySituationChartProps {
  debtHistoryDetailList?: DebtHistoryDetail[];
}

function EntitiesBySituationChart({
  debtHistoryDetailList,
}: EntitiesBySituationChartProps) {
  const { situationTypes } = useContext(BureauInformationContext);

  const [chartDatasets, setChartDatasets] = useState<ChartDataset[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);

  useEffect(() => {
    if (debtHistoryDetailList?.length) {
      const totalByPeriod = Object.values(
          groupBy(debtHistoryDetailList, [DebtHistoryDetailFields.Period]),
      ).map((e) => {
        return {
          [DebtHistoryDetailFields.Period]:
              e[0][DebtHistoryDetailFields.Period],
          total: Object.keys(count(e, DebtHistoryDetailFields.EntityCode)).length,
        };
      });

      const labels = [
        ...new Set(
            debtHistoryDetailList.map((d) => d[DebtHistoryDetailFields.Period]),
        ),
      ];

      const formattedLabels = labels
          .map((l) => dateFormatter.toFormat(l, 'YYYY/MM'))
          .reverse();
      setChartLabels(formattedLabels);

      const entitiesBySituation = Object.values(
          groupBy(debtHistoryDetailList, [DebtHistoryDetailFields.SituationCode]),
      ).map((e) =>
          Object.values(groupBy(e, [DebtHistoryDetailFields.Period])).map((v) => {
            const total =
                totalByPeriod.find(
                    (p) =>
                        p[DebtHistoryDetailFields.Period] ===
                        v[0][DebtHistoryDetailFields.Period],
                )?.total || 1;
            return {
              [DebtHistoryDetailFields.Period]:
                  v[0][DebtHistoryDetailFields.Period],
              [DebtHistoryDetailFields.SituationCode]:
                  v[0][DebtHistoryDetailFields.SituationCode],
              porcentaje:
                  (Object.keys(count(v, DebtHistoryDetailFields.EntityCode)).length /
                      total) *
                  100,
            };
          }),
      );

      const datasets: ChartDataset[] = [];
      entitiesBySituation.forEach(function (v, idx) {
        const situation = v[0][DebtHistoryDetailFields.SituationCode];
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
                parseInt(a[DebtHistoryDetailFields.Period]) -
                parseInt(b[DebtHistoryDetailFields.Period]),
        );

        datasets.push({
          label:
              situationTypes.find(
                  (s) => s[EntityWithIdFields.Id] === situation,
              )?.[SituationTypeFields.Description] || '',
          data: v.map((e) => e.porcentaje).reverse(),
          backgroundColor: SituationColorMap[situation].dark,
        } as ChartDataset);
      });

      setChartDatasets(datasets);
    }
  }, [debtHistoryDetailList]);


  return (
    <StackedBarChart
      title={'% de Entidades por Situación Ult 12 meses'}
      labels={chartLabels}
      datasets={chartDatasets}
      maxY={100}
    />
  );
}

export default EntitiesBySituationChart;
