import DrawerBase from "../../components/misc/DrawerBase";
import {GoogleDriveButton} from "../../components/google-drive/GoogleDriveButton";
import {DropboxButton} from "../../components/dropbox/DropboxButton";
import {DropzoneFieldCustomWrapper} from "../../components/forms/DropzoneField";
import ButtonFileNew from "../../components/buttons/ButtonFileNew";
import {MonitorUpIcon} from "lucide-react";
import {Fragment, useContext, useEffect, useState} from "react";
import {Button, Divider, Stack} from "@mui/material";
import {useLoaderActions} from "../../hooks/useLoaderActions";
import {useSnackbarActions} from "../../hooks/useSnackbarActions";
import {
    DocumentFields,
    FileBase,
    FileBaseFields,
    FileBaseInsert,
    FileBaseInsertFields
} from "../../types/files/filesData";
import * as yup from "yup";
import {RequiredPositiveNumberSchema} from "../../util/validation/validationSchemas";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup/dist/yup";
import {HttpCompanyFinance, HttpFileDocument, HttpFilesCompanyFinancialYear} from "../../http";
import {HttpOcr} from "../../http/general/httpOcr";
import {FileFormData, FileFormFields} from "../../components/files/NewFileDocumentForm";
import {ControlledTextFieldFilled} from "../../components/forms";
import {FileSelectedDetail} from "../../components/files/FileSelectedDetail";
import {FinancialYearInsert, FinancialYearFields, FinancialStatementOCRProcess, FinancialStatementOCRProcessFields} from "../../types/general/generalFinanceData";
import {BaseResponseFields} from "../../types/baseEntities";
import {Sections} from "../../types/general/generalEnums";
import {BureauInformationContext} from "../../hooks/contexts/BureauInformationContext";


interface CompanyBureauBalanceUploadDrawerProps {
    open: boolean;
    onClose: () => void;
    companyId: number;
}


enum CompanyBureauBalanceUploadDrawerFormFields {
    Year = 'anio'
}

interface CompanyBureauBalanceUploadDrawerForm extends FileFormData {
    [CompanyBureauBalanceUploadDrawerFormFields.Year]: number;
}

