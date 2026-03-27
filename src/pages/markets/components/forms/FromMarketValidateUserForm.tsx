import React, { useEffect, useState } from 'react';
import {
  UserModelView,
  UserModelViewFields,
  UserValidateIdentityRequest,
  UserValidateIdentityRequestFields,
} from '../../../../types/user';
import { useAction } from '../../../../hooks/useAction';
import useAxios from '../../../../hooks/useAxios';
import {
  FileBaseFields,
  FileBaseInsert,
  FileBaseInsertFields,
} from '../../../../types/files/filesData';
import * as yup from 'yup';
import {
  RequiredSchema,
  RequiredSelectSchema,
  RequiredStringSchema,
} from '../../../../util/validation/validationSchemas';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { HttpCachePerson, HttpUser } from '../../../../http';
import { Grid, Stack, Typography } from '@mui/material';
import {
  AsyncSelect,
  ControlledTextFieldFilled,
} from '../../../../components/forms';
import { DropzoneField } from '../../../../components/forms/DropzoneField';
import { FileSelectedDetail } from '../../../../components/files/FileSelectedDetail';
import { ConfirmButton } from '../../../../components/buttons/Buttons';
import { grey } from '@mui/material/colors';

interface FromMarketValidateUserFormProps {
  onSubmit: (cuit?: string) => void;
}

const FromMarketValidateUserForm = ({
  onSubmit,
}: FromMarketValidateUserFormProps) => {
  const [userDetails, setUserDetails] = useState<UserModelView>();
  const { snackbarSuccess } = useAction();
  const { fetchData } = useAxios();
  const [fileFront, setFileFront] = useState<FileBaseInsert>();
  const [fileBack, setFileBack] = useState<FileBaseInsert>();

  const validateUserSchema = yup.object().shape({
    [UserValidateIdentityRequestFields.DocumentTypeCode]: RequiredSelectSchema,
    [UserValidateIdentityRequestFields.ProcedureNumber]: RequiredStringSchema,
    [UserValidateIdentityRequestFields.GenderCode]: RequiredSelectSchema,
    [UserValidateIdentityRequestFields.DocumentFront]: RequiredSchema,
    [UserValidateIdentityRequestFields.DocumentBack]: RequiredSchema,
  });
  const { control, setValue, watch, reset, getValues, handleSubmit } =
    useForm<UserValidateIdentityRequest>({
      defaultValues: {
        [UserValidateIdentityRequestFields.DocumentNumber]:
          userDetails?.[UserModelViewFields.DocumentNumber],
      },
      resolver: yupResolver(validateUserSchema),
    });

  useEffect(() => {
    HttpUser.getUserDataLogged().then((r) => {
      setUserDetails(r);
      reset({
        ...getValues(),
        [UserValidateIdentityRequestFields.DocumentNumber]:
          r[UserModelViewFields.DocumentNumber],
      });
    });
  }, []);

  const watchFront = watch(UserValidateIdentityRequestFields.DocumentFront);
  const watchBack = watch(UserValidateIdentityRequestFields.DocumentBack);

  const onValidate = (data: UserValidateIdentityRequest) => {
    fetchData(() => HttpUser.postValidateIdentity(data), true).then(() => {
      snackbarSuccess('Se ha enviado el pedido de validación correctamente');
      onSubmit(userDetails?.[UserModelViewFields.CUIT]);
    });
  };

  const removeFront = () => {
    setValue(UserValidateIdentityRequestFields.DocumentFront, undefined);
    setFileFront(undefined);
  };

  const removeBack = () => {
    setValue(UserValidateIdentityRequestFields.DocumentBack, undefined);
    setFileBack(undefined);
  };

  useEffect(() => {
    if (watchFront) {
      let newFile = getValues(UserValidateIdentityRequestFields.DocumentFront);
      if (!newFile) return setFileFront(undefined);

      let fileBase: FileBaseInsert = {
        [FileBaseFields.FileDesc]: newFile[0]?.name,
        [FileBaseFields.BeginDate]: new Date(),
        [FileBaseFields.FileSize]: newFile[0]?.size,
        [FileBaseInsertFields.File]: newFile[0],
      } as FileBaseInsert;

      setFileFront(fileBase);
    }
  }, [watchFront, getValues]);

  useEffect(() => {
    if (watchBack) {
      let newFile = getValues(UserValidateIdentityRequestFields.DocumentBack);
      if (!newFile) return setFileBack(undefined);

      let fileBase: FileBaseInsert = {
        [FileBaseFields.FileDesc]: newFile[0]?.name,
        [FileBaseFields.BeginDate]: new Date(),
        [FileBaseFields.FileSize]: newFile[0]?.size,
        [FileBaseInsertFields.File]: newFile[0],
      } as FileBaseInsert;

      setFileBack(fileBase);
    }
  }, [watchBack, getValues]);

  return (
    <form onSubmit={handleSubmit(onValidate)}>
      <Grid item xs={12} container spacing={2} mt={2}>
        <Grid item xs={12} md={6}>
          <AsyncSelect
            control={control}
            fullWidth
            name={UserValidateIdentityRequestFields.DocumentTypeCode}
            label={'Tipo'}
            loadOptions={HttpCachePerson.getDocumentTypes}
            filled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ControlledTextFieldFilled
            control={control}
            fullWidth
            name={UserValidateIdentityRequestFields.ProcedureNumber}
            label={'Número de trámite'}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ControlledTextFieldFilled
            control={control}
            fullWidth
            name={UserValidateIdentityRequestFields.DocumentNumber}
            label={'Número de documento'}
            defaultValue={userDetails?.[UserModelViewFields.DocumentNumber]}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <AsyncSelect
            control={control}
            fullWidth
            name={UserValidateIdentityRequestFields.GenderCode}
            label={'Género'}
            loadOptions={HttpCachePerson.getGenderTypes}
            filled
          />
        </Grid>
        <Grid item xs={12}>
          <Typography fontSize={11} color={grey[600]}>
            Subí imagen de tu documento de frente y dorso, que se vea claramente
            toda la información. Los datos serán verificados con RENAPER
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <Typography fontSize={15} textAlign={'center'} fontWeight={500}>
              Frente
            </Typography>
            {!fileFront ? (
              <DropzoneField
                name={UserValidateIdentityRequestFields.DocumentFront}
                multiple={false}
                control={control}
                setValue={setValue}
              />
            ) : (
              <FileSelectedDetail
                file={fileFront}
                actions
                onDelete={removeFront}
              />
            )}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <Typography fontSize={15} textAlign={'center'} fontWeight={500}>
              Dorso
            </Typography>
            {!fileBack ? (
              <DropzoneField
                name={UserValidateIdentityRequestFields.DocumentBack}
                multiple={false}
                control={control}
                setValue={setValue}
              />
            ) : (
              <FileSelectedDetail
                file={fileBack}
                actions
                onDelete={removeBack}
              />
            )}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row-reverse">
            <ConfirmButton type={'submit'} size={'small'}>
              Validar
            </ConfirmButton>
          </Stack>
        </Grid>
      </Grid>
    </form>
  );
};

export default FromMarketValidateUserForm;
