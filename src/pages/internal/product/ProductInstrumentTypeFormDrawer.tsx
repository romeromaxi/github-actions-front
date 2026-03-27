import React, { useState, useEffect } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {Stack} from '@mui/material';
import { LoaderBlockUI } from '../../../components/loader';
import { SaveButton } from 'components/buttons/Buttons';
import { ControlledCheckBox } from 'components/forms';
import { HttpCacheProduct } from 'http/cache/httpCacheProduct';
import { RequiredStringSchema } from 'util/validation/validationSchemas';
import { ControlledTextFieldFilled } from '../../../components/forms';
import { ProductInstrumentType, ProductInstrumentTypeFields, ProductInstrumentTypeInsert } from '../../../types/product/productInstrumentData';
import DrawerBase from "../../../components/misc/DrawerBase";

export interface ProductInstrumentTypeFormDrawerProps {
  productInstrumentType: ProductInstrumentType;
  title: string;
  onCloseDrawer: () => void;
  onSubmitDrawer: (msgSuccess: string) => void;
}

export default function ProductInstrumentTypeFormDrawer(
  props: ProductInstrumentTypeFormDrawerProps,
) {
  const ProductInstrumentTypeFormSchema = yup.object().shape({
    [ProductInstrumentTypeFields.Description]: RequiredStringSchema,
  });

  const { control, handleSubmit, reset } = useForm<ProductInstrumentTypeInsert>({
    resolver: yupResolver(ProductInstrumentTypeFormSchema),
    mode: 'onBlur',
    defaultValues: {
      ...props.productInstrumentType,
      [ProductInstrumentTypeFields.ProductModuleCode]: 1,
      [ProductInstrumentTypeFields.ProductSourceCode]: 1, 
      [ProductInstrumentTypeFields.Active]: true
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const isAddMode = !props.productInstrumentType[ProductInstrumentTypeFields.Code];

  const handleClose = () => props.onCloseDrawer();

  const onSubmit = async (productInstrumentTypeToSubmit: ProductInstrumentTypeInsert) => {
    setIsSubmitting(true);
    const description = productInstrumentTypeToSubmit[ProductInstrumentTypeFields.Description];
    
    try {
      if (isAddMode) {
        await HttpCacheProduct.insertInstrumentType(productInstrumentTypeToSubmit);
      } else {
        await HttpCacheProduct.updateInstrumentType({
          ...productInstrumentTypeToSubmit,
          [ProductInstrumentTypeFields.Code]: props.productInstrumentType[ProductInstrumentTypeFields.Code]
        });
      }
      props.onSubmitDrawer(
        `Tipo de instrumento ${description} ${isAddMode ? 'creado' : 'actualizado'} correctamente!`
      );
    } catch (error) {
      props.onSubmitDrawer('Error al guardar el tipo de instrumento');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    reset({
      ...props.productInstrumentType,
      [ProductInstrumentTypeFields.ProductModuleCode]: 1,
      [ProductInstrumentTypeFields.ProductSourceCode]: 1,
      [ProductInstrumentTypeFields.Active]: props.productInstrumentType[ProductInstrumentTypeFields.Active] ?? true
    });
  }, [props.productInstrumentType, reset]);

  return (
    <div>
      <DrawerBase action={<SaveButton
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
      >
        Guardar
      </SaveButton>}
                  show={true}
                  title={props.title}
                  onCloseDrawer={handleClose}
      >
          <Stack spacing={2}>
              <ControlledTextFieldFilled
                label="Descripción"
                control={control}
                name={ProductInstrumentTypeFields.Description}
                fullWidth
                required
              />
              <ControlledCheckBox
                label="Activo"
                name={ProductInstrumentTypeFields.Active}
                control={control}
                disabled={isAddMode}
              />
          </Stack>
      </DrawerBase>
      {isSubmitting && <LoaderBlockUI />}
    </div>
  );
}