import React, {useContext, useState, useRef, useEffect} from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Stack,
    Card,
    Button,
    Box,
    Chip,
    CircularProgress,
    Tooltip,
    IconButton,
} from '@mui/material';
import {useForm, FormProvider} from 'react-hook-form';
import {
    FinancialYear,
    FinancialYearFields,
    IncomeStatement,
    PatrimonialStatement
} from 'types/general/generalFinanceData';
import {patrimonialStatementInitial, incomeStatementInitial} from 'types/company/companyFinanceInformationData';
import {EntityWithIdFields} from 'types/baseEntities';
import {TypographyBase} from 'components/misc/TypographyBase';
import {BalancesContext, BalancesSourceType, useBalances} from 'hooks/contexts/BalancesContext';
import FileNewButton from 'components/files/FileNewButton';
import {Sections} from 'types/general/generalEnums';
import {FileBase} from 'types/files/filesData';
import {HttpFilesCompanyFinancialYear, HttpFilesSolicitationBalances} from 'http/index';
import {HttpFilesClientPortfolioBalances} from 'http/files/httpFilesClientPortfolio';
import {LayoutHomeContext} from 'layouts/home/LayoutHome';
import {ChevronDownIcon, SaveIcon, ShareIcon, TrashIcon} from 'lucide-react';
import {dateFormatter} from 'util/formatters/dateFormatter';
import {FinancialYearStatus} from 'types/general/generalEnums';
import FinancialYearDetail, {FinancialYearEditFormFields, FinancialYearEditFormType} from './FinancialYearDetail';
import FinancialYearDocumentList from './FinancialYearDocumentList';
import FinancialStatementIAButton from './ia/FinancialStatementIAButton';
import {Skeleton, Grid, CardHeader, CardContent} from '@mui/material';
import {DialogAlert} from 'components/dialog';

interface FinancialYearAccordionProps {
    financialYear: FinancialYear;
    dataId?: number | string;
    dataSource?: BalancesSourceType;
    reloadTable: () => void;
    onDelete: (id: number) => void;
}

