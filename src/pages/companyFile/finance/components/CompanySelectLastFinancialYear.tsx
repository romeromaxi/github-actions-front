import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Grid, Typography } from '@mui/material';

import { ConfirmButton } from 'components/buttons/Buttons';
import { ControlledRadio, RadioOption } from 'components/forms';
import { RequiredSchema } from 'util/validation/validationSchemas';

import { HttpCompanyFinance } from 'http/index';
import { CompanyFinancialYearFields } from 'types/company/companyFinanceInformationData';

interface CompanySelectLastFinancialYearProps {
  companyId: number;
  dayClosing: number;
  monthClosing: number;
  onReload: () => void;
}

enum SelectLastFinancialYearFields {
  Year = 'year',
}

interface SelectLastFinancialYearForm {
  [SelectLastFinancialYearFields.Year]: number;
}

function CompanySelectLastFinancialYear(
  props: CompanySelectLastFinancialYearProps,
) {
  const today: Date = new Date();
  const todayYear: number = new Date().getFullYear();
  const lastClosing: Date = new Date(
    todayYear,
    props.monthClosing - 1,
    props.dayClosing,
  );
  const lastYear: number = lastClosing < today ? todayYear : todayYear - 1;

  const selectLastFinancialYearSchema = yup.object().shape({
    [SelectLastFinancialYearFields.Year]: RequiredSchema,
  });

  const methods = useForm<SelectLastFinancialYearForm>({
    resolver: yupResolver(selectLastFinancialYearSchema),
  });

  const radioOptions: RadioOption[] = [
    {
      value: lastYear,
      label: `${props.dayClosing}/${props.monthClosing}/${lastYear}`,
    },
    {
      value: lastYear - 1,
      label: `${props.dayClosing}/${props.monthClosing}/${lastYear - 1}`,
    },
  ];

  const onHandleSubmit = (data: SelectLastFinancialYearForm) => {
    const year = data[SelectLastFinancialYearFields.Year];
    Promise.all([
      HttpCompanyFinance.insert(props.companyId, {
        [CompanyFinancialYearFields.Year]: year,
      }),
      HttpCompanyFinance.insert(props.companyId, {
        [CompanyFinancialYearFields.Year]: year - 1,
      }),
    ]).then(() => {
      props.onReload();
    });
  };

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography component="span">
          ¿Cuál es el último ejercicio que posee?
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <ControlledRadio
          control={methods.control}
          name={SelectLastFinancialYearFields.Year}
          radioOptions={radioOptions}
        />
      </Grid>

      <Grid item xs={12} container justifyContent="flex-end">
        <ConfirmButton onClick={methods.handleSubmit(onHandleSubmit)}>
          Confirmar
        </ConfirmButton>
      </Grid>
    </Grid>
  );
}

export default CompanySelectLastFinancialYear;
