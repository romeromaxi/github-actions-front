import { HttpAxiosRequest } from '../httpAxiosBase';
import { BaseResponse } from '../../types/baseEntities';
import {
    FlowInsert,
    FlowInsertRequest,
    FlowSemesterDelete,
    FlowSemesterView
} from "../../types/general/generalFinanceData";
import {FileBlobResponse} from "../../types/files/filesData";

export const HttpSolicitationFlow = {
    getEndpoint: (solicitationId: number, url: string = ''): string =>
        `solicitud/${solicitationId}/movimientos${url}`,

    getSemesterList: (solicitationId: number): Promise<FlowSemesterView[]> => {
        return HttpAxiosRequest.get(
            HttpSolicitationFlow.getEndpoint(solicitationId, '/semestres'),
        );
    },

    insertSemester: (solicitationId: number): Promise<any> => {
        return HttpAxiosRequest.post(
            HttpSolicitationFlow.getEndpoint(solicitationId, '/semestres'),
            {},
        );
    },

    deleteSemester: (
        solicitationId: number,
        semesterDeleteData: FlowSemesterDelete,
    ): Promise<BaseResponse> => {
        return HttpAxiosRequest.deleteWithBody(
            HttpSolicitationFlow.getEndpoint(solicitationId, '/semestres'),
            { ...semesterDeleteData, codModulo: 1, codOrigen: 1 },
        );
    },

    insertList: (
        solicitationId: number,
        request: FlowInsertRequest,
    ): Promise<any> => {
        return HttpAxiosRequest.post(
            HttpSolicitationFlow.getEndpoint(solicitationId, '/lista'),
            { ...request, codModulo: 1, codOrigen: 1 },
        );
    },

    insertNewList: (
        solicitationId: number,
        request: FlowInsert,
    ): Promise<any> => {
        return HttpAxiosRequest.post(HttpSolicitationFlow.getEndpoint(solicitationId), {
            ...request,
            codOrigen: 1,
            codModulo: 1,
        });
    },

    removeHistoricFlow: (solicitationId: number, flowId: number): Promise<any> => {
        return HttpAxiosRequest.delete(
            HttpSolicitationFlow.getEndpoint(solicitationId, `/${flowId}`),
        );
    },

    exportToExcel: (solicitationId: number): Promise<FileBlobResponse> =>
        HttpAxiosRequest.getBlob(
            HttpSolicitationFlow.getEndpoint(solicitationId, `/exportar/excel`),
        ),
};
