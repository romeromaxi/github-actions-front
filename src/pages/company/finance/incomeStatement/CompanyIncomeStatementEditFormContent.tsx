import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Divider, Grid, Stack, Typography } from '@mui/material';

import Section from 'components/cards/Section';
import { TotalFinancialYearText } from 'components/text/TotalFinancialYearText';

import { numberFormatter } from 'util/formatters/numberFormatter';
import { CompanyIncomeStatementFields } from 'types/company/companyFinanceInformationData';
import CompanyIncomeStatementEditIncomes from './CompanyIncomeStatementEditIncomes';
import CompanyIncomeStatementEditEgress from './CompanyIncomeStatementEditEgress';
import CompanyIncomeStatementEditNetResult from './CompanyIncomeStatementEditNetResult';
import CompanyIncomeStatementEditAmortization from './CompanyIncomeStatementEditAmortization';
import CompanyFinancialSectionTitle from '../components/CompanyFinancialSectionTitle';

interface CompanyIncomeStatementEditFormContentProps {
  nameBase: string;
}

function CompanyIncomeStatementEditFormContent({
  nameBase,
}: CompanyIncomeStatementEditFormContentProps) {
  return (
    <Grid container spacing={3} justifyContent={'center'} mb={1} mt={1}>
      <Grid item xs={12} md={9}>
        <CompanyFinancialSectionTitle title={'Ingresos'} />
        <Grid container justifyContent="flex-end">
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12}>
              <CompanyIncomeStatementEditIncomes nameBase={nameBase} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={9}>
        <CompanyFinancialSectionTitle title={'Egresos'} />
        <Grid container justifyContent="flex-end">
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12}>
              <CompanyIncomeStatementEditEgress nameBase={nameBase} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={9}>
        <CompanyFinancialSectionTitle title={'Amortizaciones'} />
        <Grid container justifyContent="flex-end">
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12}>
              <CompanyIncomeStatementEditAmortization nameBase={nameBase} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={9}>
        <CompanyFinancialSectionTitle title={'Resultados'} />
        <Grid container justifyContent="flex-end">
          <Grid container item xs={12} spacing={2}>
            <Grid item xs={12}>
              <CompanyIncomeStatementEditNetResult nameBase={nameBase} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default CompanyIncomeStatementEditFormContent;
