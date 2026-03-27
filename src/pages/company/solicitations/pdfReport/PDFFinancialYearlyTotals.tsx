import React from 'react';
import { Text, View } from '@react-pdf/renderer';

import { PDFRow, PDFTitleCard } from 'components/pdf';

import {
  CompanyFinancialTotals,
  CompanyFinancialTotalsFields,
} from 'types/company/companyFinanceInformationData';
import { dateFormatter } from 'util/formatters/dateFormatter';
import { numberFormatter } from 'util/formatters/numberFormatter';

interface ITableColumn {
  label: string;
  value: CompanyFinancialTotalsFields;
  subtotal?: boolean;
  total?: boolean;
}

interface PDFFinancialYearlyTotalsProps {
  totals: CompanyFinancialTotals[];
}

function PDFFinancialYearlyTotals({ totals }: PDFFinancialYearlyTotalsProps) {
  const currentTotal: CompanyFinancialTotals =
    totals[0] || ({} as CompanyFinancialTotals);
  const prevTotal: CompanyFinancialTotals =
    totals[1] || ({} as CompanyFinancialTotals);
  const year = dateFormatter.toYearDate(
    currentTotal[CompanyFinancialTotalsFields.Date],
  );
  const closing = dateFormatter.toMonthNameWithDay(
    currentTotal[CompanyFinancialTotalsFields.Date],
  );

  const columns: ITableColumn[] = [
    {
      label: 'Activo Corriente',
      value: CompanyFinancialTotalsFields.ActiveCurrentTotal,
      subtotal: true,
    },
    {
      label: 'Activo No Corriente',
      value: CompanyFinancialTotalsFields.ActiveNotCurrentTotal,
      subtotal: true,
    },
    {
      label: 'Total Activo',
      value: CompanyFinancialTotalsFields.ActiveTotal,
      total: true,
    },
    {
      label: 'Pasivo Corriente',
      value: CompanyFinancialTotalsFields.PassiveCurrentTotal,
      subtotal: true,
    },
    {
      label: 'Pasivo No Corriente',
      value: CompanyFinancialTotalsFields.PassiveNotCurrentTotal,
      subtotal: true,
    },
    {
      label: 'Total Pasivo',
      value: CompanyFinancialTotalsFields.PassiveTotal,
      total: true,
    },
    {
      label: 'Patrimonio Neto',
      value: CompanyFinancialTotalsFields.NetPatrimonyTotal,
      total: true,
    },
  ];

  const resultColumns: ITableColumn[] = [
    {
      label: 'Resultado Neto',
      value: CompanyFinancialTotalsFields.NetResult,
      total: true,
    },
  ];

  const rowHeaderColumn = [
    { label: ' ' },
    {
      label: dateFormatter.toYearDate(
        totals[0][CompanyFinancialTotalsFields.Date],
      ),
    },
    {
      label: dateFormatter.toYearDate(
        totals[1][CompanyFinancialTotalsFields.Date],
      ),
    },
    { label: 'Variación' },
  ];

  const getVariation = (field: CompanyFinancialTotalsFields): string => {
    //@ts-ignore
    let currentYear: number | undefined = currentTotal[field];
    //@ts-ignore
    let lastYear: number | undefined = prevTotal[field];

    if (!currentYear || !lastYear) return '-';

    return numberFormatter.toStringWithPercentage(
      ((currentYear - lastYear) / lastYear) * 100,
    );
  };

  const getAmount = (
    financialTotal: CompanyFinancialTotals,
    field: CompanyFinancialTotalsFields,
  ): string =>
    // @ts-ignore
    numberFormatter.toStringWithAmount(financialTotal[field], '$', 0);

  return (
    <>
      <PDFTitleCard
        title={`Ejercicio ${year}`}
        subtitle={`Cierre: ${closing}`}
      />

      <View style={{ width: '100%' }}>
        <Text style={{ fontWeight: 600, fontSize: '10px', marginTop: '8px' }}>
          Estado de Situación Patrimonial
        </Text>

        <PDFRow columns={rowHeaderColumn} isHeader />

        {columns.map((oneColumn, index) => (
          <PDFRow
            columns={[
              { label: oneColumn.label },
              { label: getAmount(currentTotal, oneColumn.value) },
              { label: getAmount(prevTotal, oneColumn.value) },
              { label: getVariation(oneColumn.value) },
            ]}
          />
        ))}

        <Text style={{ fontWeight: 600, fontSize: '10px', marginTop: '8px' }}>
          Estado de Resultado
        </Text>

        <PDFRow columns={rowHeaderColumn} isHeader />

        {resultColumns.map((oneColumn, index) => (
          <PDFRow
            columns={[
              { label: oneColumn.label },
              { label: getAmount(currentTotal, oneColumn.value) },
              { label: getAmount(prevTotal, oneColumn.value) },
              { label: getVariation(oneColumn.value) },
            ]}
          />
        ))}
      </View>
    </>
  );
}

export default PDFFinancialYearlyTotals;
