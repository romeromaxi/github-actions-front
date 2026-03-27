import React, { useContext } from 'react';

import { Card, Grid } from '@mui/material';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

import CardHeaderFile from 'components/cards/CardHeaderFile';

import { CompanyFinancialTotals } from 'types/company/companyFinanceInformationData';

import { CompanyFileHomeContext } from '../CompanyFileHome';
import CompanyFinancialYear from './components/CompanyFinancialYear';
import CompanyFinancialSummaryStyles from './CompanyFinancialSummary.styles';
import CompanyFinancialClosingDateForm from './CompanyFinancialClosingDateForm';

import { CompanyViewDTOFields } from 'types/company/companyData';

interface CompanyFinancialSummaryFinancialYearProps {
  lstFinancialTotals?: CompanyFinancialTotals[];
}

function CompanyFinancialSummaryFinancialYear({
  lstFinancialTotals,
}: CompanyFinancialSummaryFinancialYearProps) {
  const classes = CompanyFinancialSummaryStyles();

  const { company } = useContext(CompanyFileHomeContext);

  return company && !company[CompanyViewDTOFields.DayClosing] ? (
    <CompanyFinancialClosingDateForm />
  ) : (
    <Card className={classes.root}>
      <CardHeaderFile
        title="Información Económica Financiera"
        avatar={<QueryStatsIcon />}
      />

      <Grid container spacing={2} pt={1} pr={2} pl={2}>
        <Grid item xs={12}>
          <CompanyFinancialYear lstFinancialTotals={lstFinancialTotals} />
        </Grid>
      </Grid>
    </Card>
  );
}

export default CompanyFinancialSummaryFinancialYear;
