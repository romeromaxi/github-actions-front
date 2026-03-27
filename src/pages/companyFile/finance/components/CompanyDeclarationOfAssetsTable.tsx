import React, { useContext, useEffect, useState } from 'react';

import { ITableColumn, TableListCompanyFileSummary } from 'components/table';
import { CompanyFinancialSummaryContext } from '../CompanyFinancialSummary';

import {
  CompanyDeclarationOfAssetsFields,
  CompanyDeclarationOfAssetsTotals,
  CompanyDeclarationOfAssetsTotalsFields,
} from 'types/company/companyFinanceInformationData';
import { numberFormatter } from 'util/formatters/numberFormatter';

function CompanyDeclarationOfAssetsTable() {
  const { declarationOfAssets } = useContext(CompanyFinancialSummaryContext);

  const [lstDeclarationOfAssetsTotals, setDeclarationOfAssetsTotals] =
    useState<CompanyDeclarationOfAssetsTotals[]>();

  const columns: ITableColumn[] = [
    { label: '', value: CompanyDeclarationOfAssetsTotalsFields.Description },
    { label: 'Detalle', value: CompanyDeclarationOfAssetsTotalsFields.Detail },
  ];

  const getTotalAmount = (totals: number[] | undefined): string => {
    if (!totals) return 'Sin Datos';

    return numberFormatter.toStringWithAmount(
      totals.reduce((a, b) => a + b),
      '$',
    );
  };

  useEffect(() => {
    let list: CompanyDeclarationOfAssetsTotals[] = [];

    list.push({
      [CompanyDeclarationOfAssetsTotalsFields.Description]:
        'Efectivo y Bancos:',
      [CompanyDeclarationOfAssetsTotalsFields.Detail]: getTotalAmount(
        declarationOfAssets
          ? [
              declarationOfAssets[CompanyDeclarationOfAssetsFields.Cash],
              declarationOfAssets[
                CompanyDeclarationOfAssetsFields.BankCheckingSavingsAccounts
              ],
              declarationOfAssets[CompanyDeclarationOfAssetsFields.DepositTime],
            ]
          : undefined,
      ),
    });

    list.push({
      [CompanyDeclarationOfAssetsTotalsFields.Description]: 'Rodados:',
      [CompanyDeclarationOfAssetsTotalsFields.Detail]: getTotalAmount(
        declarationOfAssets
          ? [declarationOfAssets[CompanyDeclarationOfAssetsFields.Cars]]
          : undefined,
      ),
    });

    list.push({
      [CompanyDeclarationOfAssetsTotalsFields.Description]: 'Inmuebles:',
      [CompanyDeclarationOfAssetsTotalsFields.Detail]: getTotalAmount(
        declarationOfAssets
          ? [
              declarationOfAssets[
                CompanyDeclarationOfAssetsFields.LandApartments
              ],
            ]
          : undefined,
      ),
    });

    list.push({
      [CompanyDeclarationOfAssetsTotalsFields.Description]:
        'Préstamos del Banco:',
      [CompanyDeclarationOfAssetsTotalsFields.Detail]: getTotalAmount(
        declarationOfAssets
          ? [declarationOfAssets[CompanyDeclarationOfAssetsFields.BankLoans]]
          : undefined,
      ),
    });

    list.push({
      [CompanyDeclarationOfAssetsTotalsFields.Description]:
        'Participaciones accionarias:',
      [CompanyDeclarationOfAssetsTotalsFields.Detail]: getTotalAmount(
        declarationOfAssets
          ? [
              declarationOfAssets[
                CompanyDeclarationOfAssetsFields.SharesOfStock
              ],
            ]
          : undefined,
      ),
    });

    list.push({
      [CompanyDeclarationOfAssetsTotalsFields.Description]: 'Otros Bienes:',
      [CompanyDeclarationOfAssetsTotalsFields.Detail]: getTotalAmount(
        declarationOfAssets
          ? [declarationOfAssets[CompanyDeclarationOfAssetsFields.OtherAssets]]
          : undefined,
      ),
    });

    list.push({
      [CompanyDeclarationOfAssetsTotalsFields.Description]: 'Otros Créditos:',
      [CompanyDeclarationOfAssetsTotalsFields.Detail]: getTotalAmount(
        declarationOfAssets
          ? [
              declarationOfAssets[
                CompanyDeclarationOfAssetsFields.OtherReceivables
              ],
            ]
          : undefined,
      ),
    });

    setDeclarationOfAssetsTotals(list);
  }, [declarationOfAssets]);

  return (
    <TableListCompanyFileSummary
      entityList={lstDeclarationOfAssetsTotals}
      columns={columns}
      isLoading={!lstDeclarationOfAssetsTotals}
      error={false}
    />
  );
}

export default CompanyDeclarationOfAssetsTable;