export const CompanyBureauBalanceUploadDrawer = ({
    open,
    onClose,
    companyId
}: CompanyBureauBalanceUploadDrawerProps) => {
    const { showLoader, hideLoader } = useLoaderActions();
    const {addSnackbarError, addSnackbarSuccess} = useSnackbarActions();
    
    const { onReload } = useContext(BureauInformationContext);
    
    const [files, setFiles] = useState<FileBaseInsert[]>();

    let fileFormSchema = yup.object().shape({
        [CompanyBureauBalanceUploadDrawerFormFields.Year]: RequiredPositiveNumberSchema,
        [FileFormFields.Archivo]: yup
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

                if (file && size > 20000000) addSnackbarError('El archivo es demasiado grande. El mismo no puede superar los 20MB')

                return file && size <= 20000000;
            })
    });
    const methods = useForm<CompanyBureauBalanceUploadDrawerForm>({
        resolver: yupResolver(fileFormSchema),
        defaultValues: {
        },
    });
    const { control, watch, handleSubmit } = methods;
    const watchFile = watch(FileFormFields.Archivo);
    const watchYear = watch(CompanyBureauBalanceUploadDrawerFormFields.Year);

    useEffect(() => {
        if (open) {
            methods.reset();
            setFiles(undefined);
        }
    }, [open, methods]);

    const remove = (fileToRemove: FileBase) => {
        let newFiles: FileBaseInsert[] | undefined = files?.filter(
            (x) => x !== fileToRemove,
        );

        if (newFiles?.length) setFiles(newFiles);
        else {
            methods.setValue(FileFormFields.Archivo, undefined);
            setFiles(undefined);
        }
    };

    useEffect(() => {
        if (watchFile) {
            let newFiles = methods.getValues(FileFormFields.Archivo);
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
            methods.setValue(DocumentFields.TitleDocument, newFilesArray[0].name);
        }
    }, [watchFile, methods.getValues, methods]);

    const uploadDocumentAndProcessOcr = (
        newFileBase: FileBase,
        file: File,
        financialYearId: number,
        documentId: number,
    ) => {
        return HttpFilesCompanyFinancialYear.insert(companyId, financialYearId, newFileBase, file).then(() => {
            const ocrProcessData: FinancialStatementOCRProcess = {
                [FinancialStatementOCRProcessFields.SectionCode]: Sections.FinancialYear,
                [FinancialStatementOCRProcessFields.RelatedId]: financialYearId,
            };
            return HttpOcr.processDocumentById(
                documentId,
                ocrProcessData
            );
        });
    };

    const onSubmit = (data: CompanyBureauBalanceUploadDrawerForm) => {
        if (
            data[FileFormFields.Archivo] !== null &&
            files?.length === 1
        ) {
            showLoader();

            const financialYearInsert: FinancialYearInsert = {
                [FinancialYearFields.Year]: data[CompanyBureauBalanceUploadDrawerFormFields.Year],
            };

            HttpCompanyFinance.insert(companyId, financialYearInsert).then((response) => {
                if (response[BaseResponseFields.HasError]) {
                    hideLoader();
                    addSnackbarError(response[BaseResponseFields.ErrorDescription]);
                    return;
                }

                const financialYearId = response[BaseResponseFields.Data];

                const documentPayload = {
                    [DocumentFields.TitleDocument]: data[DocumentFields.TitleDocument],
                    [DocumentFields.FileSectionCode]: Sections.FinancialYear,
                } as FileFormData;

                HttpFileDocument.insert(documentPayload).then((documentId) => {
                    const submitFiles = files?.map((file) =>
                        uploadDocumentAndProcessOcr(
                            {
                                ...file,
                                [FileBaseFields.DocumentId]: documentId,
                            } as FileBase,
                            file[FileBaseInsertFields.File],
                            financialYearId,
                            documentId,
                        ),
                    ) ?? [];

                    Promise.all(submitFiles).then(() => {
                        hideLoader();
                        addSnackbarSuccess('El archivo ha sido enviado a procesar con éxito');
                        onClose();
                        onReload();
                    }).catch(() => {
                        hideLoader();
                        addSnackbarError('No se pudo procesar el archivo con IA');
                    });
                }).catch(() => {
                    hideLoader();
                    addSnackbarError('No se pudo crear el documento');
                });
            }).catch(() => {
                hideLoader();
                addSnackbarError('No se pudo crear el ejercicio');
            });
        }
    };


    const onReceiveFilesFromExternal = (newFiles: File[]) =>
        methods.setValue(FileFormFields.Archivo, newFiles);
    
    return (
        <DrawerBase show={open}
                    onCloseDrawer={onClose}
                    title={"Nuevo balance"}
                    action={<Button variant={'contained'}
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={!files?.length || files.length === 0 || !watchYear}
                    >
                        Enviar
                    </Button>}
        >
            <Stack spacing={2}>
                <ControlledTextFieldFilled control={control}
                                           name={CompanyBureauBalanceUploadDrawerFormFields.Year}
                                           fullWidth
                                           label="Año del ejercicio"
                />
                {
                    !(files && files.length === 1) ?
                        <Fragment>
                            <Divider sx={{borderWidth: 0, color: 'text.lighter'}}>CARGÁ EL DOCUMENTO</Divider>
                            <GoogleDriveButton uploadFiles={onReceiveFilesFromExternal}
                                               multiselect={false}
                                               square
                            />
                
                            <DropboxButton uploadFiles={onReceiveFilesFromExternal}
                                           square
                            />
                
                            <DropzoneFieldCustomWrapper setValue={methods.setValue}
                                                        name={FileFormFields.Archivo}
                                                        control={methods.control}
                                                        multiple={false}
                            >
                                <ButtonFileNew title={'Desde el ordenador'}
                                               icon={MonitorUpIcon}
                                               onClick={() => {}}
                                />
                            </DropzoneFieldCustomWrapper>
                        </Fragment>
                        :
                        <FileSelectedDetail
                            file={files[0]}
                            actions
                            onDelete={remove}
                        />
                }
            </Stack>
        </DrawerBase>
    );
}


export default CompanyBureauBalanceUploadDrawer;

