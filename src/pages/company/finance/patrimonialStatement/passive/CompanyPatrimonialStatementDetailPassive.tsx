import React from 'react';

import { Stack } from '@mui/material';

import Section from 'components/cards/Section';
import {
  CompanyBasePatrimonialStatementFields,
  CompanyPatrimonialStatement,
  CompanyPatrimonialStatementFields,
} from 'types/company/companyFinanceInformationData';
import TotalBoxComponent from 'components/misc/TotalBoxComponent';

interface CompanyPatrimonialStatementDetailPassiveProps {
  patrimonialStatement: CompanyPatrimonialStatement;
}

function CompanyPatrimonialStatementDetailPassive({
  patrimonialStatement,
}: CompanyPatrimonialStatementDetailPassiveProps) {
  return (
    <Section title={'Pasivo'}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        alignItems="center"
      >
        <TotalBoxComponent
          label={'Corriente'}
          total={
            patrimonialStatement[
              CompanyBasePatrimonialStatementFields.PassiveCurrentTotal
            ]
          }
          currency={'$'}
        />
        <TotalBoxComponent
          label={'No Corriente'}
          total={
            patrimonialStatement[
              CompanyBasePatrimonialStatementFields.PassiveNotCurrentTotal
            ]
          }
          currency={'$'}
        />
        <TotalBoxComponent
          label={'Total Pasivo'}
          total={
            patrimonialStatement[
              CompanyBasePatrimonialStatementFields.PassiveTotal
            ]
          }
          currency={'$'}
        />
      </Stack>
    </Section>
  );
}

export default CompanyPatrimonialStatementDetailPassive;
