import CompanyFileDeclarationOfAssetsSummaryTab from '../components/CompanyFileDeclarationOfAssetsSummaryTab';
import CompanyFileFlowPage from '../components/CompanyFileFlowPage';
import React, { useContext } from 'react';
import {
  CompanyDeclarationOfAssetsTotals,
  CompanyDeclarationOfAssetsTotalsFields,
} from '../../../../types/company/companyFinanceInformationData';
import { CompanyFileSourceType } from '../../../../types/company/companyEnums';
import { Alert, Grid } from '@mui/material';
import { CompanyPersonalInformationContext } from '../../company/CompanyPersonalInformationHome';

interface CompanyPhysicalFinanceTabsProps {
  dataId: number;
  dataSource?: CompanyFileSourceType;
  declarationOfAssetsTotals: CompanyDeclarationOfAssetsTotals[];
  hideFlows?: boolean;
}

export const isCompleteDeclaration = (totals: CompanyDeclarationOfAssetsTotals[]) => {
  const mainDeclaration: CompanyDeclarationOfAssetsTotals = totals[0];

  return (
    (mainDeclaration[CompanyDeclarationOfAssetsTotalsFields.ActiveTotal] !==
      0 ||
      mainDeclaration[CompanyDeclarationOfAssetsTotalsFields.PassiveTotal] !==
        0) &&
    mainDeclaration[CompanyDeclarationOfAssetsTotalsFields.ActiveTotal] ===
      mainDeclaration[
        CompanyDeclarationOfAssetsTotalsFields.NetPatrimonyTotal
      ] +
        mainDeclaration[CompanyDeclarationOfAssetsTotalsFields.PassiveTotal]
  );
};

const CompanyPhysicalFinanceTabs = ({
  dataId,
  declarationOfAssetsTotals,
  hideFlows = false,
}: CompanyPhysicalFinanceTabsProps) => {
  const { dataSource } = useContext(CompanyPersonalInformationContext);
  const completeDeclaration = isCompleteDeclaration(declarationOfAssetsTotals);

  return (
    <Grid container spacing={2} mb={2}>
      {dataSource === CompanyFileSourceType.Company ? (
        !completeDeclaration && (
          <Grid item xs={12}>
            <Alert severity={'warning'}>
              Para que el legajo se considere completo, el Valor Mercado del
              Estado de Situación Patrimonial no puede tener todos los valores
              en 0 (cero).
            </Alert>
          </Grid>
        )
      ) : (
        <></>
      )}

      <Grid item xs={12}>
        {!!dataSource ? (
          <CompanyFileDeclarationOfAssetsSummaryTab
            dataId={dataId}
            dataSource={dataSource}
            totals={declarationOfAssetsTotals}
          />
        ) : (
          <></>
        )}
      </Grid>
      {!hideFlows && (
        <Grid item xs={12}>
          <CompanyFileFlowPage physicalPerson editAllowed={false} />
        </Grid>
      )}
    </Grid>
  );
};

export default CompanyPhysicalFinanceTabs;
