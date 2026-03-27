import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  ProductClassification,
  ProductClassificationFields,
  ProductClassificationInsert,
} from '../../../types/product/productclassificationData';
import { HttpCacheProduct } from '../../../http/cache/httpCacheProduct';

import { ControlledCheckBox, ControlledTextFieldFilled } from 'components/forms';

import { RequiredSchema } from 'util/validation/validationSchemas';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
} from '@mui/material';
import React from 'react';
import { LoaderBlockUI } from 'components/loader';
import BaseDialogTitle from '../../../components/dialog/BaseDialogTitle';
import { CloseButton, SaveButton } from '../../../components/buttons/Buttons';

type ProductClassificationFormData = {
  [ProductClassificationFields.ProductClassificationCode]: number;
  [ProductClassificationFields.ProductClassificationDesc]: string;
};

export interface ProductClassificationFormDialogProps {
  label?: string | undefined;
  entity: ProductClassification;
  title: string;
  onCloseDialog: () => void;
  onSubmitDialog: (msgSuccess: string) => void;
}

export default function ClientProductClassificationFormDialog(
  props: ProductClassificationFormDialogProps,
) {
  const ProductFormSchema = yup.object().shape({
    [ProductClassificationFields.ProductClassificationDesc]: RequiredSchema,
  });
  const { control, handleSubmit, getValues, reset } =
    useForm<ProductClassificationFormData>({
      resolver: yupResolver(ProductFormSchema),
      mode: 'onBlur',
    });
  const [productClassification] = useState(props.entity);
  const [isSaving, setSaving] = useState<boolean>(false);
  const [open, setOpen] = useState(true);

  const isAddMode = !productClassification.id;

  const handleClose = () => {
    props.onCloseDialog();
  };
  const onSubmit = (data: ProductClassificationFormData) => {
    setSaving(true);

    isAddMode
      ? HttpCacheProduct.insertClassification(
          data as ProductClassificationInsert,
        ).then(() => {
          setSaving(false);
          handleClose();
          props.onSubmitDialog(
            `La Clasificación ${productClassification.descripcion} se guardó correctamente!`,
          );
        })
      : HttpCacheProduct.updateClassification(
          data as ProductClassificationInsert,
        ).then(() => {
          setSaving(false);
          handleClose();
          props.onSubmitDialog(
            `La Clasificación ${productClassification.descripcion} se actualizó correctamente!`,
          );
        });
  };

  useEffect(() => {
    reset({ ...getValues(), ...productClassification });
  }, [productClassification]);

  return (
    <div>
      <Dialog onClose={handleClose} open={open} maxWidth="sm" fullWidth>
        <BaseDialogTitle
          title={props.title}
          onClose={handleClose}
        ></BaseDialogTitle>

        <DialogContent>
          <Box mt={1} />
          <Grid container spacing={1}>
            <Grid item xs={8}>
              <ControlledTextFieldFilled
                label="Clasificación"
                control={control}
                name={ProductClassificationFields.ProductClassificationDesc}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <ControlledCheckBox
                label="Activo"
                name={ProductClassificationFields.Active}
                control={control}
                disabled={isAddMode}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <CloseButton onClick={handleClose}>Cancelar</CloseButton>
          <SaveButton onClick={handleSubmit(onSubmit)}>Guardar</SaveButton>
        </DialogActions>
      </Dialog>

      {isSaving && <LoaderBlockUI />}
    </div>
  );
}
