import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import BaseDialogTitle from 'components/dialog/BaseDialogTitle';
import { AsyncSelect, ControlledTextFieldFilled } from 'components/forms';
import { HttpCachePerson, HttpUser } from 'http/index';
import { ConfirmButton } from 'components/buttons/Buttons';
import {
  UserModelView,
  UserModelViewFields,
  UserValidateIdentityRequest,
  UserValidateIdentityRequestFields,
} from 'types/user';
import { DropzoneField } from 'components/forms/DropzoneField';
import { useAction } from 'hooks/useAction';
import {
  RequiredFileSchema,
  RequiredSelectSchema,
  RequiredStringSchema,
} from 'util/validation/validationSchemas';
import useAxios from '../../../hooks/useAxios';
import { FileSelectedDetail } from '../../../components/files/FileSelectedDetail';
import {
  FileBaseFields,
  FileBaseInsert,
  FileBaseInsertFields,
} from '../../../types/files/filesData';
import {ValidationStatesType} from "../../../types/person/personEnums";
import {userStorage} from "../../../util/localStorage/userStorage";

interface ValidateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const ValidateUserDialog = ({
  open,
  onClose,
  onSubmit,
}: ValidateUserDialogProps) => {
  const [userDetails, setUserDetails] = useState<UserModelView>();
  const { snackbarSuccess } = useAction();
  const { fetchData } = useAxios();
  const [error, setError] = useState<string>('');
  const [fileFront, setFileFront] = useState<FileBaseInsert>();
  const [fileBack, setFileBack] = useState<FileBaseInsert>();

  const validateUserSchema = yup.object().shape({
    [UserValidateIdentityRequestFields.DocumentTypeCode]: RequiredSelectSchema,
    [UserValidateIdentityRequestFields.ProcedureNumber]: RequiredStringSchema,
    [UserValidateIdentityRequestFields.GenderCode]: RequiredSelectSchema,
    [UserValidateIdentityRequestFields.DocumentFront]: RequiredFileSchema,
    [UserValidateIdentityRequestFields.DocumentBack]: RequiredFileSchema,
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
    if (open)
      HttpUser.getUserDataLogged().then((r) => {
        setUserDetails(r);
        reset({
          ...getValues(),
          [UserValidateIdentityRequestFields.DocumentNumber]:
            r[UserModelViewFields.DocumentNumber],
        });
      });
  }, [open]);

  const watchFront = watch(UserValidateIdentityRequestFields.DocumentFront);
  const watchBack = watch(UserValidateIdentityRequestFields.DocumentBack);

  const handleClose = () => {
    reset({
      [UserValidateIdentityRequestFields.DocumentTypeCode]: 0,
      // @ts-ignore
      [UserValidateIdentityRequestFields.ProcedureNumber]: '',
      [UserValidateIdentityRequestFields.GenderCode]: 0,
      [UserValidateIdentityRequestFields.DocumentFront]: undefined,
      [UserValidateIdentityRequestFields.DocumentBack]: undefined,
    });
    setFileFront(undefined);
    setFileBack(undefined);
    onClose();
  };

  const onValidate = (data: UserValidateIdentityRequest) => {
    fetchData(() => HttpUser.postValidateIdentity(data), true).then(() => {
      userStorage.setValidatedIdentityCode(ValidationStatesType.PendingValidation);
      snackbarSuccess('Se ha enviado el pedido de validación correctamente');
      handleClose();
      onSubmit();
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
    <Dialog open={open} onClose={handleClose} maxWidth={'md'} fullWidth>
      <BaseDialogTitle
        onClose={handleClose}
        title={'Vamos a Validar tu Identidad'}
      />

      <form onSubmit={handleSubmit(onValidate)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <AsyncSelect
                control={control}
                fullWidth
                name={UserValidateIdentityRequestFields.DocumentTypeCode}
                label={'Tipo'}
                loadOptions={HttpCachePerson.getDocumentTypes}
                autoSelect
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
              />
            </Grid>
            <Grid item xs={12}>
              <Typography fontSize={13}>
                Subí imagen de tu documento de frente y dorso, que se vea
                claramente toda la información. Los datos serán verificados con
                RENAPER
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
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
            <Grid item xs={12} md={6}>
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
                {error !== '' && <Alert severity={'error'}>{error}</Alert>}
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <ConfirmButton type={'submit'} size={'small'}>
            Validar
          </ConfirmButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ValidateUserDialog;
