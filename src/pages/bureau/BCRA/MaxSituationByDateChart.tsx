import React, { useContext } from 'react';
import {
  DebtHistoryDetail,
  DebtHistoryDetailFields,
  SituationTypeFields,
} from '../../../types/nosis/nosisData';
import { groupBy } from '../../../util/helpers';
import LineChart from '../../../components/charts/LineChart';
import { dateFormatter } from '../../../util/formatters/dateFormatter';
import { BureauInformationContext } from 'hooks/contexts/BureauInformationContext';
import { EntityWithIdFields } from '../../../types/baseEntities';

interface MaxSituationByDateChartProps {
  debtHistoryDetailList?: DebtHistoryDetail[];
}

function MaxSituationByDateChart({
  debtHistoryDetailList,
}: MaxSituationByDateChartProps) {
  const { situationTypes } = useContext(BureauInformationContext);

  return (
    <LineChart
      title={'Máxima Situación Informada'}
      data={Object.values(
        groupBy(debtHistoryDetailList, [DebtHistoryDetailFields.Period]),
      ).map((debtList) =>
        Math.max(
          ...debtList.map((e) => e[DebtHistoryDetailFields.SituationCode]),
        ),
      )}
      labels={Object.keys(
        groupBy(debtHistoryDetailList, [DebtHistoryDetailFields.Period]),
      ).map((p) => dateFormatter.toFormat(p, 'YYYY/MM'))}
      options={{
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 1,
            max: 6,
            ticks: {
              stepSize: 1,
              padding: 0, 
              maxTicksLimit: 6, 
              callback: function (value, index, ticks) {
                const desc =
                  situationTypes?.find(
                    (s) =>
                      s[EntityWithIdFields.Id] === parseInt(value.toString()),
                  )?.[SituationTypeFields.Description] || '';
                if (desc) {
                  return [
                    ...(desc
                      .match(/\b[\w\s]{17,}?(?=\s)|.+$/g)
                      ?.map((s) => s.trim()) as string[]),
                  ];
                }
                // const a = [...desc?.match(/\b[\w\s]{15,}?(?=\s)|.+$/g)?.map(s => s.trim()) as string []]
                // const a = desc?.match(/\b[\w\s]{15,}?(?=\s)|.+$/g)?.map(s => s.trim())
                else return value;
              },
            },
          },
        },
      }}
    />
  );
}

export default MaxSituationByDateChart;
