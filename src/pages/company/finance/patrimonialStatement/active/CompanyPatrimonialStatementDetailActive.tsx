import React from 'react';

import { Stack } from '@mui/material';

import Section from 'components/cards/Section';

import {
  CompanyBasePatrimonialStatementFields,
  CompanyPatrimonialStatement,
  CompanyPatrimonialStatementFields,
} from 'types/company/companyFinanceInformationData';
import TotalBoxComponent from 'components/misc/TotalBoxComponent';

interface CompanyPatrimonialStatementDetailActiveProps {
  patrimonialStatement: CompanyPatrimonialStatement;
}

function CompanyPatrimonialStatementDetailActive({
  patrimonialStatement,
}: CompanyPatrimonialStatementDetailActiveProps) {
  return (
    <Section title={'Activo'}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        alignItems="center"
      >
        <TotalBoxComponent
          label={'Corriente'}
          total={
            patrimonialStatement[
              CompanyBasePatrimonialStatementFields.ActiveCurrentTotal
            ]
          }
          currency={'$'}
        />
        <TotalBoxComponent
          label={'No Corriente'}
          total={
            patrimonialStatement[
              CompanyBasePatrimonialStatementFields.ActiveNotCurrentTotal
            ]
          }
          currency={'$'}
        />
        <TotalBoxComponent
          label={'Total Activo'}
          total={
            patrimonialStatement[
              CompanyBasePatrimonialStatementFields.ActiveTotal
            ]
          }
          currency={'$'}
        />
      </Stack>
    </Section>
  );
}

export default CompanyPatrimonialStatementDetailActive;
