import React, { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {Box, Grid, Stack} from '@mui/material';

import { LoaderBlockUI } from 'components/loader';
import { SaveButton } from 'components/buttons/Buttons';
import {
  AsyncSelect,
  ControlledCheckBox,
} from 'components/forms';

import { HttpCacheProduct } from 'http/cache/httpCacheProduct';
import {
  RequiredSelectSchema,
  RequiredStringSchema,
} from 'util/validation/validationSchemas';

import { Product, ProductFields, ProductPost } from 'types/product/productData';
import { ControlledTextFieldFilled } from '../../../components/forms';
import DrawerBase from "../../../components/misc/DrawerBase";

type ProductFormData = {
  [ProductFields.ProductCode]: number;
  [ProductFields.ProductDesc]: string;
  [ProductFields.ProductInstrumentCode]: number;
  [ProductFields.ProductServiceCode]?: number;
};

export interface ProductFormDrawerProps {
  label?: string | undefined;
  entity: Product;
  title: string;
  onCloseDrawer: () => void;
  onSubmitDrawer: (msgSuccess: string) => void;
}

export default function ProductFormDrawer(props: ProductFormDrawerProps) {
  const ProductFormSchema = yup.object().shape({
    [ProductFields.ProductDesc]: RequiredStringSchema,
    [ProductFields.ProductTemplateCode]: RequiredSelectSchema,
    [ProductFields.ProductInstrumentCode]: RequiredSelectSchema,
    [ProductFields.ProductServiceCode]: RequiredSelectSchema,
  });

  const { control, handleSubmit, getValues, reset } = useForm<ProductFormData>({
    resolver: yupResolver(ProductFormSchema),
    mode: 'onBlur',
  });

  const [product] = useState(props.entity);
  const [isSaving, setSaving] = useState<boolean>(false);

  const isAddMode = !product.id;

  const handleClose = () => {
    props.onCloseDrawer();
  };

  const onSubmit = async (data: ProductFormData) => {
    setSaving(true);

    let productDataPost: ProductPost = data as ProductPost;

    let productId: number = productDataPost[ProductFields.ProductCode];
    let productDesc = productDataPost[ProductFields.ProductDesc];

    if (isAddMode)
      await HttpCacheProduct.insert(productDataPost).then(() => {
        setSaving(false);
        handleClose();
        props.onSubmitDrawer(
          `El producto ${productDesc} se guardó correctamente!`,
        );
      });
    else
      await HttpCacheProduct.update(productId, productDataPost).then(() => {
        setSaving(false);
        handleClose();
        props.onSubmitDrawer(
          `El producto ${productDesc} se actualizó correctamente!`,
        );
      });
  };

  useEffect(() => {
    reset({ ...getValues(), ...product });
  }, [product]);

  const loadServices = useCallback(() => {
    return HttpCacheProduct.getServices();
  }, []);

  const loadProductInstrument = useCallback(async () => {
    return await HttpCacheProduct.getInstruments(true);
  }, []);

  const loadProductTemplates = useCallback(() => {
    return HttpCacheProduct.getTemplates();
  }, []);

  return (
      <DrawerBase show={true}
                  onCloseDrawer={handleClose}
                  title={props.title}
                  action={<SaveButton onClick={handleSubmit(onSubmit)}>Guardar</SaveButton>}
      >
          <Stack spacing={2}>
              <ControlledTextFieldFilled
                label="Nombre Producto"
                control={control}
                name={ProductFields.ProductDesc}
                required
                fullWidth
              />
              <AsyncSelect
                label="Servicio"
                control={control}
                loadOptions={loadServices}
                name={ProductFields.ProductServiceCode}
                fullWidth
              />
              <AsyncSelect
                label="Instrumento"
                control={control}
                loadOptions={loadProductInstrument}
                name={ProductFields.ProductInstrumentCode}
                fullWidth
              />
              <AsyncSelect
                label="Plantilla"
                control={control}
                loadOptions={loadProductTemplates}
                name={ProductFields.ProductTemplateCode}
                required
                fullWidth
              />
              <ControlledCheckBox
                label="Activo"
                name={ProductFields.Active}
                control={control}
                disabled={isAddMode}
              />
          </Stack>
        {isSaving && <LoaderBlockUI />}
      </DrawerBase>
  );
}
