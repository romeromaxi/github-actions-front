import React, { useContext, useEffect, useState } from 'react';

import { ITableColumn, TableListCompanyFileSummary } from 'components/table';
import { CompanyFinancialSummaryContext } from '../CompanyFinancialSummary';

import { numberFormatter } from 'util/formatters/numberFormatter';
import {
  CompanyFlowFields,
  CompanyFlowTotals,
} from 'types/company/companyFlowData';

enum DescriptionFlowTotalsFields {
  Description = 'description',
  Detail = 'detail',
}

interface DescriptionFlowTotals {
  [DescriptionFlowTotalsFields.Description]: string;
  [DescriptionFlowTotalsFields.Detail]: string;
}

interface CompanyFlowTableProps {
  physicalPerson?: boolean;
}

function CompanyFlowTable({ physicalPerson }: CompanyFlowTableProps) {
  const { flowTotals } = useContext(CompanyFinancialSummaryContext);

  const [lstFlowTotals, setFlowTotals] = useState<DescriptionFlowTotals[]>();

  const columns: ITableColumn[] = [
    { label: 'Movimientos', value: DescriptionFlowTotalsFields.Description },
    {
      label: physicalPerson ? 'Últimos 12 meses' : 'Detalle',
      value: DescriptionFlowTotalsFields.Detail,
    },
  ];

  const getTotalAmount = (
    total: CompanyFlowTotals | undefined,
    fields: CompanyFlowFields.Income | CompanyFlowFields.Sale,
  ): string => {
    if (total === undefined) return 'Sin Datos';

    if (!total) return numberFormatter.toStringWithAmount(0, '$');

    return numberFormatter.toStringWithAmount(total[fields], '$');
  };

  useEffect(() => {
    let list: DescriptionFlowTotals[] = [];

    list.push({
      [DescriptionFlowTotalsFields.Description]: physicalPerson
        ? 'Ingresos:'
        : 'Total Ventas:',
      [DescriptionFlowTotalsFields.Detail]: getTotalAmount(
        flowTotals,
        CompanyFlowFields.Income,
      ),
    });

    list.push({
      [DescriptionFlowTotalsFields.Description]: physicalPerson
        ? 'Egresos:'
        : 'Total Gastos:',
      [DescriptionFlowTotalsFields.Detail]: getTotalAmount(
        flowTotals,
        CompanyFlowFields.Sale,
      ),
    });

    setFlowTotals(list);
  }, [flowTotals]);

  return (
    <TableListCompanyFileSummary
      entityList={lstFlowTotals}
      columns={columns}
      isLoading={!lstFlowTotals}
      error={false}
    />
  );
}

export default CompanyFlowTable;
