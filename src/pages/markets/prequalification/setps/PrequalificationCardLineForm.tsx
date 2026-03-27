import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from '@mui/material';
import {
  ProductLineFields,
  ProductLineRequirementFields,
} from '../../../../types/lines/productLineData';
import { ControlledTextFieldFilled } from '../../../../components/forms';
import { Alert } from '@mui/lab';
import { SolicitationRequirementFields } from '../../../../types/solicitations/solicitationData';
import { SolicitationRequirementInsertForm } from './PrequalificationStepCompleteLinesDataForm';

interface PrequalificationCardLineFormProps {
  nameBase: string;
}

function PrequalificationCardLineForm(
  props: PrequalificationCardLineFormProps,
) {
  const { control, watch } = useFormContext();
  const hasRequirements: boolean =
    !!watch(`${props.nameBase}.${ProductLineFields.ListRequirements}`) &&
    watch(`${props.nameBase}.${ProductLineFields.ListRequirements}`).length;

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Typography>
            {watch(`${props.nameBase}.${ProductLineFields.Line}`)}
          </Typography>
        }
      />

      <Divider />

      <CardContent
        sx={{ backgroundColor: 'white', maxHeight: '215px', overflowX: 'auto' }}
      >
        <Grid container spacing={2} justifyContent="center">
          {hasRequirements ? (
            watch(
              `${props.nameBase}.${ProductLineFields.ListRequirements}`,
            ).map((r: SolicitationRequirementInsertForm, index: number) => (
              <Grid item xs={10}>
                <ControlledTextFieldFilled
                  label={r[ProductLineRequirementFields.RequirementDescription]}
                  helperText={r[ProductLineRequirementFields.Description]}
                  control={control}
                  name={`${props.nameBase}.${ProductLineFields.ListRequirements}[${index}].${SolicitationRequirementFields.RequirementResponse}`}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Alert>
                Esta línea no posee requerimientos de precalificación especiales
              </Alert>
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
}

export default PrequalificationCardLineForm;
