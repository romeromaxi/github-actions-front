import {createContext, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react";
import useAxios from "../useAxios";
import {BaseResponse, EntityWithIdFields} from "../../types/baseEntities";
import {
    HttpCompanyFinance,
    HttpCompanyIncomeStatement,
    HttpCompanyPatrimonialStatement,
    HttpFilesCompanyFinancialYear,
    HttpFilesSolicitationBalances
} from "../../http";
import {incomeStatementInitial, patrimonialStatementInitial} from "../../types/company/companyFinanceInformationData";
import {
    FinancialYearEditFormFields,
    FinancialYearEditFormType
} from "../../pages/company/finance/components/FinancialYearDetail";
import {FormProvider, useForm} from "react-hook-form";
import {
    FinancialYear,
    FinancialYearFields,
    FinancialYearInsert,
    IncomeStatement,
    IncomeStatementWithPrevious,
    PatrimonialStatement,
    PatrimonialStatementWithPrevious
} from "../../types/general/generalFinanceData";
import {
    HttpSolicitationFinance,
    HttpSolicitationIncomeStatement,
    HttpSolicitationPatrimonialStatement
} from "../../http/solicitations/httpSolicitationFinance";
import {FileBase} from "../../types/files/filesData";
import {HttpClientPortfolioBalances} from "../../http/clientPortfolio/httpClientPortfolio";
import {HttpClientPortfolioPatrimonial} from "../../http/clientPortfolio/httpClientPortfolioPatrimonial";
import {HttpClientPortfolioIncome} from "../../http/clientPortfolio/HttpClientPortfolioIncome";
import {HttpFilesClientPortfolioBalances} from "../../http/files/httpFilesClientPortfolio";
import {FinancialYearStatus} from "../../types/general/generalEnums";
import {useLoaderActions} from "../useLoaderActions";
import {useSnackbarActions} from "../useSnackbarActions";


export enum BalancesSourceType {
    Company = 'company',
    Solicitation = 'solicitation',
    ClientPortfolio = 'clientPortfolio'
}

export function useBalances(
    dataId: number | string,
    dataSource: BalancesSourceType
) {
    const numericDataId = useMemo(() => {
        return typeof dataId === 'number' ? dataId : 0;
    }, [dataId]);

    const stringDataId = useMemo(() => {
        return typeof dataId === 'string' ? dataId : '';
    }, [dataId]);
    
    
    const getBalancesData = () => {
        if (!stringDataId && !numericDataId) return Promise.resolve<FinancialYear[]>([]);
        
        switch (dataSource) {
            case BalancesSourceType.Company:
                return HttpCompanyFinance.getListByCompanyId(numericDataId)
            case BalancesSourceType.Solicitation:
                return HttpSolicitationFinance.getListBysolicitationId(numericDataId)
            case BalancesSourceType.ClientPortfolio:
                return HttpClientPortfolioBalances.getListByGuid(stringDataId)
        }
    }
    
    
    const getBalanceDetail = (patrimonialId: number, incomeId: number) => {
        switch (dataSource) {
            case BalancesSourceType.Company:
                return Promise.all([
                    HttpCompanyPatrimonialStatement.getById(
                        numericDataId,
                        patrimonialId,
                    ),
                    HttpCompanyIncomeStatement.getById(numericDataId, incomeId),
                ])
            case BalancesSourceType.Solicitation:
                return Promise.all([
                    HttpSolicitationPatrimonialStatement.getById(
                        numericDataId,
                        patrimonialId,
                    ),
                    HttpSolicitationIncomeStatement.getById(numericDataId, incomeId),
                ])
            case BalancesSourceType.ClientPortfolio:
                return Promise.all([
                    HttpClientPortfolioPatrimonial.getById(
                        stringDataId,
                        patrimonialId,
                    ),
                    HttpClientPortfolioIncome.getById(stringDataId, incomeId),
                ])
        }
    }
            
    
    const handleCreateBalance = (data: FinancialYearInsert) => {
        switch (dataSource) {
            case BalancesSourceType.Company:
                return HttpCompanyFinance.insert(numericDataId, data)
            case BalancesSourceType.Solicitation:
                return HttpSolicitationFinance.insert(numericDataId, data)
            case BalancesSourceType.ClientPortfolio:
                return HttpClientPortfolioBalances.insert(stringDataId, data)
        }
    }
    
    const handleDeleteBalance = (balanceId: number) => {
        switch (dataSource) {
            case BalancesSourceType.Company:
                return HttpCompanyFinance.deleteFinancialYear(
                    numericDataId,
                    balanceId
                )
            case BalancesSourceType.Solicitation:
                return HttpSolicitationFinance.deleteFinancialYear(
                    numericDataId,
                    balanceId
                )
            case BalancesSourceType.ClientPortfolio:
                return HttpClientPortfolioBalances.delete(
                    stringDataId,
                    balanceId
                )
        }
    }
    
    const handleUpdateBalance = (data: FinancialYearEditFormType, patrimonialId: number, incomeId: number)=> {
        switch (dataSource) {
            case BalancesSourceType.Company:
                return Promise.all([
                    HttpCompanyPatrimonialStatement.update(
                        numericDataId,
                        patrimonialId,
                        data[FinancialYearEditFormFields.PatrimonialStatement],
                    ),
                    HttpCompanyIncomeStatement.update(
                        numericDataId,
                        incomeId,
                        data[FinancialYearEditFormFields.IncomeStatement],
                    ),
                ])
            case BalancesSourceType.Solicitation:
                return Promise.all([
                    HttpSolicitationPatrimonialStatement.update(
                        numericDataId,
                        patrimonialId,
                        data[FinancialYearEditFormFields.PatrimonialStatement],
                    ),
                    HttpSolicitationIncomeStatement.update(
                        numericDataId,
                        incomeId,
                        data[FinancialYearEditFormFields.IncomeStatement],
                    ),
                ])
            case BalancesSourceType.ClientPortfolio:
                return Promise.all([
                    HttpClientPortfolioPatrimonial.update(
                        stringDataId,
                        patrimonialId,
                        data[FinancialYearEditFormFields.PatrimonialStatement],
                    ),
                    HttpClientPortfolioIncome.update(
                        stringDataId,
                        incomeId,
                        data[FinancialYearEditFormFields.IncomeStatement],
                    ),
                ])
        }
    }
    
    const onExportExcel = (balanceId: number) => {
        switch (dataSource) {
            case BalancesSourceType.Company:
                return HttpCompanyFinance.exportToExcel(
                    numericDataId,
                    balanceId)
            case BalancesSourceType.Solicitation:
                return HttpSolicitationFinance.exportToExcel(
                    numericDataId,
                    balanceId
                )
            case BalancesSourceType.ClientPortfolio:
                return HttpClientPortfolioBalances.exportToExcel(
                    stringDataId,
                    balanceId
                )
        }
        
    }
        
    const handleUploadOcr = (financialId: number, fileBase: FileBase, file: File) : Promise<any> => {
        switch (dataSource) {
            case BalancesSourceType.Company:
                return HttpFilesCompanyFinancialYear.insert(numericDataId, financialId, fileBase, file)
            case BalancesSourceType.Solicitation:
                return HttpFilesSolicitationBalances.insert(numericDataId, financialId, fileBase, file)
            case BalancesSourceType.ClientPortfolio:
                return HttpFilesClientPortfolioBalances.insert(stringDataId, financialId, fileBase, file)
        }
    }

    return {
        getBalancesData,
        getBalanceDetail,
        handleCreateBalance,
        handleDeleteBalance,
        handleUpdateBalance,
        onExportExcel,
        handleUploadOcr
    }
}

interface BalancesContextProviderProps {
    dataId: number | string,
    dataSource: BalancesSourceType,
    children: ReactNode;
}

export const BalancesContext = createContext({
    balances: undefined as FinancialYear[] | undefined,
    getDetail: (patrimonialId: number, incomeId: number) => {},
    clearDetail: () => {},
    patrimonialData: undefined as PatrimonialStatement | undefined,
    incomeData: undefined as IncomeStatement | undefined,
    reloadData: (callbackFn?: () => void, isPolling?: boolean) => {},
    handleNew: (data: FinancialYearInsert) => {},
    handleDelete: (id: number) => {},
    handleUpdate: (data: FinancialYearEditFormType, patrimonialId: number, incomeId: number, callbackFn?: () => void) => {},
    handleExportExcel: (id: number) => {},
    onUploadOcrFile: async (financialId: number, fileBase: FileBase, file: File) => {},
    loading: false as boolean,
    enableLoadsIA: false as boolean,
});

export const BalancesContextProvider = ({
                                               dataId, dataSource, children
                                           }: BalancesContextProviderProps) => {
    const { showLoader, hideLoader } = useLoaderActions();
    const { addSnackbarSuccess } = useSnackbarActions();
    const { fetchData, fetchAndDownloadFile } = useAxios()
    const { 
        getBalancesData,
        getBalanceDetail,
        handleCreateBalance,
        handleDeleteBalance,
        handleUpdateBalance,
        onExportExcel,
        handleUploadOcr
    } = useBalances(dataId, dataSource);

    const [loading, setLoading] = useState<boolean>(false)
    const [balanceLst, setBalanceLst] = useState<FinancialYear[]>()
    const [patrimonialData, setPatrimonialData] = useState<PatrimonialStatement>()
    const [incomeData, setIncomeData] = useState<IncomeStatement>()
    const methods = useForm<FinancialYearEditFormType>({
        defaultValues: {
            [FinancialYearEditFormFields.PatrimonialStatement]: {
                ...patrimonialStatementInitial
            } as PatrimonialStatementWithPrevious,
            [FinancialYearEditFormFields.IncomeStatement]: {
                ...incomeStatementInitial
            } as IncomeStatementWithPrevious
        },
    });
    const listPollRef = useRef<NodeJS.Timeout | null>(null)
    const detailPollRef = useRef<NodeJS.Timeout | null>(null)
    const [isPollingList, setIsPollingList] = useState<boolean>(false)
    const [isPollingDetail, setIsPollingDetail] = useState<boolean>(false)

    const hasAnyProcessing = useCallback((list?: FinancialYear[]) => {
        if (!list || list.length === 0) return false;
        return list.some(b => b[FinancialYearFields.OcrBalanceStatusCode] === FinancialYearStatus.Processing);
    }, [])

    const reloadData = useCallback((callbackFn?: () => void, isPolling?: boolean) => {
        if (!isPolling)
            setLoading(true)

        getBalancesData().then(r => {
            setBalanceLst(r)
            if (!isPolling)
                setLoading(false)
            callbackFn && callbackFn();
        })
    }, [getBalancesData])

    const baseResponseOperation = (promiseFn: Promise<BaseResponse>, successMsg: string) => {
        setLoading(true)
        fetchData(
            () => promiseFn,
            true
        ).then(() => {
            reloadData()
            addSnackbarSuccess(successMsg)
        })
    }
    
    const handleNew = (data: FinancialYearInsert) =>
        baseResponseOperation(handleCreateBalance(data), 'Ahora podés cargar los datos del estado contable a mano o mediante el asistente de carga con IA.')
    const handleDelete = (id: number) =>
        baseResponseOperation(handleDeleteBalance(id), 'El estado contable se eliminó correctamente')
    
    const handleExportExcel = (id: number) => 
        fetchAndDownloadFile(
            () => onExportExcel(id)
        )
    
    const handleUpdate = (data: FinancialYearEditFormType, patrimonialId: number, incomeId: number, callbackFn?: () => void) => {
        showLoader()
        handleUpdateBalance(data, patrimonialId, incomeId).then(() => {
            hideLoader()
            addSnackbarSuccess('El estado contable se actualizó correctamente')
            reloadData()
            callbackFn && callbackFn()
        })
    }
    
    const setPatrimonialAndIncomeData = (patrimonial: PatrimonialStatement, income: IncomeStatement) => {
        setPatrimonialData(patrimonial)
        setIncomeData(income)
        methods.reset({
            [FinancialYearEditFormFields.PatrimonialStatement]: patrimonial,
            [FinancialYearEditFormFields.IncomeStatement]: income,
        });
    }
    
    const handleGetDetail = (patrimonialId: number, incomeId: number, isPolling: boolean = false) => {
        if (!isPolling)
            setLoading(true)
        getBalanceDetail(patrimonialId, incomeId)
            .then((values) => {
                const changeStatus =
                    !!patrimonialData && values[0]?.[FinancialYearFields.OcrBalanceStatusCode] !== patrimonialData[FinancialYearFields.OcrBalanceStatusCode];
                

                if (changeStatus && isPolling) {
                    setLoading(true)
                }
                setPatrimonialAndIncomeData(values[0], values[1]);
            })
            .finally(() => {
                if (!isPolling)
                    setLoading(false);
            })
    }

    const handleClearDetail = () => {
        setPatrimonialData(undefined);
        setIncomeData(undefined);
    }

    useEffect(() => {
        if (!balanceLst) return;
        const shouldPoll = hasAnyProcessing(balanceLst);

        if (shouldPoll) {
            if (!isPollingList) {
                setIsPollingList(true)
                if (listPollRef.current) clearInterval(listPollRef.current);
                listPollRef.current = setInterval(() => reloadData(undefined, true), 10000);
            }
        } else {
            if (isPollingList) {
                setIsPollingList(false)
                if (listPollRef.current) {
                    clearInterval(listPollRef.current);
                    listPollRef.current = null;
                }
            }
        }
        
        return () => {
            if (listPollRef.current && !shouldPoll) {
                clearInterval(listPollRef.current);
                listPollRef.current = null;
            }
        }
    }, [balanceLst, hasAnyProcessing, isPollingList, reloadData])

    useEffect(() => {
        if (!balanceLst || !patrimonialData) return;
        
        const shouldPoll =
            patrimonialData && patrimonialData[FinancialYearFields.OcrBalanceStatusCode] === FinancialYearStatus.Processing;
        
        if (shouldPoll) {
            const patrimonialId = patrimonialData[EntityWithIdFields.Id];
            const currentFinancial = balanceLst.find(x => x[FinancialYearFields.PatrimonialStatementId] === patrimonialId);
            
            if (!isPollingDetail && currentFinancial) {
                setIsPollingDetail(true)
                if (detailPollRef.current) clearInterval(detailPollRef.current);
                detailPollRef.current = setInterval(() => 
                    handleGetDetail(
                        currentFinancial[FinancialYearFields.PatrimonialStatementId], 
                        currentFinancial[FinancialYearFields.IncomeStatementId],
                        true
                    )
                    , 10000);
            }
        } else {
            if (isPollingDetail) {
                if (loading) {
                    setLoading(false);
                    addSnackbarSuccess("Se terminó de procesar el documento");
                }
                
                setIsPollingDetail(false)
                if (detailPollRef.current) {
                    clearInterval(detailPollRef.current);
                    detailPollRef.current = null;
                }
            }
        }

        return () => {
            if (detailPollRef.current && !shouldPoll) {
                clearInterval(detailPollRef.current);
                detailPollRef.current = null;
            }
        }
    }, [balanceLst, patrimonialData, isPollingDetail, loading])
    
    useEffect(() => {
        return () => {
            if (listPollRef.current) clearInterval(listPollRef.current);
            if (detailPollRef.current) clearInterval(detailPollRef.current);
        }
    }, [])

    useEffect(() => {
        reloadData()
    }, [dataId])


    return (
        <FormProvider {...methods}>
            <BalancesContext.Provider value={{
                balances: balanceLst,
                getDetail: handleGetDetail,
                clearDetail: handleClearDetail,
                patrimonialData: patrimonialData,
                incomeData: incomeData,
                reloadData,
                handleDelete: handleDelete,
                handleNew: handleNew,
                handleUpdate: handleUpdate,
                handleExportExcel: handleExportExcel,
                onUploadOcrFile: handleUploadOcr,
                loading: loading,
                enableLoadsIA: true,
            }}>
                {children}
            </BalancesContext.Provider>
        </FormProvider>
    )
}
