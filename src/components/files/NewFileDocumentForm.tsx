import React, {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {Grid} from '@mui/material';
import {
  Document,
  DocumentFields,
  DocumentInsert,
  FileBase,
  FileBaseFields,
  FileBaseInsert,
  FileBaseInsertFields,
  FileUpdateDTO,
  FileUpdateDTOFields,
} from 'types/files/filesData';
import {EntityWithIdAndDescription, EntityWithIdFields,} from 'types/baseEntities';
import * as yup from 'yup';
import {
  REQUIRED_FIELD_MESSAGE,
  RequiredSelectSchema,
  RequiredStringSchema
} from 'util/validation/validationSchemas';
import {yupResolver} from '@hookform/resolvers/yup';
import {HttpFileDocument} from 'http/index';
import {Sections} from 'types/general/generalEnums';
import {useAction} from "hooks/useAction";
import {
  CompanySectionsWithFileType,
} from "types/company/companyData";
import NewFileDocumentFormUploadPart from "./new-files/NewFileDocumentFormUploadPart";
import NewFileDocumentFormRequiredPart from "./new-files/NewFileDocumentFormRequiredPart";
import NewFileDocumentFormAdditionalPart from "./new-files/NewFileDocumentFormAdditionalPart";
import {useLoaderActions} from "../../hooks/useLoaderActions";

export enum FileFormFields {
  Archivo = 'archivo',
}

export interface FileFormData extends DocumentInsert {
  [FileFormFields.Archivo]?: File[];
}

export interface NewFileDocumentFormPartProps {
  step: number;
  companyId?: number;
}

interface NewFileDocumentFormProps {
  section?: Sections;
  fileType?: number;
  fileSubType?: number;
  solicitationRequestId?: number;
  multiselect?: boolean;
  fileToEdit?: Document;
  onDocumentUpload?: (
    newFileBase: FileBase,
    file: File,
    solicitationRequestId?: number,
    relatedId?: number
  ) => Promise<any>;
  onUploadFinish: () => void;
  getFileSections?: () => Promise<CompanySectionsWithFileType[]>;
  getRelatedData?: (section: number) => Promise<EntityWithIdAndDescription[]>;
  companyId?: number;
  blockSection?: boolean;
}

export interface NewFileDocumentFormContextType {
  section?: Sections;
  fileType?: number;
  fileSubType?: number;
  multiselect?: boolean;
  getFileSections?: () => Promise<CompanySectionsWithFileType[]>;
  getRelatedData?: (section: number) => Promise<EntityWithIdAndDescription[]>;
  files?: FileBaseInsert[];
  setFiles: (value: React.SetStateAction<FileBaseInsert[] | undefined>) => void;
  sectionHasRelatedData: boolean;
  setSectionHasRelatedData: (value: React.SetStateAction<boolean>) => void;
  isSectionCompanyRepository: boolean;
  setIsSectionCompanyRepository: (_: React.SetStateAction<boolean>) => void;
}

export const NewFileDocumentFormContext = React.createContext<NewFileDocumentFormContextType>({
  section: undefined,
  fileType: undefined,
  fileSubType: undefined,
  multiselect: false,
  getFileSections: undefined,
  getRelatedData: undefined,
  files: undefined,
  setFiles: (_: React.SetStateAction<FileBaseInsert[] | undefined>) => { },
  sectionHasRelatedData: false,
  setSectionHasRelatedData: (_: React.SetStateAction<boolean>) => { },
  isSectionCompanyRepository: false,
  setIsSectionCompanyRepository: (_: React.SetStateAction<boolean>) => { }
})

function NewFileDocumentForm({
  section,
  fileType,
  fileSubType,
  fileToEdit,
  solicitationRequestId,
  onDocumentUpload,
  multiselect = false,
  onUploadFinish,
  getFileSections, getRelatedData, blockSection,
  companyId
}: NewFileDocumentFormProps) {
  
  const { snackbarError } = useAction();
  const { showLoader, hideLoader } = useLoaderActions();
  
  const [files, setFiles] = useState<FileBaseInsert[]>();
  const [sectionHasRelatedData, setSectionHasRelatedData] = useState<boolean>(false);
  const [isSectionCompanyRepository, setIsSectionCompanyRepository] = useState<boolean>(!blockSection);
  
  let fileFormSchema = yup.object().shape({
    [DocumentFields.FileSectionCode]: RequiredSelectSchema,
    [DocumentFields.TitleDocument]: RequiredStringSchema,
    [FileFormFields.Archivo]: !fileToEdit
      ? yup
          .mixed()
          .test('required', 'Campo obligatorio', (file) => {
            return !!file;
          })
          .test('fileSize', 'El tamaño máximo permitido: 20MB', (file) => {
            const size =
              file?.reduce?.(
                (accumulator: number, currFile: File) =>
                  accumulator + currFile.size,
                0,
              ) || 0;
            
            if (file && size > 20000000) snackbarError('El archivo es demasiado grande. El mismo no puede superar los 20MB')

            return file && size <= 20000000;
          })
      : yup.mixed().notRequired(),
  })
      .test(FileUpdateDTOFields.FileTypeCode, 'Campo Obligatorio', (obj) => {
        if (!isSectionCompanyRepository || (!!obj && !!obj[FileUpdateDTOFields.FileTypeCode])) return true;

        return new yup.ValidationError(
            REQUIRED_FIELD_MESSAGE,
            null,
            FileUpdateDTOFields.FileTypeCode,
        );
      })
      .test(FileUpdateDTOFields.RelatedId, 'Campo Obligatorio', (obj) => {
        if (!sectionHasRelatedData || (!!obj && !!obj[FileUpdateDTOFields.RelatedId])) return true;
        
        return new yup.ValidationError(
            REQUIRED_FIELD_MESSAGE,
            null,
            FileUpdateDTOFields.RelatedId,
        );
      });

  const methods = useForm<FileFormData>({
    resolver: yupResolver(fileFormSchema),
    defaultValues: {
      [DocumentFields.FileSectionCode]: fileToEdit?.[FileUpdateDTOFields.SectionCode] ?? section,
      [DocumentFields.FileTypeCode]: fileToEdit?.[FileUpdateDTOFields.FileTypeCode] ?? fileType,
      [DocumentFields.FileSubtypeCode]: fileSubType,
      [DocumentFields.TitleDocument]:
        fileToEdit?.[DocumentFields.TitleDocument],
      [DocumentFields.DescriptionDocument]:
        fileToEdit?.[DocumentFields.DescriptionDocument],
      [DocumentFields.EmissionDate]: fileToEdit?.[DocumentFields.EmissionDate],
      [DocumentFields.ExpirationDate]:
        fileToEdit?.[DocumentFields.ExpirationDate],
      [DocumentFields.FromDate]: fileToEdit?.[DocumentFields.FromDate],
      [DocumentFields.ToDate]: fileToEdit?.[DocumentFields.ToDate],
    },
  });
    
  useEffect(() => {
    if (fileToEdit) {
      HttpFileDocument.getById(fileToEdit[EntityWithIdFields.Id]).then((r) => {
        methods.reset({
          ...methods.getValues(),
          [DocumentFields.TitleDocument]: r[FileUpdateDTOFields.Title],
          [DocumentFields.RelatedId]: r[FileUpdateDTOFields.RelatedId],
          [DocumentFields.DescriptionDocument]: r[FileUpdateDTOFields.Description],
          [DocumentFields.EmissionDate]: r[FileUpdateDTOFields.EmissionDate],
          [DocumentFields.ExpirationDate]: r[FileUpdateDTOFields.ExpirationDate],
          [DocumentFields.ToDate]: r[FileUpdateDTOFields.DateTo],
          [DocumentFields.FromDate]: r[FileUpdateDTOFields.DateFrom],
        });
      });
    }
  }, [fileToEdit]);

  const onUpdateDialog = (data: FileUpdateDTO, documentId: number) => {
    showLoader();
    HttpFileDocument.update(data, documentId)
      .then(() => {
        onUploadFinish();
      })
      .finally(() => hideLoader());
  };

  const onSubmit = (data: FileFormData) => {
    if (
      data[FileFormFields.Archivo] !== null &&
      onDocumentUpload &&
      !fileToEdit
    ) {
      showLoader();

      HttpFileDocument.insert(data).then((documentId) => {
        const submitFiles =
          files?.map((file) => 
            onDocumentUpload(
              { 
                ...file, 
                [FileBaseFields.DocumentId]: documentId,
                [FileBaseFields.FileTypeCode]: data[DocumentFields.FileTypeCode],
                [FileBaseFields.FileSectionCode]: data[DocumentFields.FileSectionCode]
              } as FileBase,
              file[FileBaseInsertFields.File],
              solicitationRequestId, 
              data[FileUpdateDTOFields.RelatedId]
            ),
          ) ?? [];

        Promise.all(submitFiles).then(() => {
          hideLoader();
          onUploadFinish();
        });
      });
    }
    
    if (fileToEdit) {
      const updateDialogData: FileUpdateDTO = {
        [FileUpdateDTOFields.Title]: data[DocumentFields.TitleDocument],
        [FileUpdateDTOFields.Description]: data[DocumentFields.DescriptionDocument],
        [FileUpdateDTOFields.DateFrom]: data[DocumentFields.FromDate],
        [FileUpdateDTOFields.DateTo]: data[DocumentFields.ToDate],
        [FileUpdateDTOFields.EmissionDate]: data[DocumentFields.EmissionDate],
        [FileUpdateDTOFields.ExpirationDate]: data[DocumentFields.ExpirationDate],
        [FileUpdateDTOFields.SectionCode]: data[DocumentFields.FileSectionCode],
        [FileUpdateDTOFields.FileTypeCode]: data[DocumentFields.FileTypeCode],
        [FileUpdateDTOFields.RelatedId]: data[DocumentFields.RelatedId],
      };

      onUpdateDialog(updateDialogData, fileToEdit[EntityWithIdFields.Id]);
    }
  };
      
  return (
    <form onSubmit={methods.handleSubmit(onSubmit)} id={'file-upload-form'}>
      <FormProvider {...methods}>
        <NewFileDocumentFormContext.Provider value={{
          section: section,
          fileType: fileType,
          fileSubType: fileSubType,
          multiselect: multiselect,
          getFileSections: getFileSections,
          getRelatedData: getRelatedData,
          files: files,
          setFiles: setFiles,
          sectionHasRelatedData: sectionHasRelatedData,
          setSectionHasRelatedData: setSectionHasRelatedData,
          isSectionCompanyRepository: isSectionCompanyRepository,
          setIsSectionCompanyRepository: setIsSectionCompanyRepository
        }}>
          <Grid container spacing={2}>
            {
              !fileToEdit &&
                <NewFileDocumentFormUploadPart step={1} />
            }
            
            <NewFileDocumentFormRequiredPart step={!fileToEdit ? 2 : 1} companyId={companyId} />
            
            <NewFileDocumentFormAdditionalPart step={!fileToEdit ? 3 : 2} />
          </Grid>
        </NewFileDocumentFormContext.Provider>
      </FormProvider>
    </form>
  );
}


export default NewFileDocumentForm;