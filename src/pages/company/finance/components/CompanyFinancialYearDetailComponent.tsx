import { Grid, Stack } from '@mui/material';
import React, { useContext } from 'react';
import { CompanyFinancialYearDetailContext } from './CompanyFinancialYearDetail';
import CompanyPatrimonialStatementDetailActive from '../patrimonialStatement/active/CompanyPatrimonialStatementDetailActive';
import CompanyPatrimonialStatementDetailPassive from '../patrimonialStatement/passive/CompanyPatrimonialStatementDetailPassive';
import CompanyPatrimonialStatementDetailNetPatrimony from '../patrimonialStatement/netPatrimony/CompanyPatrimonialStatementDetailNetPatrimony';
import Section from 'components/cards/Section';
import { CompanyIncomeStatementFields } from 'types/company/companyFinanceInformationData';
import TotalBoxComponent from 'components/misc/TotalBoxComponent';

function CompanyFinancialYearDetailComponent() {
  const { patrimonialStatement, incomeStatement } = useContext(
    CompanyFinancialYearDetailContext,
  );
  const currency: string = '$';

  return (
    <Grid container spacing={1}>
      {patrimonialStatement && (
        <>
          <Grid item xs={12}>
            <CompanyPatrimonialStatementDetailActive
              patrimonialStatement={patrimonialStatement}
            />
          </Grid>
          <Grid item xs={12}>
            <CompanyPatrimonialStatementDetailPassive
              patrimonialStatement={patrimonialStatement}
            />
          </Grid>
          <Grid item xs={12}>
            <CompanyPatrimonialStatementDetailNetPatrimony
              patrimonialStatement={patrimonialStatement}
            />
          </Grid>
        </>
      )}
      {incomeStatement && (
        <>
          <Grid item xs={12}>
            <Section title={'Estado de Resultado'}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1}
                alignItems="center"
              >
                <TotalBoxComponent
                  label={'Total Ingresos'}
                  total={
                    incomeStatement[CompanyIncomeStatementFields.IncomeTotal]
                  }
                  currency={currency}
                />
                <TotalBoxComponent
                  label={'Total Egresos'}
                  total={
                    incomeStatement[CompanyIncomeStatementFields.EgressTotal]
                  }
                  currency={currency}
                />
                <TotalBoxComponent
                  label={'Resultado Neto'}
                  total={
                    incomeStatement[CompanyIncomeStatementFields.NetResult]
                  }
                  currency={currency}
                />
                <TotalBoxComponent
                  label={'Total Amortizaciones'}
                  total={
                    incomeStatement[
                      CompanyIncomeStatementFields.AmortizationTotal
                    ]
                  }
                  currency={currency}
                />
              </Stack>
            </Section>
          </Grid>
        </>
      )}
    </Grid>
  );
}

export default CompanyFinancialYearDetailComponent;
