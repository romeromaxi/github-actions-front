import React, {Fragment, useEffect, useState} from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

import { Grid, Typography } from '@mui/material';

import {
  ConfirmIconButton,
  LoadingIconButton,
} from 'components/buttons/Buttons';

import { HttpCompanyDeclarationOfAssets } from 'http/index';
import {
    CompanyDeclarationOfAssetsInsert, CompanyDeclarationOfAssetsInsertFields
} from 'types/company/companyFinanceInformationData';
import { useAction } from 'hooks/useAction';
import {dateFormatter} from "../../../util/formatters/dateFormatter";
import {RequiredPositiveNumberSchema} from "../../../util/validation/validationSchemas";
import {ControlledTextFieldFilled} from "../../../components/forms";

interface CompanyDeclarationOfAssetsLastDateProps {
  companyId: number;
  defaultDate: Date | undefined;
  onSubmit: () => void;
  allowEdit?: boolean
}

function CompanyDeclarationOfAssetsLastDate({
  companyId,
  defaultDate,
  onSubmit,
  allowEdit
}: CompanyDeclarationOfAssetsLastDateProps) {
  const [isLoading, setLoading] = useState<boolean>(false);
  const { snackbarSuccess } = useAction();

  const lastYearFormSchema = yup.object().shape({
      [CompanyDeclarationOfAssetsInsertFields.Year]: RequiredPositiveNumberSchema
  });

  const { control, reset, handleSubmit, clearErrors, watch } =
    useForm<CompanyDeclarationOfAssetsInsert>({
      resolver: yupResolver(lastYearFormSchema),
    });
  const watchDate = watch(CompanyDeclarationOfAssetsInsertFields.Date);

  const onHandleSubmit = (data: CompanyDeclarationOfAssetsInsert) => {
    setLoading(true);
    const submitData: CompanyDeclarationOfAssetsInsert = {
        ...data,
        [CompanyDeclarationOfAssetsInsertFields.Date]: new Date()
    }
    HttpCompanyDeclarationOfAssets.insert(companyId, submitData).then(() => {
      setLoading(false);
      onSubmit();
      snackbarSuccess('Se cambió la fecha de última manifestación de bienes');
    });
  };

  useEffect(() => {
    reset({
      [CompanyDeclarationOfAssetsInsertFields.Date]: defaultDate,
    });
  }, [defaultDate]);

  useEffect(() => {
    clearErrors(CompanyDeclarationOfAssetsInsertFields.Date);
  }, [watchDate]);

  return (
    <Fragment>
      <form onSubmit={handleSubmit(onHandleSubmit)}>
        <Grid container spacing={2} alignItems={'center'}>
          <Grid item xs={allowEdit ? 4.5 : 3.5} mt={allowEdit ? 1 : 0}>
            <Typography
              variant="caption"
              sx={{
                width: '100%',
                fontStyle: 'normal',
                fontWeight: 300,
                fontSize: '14px',
                lineHeight: '22px',
                color: 'rgb(95, 116, 141)',
              }}
            >
                {allowEdit ? '¿Cuál es la fecha de su última manifestación de bienes personales?' : 'Fecha de la última manifestación de bienes personales:'}
            </Typography>
          </Grid>

          <Grid item xs={3}>
              {
                  allowEdit ?
                      <ControlledTextFieldFilled
                          control={control}
                          name={CompanyDeclarationOfAssetsInsertFields.Year}
                          label="Año de la manifestación de bienes"
                          helperText={'Formato YYYY'}
                      />
                      :
                      <Typography fontWeight={600} fontSize={14}>
                          {dateFormatter.toShortDate(defaultDate)}
                      </Typography>
              }
          </Grid>
            {
                allowEdit &&
                  <Grid item xs={2}>
                    {isLoading ? (
                      <LoadingIconButton />
                    ) : (
                      <ConfirmIconButton
                        color="primary"
                        type="submit"
                        sx={{ height: '40px', width: '40px', borderRadius: '.475rem' }}
                      />
                    )}
                  </Grid>
            }
        </Grid>
      </form>
    </Fragment>
  );
}

export default CompanyDeclarationOfAssetsLastDate;
