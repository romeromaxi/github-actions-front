import React, { useEffect, useState } from 'react';
import { Grid, Stack } from '@mui/material';

import Section from 'components/cards/Section';
import { TotalFinancialYearText } from 'components/text/TotalFinancialYearText';

import { HttpCompanyIncomeStatement } from 'http/index';
import { numberFormatter } from 'util/formatters/numberFormatter';
import {
  CompanyIncomeStatement,
  CompanyIncomeStatementFields,
} from 'types/company/companyFinanceInformationData';

interface CompanyIncomeStatementDetailContentProps {
  companyId: number;
  incomeStatementId: number;
}

function CompanyIncomeStatementDetailContent({
  companyId,
  incomeStatementId,
}: CompanyIncomeStatementDetailContentProps) {
  const currency: string = '$';

  const [incomeStatement, setIncomeStatement] =
    useState<CompanyIncomeStatement>();

  useEffect(() => {
    HttpCompanyIncomeStatement.getById(companyId, incomeStatementId).then(
      setIncomeStatement,
    );
  }, [incomeStatementId]);

  return (
    <Grid container spacing={2}>
      {incomeStatement && (
        <>
          <Grid item xs={12}>
            <Section title={'Ingresos'}>
              <Grid container>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end">
                    <TotalFinancialYearText
                      label="Total INGRESOS"
                      data={numberFormatter.toStringWithAmount(
                        incomeStatement[
                          CompanyIncomeStatementFields.IncomeTotal
                        ],
                        currency,
                      )}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Section>
          </Grid>

          <Grid item xs={12}>
            <Section title={'Egresos'}>
              <Grid container>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end">
                    <TotalFinancialYearText
                      label="Total EGRESOS"
                      data={numberFormatter.toStringWithAmount(
                        incomeStatement[
                          CompanyIncomeStatementFields.EgressTotal
                        ],
                        currency,
                      )}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Section>
          </Grid>
          <Grid item xs={12}>
            <Section title={'Resultado'}>
              <Grid container>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end">
                    <TotalFinancialYearText
                      label="RESULTADO Neto"
                      data={numberFormatter.toStringWithAmount(
                        incomeStatement[CompanyIncomeStatementFields.NetResult],
                        currency,
                      )}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Section>
          </Grid>
          <Grid item xs={12}>
            <Section title={'Amortizaciones'}>
              <Grid container>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="flex-end">
                    <TotalFinancialYearText
                      label="Total AMORTIZACIONES"
                      data={numberFormatter.toStringWithAmount(
                        incomeStatement[
                          CompanyIncomeStatementFields.AmortizationTotal
                        ],
                        currency,
                      )}
                    />
                  </Stack>
                </Grid>
              </Grid>
            </Section>
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default CompanyIncomeStatementDetailContent;
