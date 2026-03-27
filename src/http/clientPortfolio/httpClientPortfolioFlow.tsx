import {HttpAxiosRequest} from "../httpAxiosBase";
import {
    FlowInsert,
    FlowInsertRequest,
    FlowSemesterDelete,
    FlowSemesterView
} from "../../types/general/generalFinanceData";
import {BaseResponse} from "../../types/baseEntities";
import {FileBlobResponse} from "../../types/files/filesData";


export const HttpClientPortfolioFlow = {
    getEndpoint: (guid: string, url: string = '') => `/carpeta/${guid}/movimientos${url}`,

    getSemesterList: (guid: string): Promise<FlowSemesterView[]> => {
        return HttpAxiosRequest.get(
            HttpClientPortfolioFlow.getEndpoint(guid, '/semestres'),
        );
    },

    insertSemester: (guid: string): Promise<any> => {
        return HttpAxiosRequest.post(
            HttpClientPortfolioFlow.getEndpoint(guid, '/semestres'),
            {},
        );
    },

    deleteSemester: (
        guid: string,
        semesterDeleteData: FlowSemesterDelete,
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.deleteWithBody(
            HttpClientPortfolioFlow.getEndpoint(guid, '/semestres'),
            { ...semesterDeleteData, codModulo: 1, codOrigen: 1 },
        );
    },

    insertList: (
        guid: string,
        request: FlowInsertRequest,
    ): Promise<any> => {
        return HttpAxiosRequest.post(
            HttpClientPortfolioFlow.getEndpoint(guid, '/lista'),
            { ...request, codModulo: 1, codOrigen: 1 },
        );
    },

    insertNewList: (
        guid: string,
        request: FlowInsert,
    ): Promise<any> => {
        return HttpAxiosRequest.post(HttpClientPortfolioFlow.getEndpoint(guid), {
            ...request,
            codOrigen: 1,
            codModulo: 1,
        });
    },

    removeHistoricFlow: (guid: string, flowId: number): Promise<any> => {
        return HttpAxiosRequest.delete(
            HttpClientPortfolioFlow.getEndpoint(guid, `/${flowId}`),
        );
    },

    exportToExcel: (guid: string): Promise<FileBlobResponse> =>
        HttpAxiosRequest.getBlob(
            HttpClientPortfolioFlow.getEndpoint(guid, `/exportar/excel`),
        ),
}