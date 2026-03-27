import { useState } from 'react';
import { Grid, Typography } from '@mui/material';

import { CloseButton, ConfirmButton } from 'components/buttons/Buttons';

import { HttpCompanyFinance } from 'http/index';
import { dateFormatter } from 'util/formatters/dateFormatter';
import { CompanyFinancialYearFields } from 'types/company/companyFinanceInformationData';

interface CompanyAskCurrentFinancialYearProps {
  companyId: number;
  dayClosing: number;
  monthClosing: number;
  onReload: () => void;
}

function CompanyAskCurrentFinancialYear(
  props: CompanyAskCurrentFinancialYearProps,
) {
  const today: Date = new Date();
  const todayYear: number = today.getFullYear();
  const currentClosing: Date = new Date(
    todayYear,
    props.monthClosing - 1,
    props.dayClosing,
  );
  const lastYear: number = currentClosing < today ? todayYear : todayYear - 1;
  const lastClosing: Date = new Date(
    lastYear,
    props.monthClosing - 1,
    props.dayClosing,
  );

  const [show, setShow] = useState<boolean>(true);

  const onHandleSubmit = () => {
    HttpCompanyFinance.insert(props.companyId, {
      [CompanyFinancialYearFields.Year]: lastYear,
    }).then(() => {
      props.onReload();
    });
  };

  const hideAsk = () => setShow(false);

  return show ? (
    <Grid container mb={1}>
      <Grid item xs={12}>
        <Typography component="span">
          {`¿Posee información correspondiente al ejercicio ${dateFormatter.toShortDate(lastClosing)}?`}
        </Typography>
      </Grid>

      <Grid item xs={12} container spacing={2} justifyContent="flex-end">
        <Grid item xs={2}>
          <CloseButton onClick={hideAsk} fullWidth>
            No
          </CloseButton>
        </Grid>
        <Grid item xs={2}>
          <ConfirmButton onClick={onHandleSubmit} fullWidth>
            Sí
          </ConfirmButton>
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <div />
  );
}

export default CompanyAskCurrentFinancialYear;
