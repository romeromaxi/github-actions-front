import {HttpCompanyFlow} from "../../http";
import {createContext, ReactNode, useEffect, useMemo, useState} from "react";
import useAxios from "../useAxios";
import {BaseResponse} from "../../types/baseEntities";
import {useAction} from "../useAction";
import {
    FlowInsertRequest,
    FlowSemesterData,
    FlowSemesterDataFields, FlowSemesterDelete,
    FlowSemesterView,
    FlowSemesterViewFields
} from "../../types/general/generalFinanceData";
import {HttpSolicitationFlow} from "../../http/solicitations/httpSolicitationFlow";
import {HttpClientPortfolioFlow} from "../../http/clientPortfolio/httpClientPortfolioFlow";


export enum FlowUseSourceType {
    Company = 'company',
    Solicitation = 'solicitation',
    ClientPortfolio = 'clientPortfolio'
}

export function useFlows(
    dataId: number | string,
    dataSource: FlowUseSourceType
) {
    const numericDataId = useMemo(() => {
        return typeof dataId === 'number' ? dataId : 0;
    }, [dataId]);

    const stringDataId = useMemo(() => {
        return typeof dataId === 'string' ? dataId : '';
    }, [dataId]);
    const getFlowSemesters = () => {
        switch (dataSource) {
            case FlowUseSourceType.Company:
                return HttpCompanyFlow.getSemesterList(numericDataId)
            case FlowUseSourceType.Solicitation:
                return HttpSolicitationFlow.getSemesterList(numericDataId)
            case FlowUseSourceType.ClientPortfolio:
                return HttpClientPortfolioFlow.getSemesterList(stringDataId)
        }
    }

    const onExportExcel = () => {
        switch (dataSource) {
            case FlowUseSourceType.Company:
                return HttpCompanyFlow.exportToExcel(numericDataId)
            case FlowUseSourceType.Solicitation:
                return HttpSolicitationFlow.exportToExcel(numericDataId)
            case FlowUseSourceType.ClientPortfolio:
                return HttpClientPortfolioFlow.exportToExcel(stringDataId)
        }
    }
    
    const onInsertFlow = (data: FlowInsertRequest) => {
        switch (dataSource) {
            case FlowUseSourceType.Company:
                return HttpCompanyFlow.insertList(numericDataId, { ...data })
            case FlowUseSourceType.Solicitation:
                return HttpSolicitationFlow.insertList(numericDataId, { ...data })
            case FlowUseSourceType.ClientPortfolio:
                return HttpClientPortfolioFlow.insertList(stringDataId, { ...data })
        }
    }
    
    const onInsertSemester = () => {
        switch (dataSource) {
            case FlowUseSourceType.Company:
                return HttpCompanyFlow.insertSemester(numericDataId)
            case FlowUseSourceType.Solicitation:
                return HttpSolicitationFlow.insertSemester(numericDataId)
            case FlowUseSourceType.ClientPortfolio:
                return HttpClientPortfolioFlow.insertSemester(stringDataId)
        }
    }
    
    const onDeleteSemester = (deleteBody: FlowSemesterDelete) => {
        switch (dataSource) {
            case FlowUseSourceType.Company:
                return HttpCompanyFlow.deleteSemester(numericDataId, deleteBody)
            case FlowUseSourceType.Solicitation:
                return HttpSolicitationFlow.deleteSemester(numericDataId, deleteBody)
            case FlowUseSourceType.ClientPortfolio:
                return HttpClientPortfolioFlow.deleteSemester(stringDataId, deleteBody)
        }
    }
    
    return {
        getFlowSemesters,
        onExportExcel,
        onInsertFlow,
        onInsertSemester,
        onDeleteSemester
    }
}


interface FlowUseContextProviderProps {
    dataId: number | string;
    dataSource: FlowUseSourceType;
    children: ReactNode
}


export const FlowUseContext = createContext({
    semesterLst: undefined as Record<number, FlowSemesterView[]> | undefined,
    flowLst: undefined as FlowSemesterData[] | undefined,
    loading: false as boolean,
    reloadData: () => {},
    handleExport: () => {},
    handleInsertFlows: (data: FlowInsertRequest) => {},
    handleDelete: (deleteBody: FlowSemesterDelete) => {},
    handleInsertSemester: () => {}
})

