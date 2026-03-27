import { Card, CardContent, CardHeader, Grid, Stack } from '@mui/material';
import { dateFormatter } from '../../../../util/formatters/dateFormatter';
import {
  CompanyDeclarationOfAssetsTotals,
  CompanyDeclarationOfAssetsTotalsFields,
} from '../../../../types/company/companyFinanceInformationData';
import CompanyFlowChart from '../../../company/flow/CompanyFlowChart';
import CompanyFlowYearlyTotals from '../../../company/flow/CompanyFlowYearlyTotals';
import React, { useEffect, useState } from 'react';
import { HttpCompanyFile, HttpCompanyFlow } from '../../../../http';
import { CompanyFlowView } from '../../../../types/company/companyFlowData';
import CompanyFileDeclarationOfAssetsTotals from './CompanyFileDeclarationOfAssetsTotals';
import { CompanyFileSourceType } from '../../../../types/company/companyEnums';

interface CompanyFileDeclarationOfAssetsSummaryTabProps {
  dataId: number;
  dataSource: CompanyFileSourceType;
  totals: CompanyDeclarationOfAssetsTotals[];
}

const CompanyFileDeclarationOfAssetsSummaryTab = ({
  dataId,
  dataSource,
  totals,
}: CompanyFileDeclarationOfAssetsSummaryTabProps) => {
  const [flowList, setFlowList] = useState<CompanyFlowView[]>([]);

  useEffect(() => {
    if (dataId && dataSource)
      dataSource === CompanyFileSourceType.Company
        ? HttpCompanyFlow.getList(dataId).then((list) => setFlowList(list))
        : HttpCompanyFile.getCompanyFlowsViewByFileId(dataId).then((list) =>
            setFlowList(list),
          );
  }, [dataId, dataSource]);

  return (
    <>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={`Manifestación de Bienes`}
              subheader={`Fecha: ${dateFormatter.toShortDate(totals[0][CompanyDeclarationOfAssetsTotalsFields.Date])}`}
            />
            <CardContent>
              <CompanyFileDeclarationOfAssetsTotals totals={totals} />
            </CardContent>
          </Card>
        </Grid>
        {/*
                            <Grid item xs={6}>
                                <Stack spacing={2}>
                                    <Card>
                                        <CardHeader title={"Gráfico de movimientos"}/>
                                        <CardContent>
                                            {
                                                (flowList) &&
                                                <CompanyFlowChart flowList={flowList}/>
                                            }
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader title={"Totales por año"}/>
                                        <CardContent>
                                            <CompanyFlowYearlyTotals flowList={flowList}/>
                                        </CardContent>
                                    </Card>
                                </Stack>
                            </Grid>
                             */}
      </Grid>
    </>
  );
};

export default CompanyFileDeclarationOfAssetsSummaryTab;
