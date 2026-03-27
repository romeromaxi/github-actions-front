import React, { useEffect, useState } from 'react';
import { grey } from '@mui/material/colors';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Link,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { fileFormatter } from 'util/formatters/fileFormatter';
import { EntityWithIdAndDescriptionFields } from 'types/baseEntities';
import {
  FileSolicitationTemplate,
  FileSolicitationTemplateFields,
  SolicitationTemplateForm,
  SolicitationTemplateFormFields,
} from 'types/files/filesDataCache';
import { SendButton } from '../../../../../components/buttons/Buttons';
import {
  Document,
  FileBase,
  FileBaseFields,
  FileBaseInsert,
  FileBaseInsertFields,
} from '../../../../../types/files/filesData';
import { FormProvider, useForm } from 'react-hook-form';
import { FileSelectedDetail } from '../../../../../components/files/FileSelectedDetail';
import BaseDialogTitle from '../../../../../components/dialog/BaseDialogTitle';
import SolicitationRequiredFileNewDialogForm from './SolicitationRequiredFileNewDialogForm';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import { DialogAlert } from '../../../../../components/dialog';

interface SolicitationRequiredFileTemplateProps {
  template: FileSolicitationTemplate;
  lineId: number;
  onSelectTemplate: (
    event: React.ChangeEvent<HTMLInputElement>,
    temp: SolicitationTemplateForm,
  ) => void;
  onUpdateTemplate: (temp: SolicitationTemplateForm) => void;
  bottomSeparator: boolean;
}

interface SolicitationRequiredFileTemplateForm {
  filesForm?: File[];
}

