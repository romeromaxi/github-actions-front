import React, { useContext, useEffect, useState } from 'react';
import { Card, CardContent, Grid } from '@mui/material';
import CompanyDeclarationOfAssetsLastDate from '../CompanyDeclarationOfAssetsLastDate';
import { EntityWithIdFields } from '../../../../types/baseEntities';
import { CompanyFinancialHomeContext } from '../CompanyFinancialHome';
import { CompanyFinancialPersonHomeViewProps } from './CompanyFinancialHomeView';
import { Alert } from '@mui/lab';
import {
  CompanyDeclarationOfAssetsTotals,
  CompanyDeclarationOfAssetsTotalsFields,
} from '../../../../types/company/companyFinanceInformationData';
import {
  HttpCompanyDeclarationOfAssets,
  HttpCompanyFile,
} from '../../../../http';
import CompanyPhysicalFinanceTabs from './CompanyPhysicalFinanceTabs';
import { CompanyPersonalInformationContext } from '../../company/CompanyPersonalInformationHome';
import { CompanyFileSourceType } from '../../../../types/company/companyEnums';

function CompanyFinancialPhysicalPersonHomeView({
  company,
  hideFlows,
  onAllowEdit,
  allowEdit
}: CompanyFinancialPersonHomeViewProps) {
  const { dataId, dataSource } = useContext(CompanyPersonalInformationContext);

  const [isLoading, setLoading] = useState<boolean>();
  const [dateDeclarationOfAssets, setDateDeclarationOfAssets] =
    useState<Date>();
  const [declarationOfAssetsTotals, setDeclarationOfAssetsTotals] =
    useState<CompanyDeclarationOfAssetsTotals[]>();

  const loadData = () => {
    if (dataId && dataSource) {
      const callbackDeclarationOfAssets =
        dataSource == CompanyFileSourceType.Company
          ? HttpCompanyDeclarationOfAssets.getLastTotalsByCompany
          : HttpCompanyFile.getCompanyLastDeclarationOfAssetsTotalsByFileId;

      callbackDeclarationOfAssets(dataId).then((r) => {
        setDeclarationOfAssetsTotals(r);
        onAllowEdit && onAllowEdit(true);
      });
    }
    // company && HttpCompanyDeclarationOfAssets.getLastTotalsByCompany(company[EntityWithIdFields.Id]).then((r) => setDeclarationOfAssetsTotals(r))
  };

  useEffect(() => {
    loadData();
  }, [dataId, dataSource]);

  return (
    <CompanyFinancialHomeContext.Provider
      value={{
        company,
        lastFinancialTotals: undefined,
        dateDeclarationOfAssets,
        setDateDeclarationOfAssets,
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} container alignItems="center">
          {hideFlows ? (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  {company && (
                    <CompanyDeclarationOfAssetsLastDate
                      companyId={company[EntityWithIdFields.Id]}
                      defaultDate={
                        declarationOfAssetsTotals?.[0]?.[
                          CompanyDeclarationOfAssetsTotalsFields.Date
                        ] || undefined
                      }
                      onSubmit={loadData} allowEdit={allowEdit}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ) : (
            <Grid item xs={12}>
              {company && (
                <CompanyDeclarationOfAssetsLastDate
                  companyId={company[EntityWithIdFields.Id]}
                  defaultDate={
                    declarationOfAssetsTotals?.[0]?.[
                      CompanyDeclarationOfAssetsTotalsFields.Date
                    ] || undefined
                  }
                  onSubmit={loadData} allowEdit={allowEdit}
                />
              )}
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} mt={2}>
          {!isLoading &&
          company &&
          declarationOfAssetsTotals &&
          declarationOfAssetsTotals.length !== 0 ? (
            <CompanyPhysicalFinanceTabs
              dataId={company[EntityWithIdFields.Id]}
              declarationOfAssetsTotals={declarationOfAssetsTotals}
              hideFlows={hideFlows}
            />
          ) : (
            <Alert severity="info">
              Para ver esta sección debe completar primero la fecha de cierre
            </Alert>
          )}
        </Grid>
      </Grid>
    </CompanyFinancialHomeContext.Provider>
  );
}

export default CompanyFinancialPhysicalPersonHomeView;
