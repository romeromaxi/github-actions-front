import React, { useEffect, useState } from 'react';

import { Box, Grid, Stack, Typography } from '@mui/material';

import { DropzoneField } from '../../../components/forms/DropzoneField';
import { useForm } from 'react-hook-form';
import {
  CompanyApprovalForm,
  CompanyApprovalFormFields,
} from '../../../types/company/companyData';
import useAxios from 'hooks/useAxios';
import { HttpCompany, HttpFilesCompany } from '../../../http';
import {
  FileBaseFields,
  FileBaseInsert,
  FileBaseInsertFields,
} from '../../../types/files/filesData';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FileSelectedDetail } from '../../../components/files/FileSelectedDetail';
import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';
import FileDocumentDetail from '../../../components/files/FileDocumentDetail';
import { Document } from 'types/files/filesData';
import {Alert, Skeleton} from '@mui/lab';
import HelperInputText from '../../../components/text/HelperInputText';
import NewCompanyDrawerStyles from '../newCompany/NewCompanyDrawer.styles';
import {useAction} from "../../../hooks/useAction";
import {PublicEntityEnums} from "../../../util/typification/publicEntityEnums";
interface CompanyAfipFormProps {
  companyId: number;
  companyName: string;
  onAfipConfirmed: () => void;
  viewFiles?: boolean;
}