function FinancialYearAccordion({
                                    financialYear,
                                    dataId,
                                    dataSource,
                                    reloadTable,
                                    onDelete,
                                }: FinancialYearAccordionProps) {
    const [expanded, setExpanded] = useState<boolean>(false);
    const [showUnsavedDialog, setShowUnsavedDialog] = useState<boolean>(false);
    const {handleExportExcel, enableLoadsIA, handleUpdate} = useContext(BalancesContext);
    const {companyId} = useContext(LayoutHomeContext);

    const financialId: number = financialYear[EntityWithIdFields.Id];
    const patrimonialStatementId: number = financialYear[FinancialYearFields.PatrimonialStatementId];
    const incomeStatementId: number = financialYear[FinancialYearFields.IncomeStatementId];

    const {getBalanceDetail} = useBalances(dataId, dataSource);
    const methods = useForm<FinancialYearEditFormType>({
        defaultValues: {
            [FinancialYearEditFormFields.PatrimonialStatement]: patrimonialStatementInitial as PatrimonialStatement,
            [FinancialYearEditFormFields.IncomeStatement]: incomeStatementInitial as IncomeStatement,
        },
        mode: 'onChange'
    });
    const [localPatrimonialData, setLocalPatrimonialData] = useState<PatrimonialStatement>();
    const [localIncomeData, setLocalIncomeData] = useState<IncomeStatement>();
    const [localLoading, setLocalLoading] = useState<boolean>(false);
    const [isDirtyState, setIsDirtyState] = useState<boolean>(false);
    const pollRef = useRef<NodeJS.Timeout | null>(null);


    useEffect(() => {
        setIsDirtyState(methods.formState.isDirty);
    }, [methods.formState.isDirty]);

    const localGetDetail = () => {
        setLocalLoading(true);
        getBalanceDetail(patrimonialStatementId, incomeStatementId).then(([pat, inc]) => {
            setLocalPatrimonialData(pat);
            setLocalIncomeData(inc);
            methods.reset({
                [FinancialYearEditFormFields.PatrimonialStatement]: pat,
                [FinancialYearEditFormFields.IncomeStatement]: inc,
            }, { keepDirty: false, keepValues: false });
            setLocalLoading(false);
        });
    };

    useEffect(() => {
        if (localPatrimonialData && localPatrimonialData[FinancialYearFields.OcrBalanceStatusCode] === FinancialYearStatus.Processing) {
            if (!pollRef.current) {
                pollRef.current = setInterval(() => localGetDetail(), 10000);
            }
        } else {
            if (pollRef.current) {
                clearInterval(pollRef.current);
                pollRef.current = null;
            }
        }
        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [localPatrimonialData]);

    const handleAccordionChange = (event: React.SyntheticEvent, isExpanded: boolean) => {
        if (!isExpanded && isDirtyState) {
            setShowUnsavedDialog(true);
            return;
        }

        setExpanded(isExpanded);
        if (isExpanded && !localLoading) {
            localGetDetail();
        }
    };

    const submitChanges = (onAfterSave?: () => void) => {
        methods.handleSubmit((data) => {
            handleUpdate(data, patrimonialStatementId, incomeStatementId, () => {
                methods.reset(data, { keepDirty: false, keepValues: false });
                onAfterSave?.();
            });
        })();
    };

    const discardChanges = () => {
        if (localPatrimonialData || localIncomeData) {
            methods.reset({
                [FinancialYearEditFormFields.PatrimonialStatement]: localPatrimonialData,
                [FinancialYearEditFormFields.IncomeStatement]: localIncomeData,
            }, { keepDirty: false, keepValues: false });
        }
        setShowUnsavedDialog(false);
        setExpanded(false);
    };

    const handleSaveChanges = (e: React.MouseEvent) => {
        e.stopPropagation();
        submitChanges();
    };

    const handleDialogSave = () => {
        submitChanges(() => {
            setShowUnsavedDialog(false);
            setExpanded(false);
        });
    };

    const onSaveFile = (fileBase: FileBase, file: File) => {
        const savePromise = (() => {
            switch (dataSource) {
                case BalancesSourceType.Company:
                    return HttpFilesCompanyFinancialYear.insert(companyId as number, financialId, fileBase, file);
                case BalancesSourceType.Solicitation:
                    return HttpFilesSolicitationBalances.insert(companyId as number, financialId, fileBase, file);
                case BalancesSourceType.ClientPortfolio:
                    return HttpFilesClientPortfolioBalances.insert(String(companyId), financialId, fileBase, file);
                default:
                    return Promise.reject('Unknown source');
            }
        })();

        return savePromise.then(() => {
            reloadTable();
        });
    };

    const handleExportClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleExportExcel(financialId);
    };

    const handleLoadData = () => {
        localGetDetail();
        reloadTable();
    };

    const handleOnSaveFile = (fileBase: FileBase, file: File) => {
        return onSaveFile(fileBase, file);
    };

    const renderOcrStatusChip = (ocrStatusCode?: FinancialYearStatus) => {
        if (!ocrStatusCode) return null;
        switch (ocrStatusCode) {
            case FinancialYearStatus.Processing:
                return (
                    <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress size={16}/>
                        <Chip label="Procesando" color="primary" size="small" variant="outlined"/>
                    </Box>
                );
            case FinancialYearStatus.ProcessedSuccessfully:
                return <Chip label="Procesado" color="success" size="small" variant="outlined"/>;
            case FinancialYearStatus.ProcessedFailed:
                return <Chip label="Error al procesar" color="error" size="small" variant="outlined"/>;
            default:
                return null;
        }
    };

    const loadingComponent = () => {
        return (
            <Box>
                <CardHeader title={<Skeleton width={'20%'}/>}/>
                <CardContent>
                    <Grid container spacing={1}>
                        {Array.from(Array(10).keys()).map((item) => (
                            <Grid
                                item
                                xs={12}
                                key={`keyCardBaseLoading_${item}`}
                                alignItems={'center'}
                            >
                                <Skeleton sx={{width: '100%'}}/>
                            </Grid>
                        ))}
                    </Grid>
                </CardContent>
            </Box>
        );
    };

    return (
        <Card variant={'accordionCompanyData'}>
            <Accordion variant={'companyData'}
                       expanded={expanded}
                       onChange={handleAccordionChange}
            >
                <AccordionSummary
                    expandIcon={<ChevronDownIcon size={26} strokeWidth={'2px'} color={'black'}/>}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        width="100%"
                        spacing={2}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Stack>
                                <TypographyBase fontWeight={600} maxLines={1} tooltip variant="h5">
                                    {`Ejercicio ${financialYear[FinancialYearFields.Year]}`}
                                </TypographyBase>
                                <TypographyBase color="text.lighter" variant="body3">
                                    {`Cierre: ${dateFormatter.toShortDate(financialYear[FinancialYearFields.Date])}`}
                                </TypographyBase>
                            </Stack>
                            {renderOcrStatusChip(financialYear[FinancialYearFields.OcrBalanceStatusCode])}
                        </Stack>
                        {expanded && (
                            <Stack direction="row" alignItems="center" spacing={2} pr={2}>
                                <Tooltip title="Eliminar">
                                    <IconButton
                                        color="secondary"
                                        variant="outlined"
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(financialId);
                                        }}
                                    >
                                        <TrashIcon/>
                                    </IconButton>
                                </Tooltip>
                                <Button
                                    size="small"
                                    startIcon={<ShareIcon size={18}/>}
                                    variant="outlined"
                                    color="secondary"
                                    onClick={handleExportClick}
                                >
                                    Exportar
                                </Button>
                                {enableLoadsIA && financialYear[FinancialYearFields.OcrBalanceStatusCode] !== FinancialYearStatus.Processing && (
                                    <Box onClick={(e) => e.stopPropagation()}>
                                        <FinancialStatementIAButton
                                            dataId={dataId}
                                            dataSource={dataSource}
                                            financialId={financialId}
                                            onReload={handleLoadData}
                                            size="small"
                                        />
                                    </Box>
                                )}
                                <Button
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    startIcon={<SaveIcon size={18}/>}
                                    onClick={handleSaveChanges}
                                >
                                    Guardar cambios
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                </AccordionSummary>

                <AccordionDetails sx={{backgroundColor: '#FFFFFF', padding: '8px 0px 16px'}}>
                    {expanded && (
                        <Stack spacing={3}>
                            {localLoading ? (
                                loadingComponent()
                            ) : (
                                <FormProvider {...methods}>
                                    <FinancialYearDetail
                                        financialYear={financialYear}
                                        dataSource={dataSource}
                                        dataId={dataId}
                                        onAfterUpdate={reloadTable}
                                        localPatrimonialData={localPatrimonialData}
                                        localIncomeData={localIncomeData}
                                        localLoading={localLoading}
                                        isCollapsible
                                    />
                                </FormProvider>
                            )}

                            {dataSource === BalancesSourceType.Company && (
                                <Stack spacing={3}>
                                    <Stack direction="row" alignItems="center" spacing={1}
                                           justifyContent="space-between">
                                        <TypographyBase variant="h6" fontWeight={600}>
                                            Documentos relacionados
                                        </TypographyBase>
                                    </Stack>
                                    <FinancialYearDocumentList
                                        financialYearId={financialId}
                                        reloadTable={reloadTable}
                                    />
                                    <FileNewButton
                                        section={Sections.FinancialYear}
                                        onSaveFile={handleOnSaveFile}
                                        onReload={reloadTable}
                                    />
                                </Stack>
                            )}
                        </Stack>
                    )}
                </AccordionDetails>
            </Accordion>

            <DialogAlert
                open={showUnsavedDialog}
                onClose={() => setShowUnsavedDialog(false)}
                onConfirm={handleDialogSave}
                onReject={discardChanges}
                textContent={'Tenés cambios sin guardar. ¿Querés guardarlos o descartarlos?'}
                textConfirm={'Guardar cambios'}
                textClose={'Descartar cambios'}
                persist
            />
        </Card>
    );
}

export default FinancialYearAccordion;
