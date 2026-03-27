import React, { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

import { Grid, Stack, Typography } from '@mui/material';

import { ControlledTextFieldFilled } from 'components/forms';
import {
  ConfirmIconButton,
  LoadingIconButton,
} from 'components/buttons/Buttons';

import { HttpCompany } from 'http/index';
import { EntityWithIdFields } from 'types/baseEntities';
import { CompanyViewDTOFields } from 'types/company/companyData';
import { CompanyFinancialHomeContext } from './CompanyFinancialHome';

enum LastYearFormFields {
  Year = 'year',
}

interface LastYearForm {
  [LastYearFormFields.Year]?: string;
}

interface CompanyFinancialLastYearProps {
  onSubmit: (year: number) => void;
  allowEdit?: boolean
}

function CompanyFinancialLastYear({ onSubmit, allowEdit }: CompanyFinancialLastYearProps) {
  const { company } = useContext(CompanyFinancialHomeContext);
  const [isLoading, setLoading] = useState<boolean>(false);

  const lastYearFormSchema = yup.object().shape({
    [LastYearFormFields.Year]: yup
      .string()
      .required('Campo obligatorio')
      .length(4, 'Deben ser 4 dígitos')
      .test('AñoPasado', 'El año no puede superar al corriente', (value) => {
        return !!value && new Date().getFullYear() >= parseInt(value);
      })
      .test(
        'FechaCierre',
        'La fecha de cierre no puede ser posterior a la fecha actual',
        (value) => {
          if (!value || !company) return false;
          if (
            !!company[CompanyViewDTOFields.MonthClosing] &&
            !!company[CompanyViewDTOFields.DayClosing]
          ) {
            let lastDate: Date = new Date(
              parseInt(value),
              // @ts-ignore
              company[CompanyViewDTOFields.MonthClosing] - 1,
              company[CompanyViewDTOFields.DayClosing],
            );

            return new Date() >= lastDate;
          }

          return false;
        },
      ),
  });

  const { control, reset, handleSubmit } = useForm<LastYearForm>({
    resolver: yupResolver(lastYearFormSchema),
  });

  const onHandleSubmit = (data: LastYearForm) => {
    let year: number = parseInt(data[LastYearFormFields.Year] || '0');

    if (company && company[EntityWithIdFields.Id] && year) {
      setLoading(true);
      HttpCompany.updateLastFinancialYear(
        company[EntityWithIdFields.Id],
        year,
      ).then(() => {
        setLoading(false);
        onSubmit(year);
      });
    }
  };

  useEffect(() => {
    if (company && company[EntityWithIdFields.Id]) {
      let lastYear: number | undefined =
        company[CompanyViewDTOFields.YearLastClosing];

      if (lastYear)
        reset({
          [LastYearFormFields.Year]: lastYear.toString(),
        });
    }
  }, [company]);

  return (
    <Stack direction={'row'}>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <Grid container alignItems={'center'} spacing={1}>
          <Grid item xs={allowEdit ? 6 : 10}>
            <Typography
              variant="caption"
              color="text.disabled"
              fontWeight={500}
              fontSize="1rem"
            >
              {allowEdit ? '¿Cuál es el año de su último balance cerrado?' : 'Año de último balance cerrado:'}
            </Typography>
          </Grid>
          <Grid item xs={allowEdit ? 3.5 : 2}>
            {
              allowEdit ?
                  <Stack direction={'row'} spacing={2}>
                    <ControlledTextFieldFilled
                      control={control}
                      name={LastYearFormFields.Year}
                      disabled={isLoading}
                    />
                    {isLoading ? (
                      <LoadingIconButton />
                    ) : (
                      <ConfirmIconButton
                        color="primary"
                        type="submit"
                        sx={{
                          height: '40px',
                          width: '40px',
                          borderRadius: '.475rem',
                        }}
                      />
                    )}
                  </Stack>
                  :
                  <Typography fontWeight={600} fontSize={14}>
                    {company?.[CompanyViewDTOFields.YearLastClosing]}
                  </Typography>
            }
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
}

export default CompanyFinancialLastYear;
