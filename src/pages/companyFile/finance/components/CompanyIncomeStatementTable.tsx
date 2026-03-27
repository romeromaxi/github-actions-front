import React, { useContext, useEffect, useState } from 'react';

import { ITableColumn, TableListCompanyFileSummary } from 'components/table';
import { CompanyFinancialSummaryContext } from '../CompanyFinancialSummary';

import {
  CompanyFinancialTotals,
  CompanyFinancialTotalsFields,
  DescriptionCompanyFinancialTotals,
  DescriptionCompanyFinancialTotalsFields,
} from 'types/company/companyFinanceInformationData';
import { numberFormatter } from 'util/formatters/numberFormatter';

function CompanyIncomeStatementTable() {
  const { lstFinancialTotals } = useContext(CompanyFinancialSummaryContext);

  const [lstIncomeStatementTotals, setIncomeStatementTotals] =
    useState<DescriptionCompanyFinancialTotals[]>();

  const columns: ITableColumn[] = [
    {
      label: 'Estado de Resultados',
      value: DescriptionCompanyFinancialTotalsFields.Description,
    },
    {
      label: 'Año Corriente',
      value: DescriptionCompanyFinancialTotalsFields.TotalCurrentYear,
    },
    {
      label: 'Año Anterior',
      value: DescriptionCompanyFinancialTotalsFields.TotalPreviousYear,
    },
  ];

  const getTotalAmount = (
    total: CompanyFinancialTotals | undefined,
    perMonth?: boolean,
  ): string => {
    if (!total) return 'Sin Datos';

    let amount: number = perMonth
      ? total[CompanyFinancialTotalsFields.IncomeTotal] / 12
      : total[CompanyFinancialTotalsFields.IncomeTotal];

    return numberFormatter.toStringWithAmount(amount, '$');
  };

  useEffect(() => {
    if (lstFinancialTotals) {
      let list: DescriptionCompanyFinancialTotals[] = [];

      let currentTotal: CompanyFinancialTotals =
        lstFinancialTotals[0] ?? undefined;
      let previousTotal: CompanyFinancialTotals | undefined =
        lstFinancialTotals[1] ?? undefined;

      list.push({
        [DescriptionCompanyFinancialTotalsFields.Description]:
          'Ventas Promedio:',
        [DescriptionCompanyFinancialTotalsFields.TotalCurrentYear]:
          getTotalAmount(currentTotal),
        [DescriptionCompanyFinancialTotalsFields.TotalPreviousYear]:
          getTotalAmount(previousTotal),
      });

      list.push({
        [DescriptionCompanyFinancialTotalsFields.Description]: 'Ventas / 12:',
        [DescriptionCompanyFinancialTotalsFields.TotalCurrentYear]:
          getTotalAmount(currentTotal, true),
        [DescriptionCompanyFinancialTotalsFields.TotalPreviousYear]:
          getTotalAmount(previousTotal, true),
      });

      setIncomeStatementTotals(list);
    }
  }, [lstFinancialTotals]);

  return (
    <TableListCompanyFileSummary
      entityList={lstIncomeStatementTotals}
      columns={columns}
      isLoading={!lstIncomeStatementTotals}
      error={false}
    />
  );
}

export default CompanyIncomeStatementTable;
