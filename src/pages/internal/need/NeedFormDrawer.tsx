import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {Stack} from '@mui/material';

import { LoaderBlockUI } from 'components/loader';
import { SaveButton } from 'components/buttons/Buttons';
import { ControlledCheckBox } from 'components/forms';

import { RequiredStringSchema } from 'util/validation/validationSchemas';
import { HttpCacheProduct } from 'http/cache/httpCacheProduct';
import { Need, NeedFields, NeedInsert } from 'types/general/generalNeedData';
import { ControlledTextFieldFilled } from '../../../components/forms';
import DrawerBase from "../../../components/misc/DrawerBase";

type NeedFormData = {
  [NeedFields.NeedCode]: number;
  [NeedFields.NeedDesc]: string;
};

export interface NeedFormDrawerProps {
  label?: string | undefined;
  entity: Need;
  title: string;
  onCloseDrawer: () => void;
  onSubmitDrawer: (msgSuccess: string) => void;
}

export default function ClientNeedFormDrawer(props: NeedFormDrawerProps) {
  const NeedFormSchema = yup.object().shape({
    [NeedFields.NeedDesc]: RequiredStringSchema,
  });

  const { control, handleSubmit, getValues, reset } = useForm<NeedFormData>({
    resolver: yupResolver(NeedFormSchema),
    mode: 'onBlur',
  });

  const [productNeed] = useState(props.entity);
  const [isSaving, setSaving] = useState<boolean>(false);

  const isAddMode = !productNeed.id;

  const handleClose = () => {
    props.onCloseDrawer();
  };

  const onSubmit = (data: NeedFormData) => {
    setSaving(true);

    let productNeedDesc = data[NeedFields.NeedDesc];

    isAddMode
      ? HttpCacheProduct.insertNeed(data as NeedInsert).then(() => {
          setSaving(false);
          handleClose();
          props.onSubmitDrawer(
            `La necesidad ${productNeedDesc} se guardó correctamente!`,
          );
        })
      : HttpCacheProduct.updateNeed(data as NeedInsert).then(() => {
          setSaving(false);
          handleClose();
          props.onSubmitDrawer(
            `La necesidad ${productNeedDesc} se actualizó correctamente!`,
          );
        });
  };

  useEffect(() => {
    reset({ ...getValues(), ...productNeed });
  }, [productNeed]);

  return (
    <div>
      <DrawerBase onCloseDrawer={handleClose} show={true}
                  title={props.title} action={<SaveButton onClick={handleSubmit(onSubmit)}>Guardar</SaveButton>}
      >
          <Stack spacing={1}>
              <ControlledTextFieldFilled
                label="Nombre Necesidad"
                control={control}
                name={NeedFields.NeedDesc}
                fullWidth
                required
              />
              <ControlledCheckBox
                label="Activo"
                name={NeedFields.Active}
                control={control}
                disabled={isAddMode}
              />
          </Stack>
      </DrawerBase>
      {isSaving && <LoaderBlockUI />}
    </div>
  );
}
