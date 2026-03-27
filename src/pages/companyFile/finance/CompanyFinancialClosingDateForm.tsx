import React, { useContext, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { useForm } from 'react-hook-form';

import { Card, Grid, Typography } from '@mui/material';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

import { ControlledTextFieldFilled } from 'components/forms';
import {
  CloseButton,
  ConfirmButton,
  SendButton,
} from 'components/buttons/Buttons';
import CardHeaderFile from 'components/cards/CardHeaderFile';

import { CompanyFileHomeContext } from '../CompanyFileHome';
import CompanyFinancialSummaryStyles from './CompanyFinancialSummary.styles';

import { HttpCompany, HttpCompanyFinance } from 'http/index';
import { EntityWithIdFields } from 'types/baseEntities';
import { RequiredDayMonthSchema } from 'util/validation/validationSchemas';
import { CompanyFinancialYearFields } from '../../../types/company/companyFinanceInformationData';

enum PreviousClosingDateFields {
  Day = 'day',
  Month = 'month',
  LastYear = 'lastYear',
}

interface PreviousClosingDate {
  [PreviousClosingDateFields.Day]: number;
  [PreviousClosingDateFields.Month]: number;
  [PreviousClosingDateFields.LastYear]: number;
}

enum ClosingDateFormFields {
  Date = 'date',
}

interface ClosingDateForm {
  [ClosingDateFormFields.Date]?: string;
}

function CompanyFinancialClosingDateForm() {
  const classes = CompanyFinancialSummaryStyles();
  const { company, setClosingDate } = useContext(CompanyFileHomeContext);

  const [previousClosingDate, setPreviousClosingDate] =
    useState<PreviousClosingDate>();

  const ClosingDateFormSchema = yup.object().shape({
    [ClosingDateFormFields.Date]: RequiredDayMonthSchema,
  });

  const { control, handleSubmit } = useForm<ClosingDateForm>({
    resolver: yupResolver(ClosingDateFormSchema),
  });

  const onHandleSubmit = (data: ClosingDateForm) => {
    if (company && data[ClosingDateFormFields.Date]) {
      let today: Date = new Date();
      let todayYear: number = today.getFullYear();

      let [day, month] = data[ClosingDateFormFields.Date]
        ?.split('/')
        .map((x) => parseInt(x)) || [0, 0];
      let lastClosing: Date = new Date(todayYear, month - 1, day);

      let prevClosingYear: number =
        lastClosing < today ? todayYear : todayYear - 1;

      setPreviousClosingDate({
        [PreviousClosingDateFields.Day]: day,
        [PreviousClosingDateFields.Month]: month,
        [PreviousClosingDateFields.LastYear]: prevClosingYear,
      });
    }
  };

  const loadFinancialYear = (lastYear: number) => {
    if (company && previousClosingDate)
      Promise.all([
        HttpCompany.updateClosingDate(
          company[EntityWithIdFields.Id],
          previousClosingDate[PreviousClosingDateFields.Day],
          previousClosingDate[PreviousClosingDateFields.Month],
        ),
        HttpCompanyFinance.insert(company[EntityWithIdFields.Id], {
          [CompanyFinancialYearFields.Year]: lastYear,
        }),
        HttpCompanyFinance.insert(company[EntityWithIdFields.Id], {
          [CompanyFinancialYearFields.Year]: lastYear - 1,
        }),
      ]).then(() => {
        setClosingDate(
          previousClosingDate[PreviousClosingDateFields.Day],
          previousClosingDate[PreviousClosingDateFields.Month],
        );
      });
  };

  return (
    <Card className={classes.rootDateForm}>
      <CardHeaderFile
        title="Información Económica Financiera"
        avatar={<QueryStatsIcon />}
      />

      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <Grid
          container
          spacing={2}
          direction="column"
          alignItems="center"
          justifyContent="center"
          className={classes.contentBlur}
        >
          <Grid item xs={1} mt={9}>
            <Typography component="span" className={classes.dateDescription}>
              {previousClosingDate
                ? `¿Posee información financiera corresponfiente al cierre
                                    ${previousClosingDate[PreviousClosingDateFields.Day]}/${previousClosingDate[PreviousClosingDateFields.Month]}/${previousClosingDate[PreviousClosingDateFields.LastYear]}?`
                : 'Para poder visualizar la información económica-financiera debe ingresas el día y mes de cierre del ejercicio'}
            </Typography>
          </Grid>
          {previousClosingDate ? (
            <Grid item>
              <CloseButton
                sx={{ marginRight: 1 }}
                onClick={() =>
                  loadFinancialYear(
                    previousClosingDate[PreviousClosingDateFields.LastYear] - 1,
                  )
                }
              >
                No
              </CloseButton>
              <ConfirmButton
                onClick={() =>
                  loadFinancialYear(
                    previousClosingDate[PreviousClosingDateFields.LastYear],
                  )
                }
              >
                Sí
              </ConfirmButton>
            </Grid>
          ) : (
            <>
              <Grid item>
                <ControlledTextFieldFilled
                  control={control}
                  name={ClosingDateFormFields.Date}
                  placeholder="dd/mm"
                />
              </Grid>
              <Grid item>
                <SendButton type="submit">Guardar</SendButton>
              </Grid>
            </>
          )}
        </Grid>
      </form>
    </Card>
  );
}

export default CompanyFinancialClosingDateForm;
