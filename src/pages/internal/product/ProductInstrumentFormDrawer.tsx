import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {Stack} from '@mui/material';

import { AsyncSelect } from 'components/forms';
import { LoaderBlockUI } from 'components/loader';
import {SaveButton } from 'components/buttons/Buttons';
import { ControlledCheckBox } from 'components/forms';

import { HttpCacheProduct } from 'http/cache/httpCacheProduct';
import {
  RequiredSelectSchema,
  RequiredStringSchema,
} from 'util/validation/validationSchemas';
import {
  ProductInstrument,
  ProductInstrumentFields,
  ProductInstrumentInsert,
} from 'types/product/productInstrumentData';
import { ControlledTextFieldFilled } from '../../../components/forms';
import DrawerBase from "../../../components/misc/DrawerBase";

type ProductInstrumentFormData = {
  [ProductInstrumentFields.ProductInstrumentCode]: number;
  [ProductInstrumentFields.ProductInstrumentDesc]: string;
};

export interface ProductInstrumentFormDrawerProps {
  label?: string | undefined;
  entity: ProductInstrument;
  title: string;
  onCloseDrawer: () => void;
  onSubmitDrawer: (msgSuccess: string) => void;
}

export default function ProductInstrumentFormDrawer(
  props: ProductInstrumentFormDrawerProps,
) {
  const ProductFormSchema = yup.object().shape({
    [ProductInstrumentFields.ProductInstrumentTypeCode]: RequiredSelectSchema,
    [ProductInstrumentFields.ProductDestinyCode]: RequiredSelectSchema,
    [ProductInstrumentFields.ProductInstrumentDesc]: RequiredStringSchema,
  });

  const { control, handleSubmit, getValues, reset } =
    useForm<ProductInstrumentFormData>({
      resolver: yupResolver(ProductFormSchema),
      mode: 'onBlur',
    });

  const [productInstrument] = useState(props.entity);
  const [isSaving, setSaving] = useState<boolean>(false);

  const isAddMode = !productInstrument.id;

  const handleClose = () => {
    props.onCloseDrawer();
  };

  const onSubmit = (data: ProductInstrumentFormData) => {
    setSaving(true);

    let productInstrument = data as ProductInstrumentInsert;
    let productInstrumentDesc =
      productInstrument[ProductInstrumentFields.ProductInstrumentDesc];

    isAddMode
      ? HttpCacheProduct.insertInstrument(productInstrument).then(() => {
          setSaving(false);
          handleClose();
          props.onSubmitDrawer(
            `El instrumento ${productInstrumentDesc} se guardó correctamente!`,
          );
        })
      : HttpCacheProduct.updateInstrument(productInstrument).then(() => {
          setSaving(false);
          handleClose();
          props.onSubmitDrawer(
            `El instrumento ${productInstrumentDesc} se actualizó correctamente!`,
          );
        });
  };

  useEffect(() => {
    reset({ ...getValues(), ...productInstrument });
  }, [productInstrument]);

  return (
      <DrawerBase onCloseDrawer={handleClose} show={true}
                  title={props.title} action={<SaveButton onClick={handleSubmit(onSubmit)}>Guardar</SaveButton>}>
          <Stack spacing={2}>
              <ControlledTextFieldFilled
                label="Nombre Instrumento"
                control={control}
                name={ProductInstrumentFields.ProductInstrumentDesc}
                fullWidth
                required
              />
              <AsyncSelect
                label="Tipo Instrumento"
                loadOptions={HttpCacheProduct.getInstrumentTypes}
                control={control}
                name={ProductInstrumentFields.ProductInstrumentTypeCode}
                fullWidth
                required
              />
              <AsyncSelect
                label="Destino"
                loadOptions={HttpCacheProduct.getDestinies}
                control={control}
                name={ProductInstrumentFields.ProductDestinyCode}
                fullWidth
                required
              />
              <ControlledCheckBox
                label="Activo"
                name={ProductInstrumentFields.Active}
                control={control}
                disabled={isAddMode}
              />
          </Stack>
        {isSaving && <LoaderBlockUI />}
      </DrawerBase>

  );
}
