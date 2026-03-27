import {Box, Dialog, DialogActions, DialogContent, Grid, Link, Stack, Typography} from "@mui/material";
import BaseDialogTitle from "./BaseDialogTitle";
import {useContext, useEffect, useMemo, useState} from "react";
import {LoaderBlockUI} from "../loader";
import CancelIcon from '@mui/icons-material/Cancel';
import {AppRoutesDefinitions, useAppNavigation} from "../../hooks/navigation";
import FinancialYearDynamicEditComponent from "../../pages/company/finance/components/FinancialYearDynamicEditComponent";
import {FormProvider, useForm} from "react-hook-form";
import {HttpOcr} from "../../http/general/httpOcr";
import {HttpFileDocument} from "../../http";
import {FileBlobResponseFields} from "../../types/files/filesData";
import {BalancesContext} from "../../hooks/contexts/BalancesContext";
import {SaveButton} from "../buttons/Buttons";
import {
    FinancialYearEditFormFields,
    FinancialYearEditFormType
} from "../../pages/company/finance/components/FinancialYearDetail";
import {PatrimonialStatementFields} from "../../types/general/generalFinanceData";
import {Alert} from "@mui/lab";


interface OcrBalanceFile {
    file: File,
    fileName: string,
    id: number
}

interface DialogLoadBalanceByOcrDynamicProps {
    open: boolean;
    onClose: () => void;
    file?: OcrBalanceFile;
    patrimonialId: number;
    incomeId: number;
    guid?: string;
    documentId?: number;
}

interface DynamicOcrBalanceForm {
    patrimonialStatement: any,
    incomeStatement: any
}

const DialogLoadBalanceByOcrDynamic = ({open, onClose, file, patrimonialId, incomeId, guid, documentId} : DialogLoadBalanceByOcrDynamicProps) => {
    const { navigate } = useAppNavigation();
    const { getDetail, handleUpdate } = useContext(BalancesContext)
    
    const [loading, setLoading] = useState<boolean>(false)
    const [fileFinancialStatementData, setFileFinancialStatementData] = useState<any>()
    const [error, setError] = useState<boolean>()
    const [customFileBase, setCustomFileBase] = useState<OcrBalanceFile>()
    const methods = useForm<DynamicOcrBalanceForm>()
    const fileSrc = useMemo(() => {
        const fileToUse = file || customFileBase;
        if (!fileToUse) return undefined;
        return URL.createObjectURL(new Blob([fileToUse.file], { type: "application/pdf" }));
    }, [file, customFileBase]);

    const applyData = (actual: any) => {
        setFileFinancialStatementData(actual);

        const patrimonialCurrent = actual?.estadoPatrimonial;
        const incomeCurrent = actual?.estadoResultado;

        const resetData = {
            patrimonialStatement: patrimonialCurrent ?? {},
            incomeStatement: incomeCurrent ?? {}
        };

        methods.reset(resetData);
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

    const loadByGuid = (guidToLoad: string) => {
        methods.reset({
            patrimonialStatement: {},
            incomeStatement: {}
        })
        setFileFinancialStatementData(undefined)
        setError(false)
        setLoading(true)

        HttpOcr.getBalancesByGuidDynamic(guidToLoad)
            .then((r) => {
                if (!r.tieneError) {
                    const actual = r.data
                    
                    if (!actual) {
                        setError(true);
                        return;
                    }
                    
                    applyData(actual);
                } 
                else setError(true)
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false))
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
            patrimonialStatement: {},
            incomeStatement: {}
        })
        setFileFinancialStatementData(undefined)
        setError(false)
    }
    
    useEffect(() => {
        if (open)
            processData()
    }, [open]);
    
    const goToContactLuc = () => navigate(AppRoutesDefinitions.LucContactPage);
    
    const onAfterSubmit = () => {
        onClose()
        getDetail(patrimonialId, incomeId)
    }
    const onHandleSubmit = (data: DynamicOcrBalanceForm) => {
        const patrimonial = {
            ...data.patrimonialStatement,
            [PatrimonialStatementFields.ActiveCurrentAvailabilities]: data.patrimonialStatement[PatrimonialStatementFields.ActiveCurrentCashBanks]
        };

        const submitData: FinancialYearEditFormType = {
            [FinancialYearEditFormFields.PatrimonialStatement]: patrimonial,
            [FinancialYearEditFormFields.IncomeStatement]: data.incomeStatement
        }
        
        handleUpdate(
            submitData,
            patrimonialId,
            incomeId,
            onAfterSubmit
        )
    }
    
    return (
        <Dialog open={open}
                onClose={onClose}
                fullScreen
        >
            <BaseDialogTitle onClose={onClose}
                             title={'Resultado del procesamiento con IA - Formato Extendido'}
            />
            <DialogContent>
                <Grid container spacing={3}>
                    {fileSrc && (
                        <Grid item md={6}>
                            <iframe src={fileSrc}
                                    title={file?.fileName || 'Balance'}
                                    width="100%" height="900px"
                                    style={{border: 'none'}}
                                    key={'balance-ocr-dynamic-key'}
                                    id={"balance-ocr-dynamic"}
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
                                    <Stack spacing={2}>
                                        <FinancialYearDynamicEditComponent
                                            year={fileFinancialStatementData?.fecha ? new Date(fileFinancialStatementData.fecha).getFullYear() : new Date().getFullYear()}
                                            patrimonialNameBase="patrimonialStatement"
                                            incomeNameBase="incomeStatement"
                                            disabled
                                        />
                                    </Stack>
                                </FormProvider>
                        }
                    </Grid>
                </Grid>
            </DialogContent>
            {loading && <LoaderBlockUI message="Por favor, aguardá mientras procesamos el estado contable. Puede tomar dos minutos o menos."/>}
        </Dialog>
    )
}

export default DialogLoadBalanceByOcrDynamic