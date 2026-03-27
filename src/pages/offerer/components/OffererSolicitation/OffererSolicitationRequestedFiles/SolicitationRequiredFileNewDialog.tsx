import BaseDialogTitle from 'components/dialog/BaseDialogTitle';
import * as yup from 'yup';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Skeleton,
  Stack, Tab,
  Typography,
} from '@mui/material';
import React, {useContext, useEffect, useState} from 'react';
import CheckIcon from '@mui/icons-material/Check';
import {FormProvider, useForm} from 'react-hook-form';
import {ControlledTextFieldFilled} from 'components/forms';
import {yupResolver} from '@hookform/resolvers/yup';
import {
  FileRequestedSolicitationInsert,
  FileRequestedSolicitationInsertFields,
  SolicitationViewDTO,
  SolicitationViewDTOFields,
} from 'types/solicitations/solicitationData';
import {RequiredStringSchema} from 'util/validation/validationSchemas';
import {
  Document,
  DocumentToFileRequestLinkFields,
  FileBase,
  FileBaseFields,
  FileBaseInsert,
  FileBaseInsertFields,
} from 'types/files/filesData';
import {FileSelectedDetail} from 'components/files/FileSelectedDetail';
import SolicitationRequiredFileNewDialogForm from './SolicitationRequiredFileNewDialogForm';
import {
  FileSolicitationTemplate,
  SolicitationTemplateForm,
  SolicitationTemplateFormFields,
} from 'types/files/filesDataCache';
import {BaseRequestFields, BaseResponseFields, EntityWithIdFields} from 'types/baseEntities';
import useAxios from 'hooks/useAxios';
import {HttpFilesSolicitation} from 'http/index';
import {useAction} from 'hooks/useAction';
import RadioBoxButton from 'components/buttons/RadioBoxButton';
import SolicitationRequiredFileTemplate from './SolicitationRequiredFileTemplate';
import {DialogAlert} from 'components/dialog';
import NewFileDocumentForm from "../../../../../components/files/NewFileDocumentForm";
import {Sections} from "../../../../../types/general/generalEnums";
import {SaveButton} from "../../../../../components/buttons/Buttons";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import FileFromLibrary from "../../../../../components/files/FileFromLibrary";
import {OffererContext} from "../../OffererContextProvider";
import {useLoaderActions} from "../../../../../hooks/useLoaderActions";

interface SolicitationRequiredFileNewDialogProps {
  solicitation: SolicitationViewDTO;
  open: boolean;
  onClose: () => void;
  onSubmitDialog: (fileRequested: FileRequestedSolicitationInsert) => void;
  onReload?: () => void;
  onSelect: (
    event: React.ChangeEvent<HTMLInputElement>,
    document: Document,
  ) => void;
  selectedFiles?: number[];
}

enum SolicitationFileViewType {
  Templates = 1,
  Custom = 2,
  DocumentsSend = 3
}

