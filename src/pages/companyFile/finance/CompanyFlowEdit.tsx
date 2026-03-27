import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Grid, Typography } from '@mui/material';

import { dateFormatter } from 'util/formatters/dateFormatter';
import {
  CompanyFlowFields,
  CompanyFlowInsertRequest,
  CompanyFlowInsertRequestFields,
} from 'types/company/companyFlowData';
import { ControlledTextFieldFilled } from '../../../components/forms';
import { grey } from '@mui/material/colors';

interface CompanyFlowEditProps {
  physicalPerson?: boolean;
}

function CompanyFlowEdit({ physicalPerson }: CompanyFlowEditProps) {
  const { control } = useFormContext<CompanyFlowInsertRequest>();

  const { fields } = useFieldArray({
    control,
    name: CompanyFlowInsertRequestFields.FlowList,
  });

  return (
    <Grid container spacing={2}>
      <Grid item container xs={12}>
        <Grid item xs={4}>
          <Typography
            style={{ textAlign: 'center' }}
            color={grey[600]}
            fontSize={18}
          >
            Fecha
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            style={{ textAlign: 'center' }}
            color={grey[600]}
            fontSize={18}
          >
            {physicalPerson ? 'Ingresos' : 'Ventas'}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography
            style={{ textAlign: 'center' }}
            color={grey[600]}
            fontSize={18}
          >
            {physicalPerson ? 'Egresos' : 'Gastos'}
          </Typography>
        </Grid>
      </Grid>

      {fields.map((field, idx) => (
        <Grid
          key={`company-flow-row-${idx}`}
          item
          container
          xs={12}
          spacing={1}
          alignItems={'center'}
          sx={{ mb: -1 }}
        >
          <Grid item xs={4}>
            <Typography
              color={grey[600]}
              fontSize={14}
              textAlign={'center'}
            >{`${dateFormatter.toMonthNameWithYear(field[CompanyFlowFields.Date], true)}`}</Typography>
          </Grid>
          <Grid item xs={4}>
            <ControlledTextFieldFilled
              label=""
              control={control}
              name={`${CompanyFlowInsertRequestFields.FlowList}.${idx}.${CompanyFlowFields.Income}`}
              currency
              textAlign={'right'}
            />
          </Grid>
          <Grid item xs={4}>
            <ControlledTextFieldFilled
              label=""
              control={control}
              name={`${CompanyFlowInsertRequestFields.FlowList}.${idx}.${CompanyFlowFields.Sale}`}
              currency
              textAlign={'right'}
            />
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default CompanyFlowEdit;
