import { Checkbox, Grid, Stack, Typography } from '@mui/material';
import { SubTitle } from '../../../components/text/SubTitle';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import {
  NotRequiredNumberSchema,
  RequiredFileSchema,
  RequiredMonthSchema,
  RequiredSchema,
  RequiredSelectSchema,
  RequiredStringSchema,
} from '../../../util/validation/validationSchemas';
import {
  CompanyUnconfirmedRegisterData,
  CompanyUnconfirmedRegisterDataFields,
} from '../../../types/company/companyData';
import {
  HttpCacheCompany,
  HttpCachePerson,
  HttpCompany,
  HttpUser,
} from '../../../http';
import { Disclaimer } from '../../../components/text/Disclaimer';
import {
  AsyncSelect,
  ControlledTextFieldFilled,
} from '../../../components/forms';
import {
  UserModelView,
  UserModelViewFields,
  UserValidateIdentityRequest,
  UserValidateIdentityRequestFields,
} from '../../../types/user';
import { DropzoneField } from '../../../components/forms/DropzoneField';
import { FileSelectedDetail } from '../../../components/files/FileSelectedDetail';
import { ConfirmButton } from '../../../components/buttons/Buttons';
import {
  FileBaseFields,
  FileBaseInsert,
  FileBaseInsertFields,
} from '../../../types/files/filesData';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import useAxios from '../../../hooks/useAxios';
import NewCompanyDrawerStyles from './NewCompanyDrawer.styles';
import { useAction } from '../../../hooks/useAction';
import { PersonTypes } from '../../../types/person/personEnums';

interface NewCompanyAndValidationBaseFormProps {
  onSubmitted: () => void;
  samePerson: boolean;
  companyId?: number;
  companyName?: string;
  personTypeCode?: number;
}

enum CompanyAndValidationFormFields {
  CloseMonth = 'mesCierre',
}

interface CompanyAndValidationForm {
  [CompanyAndValidationFormFields.CloseMonth]: string;
  [CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]: number;
  [UserValidateIdentityRequestFields.DocumentTypeCode]: number;
  [UserValidateIdentityRequestFields.ProcedureNumber]: number;
  [UserValidateIdentityRequestFields.DocumentNumber]: string;
  [UserValidateIdentityRequestFields.GenderCode]: number;
  [UserValidateIdentityRequestFields.DocumentFront]: File;
  [UserValidateIdentityRequestFields.DocumentBack]: File;
}

