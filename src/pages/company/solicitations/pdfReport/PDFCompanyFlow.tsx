import React from 'react';
import { Text, View } from '@react-pdf/renderer';

import { PDFRow, PDFTitle, PDFTitleCard } from 'components/pdf';

import { dateFormatter } from 'util/formatters/dateFormatter';
import { numberFormatter } from 'util/formatters/numberFormatter';
import {
  CompanyFlowFields,
  CompanyFlowSemesterData,
  CompanyFlowView,
} from 'types/company/companyFlowData';

interface PDFCompanyFlowProps {
  flowList: CompanyFlowSemesterData[] | CompanyFlowView[];
}

function PDFCompanyFlow({ flowList }: PDFCompanyFlowProps) {
  const reverseFlowList = [...flowList].reverse();

  const rowHeaderColumn = [
    { label: 'Fecha' },
    { label: 'Ventas' },
    { label: 'Compras' },
  ];

  return (
    <>
      <PDFTitleCard title={'Movimientos'} />

      <View style={{ width: '100%' }}>
        <PDFRow columns={rowHeaderColumn} isHeader />

        {reverseFlowList.map((oneColumn, index) => (
          <PDFRow
            columns={[
              {
                label: dateFormatter.toMonthNameWithYear(
                  oneColumn[CompanyFlowFields.Date],
                  true,
                ),
              },
              {
                label: numberFormatter.toStringWithAmount(
                  oneColumn[CompanyFlowFields.Income],
                  '$',
                ),
              },
              {
                label: numberFormatter.toStringWithAmount(
                  oneColumn[CompanyFlowFields.Sale],
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

export default PDFCompanyFlow;
