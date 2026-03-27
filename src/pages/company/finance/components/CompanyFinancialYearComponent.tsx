import React from 'react';

import CardBase, { InformationShownType } from 'components/cards/CardBase';
import { EnumColors } from 'types/general/generalEnums';
import {
  CompanyFinancialYear,
  CompanyFinancialYearFields,
} from 'types/company/companyFinanceInformationData';

import CompanyFinancialYearSummaryContent from './CompanyFinancialYearSummaryContent';
import CompanyFinancialYearDetailContent from './CompanyFinancialYearDetailContent';
import CompanyFinancialYearEditFormContent from './CompanyFinancialYearEditFormContent';
import { EntityWithIdFields } from '../../../../types/baseEntities';

interface CompanyFinancialYearComponentProps {
  financialYear: CompanyFinancialYear;
  onReload: () => void;
  startEditing?: boolean;
}

export const CompanyFinancialYearComponentContext = React.createContext({
  companyId: 0 as number,
  financialYearId: 0 as number,
  patrimonialStatementId: 0 as number,
  incomeStatementId: 0 as number,
});

function CompanyFinancialYearComponent({
  financialYear,
  onReload,
  startEditing,
}: CompanyFinancialYearComponentProps) {
  const companyId: number = financialYear[CompanyFinancialYearFields.CompanyId];
  const financialYearId: number = financialYear[EntityWithIdFields.Id];
  const patrimonialStatementId: number =
    financialYear[CompanyFinancialYearFields.PatrimonialStatementId];
  const incomeStatementId: number =
    financialYear[CompanyFinancialYearFields.IncomeStatementId];

  return (
    <CompanyFinancialYearComponentContext.Provider
      value={{
        companyId,
        financialYearId,
        patrimonialStatementId,
        incomeStatementId,
      }}
    >
      <CardBase
        baseColor={EnumColors.GREEN}
        title="Ejercicio"
        showSummaryAlways
        startShowType={
          startEditing
            ? InformationShownType.EDITION
            : InformationShownType.SUMMARY
        }
        summaryContent={
          <CompanyFinancialYearSummaryContent financialYear={financialYear} />
        }
        detailContent={<CompanyFinancialYearDetailContent />}
        editContent={
          <CompanyFinancialYearEditFormContent onSubmit={onReload} />
        }
      />
    </CompanyFinancialYearComponentContext.Provider>
  );
}

export default CompanyFinancialYearComponent;
