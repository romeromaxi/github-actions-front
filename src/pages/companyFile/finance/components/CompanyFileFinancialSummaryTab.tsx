import { Alert, Card, CardContent, CardHeader, Grid } from '@mui/material';
import React, { useContext } from 'react';
import CompanyFinancialYearlyTotals from '../../../company/finance/components/CompanyFinancialYearlyTotals';
import {
  CompanyFinancialTotals,
  CompanyFinancialTotalsFields,
} from '../../../../types/company/companyFinanceInformationData';
import { dateFormatter } from '../../../../util/formatters/dateFormatter';
import CompanyFileFlowPage from './CompanyFileFlowPage';
import { CompanyPersonalInformationContext } from '../../company/CompanyPersonalInformationHome';
import {
  CompanyFileSourceType,
  CompanyFileType,
} from '../../../../types/company/companyEnums';

interface CompanyFileFinancialSummaryTabProps {
  totalsLast: CompanyFinancialTotals[];
  totalsPrev: CompanyFinancialTotals[];
  hideFlows?: boolean;
}

const isCompleteFinancial = (totals: CompanyFinancialTotals[]) => {
  const mainFinancial: CompanyFinancialTotals = totals[0];

  return (
    (mainFinancial[CompanyFinancialTotalsFields.ActiveTotal] !== 0 ||
      mainFinancial[CompanyFinancialTotalsFields.PassiveTotal] !== 0) &&
    mainFinancial[CompanyFinancialTotalsFields.ActiveTotal] ===
      mainFinancial[CompanyFinancialTotalsFields.NetPatrimonyTotal] +
        mainFinancial[CompanyFinancialTotalsFields.PassiveTotal]
  );
};

const CompanyFileFinancialSummaryTab = ({
  totalsLast,
  totalsPrev,
  hideFlows = false,
}: CompanyFileFinancialSummaryTabProps) => {
  const { dataSource } = useContext(CompanyPersonalInformationContext);
  const completeLastFinancial = isCompleteFinancial(totalsLast);
  const completePrevFinancial = isCompleteFinancial(totalsPrev);

  return (
    <Grid container spacing={2} mb={2}>
      {dataSource === CompanyFileSourceType.Company ? (
        (!completeLastFinancial || !completePrevFinancial) && (
          <Grid item xs={12}>
            <Alert severity={'warning'}>
              Para que el legajo se considere completo, el Estado de Situación
              Patrimonial no puede tener todos los valores en 0 (cero).
            </Alert>
          </Grid>
        )
      ) : (
        <></>
      )}

      <Grid item xs={6}>
        <Card>
          <CardHeader
            title={`Ejercicio ${dateFormatter.toYearDate(totalsLast[0][CompanyFinancialTotalsFields.Date])}`}
            subheader={`Cierre: ${dateFormatter.toMonthNameWithDay(totalsLast[0][CompanyFinancialTotalsFields.Date])}`}
          />
          <CardContent>
            <CompanyFinancialYearlyTotals totals={totalsLast} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardHeader
            title={`Ejercicio ${dateFormatter.toYearDate(totalsPrev[0][CompanyFinancialTotalsFields.Date])}`}
            subheader={`Cierre: ${dateFormatter.toMonthNameWithDay(totalsPrev[0][CompanyFinancialTotalsFields.Date])}`}
          />
          <CardContent>
            <CompanyFinancialYearlyTotals totals={totalsPrev} />
          </CardContent>
        </Card>
      </Grid>
      {!hideFlows && (
        <Grid item xs={12}>
          <CompanyFileFlowPage editAllowed={false} />
        </Grid>
      )}
    </Grid>
  );
};

export default CompanyFileFinancialSummaryTab;
