import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  ProductDestiny,
  ProductDestinyFields,
  ProductDestinyInsert,
} from 'types/product/productdestinyData';
import { HttpCacheProduct } from 'http/cache/httpCacheProduct';

import { ControlledCheckBox } from 'components/forms';

import { RequiredStringSchema } from 'util/validation/validationSchemas';
import {Stack} from '@mui/material';
import { LoaderBlockUI } from 'components/loader';
import { SaveButton } from 'components/buttons/Buttons';
import { ControlledTextFieldFilled } from '../../../components/forms';
import DrawerBase from "../../../components/misc/DrawerBase";

type ProductDestinyFormData = {
  [ProductDestinyFields.ProductDestinyCode]: number;
  [ProductDestinyFields.ProductDestinyDesc]: string;
};

export interface ProductDestinyFormDrawerProps {
  label?: string | undefined;
  entity: ProductDestiny;
  title: string;
  onCloseDrawer: () => void;
  onSubmitDrawer: (msgSuccess: string) => void;
}

export default function ClientProductDestinyFormDrawer(
  props: ProductDestinyFormDrawerProps,
) {
  const ProductFormSchema = yup.object().shape({
    [ProductDestinyFields.ProductDestinyDesc]: RequiredStringSchema,
  });

  const { control, handleSubmit, getValues, reset } =
    useForm<ProductDestinyFormData>({
      resolver: yupResolver(ProductFormSchema),
      mode: 'onBlur',
    });

  const [productDestiny] = useState(props.entity);
  const [isSaving, setSaving] = useState<boolean>(false);

  const isAddMode = !productDestiny.id;

  const handleClose = () => {
    props.onCloseDrawer();
  };

  const onSubmit = (data: ProductDestinyFormData) => {
    setSaving(true);

    isAddMode
      ? HttpCacheProduct.insertDestiny(data as ProductDestinyInsert).then(
          () => {
            setSaving(false);
            handleClose();
            props.onSubmitDrawer(
              `El Destino ${productDestiny.descripcion} se guardó correctamente!`,
            );
          },
        )
      : HttpCacheProduct.updateDestiny(data as ProductDestinyInsert).then(
          () => {
            setSaving(false);
            handleClose();
            props.onSubmitDrawer(
              `El Destino ${productDestiny.descripcion} se actualizó correctamente!`,
            );
          },
        );
  };

  useEffect(() => {
    reset({ ...getValues(), ...productDestiny });
  }, [productDestiny]);

  return (
    <div>
      <DrawerBase onCloseDrawer={handleClose}
                  show={true}
                  title={props.title}
                  action={<SaveButton onClick={handleSubmit(onSubmit)}>Guardar</SaveButton>}
      >
          <Stack spacing={1}>
              <ControlledTextFieldFilled
                label="Destino"
                control={control}
                name={ProductDestinyFields.ProductDestinyDesc}
                required
                fullWidth
              />
              <ControlledCheckBox
                label="Activo"
                name={ProductDestinyFields.Active}
                control={control}
                disabled={isAddMode}
              />
          </Stack>
      </DrawerBase>

      {isSaving && <LoaderBlockUI />}
    </div>
  );
}