const NewCompanyAndValidationBaseForm = ({
  onSubmitted,
  samePerson,
  companyId,
  companyName,
  personTypeCode,
}: NewCompanyAndValidationBaseFormProps) => {
  const [checkedResponsible, setCheckedResponsible] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<UserModelView>();
  const [fileFront, setFileFront] = useState<FileBaseInsert>();
  const [fileBack, setFileBack] = useState<FileBaseInsert>();

  const classes = NewCompanyDrawerStyles();

  const { fetchAllData } = useAxios();
  const { snackbarError, snackbarSuccess } = useAction();

  const formSchema = yup.object().shape({
    [CompanyAndValidationFormFields.CloseMonth]: RequiredMonthSchema,
    [UserValidateIdentityRequestFields.DocumentTypeCode]: RequiredSelectSchema,
    [UserValidateIdentityRequestFields.ProcedureNumber]: RequiredStringSchema,
    [UserValidateIdentityRequestFields.GenderCode]: RequiredSelectSchema,
    [UserValidateIdentityRequestFields.DocumentFront]: RequiredFileSchema,
    [UserValidateIdentityRequestFields.DocumentBack]: RequiredFileSchema,
    [CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]: samePerson
      ? NotRequiredNumberSchema
      : RequiredSchema,
  });

  const { control, watch, setValue, handleSubmit, reset, getValues } =
    useForm<CompanyAndValidationForm>({
      defaultValues: {
        [UserValidateIdentityRequestFields.DocumentNumber]:
          userDetails?.[UserModelViewFields.DocumentNumber],
      },
      resolver: yupResolver(formSchema),
    });

  const watchFront = watch(UserValidateIdentityRequestFields.DocumentFront);
  const watchBack = watch(UserValidateIdentityRequestFields.DocumentBack);

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

  const onSubmit = (data: CompanyAndValidationForm) => {
    if (companyId) {
      const companyData: CompanyUnconfirmedRegisterData = {
        [CompanyAndValidationFormFields.CloseMonth]:
          data[CompanyAndValidationFormFields.CloseMonth],
        [CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]:
          data[CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode],
        diaCierre: '1',
      };

      const promises = [];

      promises.push(
        HttpCompany.insertUnconfirmedCompany(companyId, companyData),
      );

      if (fileFront && fileBack) {
        const validationData: UserValidateIdentityRequest = {
          [UserValidateIdentityRequestFields.DocumentNumber]:
            data[UserValidateIdentityRequestFields.DocumentNumber],
          [UserValidateIdentityRequestFields.DocumentTypeCode]:
            data[UserValidateIdentityRequestFields.DocumentTypeCode],
          [UserValidateIdentityRequestFields.ProcedureNumber]:
            data[UserValidateIdentityRequestFields.ProcedureNumber],
          [UserValidateIdentityRequestFields.GenderCode]:
            data[UserValidateIdentityRequestFields.GenderCode],
          [UserValidateIdentityRequestFields.DocumentFront]:
            data[UserValidateIdentityRequestFields.DocumentFront],
          [UserValidateIdentityRequestFields.DocumentBack]:
            data[UserValidateIdentityRequestFields.DocumentBack],
        };

        promises.push(HttpUser.postValidateIdentity(validationData));

        fetchAllData(promises, true).then(() => {
          snackbarSuccess(
            'Se envió el pedido de validación y se cargó la empresa correctamente',
          );
          reset({
            [UserValidateIdentityRequestFields.DocumentTypeCode]: 0,
            // @ts-ignore
            [UserValidateIdentityRequestFields.ProcedureNumber]: '',
            [UserValidateIdentityRequestFields.GenderCode]: 0,
            [UserValidateIdentityRequestFields.DocumentFront]: undefined,
            [UserValidateIdentityRequestFields.DocumentBack]: undefined,
            [CompanyAndValidationFormFields.CloseMonth]: '',
            [CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode]: 0,
          });
          setFileFront(undefined);
          setFileBack(undefined);

          onSubmitted();
        });
      } else snackbarError('Debe adjuntar archivos para frente y dorso de DNI');
    }
  };

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

  const loadBondOptions =
    personTypeCode === PersonTypes.Legal
      ? HttpCacheCompany.getBondsForLegalPerson
      : HttpCacheCompany.getBondsForPhysicalPerson;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid item xs={12}>
        <SubTitle text={'Carga de datos'} />
      </Grid>
      {companyName && (
        <Grid item xs={12}>
          <Typography className={classes.companyName}>{companyName}</Typography>
        </Grid>
      )}
      <Grid item xs={12} container spacing={2} alignItems={'center'}>
        {!samePerson && (
          <Grid item xs={4}>
            <AsyncSelect
              loadOptions={loadBondOptions}
              control={control}
              name={CompanyUnconfirmedRegisterDataFields.CompanyUserBondCode}
              select
              fullWidth
              label={'¿Cuál es tu relación con la MiPyME?'}
            />
          </Grid>
        )}
        <Grid item xs={2}>
          <ControlledTextFieldFilled
            control={control}
            placeholder="mm"
            label="Mes de cierre del Ejercicio"
            name={CompanyAndValidationFormFields.CloseMonth}
          />
        </Grid>
        <Grid item xs={samePerson ? 10 : 6}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography>
              Declaro que tengo autorización para actuar en representación de la
              MiPyME
            </Typography>
            <Checkbox
              checked={checkedResponsible}
              onChange={() => setCheckedResponsible(!checkedResponsible)}
            />
          </Stack>
        </Grid>
      </Grid>
      <Grid item xs={12} sx={{ marginTop: 4 }}>
        <SubTitle text={'Validación de cuenta'} />
      </Grid>
      <Grid item xs={12} container spacing={2} sx={{ marginTop: 1 }}>
        <Grid item xs={12} md={3}>
          <AsyncSelect
            control={control}
            fullWidth
            name={UserValidateIdentityRequestFields.DocumentTypeCode}
            label={'Tipo'}
            loadOptions={HttpCachePerson.getDocumentTypes}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <ControlledTextFieldFilled
            control={control}
            fullWidth
            name={UserValidateIdentityRequestFields.ProcedureNumber}
            label={'Número de trámite'}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <ControlledTextFieldFilled
            control={control}
            fullWidth
            name={UserValidateIdentityRequestFields.DocumentNumber}
            label={'Número de documento'}
            defaultValue={userDetails?.[UserModelViewFields.DocumentNumber]}
            disabled
          />
        </Grid>
        <Grid item xs={12} md={3}>
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
            Subí imagen de tu documento de frente y dorso, que se vea claramente
            toda la información. Los datos serán verificados con RENAPER
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
          </Stack>
        </Grid>
      </Grid>
      <Stack direction="row-reverse" sx={{ marginTop: 2 }}>
        <ConfirmButton type="submit" disabled={!checkedResponsible}>
          Enviar
        </ConfirmButton>
      </Stack>
    </form>
  );
};

export default NewCompanyAndValidationBaseForm;
