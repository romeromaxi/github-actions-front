import React, { useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Dialog, DialogActions, DialogContent, Grid } from '@mui/material';

import BaseDialogTitle from 'components/dialog/BaseDialogTitle';
import { CloseButton, SaveButton } from 'components/buttons/Buttons';
import { ControlledDatePicker } from 'components/forms/ControlledDatePicker';

import {
  RequestPublicationData,
  RequestPublicationFields,
} from 'types/lines/productLineData';
import { useAction } from 'hooks/useAction';
import { dateFormatter } from 'util/formatters/dateFormatter';
import { dateHelper } from 'util/helpers/dateHelper';
import {DATE_OUT_OF_RANGE_MESSAGE, RequiredDateSchema} from 'util/validation/validationSchemas';
import { HttpOffererProductLine } from 'http/index';
import { BaseResponseFields } from 'types/baseEntities';

interface OffererLineRequestPublicationDialogProps {
  open: boolean;
  offererId: number;
  productLineId: number;
  onCloseDialog: () => void;
  onSubmitDialog: () => void;
}

function OffererLineRequestPublicationDialog(
  props: OffererLineRequestPublicationDialogProps,
) {
  const { showLoader, hideLoader, snackbarError, snackbarSuccess } =
    useAction();
  const today: Date = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate: Date = today; //dateHelper.getNextDate(2);
  const [startDate, setStartDate] = useState<Date>();

  const OffererLineRequestPublicationSchema = yup
    .object()
    .shape({
      [RequestPublicationFields.DateToPublish]: yup
        .mixed()
        .required('Campo obligatorio')
        .default(() => today),
      [RequestPublicationFields.DateCancelPublication]: RequiredDateSchema
    })
    .test(
      RequestPublicationFields.DateToPublish,
      `La fecha debe ser mayor o igual a ${dateFormatter.toShortDate(today)}`,
      (obj) => {
        if (!obj) return true;

        if (
          !obj[RequestPublicationFields.DateToPublish] ||
          obj[RequestPublicationFields.DateToPublish] >= today
        )
          return true;

        return new yup.ValidationError(
          `La fecha debe ser mayor o igual a ${dateFormatter.toShortDate(minDate)}`,
          null,
          RequestPublicationFields.DateToPublish,
        );
      },
    )
    .test(
      RequestPublicationFields.DateCancelPublication,
      'Debe ser mayor que la Fecha de Publicación',
      (obj) => {
        let dateCancelPub = obj[RequestPublicationFields.DateCancelPublication];
        let dateToPublish = obj[RequestPublicationFields.DateToPublish];

        if (!dateCancelPub) return true;

        if (!dateHelper.isValidDate(dateCancelPub))
          return new yup.ValidationError(
            DATE_OUT_OF_RANGE_MESSAGE,
            null,
            RequestPublicationFields.DateCancelPublication,
          );

        if (
          !!dateToPublish &&
          (dateCancelPub as Date) <= (dateToPublish as Date)
        )
          return new yup.ValidationError(
            'Debe ser mayor que la Fecha de Publicación',
            null,
            RequestPublicationFields.DateCancelPublication,
          );

        if ((dateCancelPub as Date) >= minDate) return true;

        return new yup.ValidationError(
          `La fecha debe ser mayor o igual a ${dateFormatter.toShortDate(minDate)}`,
          null,
          RequestPublicationFields.DateCancelPublication,
        );
      },
    );

  /*
        [ChangePasswordFormFields.NewPasswordConfirm]: RequiredPasswordSchema
            .oneOf([yup.ref(ChangePasswordFormFields.NewPassword), null], 'Las constraseñas no coinciden')*/
  const methods = useForm<RequestPublicationData>({
    resolver: yupResolver(OffererLineRequestPublicationSchema),
  });

  const resetForm = () =>
    methods.reset({
      [RequestPublicationFields.DateToPublish]: undefined,
      [RequestPublicationFields.DateCancelPublication]: undefined,
    });

  const handleClose = () => {
    resetForm();
    props.onCloseDialog();
  };

  const handleSubmit = (data: RequestPublicationData) => {
    showLoader();

    if (!data[RequestPublicationFields.DateToPublish])
      data[RequestPublicationFields.DateToPublish] = today;

    HttpOffererProductLine.requestPublication(
      props.offererId,
      props.productLineId,
      data,
    )
      .then((response) => {
        if (response[BaseResponseFields.HasError])
          snackbarError(response[BaseResponseFields.ErrorDescription]);
        else {
          snackbarSuccess('La línea fue enviada para publicar correctamente');
          props.onSubmitDialog();
        }
      })
      .finally(() => hideLoader());
  };

  return (
    <Dialog open={props.open} onClose={handleClose} maxWidth="sm" fullWidth>
      <BaseDialogTitle title={'Solicitar publicación'} onClose={handleClose} />

      <form>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <ControlledDatePicker
                label={'Fecha de Publicación'}
                control={methods.control}
                name={RequestPublicationFields.DateToPublish}
                minDate={minDate}
                handleChange={(date: Date) => setStartDate(date)}
                filled
              />
            </Grid>
            <Grid item xs={12}>
              <ControlledDatePicker
                label={'Fecha de Finalización'}
                control={methods.control}
                name={RequestPublicationFields.DateCancelPublication}
                minDate={!!startDate ? startDate : minDate}
                filled
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <CloseButton onClick={handleClose}>Cancelar</CloseButton>
          <SaveButton onClick={methods.handleSubmit(handleSubmit)}>
            Enviar
          </SaveButton>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default OffererLineRequestPublicationDialog;