const SolicitationRequiredFileNewDialog = ({
  solicitation,
  open,
  onClose,
  onSubmitDialog,
  onReload,
  onSelect,
  selectedFiles
}: SolicitationRequiredFileNewDialogProps) => {
  const requestFilesFormSchema = yup.object().shape({
    [FileRequestedSolicitationInsertFields.Title]: RequiredStringSchema,
  });
  const offerer  = useContext(OffererContext)
  const [showTemplates, setShowTemplates] = useState<SolicitationFileViewType>(SolicitationFileViewType.Templates);
  const [templates, setTemplates] = useState<FileSolicitationTemplate[]>();
  const [currentTab, setCurrentTab] = useState('0');
  const [selectedTemplates, setSelectedTemplates] = useState<
    SolicitationTemplateForm[]
  >([]);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const { fetchData } = useAxios();
  const { snackbarError, snackbarSuccess } = useAction();
  const { showLoader, hideLoader } = useLoaderActions();

  const methods = useForm<FileRequestedSolicitationInsert>({
    resolver: yupResolver(
      showTemplates ? yup.object().shape({}) : requestFilesFormSchema,
    ),
  });
  const [files, setFiles] = useState<FileBaseInsert[]>();

  const watchFile = methods.watch(FileRequestedSolicitationInsertFields.Files);

  const onSubmit = (data: FileRequestedSolicitationInsert) => {
    if (showTemplates === SolicitationFileViewType.Templates) {
      if (selectedTemplates.length !== 0) {
        let submitData: FormData = new FormData();
        selectedTemplates.map((temp, idx) => {
          submitData.append(
            `solicitudArchivoSolicitadoPlantilla[${idx}].idSolicitudArchivoSolicitadoPlantilla`,
            temp[SolicitationTemplateFormFields.TemplateId],
          );
          temp[SolicitationTemplateFormFields.Files]?.forEach((file) =>
            submitData.append(
              `solicitudArchivoSolicitadoPlantilla[${idx}].files`,
              file.file,
              file.descArchivo,
            ),
          );
          temp[SolicitationTemplateFormFields.RelatedFileIds]?.forEach((id) =>
            submitData.append(
              `solicitudArchivoSolicitadoPlantilla[${idx}].idsDocumento`,
              `${id}`,
            ),
          );
        });

        const codModulo = 1;
        const codOrigen = 1;

        submitData.append(
          FileBaseInsertFields.ModuleCode,
          codModulo.toString(),
        );
        submitData.append(
          FileBaseInsertFields.OriginCode,
          codOrigen.toString(),
        );

        fetchData(
          () =>
            HttpFilesSolicitation.insertByTemplates(
              solicitation[EntityWithIdFields.Id],
              submitData,
            ),
          true,
        ).then(() => {
          snackbarSuccess('El documento se generó correctamente');
          onReload && onReload();
          onClose();
          setOpenAlert(false);
        });
      } else {
        snackbarError(
          'Para solicitar documentación en este modo, debe seleccionar al menos una plantilla',
        );
      }
    } 
    else if (showTemplates === SolicitationFileViewType.Custom) {
      if (files && !!files.length)
        data[FileRequestedSolicitationInsertFields.Files] = files.map(
          (f) => f[FileBaseInsertFields.File],
        );

      onSubmitDialog(data);
      onClose();
      setOpenAlert(false);
    }
  };

  useEffect(() => {
    methods.reset({
      [FileRequestedSolicitationInsertFields.Title]: '',
      [FileRequestedSolicitationInsertFields.Observations]: '',
      [FileRequestedSolicitationInsertFields.Files]: undefined,
      [FileRequestedSolicitationInsertFields.DocumentIds]: [],
    });
    setFiles(undefined);
    setShowTemplates(SolicitationFileViewType.Templates);
    setSelectedTemplates([]);
  }, [open]);

  useEffect(() => {
    if (watchFile) {
      let newFiles = methods.getValues(
        FileRequestedSolicitationInsertFields.Files,
      );
      if (!newFiles) return setFiles(undefined);

      const newFilesArray = Array.from(newFiles);

      let listFilesBase: FileBaseInsert[] = newFilesArray.map((f) => {
        return {
          [FileBaseFields.FileDesc]: f.name,
          [FileBaseFields.BeginDate]: new Date(),
          [FileBaseFields.FileSize]: f.size,
          [FileBaseInsertFields.File]: f,
        } as FileBaseInsert;
      });

      if (files && files.length !== 0) setFiles([...files, ...listFilesBase]);
      else setFiles(listFilesBase);
    }
  }, [watchFile, methods.getValues]);

  const remove = (fileToRemove: FileBase) => {
    let newFiles: FileBaseInsert[] | undefined = files?.filter(
      (x) => x !== fileToRemove,
    );

    if (newFiles?.length) setFiles(newFiles);
    else {
      methods.setValue(FileRequestedSolicitationInsertFields.Files, undefined);
      setFiles(undefined);
    }
  };

  const handleChangeTab = (_: React.SyntheticEvent, newValue: string) =>
      setCurrentTab(newValue);

  useEffect(() => {
    if (open && showTemplates && !templates) {
      HttpFilesSolicitation.getRequestedTemplates(
        solicitation[EntityWithIdFields.Id],
      ).then(setTemplates);
    }
  }, [showTemplates, open]);

  const triggerView = (view: SolicitationFileViewType) => {
    setShowTemplates(view);
  };

  const onUpdateTemplate = (item: SolicitationTemplateForm) => {
    const updatedTemplates = selectedTemplates.map((temp) => {
      if (
        temp[SolicitationTemplateFormFields.TemplateId] ===
        item[SolicitationTemplateFormFields.TemplateId]
      )
        return item;
      else return temp;
    });

    setSelectedTemplates(updatedTemplates);
  };

  const onSelectTemplate = (
    event: React.ChangeEvent<HTMLInputElement>,
    item: SolicitationTemplateForm,
  ) => {
    let newSelectedTemplates: SolicitationTemplateForm[];

    if (event.target.checked) {
      newSelectedTemplates = [...selectedTemplates, item];
      setSelectedTemplates(newSelectedTemplates);
    } else {
      newSelectedTemplates = [...selectedTemplates].filter(
        (template) =>
          template[SolicitationTemplateFormFields.TemplateId] !==
          item[SolicitationTemplateFormFields.TemplateId],
      );
      setSelectedTemplates(newSelectedTemplates);
    }
  };
  const onOpenAlert = () => {
    setOpenAlert(true);
  };
  
  
  const onUploadDocuments = (newFileBase: FileBase, file: File) => {
    setOpenAlert(false)
    return HttpFilesSolicitation.insert(
        solicitation[EntityWithIdFields.Id],
        newFileBase,
        file,
    );
  }
  
  const onSubmitFromLibrary = (idLst: any) => {
    fetchData(
        () => HttpFilesSolicitation.linkFileExistent(
            solicitation[EntityWithIdFields.Id],
            {
              [DocumentToFileRequestLinkFields.SolicitationRequestId]: null,
              [DocumentToFileRequestLinkFields.DocumentIdList]: idLst.files,
              [BaseRequestFields.ModuleCode]: 1,
              [BaseRequestFields.OriginCode]: 1
            }
        ),
        true
    ).then((r) => {
        if (!r[BaseResponseFields.HasError]) {
          snackbarSuccess('Los documentos fueron adjuntados correctamente')
          onReload && onReload()
          onClose()
        }
    })
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={'lg'}>
      <BaseDialogTitle title={'Documentación'} onClose={onClose} />
      
      <DialogContent>
        <Stack spacing={3}>
          <form id={'solicitation-require-file-form'} onSubmit={methods.handleSubmit(onSubmit)}>
            <Grid item xs={12} container spacing={1}>
              <Grid item xs={12} md={4}>
                <RadioBoxButton
                  title={'Listado de documentos'}
                  subtitle={
                    'Solicitá documentación a partir del listado predefinido'
                  }
                  onClick={() => triggerView(SolicitationFileViewType.Templates)}
                  value={showTemplates === SolicitationFileViewType.Templates}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <RadioBoxButton
                  title={'Solicitud personalizada'}
                  subtitle={
                    'Solicitá documentación escribiendo tu requerimiento en el momento'
                  }
                  value={showTemplates === SolicitationFileViewType.Custom}
                  onClick={() => triggerView(SolicitationFileViewType.Custom)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <RadioBoxButton
                    title={'Enviá documentación'}
                    subtitle={
                      'Compartí documentos o formularios con la empresa, sin necesidad de una respuesta'
                    }
                    value={showTemplates === SolicitationFileViewType.DocumentsSend}
                    onClick={() => triggerView(SolicitationFileViewType.DocumentsSend)}
                />
              </Grid>
            </Grid>
            {showTemplates === SolicitationFileViewType.Templates && (
              <Grid item md={12} container spacing={1} justifyContent={'center'}>
                <Grid item xs={12}>
                  <Alert severity={'info'}>
                    Para seleccionar los documentos a solicitar, utilizá los deslizables de la derecha
                  </Alert>
                </Grid>
                <Grid item xs={10.5}></Grid>
                <Grid item xs={1.5}>
                  <Typography fontSize={12} fontWeight={600} textAlign={'center'}>
                    Seleccionados
                  </Typography>
                </Grid>
                <Box sx={{ padding: '4px', width: '100%', marginLeft: '8px' }}>
                  <Stack spacing={1}>
                    {templates ? (
                      templates.length !== 0 ? (
                        templates.map((temp, idx) => (
                          <SolicitationRequiredFileTemplate
                            template={temp}
                            lineId={
                              solicitation[
                                SolicitationViewDTOFields.ProductLineId
                              ]
                            }
                            onSelectTemplate={onSelectTemplate}
                            onUpdateTemplate={onUpdateTemplate}
                            bottomSeparator={idx < templates.length - 1}
                            key={`SolicitationRequiredFileTemplate_${idx}`}
                          />
                        ))
                      ) : (
                        <Alert severity={'info'}>
                          No se encontraron plantillas
                        </Alert>
                      )
                    ) : (
                      Array.from({ length: 5 }).map(() => (
                        <Skeleton width={'100%'} />
                      ))
                    )}
                  </Stack>
                </Box>
              </Grid>
            )
            }
            {
              showTemplates === SolicitationFileViewType.Custom && (
              <Stack spacing={2} mt={1}>
                  <ControlledTextFieldFilled
                    control={methods.control}
                    label={'Título'}
                    name={FileRequestedSolicitationInsertFields.Title}
                  />
                  <ControlledTextFieldFilled
                    control={methods.control}
                    label={'Observaciones'}
                    multiline
                    rows={7}
                    name={FileRequestedSolicitationInsertFields.Observations}
                  />
                  <Stack spacing={2}>
                    <Typography color={'#A1A5B7'} fontWeight={500}>
                      Adjuntar archivo
                    </Typography>
  
                    {files && (
                      <Stack spacing={1}>
                        {files.map?.((file) => (
                            <FileSelectedDetail
                              file={file}
                              actions
                              onDelete={remove}
                            />
                        ))}
                      </Stack>
                    )}
  
                    <FormProvider {...methods}>
                      <SolicitationRequiredFileNewDialogForm
                        lineId={
                          solicitation[SolicitationViewDTOFields.ProductLineId]
                        }
                        onSelect={onSelect}
                        name={FileRequestedSolicitationInsertFields.Files}
                        selectedFiles={selectedFiles}
                      />
                    </FormProvider>
                  </Stack>
              </Stack>
            )}
          </form>
          {
            showTemplates === SolicitationFileViewType.DocumentsSend && (
                  <TabContext value={currentTab}>
                    <Box>
                      <TabList
                          onChange={handleChangeTab}
                          aria-label="lab API tabs example"
                          variant="fullWidth"
                      >
                        <Tab label="Subir nuevo archivo" value="0" />
                        <Tab label="Relacionar desde LUC" value="1" />
                      </TabList>
                    </Box>
                    <TabPanel value="0">
                      <NewFileDocumentForm section={Sections.Solicitations}
                                           onUploadFinish={() => {
                                             onReload && onReload()
                                             onClose()
                                             snackbarSuccess('Los documentos fueron adjuntados correctamente')
                                           }}
                                           onDocumentUpload={onUploadDocuments}
                                           blockSection
                      />
                    </TabPanel>
                    <TabPanel value="1">
                      {
                          <FileFromLibrary solicitationId={solicitation[EntityWithIdFields.Id]}
                                           handleLibrarySubmit={onSubmitFromLibrary}
                                           entityId={offerer[EntityWithIdFields.Id]}
                                           
                          />
                      }
                    </TabPanel>
                  </TabContext>
              )
          }
        </Stack>
      </DialogContent>

      <DialogActions sx={{ marginTop: 2 }}>
        {
            showTemplates === SolicitationFileViewType.DocumentsSend ?
                <SaveButton type="submit"
                            form={`${
                                currentTab === '0'
                                    ? 'file-upload-form'
                                    : currentTab === '1'
                                        ? 'file-from-library-form'
                                        : ''
                            }`}
                >
                  Guardar
                </SaveButton>
                :
                <Button
                  color={'primary'}
                  variant={'contained'}
                  onClick={onOpenAlert}
                  endIcon={<CheckIcon />}
                >
                  Solicitar documento
                </Button>
        }
      </DialogActions>
      <DialogAlert
        onClose={() => {
          setOpenAlert(false);
        }}
        open={openAlert}
        textContent={'¿Estás seguro que deseás enviar el/los pedido/s cargado/s?'}
        confirmBtn={
          <Button form={'solicitation-require-file-form'} type={'submit'} variant={'contained'} fullWidth >
            Confirmar
          </Button>
        }
      />
    </Dialog>
  );
};

export default SolicitationRequiredFileNewDialog;
