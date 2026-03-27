import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
} from '@mui/material';
import { DefaultStylesButton } from '../buttons/Buttons';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import { RequiredStringSchema } from '../../util/validation/validationSchemas';
import { ControlledTextFieldFilled } from '../forms';
import React from 'react';

const titleDefault: string = '¡Atención!';

interface DialogAlertObservationsProps extends DialogProps {
  title?: string;
  textAlert?: string;
  onClose: () => void;
  onConfirm: (observations: string) => void;
}

enum DialogAlertObservationsFields {
  Observations = 'observaciones',
}

interface DialogAlertObservationsType {
  [DialogAlertObservationsFields.Observations]: string;
}

export function DialogAlertObservations(props: DialogAlertObservationsProps) {
  const finalTitle: string = props.title ?? titleDefault;

  const observationsSchema = yup.object().shape({
    [DialogAlertObservationsFields.Observations]: RequiredStringSchema,
  });

  const methods = useForm<DialogAlertObservationsType>({
    resolver: yupResolver(observationsSchema),
  });

  const onHandleSubmit = (data: DialogAlertObservationsType) =>
    props.onConfirm(data[DialogAlertObservationsFields.Observations]);

  return (
    <Dialog {...props} fullWidth onClose={props.onClose}>
      <DialogTitle>{finalTitle}</DialogTitle>

      <form onSubmit={methods.handleSubmit(onHandleSubmit)}>
        <DialogContent>
          <Grid container spacing={1}>
            {props.textAlert && (
              <Grid item xs={12} mb={2}>
                <Alert color={'info'} severity={'info'}>
                  {props.textAlert}
                </Alert>
              </Grid>
            )}

            <Grid item xs={12}>
              <ControlledTextFieldFilled
                label={'Observaciones'}
                control={methods.control}
                name={DialogAlertObservationsFields.Observations}
                minRows={3}
                maxRows={6}
                multiline
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <DefaultStylesButton color="secondary" onClick={props.onClose}>
            Cancelar
          </DefaultStylesButton>

          <DefaultStylesButton type={'submit'}>Confirmar</DefaultStylesButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}
