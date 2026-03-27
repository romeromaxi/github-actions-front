import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {Stack} from '@mui/material';

import { LoaderBlockUI } from 'components/loader';
import { SaveButton } from 'components/buttons/Buttons';
import { ControlledCheckBox } from 'components/forms';

import { HttpCacheProduct } from 'http/cache/httpCacheProduct';
import { RequiredStringSchema } from 'util/validation/validationSchemas';
import {
  ProductService,
  ProductServiceFields,
  ProductServiceInsert,
} from 'types/product/productserviceData';
import { ControlledTextFieldFilled } from '../../../components/forms';
import DrawerBase from "../../../components/misc/DrawerBase";

type ProductServiceFormData = {
  [ProductServiceFields.ProductServiceCode]: number;
  [ProductServiceFields.ProductServiceDesc]: string;
};

export interface ProductServiceFormDrawerProps {
  label?: string | undefined;
  entity: ProductService;
  title: string;
  onCloseDrawer: () => void;
  onSubmitDrawer: (msgSuccess: string) => void;
}

export default function ClientProductServiceFormDrawer(
  props: ProductServiceFormDrawerProps,
) {
  const ProductFormSchema = yup.object().shape({
    [ProductServiceFields.ProductServiceDesc]: RequiredStringSchema,
  });

  const { control, handleSubmit, getValues, reset } =
    useForm<ProductServiceFormData>({
      resolver: yupResolver(ProductFormSchema),
      mode: 'onBlur',
    });

  const [productService] = useState(props.entity);
  const [isSaving, setSaving] = useState<boolean>(false);

  const isAddMode = !productService.id;

  const handleClose = () => {
    props.onCloseDrawer();
  };
  const onSubmit = (data: ProductServiceFormData) => {
    setSaving(true);

    let productServiceDesc = data[ProductServiceFields.ProductServiceDesc];

    isAddMode
      ? HttpCacheProduct.insertService(data as ProductServiceInsert).then(
          () => {
            setSaving(false);
            handleClose();
            props.onSubmitDrawer(
              `El servicio ${productServiceDesc} se guardó correctamente!`,
            );
          },
        )
      : HttpCacheProduct.updateService(data as ProductServiceInsert).then(
          () => {
            setSaving(false);
            handleClose();
            props.onSubmitDrawer(
              `El servicio ${productServiceDesc} se actualizó correctamente!`,
            );
          },
        );
  };

  useEffect(() => {
    reset({ ...getValues(), ...productService });
  }, [productService]);

  return (
    <div>
      <DrawerBase title={props.title}
                  onCloseDrawer={handleClose}
                  show={true}
                  action={<SaveButton onClick={handleSubmit(onSubmit)}>Guardar</SaveButton>}
      >
          <Stack spacing={1}>
              <ControlledTextFieldFilled
                label="Nombre servicio"
                control={control}
                name={ProductServiceFields.ProductServiceDesc}
                fullWidth
                required
              />
              <ControlledCheckBox
                label="Activo"
                name={ProductServiceFields.Active}
                control={control}
                disabled={isAddMode}
              />
          </Stack>
      </DrawerBase>

      {isSaving && <LoaderBlockUI />}
    </div>
  );
}
