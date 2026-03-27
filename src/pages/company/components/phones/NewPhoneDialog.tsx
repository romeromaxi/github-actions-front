import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Theme,
  useMediaQuery,
} from '@mui/material';
import BaseDialogTitle from '../../../../components/dialog/BaseDialogTitle';
import { ControlledAreaCodePhoneFieldFilled } from '../../../../components/forms/ControlledAreaCodePhoneField';
import { useForm, useWatch } from 'react-hook-form';
import {
  ControlledCheckBox,
  ControlledTextFieldFilled,
} from '../../../../components/forms';
import { EntityWithIdAndDescription } from '../../../../types/baseEntities';
import { PhoneType } from '../../../../types/general/generalEnums';
import React, { useEffect } from 'react';
import * as yup from 'yup';
import { CompanyPhoneInsertDTO } from '../../../../types/company/companyReferentialData';
import {
  EntityPhoneNumber,
  EntityPhoneNumberFields,
} from '../../../../types/general/generalReferentialData';
import {
  RequiredAreaCodeSchema,
  RequiredPhoneSchema,
  RequiredSelectSchema,
} from '../../../../util/validation/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';

interface NewPhoneDialogProps {
  open: boolean;
  onClose: () => void;
  phoneBase?: EntityPhoneNumber;
  onSubmit: (data: CompanyPhoneInsertDTO) => void;
}

const typesOptions: EntityWithIdAndDescription[] = [
  {
    id: PhoneType.CellPhone,
    descripcion: 'Celular',
  },
  {
    id: PhoneType.Landline,
    descripcion: 'Fijo',
  },
];

const NewPhoneDialog = ({
  open,
  onClose,
  phoneBase,
  onSubmit,
}: NewPhoneDialogProps) => {
  const phoneResolverSchema = yup.object().shape({
    [EntityPhoneNumberFields.PhoneTypeCode]: RequiredSelectSchema,
    [EntityPhoneNumberFields.AreaCode]: RequiredAreaCodeSchema,
    [EntityPhoneNumberFields.PhoneNumber]: RequiredPhoneSchema,
  });

  const { control, handleSubmit, reset } = useForm<CompanyPhoneInsertDTO>({
    defaultValues: {
      ...phoneBase,
    },

    resolver: yupResolver(phoneResolverSchema),
  });

  const phoneType = useWatch({
    control,
    name: EntityPhoneNumberFields.PhoneTypeCode,
    defaultValue: PhoneType.CellPhone,
  });

  const isMediumScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const handleClose = () => {
    reset({
      [EntityPhoneNumberFields.MainPhone]: false,
      [EntityPhoneNumberFields.PhoneNumber]: '',
      [EntityPhoneNumberFields.PhoneTypeCode]: 0,
      [EntityPhoneNumberFields.PhoneTypeDesc]: '',
      [EntityPhoneNumberFields.AreaCode]: '',
      [EntityPhoneNumberFields.Whatsapp]: false,
    });
    onClose();
  };

  const onHandleSubmit = (data: CompanyPhoneInsertDTO) => {
    const sentData: CompanyPhoneInsertDTO = {
      ...data,
      [EntityPhoneNumberFields.Whatsapp]:
        data[EntityPhoneNumberFields.PhoneTypeCode] === PhoneType.CellPhone
          ? data[EntityPhoneNumberFields.Whatsapp]
          : false,
    };

    onSubmit(sentData);
    handleClose();
  };

  useEffect(() => {
    phoneBase && reset(phoneBase);
  }, [phoneBase]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <BaseDialogTitle
        title={phoneBase ? 'Editar teléfono' : 'Nuevo teléfono'}
        onClose={handleClose}
      />
      <DialogContent>
        <Grid container alignItems={'center'} spacing={3}>
          <Grid item xs={12} sm={12} md={3} lg={3} mb={2}>
            <ControlledTextFieldFilled
              select
              control={control}
              options={typesOptions}
              name={EntityPhoneNumberFields.PhoneTypeCode}
              defaultValue={typesOptions[0]}
              label={'Tipo'}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={7}>
            <ControlledAreaCodePhoneFieldFilled
              control={control}
              nameAreaCode={EntityPhoneNumberFields.AreaCode}
              namePhoneNumber={EntityPhoneNumberFields.PhoneNumber}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2} textAlign={'start'} alignItems="center" ml={isMediumScreenSize ? 2 : 0}>
            {phoneType === PhoneType.CellPhone && (
              <ControlledCheckBox
                label={'Whatsapp'}
                name={EntityPhoneNumberFields.Whatsapp}
                control={control}
              />
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={handleSubmit(onHandleSubmit)}
          id={"company-save-phone-btn"}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewPhoneDialog;
