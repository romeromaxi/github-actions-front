import {Box, Dialog, DialogActions, DialogContent, Grid, Link, Stack, Typography} from "@mui/material";
import BaseDialogTitle from "./BaseDialogTitle";
import {useContext, useEffect, useState} from "react";
import {HttpOcr} from "../../http/general/httpOcr";
import {LoaderBlockUI} from "../loader";
import {
    FinancialStatement, FinancialStatementFields,
    FinancialYearFields, IncomeStatementWithPrevious,
    PatrimonialStatementWithPrevious
} from "../../types/general/generalFinanceData";
import {FormProvider, useForm} from "react-hook-form";
import FinancialYearEditComponent from "../../pages/company/finance/components/FinancialYearEditComponent";
import {SaveButton} from "../buttons/Buttons";
import {BalancesContext} from "../../hooks/contexts/BalancesContext";
import {incomeStatementInitial, patrimonialStatementInitial} from "../../types/company/companyFinanceInformationData";
import {
    FinancialYearEditFormFields,
    FinancialYearEditFormType
} from "../../pages/company/finance/components/FinancialYearDetail";
import CancelIcon from '@mui/icons-material/Cancel';
import {AppRoutesDefinitions, useAppNavigation} from "../../hooks/navigation";
import {BaseResponseFields} from "../../types/baseEntities";
import {HttpFileDocument} from "../../http";
import {FileBlobResponseFields} from "../../types/files/filesData";
import {Alert} from "@mui/lab";


interface OcrBalanceFile {
    file: File,
    fileName: string,
    id: number
}

interface DialogLoadBalanceByOcrProps {
    open: boolean;
    onClose: () => void;
    file?: OcrBalanceFile;
    patrimonialId: number;
    incomeId: number;
    guid?: string;
    documentId?: number;
}

interface OcrBalanceForm {
    patrimonial: PatrimonialStatementWithPrevious,
    resultado: IncomeStatementWithPrevious
}

const DialogLoadBalanceByOcr = ({open, onClose, file, patrimonialId, incomeId, guid, documentId} : DialogLoadBalanceByOcrProps) => {
    const { navigate } = useAppNavigation();
    
    const [loading, setLoading] = useState<boolean>(false)
    const [fileFinancialStatementData, setFileFinancialStatementData] = useState<FinancialStatement>()
    const [error, setError] = useState<boolean>()
    const [customFileBase, setCustomFileBase] = useState<OcrBalanceFile>()
    const { getDetail, handleUpdate } = useContext(BalancesContext)
    const methods = useForm<OcrBalanceForm>()
    const fileSrc = (file || customFileBase) ? URL.createObjectURL(new Blob([(file || customFileBase)!.file], { type: "application/pdf" })) : undefined;

    const loadByGuid = (guidToLoad: string) => {
        setError(false)
        setLoading(true)
        setFileFinancialStatementData(undefined)
        methods.reset({
            patrimonial: {
                ...patrimonialStatementInitial
            } as PatrimonialStatementWithPrevious,
            resultado: {
                ...incomeStatementInitial
            } as IncomeStatementWithPrevious
        })

        HttpOcr.getBalancesByGuid(guidToLoad)
            .then((r) => {
                if (!r[BaseResponseFields.HasError]) {
                    setFileFinancialStatementData(r[BaseResponseFields.Data])
                    methods.reset({
                        patrimonial: r[BaseResponseFields.Data][FinancialStatementFields.PatrimonialStatement],
                        resultado: r[BaseResponseFields.Data][FinancialStatementFields.IncomeStatement]
                    })
                }
                else setError(true)
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false))
    }

    const loadDocumentFile = (docId: number) => {
        setLoading(true)
        HttpFileDocument.download(docId).then(
            (blob) => {
                const customFile: OcrBalanceFile = {
                    file: blob[FileBlobResponseFields.File],
                    fileName: blob[FileBlobResponseFields.FileName],
                    id: docId
                }
                setCustomFileBase(customFile)
                setLoading(false)
            },
        ).catch(() => {
            setLoading(false)
            setError(true)
        });
    }

    const processData = () => {
        if (guid) {
            loadByGuid(guid)
            if (documentId) {
                loadDocumentFile(documentId)
            }
            return;
        }

        if (!file) {
            setError(true);
            return;
        }

        methods.reset({
            patrimonial: {
                ...patrimonialStatementInitial
            } as PatrimonialStatementWithPrevious,
            resultado: {
                ...incomeStatementInitial
            } as IncomeStatementWithPrevious
        })
        setFileFinancialStatementData(undefined)
        setError(false)
    }
    
    useEffect(() => {
        if (open)
            processData()
    }, [open]);

    const onAfterSubmit = () => {
        onClose()
        getDetail(patrimonialId, incomeId)
    }
    const onHandleSubmit = (data: OcrBalanceForm) => {
        const submitData: FinancialYearEditFormType = {
            [FinancialYearEditFormFields.PatrimonialStatement]: data.patrimonial,
            [FinancialYearEditFormFields.IncomeStatement]: data.resultado
        }
        
        handleUpdate(
            submitData,
            patrimonialId,
            incomeId,
            onAfterSubmit
        )
    }
    
    const goToContactLuc = () => navigate(AppRoutesDefinitions.LucContactPage);
    
    return (
        <Dialog open={open}
                onClose={onClose}
                fullScreen
        >
            <BaseDialogTitle onClose={onClose}
                             title={'Resultado del procesamiento con IA'}
            />
            <DialogContent>
                <Grid container spacing={3}>
                    {fileSrc && (
                        <Grid item md={6}>
                            <iframe src={fileSrc}
                                    title={file?.fileName || 'Balance'}
                                    width="100%" height="900px"
                                    style={{border: 'none'}}
                                    key={'balance-ocr-key'}
                                    id={"balance-ocr"}
                            />
                        </Grid>
                    )}
                    <Grid item md={fileSrc ? 6 : 12}>
                        {
                            error && (
                                <Alert color={'error'} severity={'error'}>
                                    No pudimos procesar el archivo. Si el problema persiste, <Link underline='none' onClick={goToContactLuc}>contactanos</Link>.
                                </Alert>
                            )
                        }
                        
                        {
                            !error && fileFinancialStatementData &&
                            <FormProvider {...methods}>
                                <FinancialYearEditComponent
                                    incomeStatement={fileFinancialStatementData[FinancialStatementFields.IncomeStatement]}
                                    patrimonialStatement={fileFinancialStatementData[FinancialStatementFields.PatrimonialStatement]}
                                    year={fileFinancialStatementData[FinancialStatementFields.PatrimonialStatement][FinancialYearFields.Year]}
                                    patrimonialNameBase={'patrimonial'}
                                    incomeNameBase={'resultado'}
                                    disabled
                                />
                            </FormProvider>
                        }
                    </Grid>
                </Grid>
            </DialogContent>
            {loading && <LoaderBlockUI message="Por favor, aguardá mientras procesamos el estado contable. Puede tomar dos minutos o menos."/>}
        </Dialog>
    )
}


export default DialogLoadBalanceByOcr