function SolicitationRequiredFileTemplate({
  template,
  lineId,
  onSelectTemplate,
  onUpdateTemplate,
  bottomSeparator,
}: SolicitationRequiredFileTemplateProps) {
  const defaultTemplate: SolicitationTemplateForm = {
    [SolicitationTemplateFormFields.TemplateId]:
      template[EntityWithIdAndDescriptionFields.Id],
    [SolicitationTemplateFormFields.Files]: [],
    [SolicitationTemplateFormFields.RelatedFileIds]: [],
  };

  const [selectedTemplate, setSelectedTemplate] =
    useState<SolicitationTemplateForm>(defaultTemplate);
  const [currentTab, setCurrentTab] = useState<'0' | '1'>();
  const [openAddFile, setOpenAddFile] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [openExit, setOpenExit] = useState<boolean>(false);
  const [triggered, setTriggered] = useState<boolean>(false);

  const handleCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    document: Document,
  ) => {
    let newSelectedFiles;
    if (event.target.checked) {
      newSelectedFiles = [...selectedFiles, parseInt(event.target.value)];
      setSelectedFiles(newSelectedFiles);
      const updatedTemplate: SolicitationTemplateForm = {
        ...selectedTemplate,
        [SolicitationTemplateFormFields.RelatedFileIds]: newSelectedFiles,
      };

      setSelectedTemplate(updatedTemplate);
    } else {
      newSelectedFiles = selectedFiles.filter(
        (id) => id !== parseInt(event.target.value),
      );
      setSelectedFiles(newSelectedFiles);
      const updatedTemplate: SolicitationTemplateForm = {
        ...selectedTemplate,
        [SolicitationTemplateFormFields.RelatedFileIds]: newSelectedFiles,
      };

      setSelectedTemplate(updatedTemplate);
    }
  };

  const methods = useForm<SolicitationRequiredFileTemplateForm>();

  const [files, setFiles] = useState<FileBaseInsert[]>();

  const watchFile = methods.watch('filesForm');

  const onChangeTab = (tab: '0' | '1') => {
    if (tab == '0') {
      setSelectedFiles([]);
      const updatedTemplate: SolicitationTemplateForm = {
        ...selectedTemplate,
        [SolicitationTemplateFormFields.RelatedFileIds]: [],
      };

      setSelectedTemplate(updatedTemplate);
    }
    if (tab == '1') {
      setFiles([]);
      methods.reset({ filesForm: undefined });
      const updatedTemplate: SolicitationTemplateForm = {
        ...selectedTemplate,
        [SolicitationTemplateFormFields.Files]: [],
      };

      setSelectedTemplate(updatedTemplate);
    }

    setCurrentTab(tab);
  };

  useEffect(() => {
    if (watchFile) {
      let newFiles = methods.getValues('filesForm');

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
      setFiles(listFilesBase);
      const updatedTemplate: SolicitationTemplateForm = {
        ...selectedTemplate,
        [SolicitationTemplateFormFields.Files]: listFilesBase,
      };

      setSelectedTemplate(updatedTemplate);
    }
  }, [watchFile, methods.getValues]);

  const remove = (fileToRemove: FileBase) => {
    let newFiles: FileBaseInsert[] | undefined = files?.filter(
      (x) => x !== fileToRemove,
    );
    const updatedTemplate: SolicitationTemplateForm = {
      ...selectedTemplate,
      [SolicitationTemplateFormFields.Files]: newFiles,
    };

    setSelectedTemplate(updatedTemplate);

    if (newFiles?.length) setFiles(newFiles);
    else {
      methods.setValue('filesForm', undefined);
      setFiles(undefined);
    }
  };
  const handleCloseForm = () => {
    setOpenAddFile(false);
  };

  const onAchieve = () => {
    handleCloseForm();
    onUpdateTemplate(selectedTemplate);
  };

  const onExit = () => {
    handleCloseForm();
    methods.reset({ filesForm: undefined });
    setFiles(undefined);
    setSelectedTemplate(defaultTemplate);
    setSelectedFiles([]);
    setOpenExit(false);
  };

  const handleExit = () => {
    setOpenExit(true);
  };

  const handleSelectTemplate = (
    e: React.ChangeEvent<HTMLInputElement>,
    temp: SolicitationTemplateForm,
  ) => {
    onSelectTemplate(e, temp);
    setTriggered(!triggered);
  };

  const renderPrevFiles = () => {
    if (files && files.length !== 0) {
      return files.length;
    } else {
      if (selectedFiles.length !== 0) return selectedFiles.length;
    }

    return 0;
  };

  return (
    <Stack
      direction={'row'}
      justifyContent={'space-between'}
      alignItems={'center'}
      sx={{ borderBottom: bottomSeparator ? '1.5px dashed #F1F1F4' : '' }}
    >
      <Stack direction={'row'} minWidth={'70%'} maxWidth={'70%'}>
        <Box>{fileFormatter.getIconByFileName('', { fontSize: 'large' })}</Box>

        <Stack>
          <Typography variant={'label'} fontWeight={500}>
            {template[EntityWithIdAndDescriptionFields.Description]}
          </Typography>

          <Typography variant={'caption'} color={'text.lighter'}>
            {template[FileSolicitationTemplateFields.Detail] || ''}
          </Typography>
        </Stack>
      </Stack>
      <Stack spacing={1} direction="row" alignItems="center">
        <Link
          component={Button}
          onClick={() => setOpenAddFile(true)}
          size={'small'}
          fontSize={'0.795rem'}
        >
          <FileUploadRoundedIcon fontSize={'small'} />
          {`Adjuntar archivo (${renderPrevFiles()})`}
        </Link>
        <Tooltip title={triggered ? 'Quitar' : 'Incluir'}>
          <Switch
            value={selectedTemplate}
            onChange={(e) => handleSelectTemplate(e, selectedTemplate)}
            name={`select_template_${selectedTemplate[SolicitationTemplateFormFields.TemplateId]}`}
            size={'small'}
          />
        </Tooltip>
      </Stack>
      {openAddFile && (
        <Dialog
          open={openAddFile}
          onClose={handleExit}
          maxWidth={'sm'}
          fullWidth
        >
          <BaseDialogTitle onClose={handleExit} title={'Adjuntar archivo'} />
          <DialogContent>
            <FormProvider {...methods}>
              <SolicitationRequiredFileNewDialogForm
                lineId={lineId}
                onSelect={handleCheckboxChange}
                onChangeTab={onChangeTab}
                currentTab={currentTab}
                name={'filesForm'}
                selectedFiles={selectedFiles}
              />
            </FormProvider>
            {files && (
              <Grid container spacing={1} mt={2}>
                {files.length > 1
                  ? files.map?.((file) => (
                      <Grid item xs={12}>
                        <FileSelectedDetail
                          file={file}
                          actions
                          onDelete={remove}
                        />
                      </Grid>
                    ))
                  : files.length === 1 && (
                      <Grid item xs={12}>
                        <FileSelectedDetail
                          file={files[0]}
                          actions
                          onDelete={remove}
                        />
                      </Grid>
                    )}
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <SendButton
              onClick={onAchieve}
              disabled={
                (!files || files.length == 0) && selectedFiles.length == 0
              }
            >
              Enviar
            </SendButton>
          </DialogActions>
          <DialogAlert open={openExit}
                       textContent={'Si cerrás la ventana se perderán los archivos cargados. ¿Estás seguro de que no querés adjuntar ningún archivo?'} 
                       onConfirm={onExit}
                       onClose={() => setOpenExit(false)} 
                       hideTitle
          />
        </Dialog>
      )}
    </Stack>
  );
}

export default SolicitationRequiredFileTemplate;
