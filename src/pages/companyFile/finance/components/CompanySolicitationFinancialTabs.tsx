import React, { useEffect, useState } from 'react';
import {
  CompanyDeclarationOfAssetsTotals,
  CompanyFinancialTotals,
  CompanyFinancialTotalsFields,
  CompanyIncomeLastYearStatement,
  CompanyPatrimonialStatement,
} from 'types/company/companyFinanceInformationData';
import { HttpCompanyFile } from 'http/index';
import { Box } from '@mui/material';
import { PersonTypes } from '../../../../types/person/personEnums';
import CompanyLegalFinanceTabs from '../home/CompanyLegalFinanceTabs';
import CompanyPhysicalFinanceTabs from '../home/CompanyPhysicalFinanceTabs';
import { CompanyFileSourceType } from '../../../../types/company/companyEnums';
import { Alert } from '@mui/lab';

interface CompanySolicitationFinancialTabsProps {
  fileId: number;
  personType?: PersonTypes;
}

function CompanySolicitationFinancialTabs({
  fileId,
  personType = PersonTypes.Legal,
}: CompanySolicitationFinancialTabsProps) {
  const [isLoading, setLoading] = useState<boolean>();
  const [lastFinancialTotals, setFinancialTotals] =
    useState<CompanyFinancialTotals[]>();
  const [prevFinancialTotals, setPrevFinancialTotals] =
    useState<CompanyFinancialTotals[]>();
  const [lastPatrimonial, setLastPatrimonial] =
    useState<CompanyPatrimonialStatement>();
  const [prevPatrimonial, setPrevPatrimonial] =
    useState<CompanyPatrimonialStatement>();
  const [lastIncome, setLastIncome] =
    useState<CompanyIncomeLastYearStatement>();
  const [prevIncome, setPrevIncome] =
    useState<CompanyIncomeLastYearStatement>();
  const [declarationOfAssetsTotals, setDeclarationOfAssetsTotals] =
    useState<CompanyDeclarationOfAssetsTotals[]>();

  const sortByDateDesc = (
    a: CompanyFinancialTotals,
    b: CompanyFinancialTotals,
  ): number => {
    return a[CompanyFinancialTotalsFields.Date] <
      b[CompanyFinancialTotalsFields.Date]
      ? 1
      : -1;
  };

  const loadCompanyFileData = () => {
    Promise.all([
      HttpCompanyFile.getCompanyFinanceLastTotalsByFileId(fileId),
      HttpCompanyFile.getCompanyFinancePreviousTotalsByFileId(fileId),
    ]).then((values) => {
      const lastFinancial: CompanyFinancialTotals[] =
        values[0].sort(sortByDateDesc);
      const prevFinancial: CompanyFinancialTotals[] =
        values[1].sort(sortByDateDesc);
      setFinancialTotals(lastFinancial);
      setPrevFinancialTotals(prevFinancial);
    });

    Promise.all([
      HttpCompanyFile.getCompanyLastPatrimonialStateByFileId(fileId),
      HttpCompanyFile.getCompanyPreviousPatrimonialStateByFileId(fileId),
    ]).then((values) => {
      setLastPatrimonial(values[0]);
      setPrevPatrimonial(values[1]);
    });

    Promise.all([
      HttpCompanyFile.getCompanyLastIncomeStateByFileId(fileId),
      HttpCompanyFile.getCompanyPreviousIncomeStateByFileId(fileId),
    ]).then((values) => {
      setLastIncome(values[0]);
      setPrevIncome(values[1]);
      setLoading(false);
    });
  };

  const loadPhysicalCompanyFileData = () => {
    HttpCompanyFile.getCompanyLastDeclarationOfAssetsTotalsByFileId(
      fileId,
    ).then((doa) => {
      setDeclarationOfAssetsTotals(doa);
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);

    personType === PersonTypes.Legal
      ? loadCompanyFileData()
      : loadPhysicalCompanyFileData();
  }, [fileId]);

  return (
    <Box sx={{ marginTop: 4, marginBottom: 2 }}>
      {!isLoading ? (
        <>
          {personType === PersonTypes.Legal
            ? lastFinancialTotals &&
              lastFinancialTotals.length !== 0 &&
              prevFinancialTotals &&
              prevFinancialTotals.length !== 0 &&
              lastPatrimonial &&
              prevPatrimonial &&
              lastIncome &&
              prevIncome && (
                <CompanyLegalFinanceTabs
                  lastFinancialTotals={lastFinancialTotals}
                  prevFinancialTotals={prevFinancialTotals}
                  lastPatrimonial={lastPatrimonial}
                  prevPatrimonial={prevPatrimonial}
                  lastIncome={lastIncome}
                  prevIncome={prevIncome}
                />
              )
            : declarationOfAssetsTotals &&
              declarationOfAssetsTotals.length !== 0 && (
                <CompanyPhysicalFinanceTabs
                  dataId={fileId}
                  dataSource={CompanyFileSourceType.CompanyFile}
                  declarationOfAssetsTotals={declarationOfAssetsTotals}
                />
              )}
        </>
      ) : (
        <Alert severity="info">Cargando ......</Alert>
      )}
    </Box>
  );
}

export default CompanySolicitationFinancialTabs;