export const FlowUseContextProvider = ({dataId, dataSource, children} : FlowUseContextProviderProps) => {
    const [semesterLst, setSemesterLst] = useState<Record<number, FlowSemesterView[]>>()
    const [flowLst, setFlowLst] = useState<FlowSemesterData[]>()
    const [loading, setLoading] = useState<boolean>(false)
    
    const { snackbarSuccess } = useAction()
    const { fetchData, fetchAndDownloadFile } = useAxios()
    const { 
        getFlowSemesters,
        onExportExcel,
        onInsertFlow,
        onInsertSemester,
        onDeleteSemester
    } = useFlows(dataId, dataSource)
    const loadData = () => {
        setLoading(true)
        setSemesterLst(undefined)
        getFlowSemesters().then((r) => {
            if (r.length !== 0) {
                let tempFlows: FlowSemesterData[] = [];
                let editableFlows: FlowSemesterData[] = [];
                r.map((sem, idx) => {
                    if (idx < 4) {
                        if (idx === 0) {
                            const auxFlows = [...sem[FlowSemesterViewFields.Flows]];
                            auxFlows.reverse().map((flow) => {
                                if (flow[FlowSemesterDataFields.AllowEdit]) {
                                    editableFlows = [flow, ...editableFlows];
                                }
                            });
                            tempFlows = [...editableFlows, ...tempFlows];
                        } else if (idx === 3 && editableFlows.length !== 6) {
                            let lastFlows: FlowSemesterData[] = [];
                            const auxFlows = [...sem[FlowSemesterViewFields.Flows]];
                            auxFlows.reverse().map((flow, idx2) => {
                                if (
                                    flow[FlowSemesterDataFields.AllowEdit] &&
                                    idx2 < 6 - editableFlows.length
                                ) {
                                    lastFlows = [flow, ...lastFlows];
                                }
                            });
                            tempFlows = [...lastFlows, ...tempFlows];
                        } else {
                            tempFlows = [
                                ...sem[FlowSemesterViewFields.Flows],
                                ...tempFlows,
                            ];
                        }
                    } else {
                        return;
                    }
                });
                setFlowLst(tempFlows);
            }
            const groupedFlows: Record<number, FlowSemesterView[]> = r.reduce(
                (acc, semester) => {
                    const year = semester[FlowSemesterViewFields.SemesterYear]

                    if (!acc[year]) {
                        acc[year] = []
                    }

                    acc[year].push(semester)
                    return acc;
                },
                {} as Record<number, FlowSemesterView[]>
            );
            setSemesterLst(groupedFlows);
            setLoading(false)
        })
    }
    
    useEffect(() => {
        loadData()
    }, []);

    const baseResponseOperation = (promiseFn: Promise<BaseResponse>, successMsg: string) => {
        fetchData(
            () => promiseFn,
            true
        ).then(() => {
            loadData()
            snackbarSuccess(successMsg)
        })
    }
    
    const handleExportExcel = () =>
        fetchAndDownloadFile(
            () => onExportExcel()
        )
    
    const handleNewFlow = (data: FlowInsertRequest) =>
        baseResponseOperation(onInsertFlow(data), 'El semestre se actualizó correctamente')
    
    const handleDeleteFlow = (deleteBody: FlowSemesterDelete) =>
        baseResponseOperation(onDeleteSemester(deleteBody), 'El semestre se eliminó correctamente')
    
    const handleInsertSemester = () =>
        baseResponseOperation(onInsertSemester(), 'El semestre se creó correctamente')
    
    return (
        <FlowUseContext.Provider value={{
            semesterLst: semesterLst,
            flowLst: flowLst,
            loading: loading,
            handleExport: handleExportExcel,
            handleInsertFlows: handleNewFlow,
            handleDelete: handleDeleteFlow,
            handleInsertSemester: handleInsertSemester,
            reloadData: loadData
        }}>
            {children}
        </FlowUseContext.Provider>
    )
}