function CompanyAfipForm(props: CompanyAfipFormProps) {
  const { fetchData } = useAxios();
  const { showLoader, hideLoader, snackbarSuccess } = useAction();
  const classes = NewCompanyDrawerStyles();
  const [docs, setDocs] = useState<Document[]>();
  const [fileFront, setFileFront] = useState<FileBaseInsert>();
  const [fileBack, setFileBack] = useState<FileBaseInsert>();
  const [fileAble, setFileAble] = useState<FileBaseInsert>();

  const fileSchema = yup.object().shape({
    //[CompanyApprovalFormFields.FileAble]: RequiredSingleFileSchema,
    //[CompanyApprovalFormFields.FrontIdFile]: RequiredSchema,
    //[CompanyApprovalFormFields.BackIdFile]: RequiredSchema
  });

  const {
    control,
    watch,
    getValues,
    setValue,
    handleSubmit,
    getFieldState,
    clearErrors,
    setError,
  } = useForm<CompanyApprovalForm>({
    resolver: yupResolver(fileSchema),
  });
  const onHandleAfipConfirmed = (data: CompanyApprovalForm) => {
    if (fileAble) {
      showLoader();

      let formData: FormData = new FormData();
      const codModulo = 1;
      const codOrigen = 1;

      //formData.append(CompanyApprovalFormFields.FrontIdFile, data[CompanyApprovalFormFields.FrontIdFile][0], fileFront.descArchivo)
      //formData.append(CompanyApprovalFormFields.BackIdFile, data[CompanyApprovalFormFields.BackIdFile][0], fileBack.descArchivo)
      formData.append(
          CompanyApprovalFormFields.FileAble,
          data[CompanyApprovalFormFields.FileAble][0],
          fileAble.descArchivo,
      );
      formData.append(FileBaseInsertFields.ModuleCode, codModulo.toString());
      formData.append(FileBaseInsertFields.OriginCode, codOrigen.toString());

      fetchData(() => HttpCompany.changeResponsible(props.companyId))
          .then(() => {
            fetchData(() => HttpCompany.requestApproval(props.companyId, formData))
                .then((r) => {
                  if (!r.tieneError) {
                    props.onAfipConfirmed()
                    snackbarSuccess('La documentación fue enviada correctamente')
                  }
                })
                .finally(() => hideLoader())
          })
          .catch(() => hideLoader());

      /*Promise.all([
        HttpCompany.changeResponsible(props.companyId),
        fetchData(
          () => HttpCompany.requestApproval(props.companyId, formData),
          true,
        ),
      ]).then(() => {
        props.onAfipConfirmed();
      });*/
    } else {
      setError(CompanyApprovalFormFields.FileAble, {
        type: 'custom',
        message: 'Campo obligatorio',
      });
      //snackbarError('Debe adjuntar todos los archivos para continuar')
    }
  };

  const watchFront = watch(CompanyApprovalFormFields.FrontIdFile);
  const watchBack = watch(CompanyApprovalFormFields.BackIdFile);
  const watchFileAble = watch(CompanyApprovalFormFields.FileAble);
  const messageErrorFileAble =
      getFieldState(CompanyApprovalFormFields.FileAble)?.error?.message ||
      undefined;

  const removeAble = () => {
    setValue(CompanyApprovalFormFields.FileAble, undefined);
    setFileAble(undefined);
  };

  useEffect(() => {
    if (watchFront) {
      let newFile = getValues(CompanyApprovalFormFields.FrontIdFile);
      if (!newFile) return setFileFront(undefined);

      let fileBase: FileBaseInsert = {
        [FileBaseFields.FileDesc]: newFile[0]?.name,
        [FileBaseFields.BeginDate]: new Date(),
        [FileBaseFields.FileSize]: newFile[0]?.size,
        [FileBaseInsertFields.File]: newFile[0],
      } as FileBaseInsert;

      setFileFront(fileBase);
    }

    if (watchBack) {
      let newFile = getValues(CompanyApprovalFormFields.BackIdFile);
      if (!newFile) return setFileBack(undefined);

      let fileBase: FileBaseInsert = {
        [FileBaseFields.FileDesc]: newFile[0]?.name,
        [FileBaseFields.BeginDate]: new Date(),
        [FileBaseFields.FileSize]: newFile[0]?.size,
        [FileBaseInsertFields.File]: newFile[0],
      } as FileBaseInsert;

      setFileBack(fileBase);
    }

    if (watchFileAble) {
      let newFile = getValues(CompanyApprovalFormFields.FileAble);
      if (!newFile) return setFileAble(undefined);

      clearErrors(CompanyApprovalFormFields.FileAble);
      let fileBase: FileBaseInsert = {
        [FileBaseFields.FileDesc]: newFile[0]?.name,
        [FileBaseFields.BeginDate]: new Date(),
        [FileBaseFields.FileSize]: newFile[0]?.size,
        [FileBaseInsertFields.File]: newFile[0],
      } as FileBaseInsert;

      setFileAble(fileBase);
    }
  }, [watchFront, watchBack, watchFileAble, getValues]);

  useEffect(() => {
    if (props.viewFiles) {
      HttpFilesCompany.getIdentityValidationDocuments(props.companyId).then(
          (r) => setDocs(r),
      );
    }
  }, []);

  const onDownloadHelper = () => {
    const pdfUrl =
        process.env.PUBLIC_URL +
        '/Paso a Paso - AFIP - Administrador de relaciones.pdf';
    window.open(pdfUrl);
  };

  return (
      <Stack
          direction="column"
          justifyContent="flex-start"
          spacing={2}
          mt={2}
          width={1}
      >

        <Typography className={classes.companyName}>
          {props.companyName}
        </Typography>
        {!props.viewFiles && (
            <Stack>
              <Typography fontSize={16}>
                Para obtener la cuenta verificada y disfrutar de todas las funcionalidades, ingresá alguno de los documentos que acrediten su relación con la misma.
              </Typography>
              <Typography fontSize={16}>
                La cuenta verificada permite:
              </Typography>
              <ul>
                <li>
                  Varios usuarios con perfiles diferenciados
                </li>
                <li>
                  Visualizar tus indicadores crediticios a través de VER CÓMO TE VEN
                </li>
                <li>
                  Almacenar y gestionar tu información y documentos para todas tus operaciones con una única carga
                </li>
              </ul>
            </Stack>
        )}
        <Typography fontSize={16} color='text.lighter'>
          {props.viewFiles ? 'Documentación Enviada' : 'A la brevedad lo analizaremos y te contestaremos.'}
        </Typography>
        
        <Stack spacing={3} mt={2} sx={{ width: '100% !important' }}>
          <form onSubmit={handleSubmit(onHandleAfipConfirmed)} id={'company-afip-form-file'}>
            {props.viewFiles ? (
                <Grid
                    container
                    spacing={2}
                    sx={{ width: '100% !important' }}
                    justifyContent={'center'}
                >
                  <Grid item xs={12}>
                    <Alert severity={'info'} color={'info'}>
                      El Centro de Atención de LUC está analizando la documentación presentada, en breve te comunicaremos su resolución
                    </Alert>
                  </Grid>

                  {docs
                      ? docs.length !== 0 &&
                      docs.reverse().map((doc) => (
                          <Grid item xs={12}>
                            <FileDocumentDetail document={doc} preview download />
                          </Grid>
                      ))
                      : Array.from({ length: 3 }).map(() => (
                          <Grid
                              item
                              xs={12}
                              sx={{ width: '100% !important', textAlign: 'center' }}
                          >
                            <Skeleton width={400} height={70} />
                          </Grid>
                      ))}
                </Grid>
            ) : (
                <React.Fragment>
                  {/*<Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Typography color={grey[600]}>Foto Frente DNI</Typography>
                  <Chip
                    label={'Verificado'}
                    icon={<CheckIcon fontSize={'small'} />}
                    size={'small'}
                    color={'success'}
                  />
                </Stack>*/}
                  {/*
                                      fileFront ?
                                          <FileSelectedDetail file={fileFront} actions onDelete={removeFront}/>
                                          :
                                          <DropzoneField name={CompanyApprovalFormFields.FrontIdFile}
                                                         multiple={false}
                                                         control={control}
                                                         setValue={setValue}
                                          />
                                  */}
                  {/*<Stack
                  direction={'row'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                >
                  <Typography color={grey[600]}>Foto Dorso DNI</Typography>
                  <Chip
                    label={'Verificado'}
                    icon={<CheckIcon fontSize={'small'} />}
                    size={'small'}
                    color={'success'}
                  />
                </Stack>*/}
                  {/*
                                          fileBack ?
                                              <FileSelectedDetail file={fileBack} actions onDelete={removeBack}/>
                                              :
                                              <DropzoneField name={CompanyApprovalFormFields.BackIdFile}
                                                             multiple={false}
                                                             control={control}
                                                             setValue={setValue}
                                              />
                                       */}
                  <div>
                    <Typography color={'text.lighter'} display={'flex'} fontSize={16}>
                      {`Poder habilitante, acta constitutiva, designación de autoridades, captura de pantalla de Página ${PublicEntityEnums.ARCA} (administrador de relaciones).`}
                      <Box
                          sx={{ '&:hover': { cursor: 'pointer' } }}
                          onClick={onDownloadHelper}
                      >
                        <HelpOutlineRoundedIcon
                            sx={{ marginLeft: 0.5 }}
                            fontSize={'small'}
                            color="info"
                        />
                      </Box>
                    </Typography>
                    {fileAble ? (
                        <FileSelectedDetail
                            file={fileAble}
                            actions
                            onDelete={removeAble}
                        />
                    ) : (
                        <DropzoneField
                            name={CompanyApprovalFormFields.FileAble}
                            multiple={false}
                            control={control}
                            setValue={setValue}
                        />
                    )}
                    {!!messageErrorFileAble && (
                        <HelperInputText error text={messageErrorFileAble} />
                    )}
                  </div>
                </React.Fragment>
            )}
          </form>
        </Stack>
      </Stack>
  );
}

export default CompanyAfipForm;
