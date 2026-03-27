import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';

import CompanyPatrimonialStatementDetailActive from './active/CompanyPatrimonialStatementDetailActive';
import CompanyPatrimonialStatementDetailPassive from './passive/CompanyPatrimonialStatementDetailPassive';
import CompanyPatrimonialStatementDetailNetPatrimony from './netPatrimony/CompanyPatrimonialStatementDetailNetPatrimony';

import { CompanyPatrimonialStatement } from 'types/company/companyFinanceInformationData';
import { HttpCompanyPatrimonialStatement } from 'http/index';

interface CompanyPatrimonialStatementDetailContentProps {
  companyId: number;
  patrimonialStatementId: number;
}

function CompanyPatrimonialStatementDetailContent({
  companyId,
  patrimonialStatementId,
}: CompanyPatrimonialStatementDetailContentProps) {
  const [patrimonialStatement, setPatrimonialStatement] =
    useState<CompanyPatrimonialStatement>();

  useEffect(() => {
    HttpCompanyPatrimonialStatement.getById(
      companyId,
      patrimonialStatementId,
    ).then(setPatrimonialStatement);
  }, [patrimonialStatementId]);

  return (
    <Grid container spacing={2}>
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
    </Grid>
  );
}

export default CompanyPatrimonialStatementDetailContent;
