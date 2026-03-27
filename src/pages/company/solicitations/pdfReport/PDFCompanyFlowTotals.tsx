import React, { useEffect, useState } from 'react';
import { View } from '@react-pdf/renderer';

import { PDFRow, PDFTitleCard } from 'components/pdf';

import { numberFormatter } from 'util/formatters/numberFormatter';
import {
  CompanyFlowFields,
  CompanyFlowSemesterData,
  CompanyFlowView,
} from 'types/company/companyFlowData';
import { groupBySum } from 'util/helpers';

interface PDFCompanyFlowTotalsProps {
  flowList: CompanyFlowSemesterData[] | CompanyFlowView[];
}

function PDFCompanyFlowTotals({ flowList }: PDFCompanyFlowTotalsProps) {
  const [groupedFlowList, setGroupedFlowList] = useState<CompanyFlowView[]>();

  const sortDesc = (a: CompanyFlowView, b: CompanyFlowView) =>
    a[CompanyFlowFields.Date] > b[CompanyFlowFields.Date] ? -1 : 1;

  useEffect(() => {
    const flowListDateYear = flowList.map((f) => {
      return {
        ...f,
        [CompanyFlowFields.Date]: new Date(
          f[CompanyFlowFields.Date],
        ).getFullYear(),
        [CompanyFlowFields.MonthQuantity]: 1,
      };
    });
    //@ts-ignore
    const groupedList: CompanyFlowView[] = groupBySum(
      flowListDateYear,
      [CompanyFlowFields.Date, CompanyFlowFields.CompanyId],
      [
        CompanyFlowFields.Income,
        CompanyFlowFields.Sale,
        CompanyFlowFields.MonthQuantity,
      ],
    );
    setGroupedFlowList(groupedList.sort(sortDesc));
  }, [flowList]);

  const rowHeaderColumn = [
    { label: 'Año' },
    { label: 'Compras' },
    { label: 'Ventas' },
  ];

  return (
    <>
      <PDFTitleCard title={'Totales por año'} />

      <View style={{ width: '100%' }}>
        <PDFRow columns={rowHeaderColumn} isHeader />

        {groupedFlowList?.map((flow) => (
          <PDFRow
            columns={[
              {
                label: `${flow[CompanyFlowFields.Date]} (${flow[CompanyFlowFields.MonthQuantity]} meses incluidos)`,
              },
              {
                label: numberFormatter.toStringWithAmount(
                  flow[CompanyFlowFields.Income],
                  '$',
                ),
              },
              {
                label: numberFormatter.toStringWithAmount(
                  flow[CompanyFlowFields.Sale],
                  '$',
                ),
              },
            ]}
          />
        ))}
      </View>
    </>
  );
}

export default PDFCompanyFlowTotals;
