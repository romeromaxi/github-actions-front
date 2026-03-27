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

let initialColumns: ITableColumn[] = [
  { label: '', value: DescriptionCompanyFinancialTotalsFields.Description },
  {
    label: '-',
    value: DescriptionCompanyFinancialTotalsFields.TotalCurrentYear,
  },
  {
    label: '-',
    value: DescriptionCompanyFinancialTotalsFields.TotalPreviousYear,
  },
];

function CompanyPatrimonialStatementTable() {
  const { lstFinancialTotals } = useContext(CompanyFinancialSummaryContext);

  const [lstPatrimonialStatementTotals, setPatrimonialStatementTotals] =
    useState<DescriptionCompanyFinancialTotals[]>();
  const [columns, setColumns] = useState<ITableColumn[]>(initialColumns);

  const getTotalAmount = (
    total: CompanyFinancialTotals | undefined,
    fields:
      | CompanyFinancialTotalsFields.ActiveTotal
      | CompanyFinancialTotalsFields.PassiveTotal
      | CompanyFinancialTotalsFields.NetPatrimonyTotal,
  ): string => {
    if (!total) return 'Sin Datos';

    return numberFormatter.toStringWithAmount(total[fields], '$');
  };

  const getTotalIncome = (
    total: CompanyFinancialTotals | undefined,
    perMonth?: boolean,
  ): string => {
    if (!total) return 'Sin Datos';

    return numberFormatter.toStringWithAmount(
      perMonth
        ? total[CompanyFinancialTotalsFields.IncomeTotal] / 12
        : total[CompanyFinancialTotalsFields.IncomeTotal],
      '$',
    );
  };

  const getYear = (total: CompanyFinancialTotals | undefined): string => {
    if (!total) return '-';

    let year: string = total[CompanyFinancialTotalsFields.Date]
      .toString()
      .substring(0, 4);

    return `Año ${year}`;
  };

  useEffect(() => {
    if (lstFinancialTotals) {
      let list: DescriptionCompanyFinancialTotals[] = [];

      let currentTotal: CompanyFinancialTotals =
        lstFinancialTotals[0] ?? undefined;
      let previousTotal: CompanyFinancialTotals | undefined =
        lstFinancialTotals[1] ?? undefined;

      let auxColumns: ITableColumn[] = [
        {
          label: 'Balance',
          value: DescriptionCompanyFinancialTotalsFields.Description,
        },
        {
          label: getYear(currentTotal),
          value: DescriptionCompanyFinancialTotalsFields.TotalCurrentYear,
        },
        {
          label: getYear(previousTotal),
          value: DescriptionCompanyFinancialTotalsFields.TotalPreviousYear,
        },
      ];

      list.push({
        [DescriptionCompanyFinancialTotalsFields.Description]: 'Activo:',
        [DescriptionCompanyFinancialTotalsFields.TotalCurrentYear]:
          getTotalAmount(
            currentTotal,
            CompanyFinancialTotalsFields.ActiveTotal,
          ),
        [DescriptionCompanyFinancialTotalsFields.TotalPreviousYear]:
          getTotalAmount(
            previousTotal,
            CompanyFinancialTotalsFields.ActiveTotal,
          ),
      });

      list.push({
        [DescriptionCompanyFinancialTotalsFields.Description]: 'Pasivo:',
        [DescriptionCompanyFinancialTotalsFields.TotalCurrentYear]:
          getTotalAmount(
            currentTotal,
            CompanyFinancialTotalsFields.PassiveTotal,
          ),
        [DescriptionCompanyFinancialTotalsFields.TotalPreviousYear]:
          getTotalAmount(
            previousTotal,
            CompanyFinancialTotalsFields.PassiveTotal,
          ),
      });

      list.push({
        [DescriptionCompanyFinancialTotalsFields.Description]: 'Patrimonio:',
        [DescriptionCompanyFinancialTotalsFields.TotalCurrentYear]:
          getTotalAmount(
            currentTotal,
            CompanyFinancialTotalsFields.NetPatrimonyTotal,
          ),
        [DescriptionCompanyFinancialTotalsFields.TotalPreviousYear]:
          getTotalAmount(
            previousTotal,
            CompanyFinancialTotalsFields.NetPatrimonyTotal,
          ),
      });

      list.push({
        [DescriptionCompanyFinancialTotalsFields.Description]: 'Ventas:',
        [DescriptionCompanyFinancialTotalsFields.TotalCurrentYear]:
          getTotalIncome(currentTotal),
        [DescriptionCompanyFinancialTotalsFields.TotalPreviousYear]:
          getTotalIncome(previousTotal),
      });

      list.push({
        [DescriptionCompanyFinancialTotalsFields.Description]: 'Ventas / 12:',
        [DescriptionCompanyFinancialTotalsFields.TotalCurrentYear]:
          getTotalIncome(currentTotal, true),
        [DescriptionCompanyFinancialTotalsFields.TotalPreviousYear]:
          getTotalIncome(previousTotal, true),
      });

      setColumns(auxColumns);
      setPatrimonialStatementTotals(list);
    }
  }, [lstFinancialTotals]);

  return (
    <TableListCompanyFileSummary
      entityList={lstPatrimonialStatementTotals}
      columns={columns}
      isLoading={!lstPatrimonialStatementTotals}
      error={false}
    />
  );
}

export default CompanyPatrimonialStatementTable;
