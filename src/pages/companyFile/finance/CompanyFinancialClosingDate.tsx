import React, { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

import { Stack } from '@mui/material';
import { ControlledTextFieldFilled } from 'components/forms';

import { EntityWithIdFields } from 'types/baseEntities';
import { CompanyViewDTOFields } from 'types/company/companyData';
import {
  ConfirmIconButton,
  LoadingIconButton,
} from 'components/buttons/Buttons';

import { HttpCompany } from 'http/index';
import { RequiredDayMonthSchema } from 'util/validation/validationSchemas';
import { CompanyFinancialHomeContext } from './CompanyFinancialHome';

enum ClosingDateFormFields {
  Date = 'date',
}

interface ClosingDateForm {
  [ClosingDateFormFields.Date]?: string;
}

interface CompanyFinancialClosingDateProps {
  onSubmit: () => void;
}

function CompanyFinancialClosingDate(props: CompanyFinancialClosingDateProps) {
  const { company } = useContext(CompanyFinancialHomeContext);
  const [isLoading, setLoading] = useState<boolean>(false);

  const ClosingDateFormSchema = yup.object().shape({
    [ClosingDateFormFields.Date]: RequiredDayMonthSchema,
  });

  const { control, reset, handleSubmit } = useForm<ClosingDateForm>({
    resolver: yupResolver(ClosingDateFormSchema),
  });

  const onHandleSubmit = (data: ClosingDateForm) => {
    if (company && company[EntityWithIdFields.Id]) {
      let [day, month] = data[ClosingDateFormFields.Date]
        ?.split('/')
        .map((x) => parseInt(x)) || [0, 0];

      setLoading(true);
      HttpCompany.updateClosingDate(
        company[EntityWithIdFields.Id],
        day,
        month,
      ).then(() => {
        setLoading(false);
        props.onSubmit();
      });
    }
  };

  const getStringDate = (
    day: number | undefined,
    month: number | undefined,
  ): string => {
    if (!day || !month) return '';

    let finalDay: string = day < 10 ? `0${day}` : `${day}`;
    let finalMonth: string = month < 10 ? `0${month}` : `${month}`;

    return `${finalDay}/${finalMonth}`;
  };

  useEffect(() => {
    if (company && company[EntityWithIdFields.Id]) {
      let prevClosingDate: boolean =
        !!company[CompanyViewDTOFields.DayClosing] &&
        !!company[CompanyViewDTOFields.MonthClosing];

      if (prevClosingDate)
        reset({
          [ClosingDateFormFields.Date]: getStringDate(
            company[CompanyViewDTOFields.DayClosing],
            company[CompanyViewDTOFields.MonthClosing],
          ),
        });
    }
  }, [company]);

  return (
    <Stack direction="row" spacing={2}>
      <ControlledTextFieldFilled
        control={control}
        name={ClosingDateFormFields.Date}
        placeholder="dd/mm"
        helperText="Formato: dd/mm. Por ejemplo 31/12"
        disabled={isLoading}
      />

      {isLoading ? (
        <LoadingIconButton />
      ) : (
        <ConfirmIconButton
          color={'primary'}
          onClick={handleSubmit(onHandleSubmit)}
          sx={{ height: '40px' }}
        />
      )}
    </Stack>
  );
}

export default CompanyFinancialClosingDate;
