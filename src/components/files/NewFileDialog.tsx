import React, {useMemo, useState} from 'react';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  Tab,
} from '@mui/material';
import {FileBase, Document, FileBaseFields} from 'types/files/filesData';
import { Sections } from 'types/general/generalEnums';
import NewFileDocumentForm from './NewFileDocumentForm';
import { DefaultStylesButton, SendButton } from '../buttons/Buttons';
import BaseDialogTitle from '../dialog/BaseDialogTitle';
import FileFromLibrary from './FileFromLibrary';
import { Alert, TabContext, TabList, TabPanel } from '@mui/lab';
import {getEndpointBySectionCodeMap} from "../../util/typification/endpointBySectionCodeMap";
import {HttpCompany} from 'http/index';


export interface FileNewDialogProps {
  section?: Sections;
  onSubmitDialog?: (
    newFileBase: FileBase,
    file: File,
    solicitationRequestId?: number,
  ) => Promise<any>;
  onSubmitFromLibrary?: (docIdLst: number[]) => void;
  fileType?: number;
  fileSubType?: number;
  onReload?: () => void;
  onCloseDialog: () => void;
  fileToEdit?: Document;
  //used when the file is from the company library
  allowFromLibrary?: boolean;
  companyId?: number;
  solicitationId?: number;
  clientPortfolioGuid?: string;
  offererId?: number;
  multiselect?: boolean;
  fileSolicitationRequestId?: number;
  fromLibraryMessage?: string;
  blockSection?: boolean;
  title?: string;
  subtitle?: string;
  //por ahora lo pusimos por el ocr
  buttonTxt?: string;
}

function FileNewDialog(props: FileNewDialogProps) {
  const [open, setOpen] = useState(true);
  const [currentTab, setCurrentTab] = useState('0');
  const idBase = useMemo(() => 
          props.section === Sections.ClientPortfolio ? props.clientPortfolioGuid : 
              props.companyId ?? props.offererId ?? props.solicitationId ?? 0
      , [props]);

  const handleClose = () => {
    setOpen(false);
    props.onCloseDialog();
  };

  const handleChange = (_: React.SyntheticEvent, newValue: string) => 
      setCurrentTab(newValue);
  
  const onSubmitDialog = (
      newFileBase: FileBase, file: File, solicitationRequestId?: number, relatedId?: number
  ) => {
    if (!!props.section && !!props.onSubmitDialog)
       return props.onSubmitDialog(newFileBase, file, solicitationRequestId);

    const sectionFile = newFileBase[FileBaseFields.FileSectionCode] as Sections;
    if (sectionFile && !!idBase)
      return getEndpointBySectionCodeMap[sectionFile](idBase, newFileBase, file, relatedId);
    
    return Promise.resolve();
  }

    const onSubmitFromLibrary = (data: any) => props.onSubmitFromLibrary && props.onSubmitFromLibrary(data.files)
    

  const getFileSections = () => HttpCompany.getFileSections(props.companyId ?? 0);

  const getRelatedData = (section: number) =>
      HttpCompany.getRelatedData(props.companyId ?? 0, section)
  
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth
      maxWidth={props?.allowFromLibrary ? 'xl' : 'md'}
    >
      <BaseDialogTitle
        title={props.title ? props.title : props.fileToEdit ? '¿Querés editar la información relacionada al documento?' : 'Nuevo documento'}
        subtitle={props.subtitle}
        onClose={handleClose}
      />
      <DialogContent>
        <Grid container spacing={2}>
          <Grid container item xs={12}>
            {props?.allowFromLibrary ? (
              <Box sx={{ width: '100%', typography: 'body1' }}>
                <TabContext value={currentTab}>
                  <Box>
                    <TabList
                      onChange={handleChange}
                      aria-label="lab API tabs example"
                      variant="fullWidth"
                    >
                      <Tab label="Subir nuevo archivo" value="0" />
                      <Tab label="Relacionar desde LUC" value="1" />
                    </TabList>
                  </Box>
                  <TabPanel value="0">
                    <NewFileDocumentForm
                      section={props.section}
                      fileType={props.fileType}
                      fileSubType={props.fileSubType}
                      onDocumentUpload={onSubmitDialog}
                      fileToEdit={props.fileToEdit}
                      multiselect={props.multiselect}
                      onUploadFinish={() => {
                        handleClose();
                        props.onReload && props.onReload();
                      }}
                      solicitationRequestId={props?.fileSolicitationRequestId}
                      getFileSections={props.section ? undefined : getFileSections}
                      getRelatedData={getRelatedData}
                      blockSection={props.blockSection}
                      companyId={props.companyId}
                    />
                  </TabPanel>
                  <TabPanel value="1">
                    {props.fromLibraryMessage &&
                    props.fromLibraryMessage !== '' ? (
                      <Alert severity="info">{props.fromLibraryMessage}</Alert>
                    ) : (
                      <FileFromLibrary entityId={props.companyId || props.offererId}
                                       solicitationId={props.solicitationId}
                                       clientPortfolioGuid={props.clientPortfolioGuid}
                                       handleLibrarySubmit={onSubmitFromLibrary}
                      />
                    )}
                  </TabPanel>
                </TabContext>
              </Box>
            ) : (
              <NewFileDocumentForm
                section={props.section}
                fileType={props.fileType}
                fileSubType={props.fileSubType}
                onDocumentUpload={onSubmitDialog}
                multiselect={props.multiselect}
                fileToEdit={props.fileToEdit}
                onUploadFinish={() => {
                  handleClose();
                  props.onReload && props.onReload();
                }}
                solicitationRequestId={props.fileSolicitationRequestId}
                getFileSections={props.section ? undefined : getFileSections}
                getRelatedData={getRelatedData}
                blockSection={props.blockSection}
                companyId={props.companyId}
              />
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <DefaultStylesButton color="secondary"
                             onClick={handleClose}
        >
          Cancelar
        </DefaultStylesButton>

        <SendButton
          type="submit"
          form={`${
            currentTab === '0'
              ? 'file-upload-form'
              : currentTab === '1'
                ? 'file-from-library-form'
                : ''
          }`}
          id={props.buttonTxt ? 'ocr-process-btn' : 'file-save-btn'}
        >
          {props.buttonTxt ?? 'Guardar'}
        </SendButton>
      </DialogActions>
    </Dialog>
  );
}

export default FileNewDialog;
