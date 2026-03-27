import {HttpAxiosRequest} from "../httpAxiosBase";
import {InternalReportSummaryTotal, OffererReportSummary} from "../../types/offerer/offererReports";
import {BaseResponse} from "../../types/baseEntities";
import {FileBlobResponse} from "../../types/files/filesData";


export const HttpReports = {
    getEndpoint: (url: string = '') => `/reportes${url}`,
    
    getInternal: () : Promise<OffererReportSummary[]> => {
        return HttpAxiosRequest.get(
            HttpReports.getEndpoint('/internos')
        )
    },

    getInternalSummary: () : Promise<InternalReportSummaryTotal> => {
        return HttpAxiosRequest.get(
            HttpReports.getEndpoint('/internos/resumen')
        )
    },
    
    createReportInstance: (reportId: number, params: { [key: string]: any }): Promise<BaseResponse> => {
        return HttpAxiosRequest.post(
            HttpReports.getEndpoint(`/${reportId}`),
            params
        )
    },
    
    getById: (reportId: number) : Promise<OffererReportSummary> => {
        return HttpAxiosRequest.get(
            HttpReports.getEndpoint(`/${reportId}`)
        )
    },
    
    export: (reportId: number, params: { [key: string]: any }) : Promise<FileBlobResponse> => {
        return HttpAxiosRequest.getBlobWithQueryParamsSerializer(
            HttpReports.getEndpoint(`/${reportId}/exportar`),
            params
        )
    }
}