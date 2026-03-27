import React from 'react';

import { Stack } from '@mui/material';
import Section from 'components/cards/Section';

import {
  CompanyFinancialTotalsFields,
  CompanyPatrimonialStatement,
  CompanyPatrimonialStatementFields,
} from 'types/company/companyFinanceInformationData';
import TotalBoxComponent from 'components/misc/TotalBoxComponent';

interface CompanyPatrimonialStatementDetailNetPatrimonyProps {
  patrimonialStatement: CompanyPatrimonialStatement;
}

function CompanyPatrimonialStatementDetailNetPatrimony({
  patrimonialStatement,
}: CompanyPatrimonialStatementDetailNetPatrimonyProps) {
  return (
    <Section title={'Patrimonio'}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        alignItems="center"
      >
        <TotalBoxComponent
          label={'Total Patrimonio Neto'}
          total={
            patrimonialStatement[CompanyFinancialTotalsFields.ActiveTotal] -
            patrimonialStatement[CompanyFinancialTotalsFields.PassiveTotal]
          }
          currency={'$'}
        />
      </Stack>
    </Section>
  );
}

export default CompanyPatrimonialStatementDetailNetPatrimony;
