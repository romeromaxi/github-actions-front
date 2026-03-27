import React from 'react';
import { Text, View } from '@react-pdf/renderer';

import { PDFRow, PDFTitleCard } from 'components/pdf';

import {
  CompanyDeclarationOfAssetsTotals,
  CompanyDeclarationOfAssetsTotalsFields,
} from 'types/company/companyFinanceInformationData';
import { dateFormatter } from 'util/formatters/dateFormatter';
import { numberFormatter } from 'util/formatters/numberFormatter';

interface ITableColumn {
  label: string;
  value: CompanyDeclarationOfAssetsTotalsFields;
  subtotal?: boolean;
  total?: boolean;
}

interface PDFDeclarationOfAssetsTotalsProps {
  totals: CompanyDeclarationOfAssetsTotals[];
}

function PDFDeclarationOfAssetsTotals({
  totals,
}: PDFDeclarationOfAssetsTotalsProps) {
  const currentTotal: CompanyDeclarationOfAssetsTotals =
    totals[0] || ({} as CompanyDeclarationOfAssetsTotals);
  const prevTotal: CompanyDeclarationOfAssetsTotals =
    totals[1] || ({} as CompanyDeclarationOfAssetsTotals);
  const date = dateFormatter.toShortDate(
    currentTotal[CompanyDeclarationOfAssetsTotalsFields.Date],
  );

  const columns: ITableColumn[] = [
    {
      label: 'Activo Corriente',
      value: CompanyDeclarationOfAssetsTotalsFields.CurrentActiveTotal,
      subtotal: true,
    },
    {
      label: 'Activo No Corriente',
      value: CompanyDeclarationOfAssetsTotalsFields.NonCurrentActiveTotal,
      subtotal: true,
    },
    {
      label: 'Total Activo',
      value: CompanyDeclarationOfAssetsTotalsFields.ActiveTotal,
      total: true,
    },
    {
      label: 'Pasivo Corriente',
      value: CompanyDeclarationOfAssetsTotalsFields.CurrentPassiveTotal,
      subtotal: true,
    },
    {
      label: 'Pasivo No Corriente',
      value: CompanyDeclarationOfAssetsTotalsFields.NonCurrentPassiveTotal,
      subtotal: true,
    },
    {
      label: 'Total Pasivo',
      value: CompanyDeclarationOfAssetsTotalsFields.PassiveTotal,
      total: true,
    },
    {
      label: 'Patrimonio Neto',
      value: CompanyDeclarationOfAssetsTotalsFields.NetPatrimonyTotal,
      total: true,
    },
  ];

  const rowHeaderColumn = [
    { label: ' ' },
    { label: 'Valor Mercado' },
    { label: 'Valor Fiscal' },
  ];

  const getAmount = (
    financialTotal: CompanyDeclarationOfAssetsTotals,
    field: CompanyDeclarationOfAssetsTotalsFields,
  ): string =>
    // @ts-ignore
    numberFormatter.toStringWithAmount(financialTotal[field], '$', 0);

  return (
    <>
      <PDFTitleCard
        title={`Manifestación de Bienes`}
        subtitle={`Fecha: ${date}`}
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
            ]}
          />
        ))}
      </View>
    </>
  );
}

export default PDFDeclarationOfAssetsTotals;
