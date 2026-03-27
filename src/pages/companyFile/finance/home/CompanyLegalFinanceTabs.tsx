import { CompanyFinancialTotals } from '../../../../types/company/companyFinanceInformationData';
import CompanyFileFinancialSummaryTab from '../components/CompanyFileFinancialSummaryTab';
import React from 'react';

interface CompanyLegalFinanceTabsProps {
  lastFinancialTotals: CompanyFinancialTotals[];
  prevFinancialTotals: CompanyFinancialTotals[];
  hideFlows?: boolean;
}

const CompanyLegalFinanceTabs = ({
  lastFinancialTotals,
  prevFinancialTotals,
  hideFlows = false,
}: CompanyLegalFinanceTabsProps) => {
  return (
    <CompanyFileFinancialSummaryTab
      totalsLast={lastFinancialTotals}
      totalsPrev={prevFinancialTotals}
      hideFlows={hideFlows}
    />
  );
};

export default CompanyLegalFinanceTabs;
