import React, { useContext, useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import {
  CompanyFlowFields,
  CompanyFlowInsert,
} from '../../../types/company/companyFlowData';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import { ControlledDatePicker } from '../../../components/forms/ControlledDatePicker';
import { DefaultStylesButton } from '../../../components/buttons/Buttons';
import { subMonths } from 'date-fns';
import { ControlledTextFieldFilled } from '../../../components/forms';
import * as yup from 'yup';
import {
  RequiredDateRangeSchema,
  RequiredPositiveNumberSchema,
} from '../../../util/validation/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { grey } from '@mui/material/colors';
import {useApplicationCommon} from "hooks/contexts/ApplicationCommonContext";

interface CompanyFlowHistoryFormProps {
  maxDate: Date;
  onSubmitted: (data: CompanyFlowInsert) => void;
  onBack: () => void;
}

function CompanyFlowHistoryForm({
  maxDate,
  onSubmitted,
  onBack,
}: CompanyFlowHistoryFormProps) {
  const { setShouldWarnBeforeSwitch } = useApplicationCommon();

  const minDate = subMonths(maxDate, 48);

  const flowHistorySchema = yup.object().shape({
    [CompanyFlowFields.Date]: RequiredDateRangeSchema(minDate, maxDate),
    [CompanyFlowFields.Income]: RequiredPositiveNumberSchema,
    [CompanyFlowFields.Sale]: RequiredPositiveNumberSchema,
  });

  const { control, handleSubmit } = useForm<CompanyFlowInsert>({
    resolver: yupResolver(flowHistorySchema),
  });

  const { isDirty } = useFormState({ control: control });

  useEffect(() => {
    setShouldWarnBeforeSwitch(isDirty);
  }, [isDirty]);

  const onSubmit = (data: CompanyFlowInsert) => {
    setShouldWarnBeforeSwitch(false);
    onSubmitted(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={12} container>
          <Stack gap={2}>
            <Stack direction={'row'} gap={2}>
              <Grid item xs={4}>
                <Typography color={grey[600]} fontSize={16}>
                  Fecha
                </Typography>
                <Box sx={{ backgroundColor: '#F5F8FA !important' }}>
                  <ControlledDatePicker
                    control={control}
                    name={CompanyFlowFields.Date}
                    views={['year', 'month']}
                    inputFormat={'MM/yyyy'}
                    maxDate={maxDate}
                    minDate={minDate}
                  />
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Typography color={grey[600]} fontSize={16}>
                  Ingreso
                </Typography>
                <ControlledTextFieldFilled
                  control={control}
                  label={''}
                  currency
                  name={CompanyFlowFields.Income}
                />
              </Grid>
              <Grid item xs={4}>
                <Typography color={grey[600]} fontSize={16}>
                  Egreso
                </Typography>
                <ControlledTextFieldFilled
                  control={control}
                  label={''}
                  currency
                  name={CompanyFlowFields.Sale}
                />
              </Grid>
            </Stack>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'space-around'}
          >
            <Button
              onClick={onBack}
              variant={'contained'}
              color={'inherit'}
              startIcon={<KeyboardBackspaceIcon />}
            >
              Volver
            </Button>
            <DefaultStylesButton type={'submit'}>
              Agregar movimiento
            </DefaultStylesButton>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
}

export default CompanyFlowHistoryForm;
